import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  mode: 'all' | 'individual' | 'tier';
  merchantIds?: string[];
  tier?: string;
  subject: string;
  message: string;
  fromName?: string;
}

const resendApiKey = Deno.env.get("RESEND_API_KEY");

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      {
        global: {
          headers: { Authorization: req.headers.get("Authorization")! },
        },
      }
    );

    // Verify admin authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      console.error("Authentication error:", authError);
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Check admin role
    const { data: roleData } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .eq("role", "admin")
      .single();

    if (!roleData) {
      console.error("User is not an admin");
      return new Response(
        JSON.stringify({ error: "Admin access required" }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { mode, merchantIds, tier, subject, message, fromName }: EmailRequest = await req.json();

    console.log("Email request:", { mode, tier, merchantIdsCount: merchantIds?.length, subject });

    // Fetch merchant emails based on mode
    let query = supabase
      .from("merchants")
      .select("id, email, brand_name")
      .eq("application_status", "Approved")
      .or("status.is.null,status.eq.active");

    if (mode === 'individual' && merchantIds && merchantIds.length > 0) {
      query = query.in("id", merchantIds);
    } else if (mode === 'tier' && tier) {
      if (tier === 'standard') {
        query = query.is("tier", null);
      } else {
        query = query.eq("tier", tier);
      }
    }

    const { data: merchants, error: merchantError } = await query;

    if (merchantError) {
      console.error("Error fetching merchants:", merchantError);
      throw merchantError;
    }

    if (!merchants || merchants.length === 0) {
      return new Response(
        JSON.stringify({ error: "No merchants found matching criteria" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Sending emails to ${merchants.length} merchants`);

    // Send emails with rate limiting using Resend API
    const emailPromises = [];
    const sentMerchantIds: string[] = [];

    for (let i = 0; i < merchants.length; i++) {
      const merchant = merchants[i];
      
      const emailHtml = `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; margin: 0; padding: 0; }
              .container { max-width: 600px; margin: 0 auto; }
              .header { background: hsl(280, 65%, 60%); color: white; padding: 30px 20px; text-align: center; }
              .header h1 { margin: 0; font-size: 28px; }
              .content { padding: 30px 20px; background: white; }
              .content p { line-height: 1.6; color: #333; }
              .footer { text-align: center; padding: 20px; color: #888; font-size: 12px; background: #f5f5f5; }
              .footer a { color: hsl(280, 65%, 60%); text-decoration: none; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>PopUp Lane</h1>
              </div>
              <div class="content">
                <p>Hi ${merchant.brand_name},</p>
                ${message.split('\n').map(line => `<p>${line}</p>`).join('')}
              </div>
              <div class="footer">
                <p>You're receiving this because you're a merchant on PopUp Lane</p>
                <p>Questions? Contact us at <a href="mailto:admin@popuplane.com">admin@popuplane.com</a></p>
              </div>
            </div>
          </body>
        </html>
      `;

      const emailPromise = fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${resendApiKey}`,
        },
        body: JSON.stringify({
          from: fromName ? `${fromName} <onboarding@resend.dev>` : "PopUp Lane <onboarding@resend.dev>",
          to: [merchant.email],
          subject: subject,
          html: emailHtml,
        }),
      }).then(async (response) => {
        if (response.ok) {
          sentMerchantIds.push(merchant.id);
          console.log(`Email sent to ${merchant.email}`);
        } else {
          const errorText = await response.text();
          console.error(`Failed to send email to ${merchant.email}:`, errorText);
        }
      }).catch((error) => {
        console.error(`Failed to send email to ${merchant.email}:`, error);
      });

      emailPromises.push(emailPromise);

      // Add delay every 10 emails to avoid rate limiting
      if ((i + 1) % 10 === 0 && i < merchants.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    await Promise.all(emailPromises);

    // Log the email send
    await supabase.from("admin_email_logs").insert({
      admin_id: user.id,
      recipient_mode: mode,
      recipient_count: sentMerchantIds.length,
      subject: subject,
      merchant_ids: sentMerchantIds,
      success: sentMerchantIds.length === merchants.length,
    });

    console.log(`Successfully sent ${sentMerchantIds.length}/${merchants.length} emails`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        sent: sentMerchantIds.length,
        total: merchants.length 
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error: any) {
    console.error("Error in admin-send-merchant-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
};

serve(handler);
