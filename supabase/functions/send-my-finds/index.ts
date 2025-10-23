import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const resendApiKey = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface Brand {
  id: string;
  brand_name: string;
  category?: string;
  website_url?: string;
  social_media?: string;
}

interface SendMyFindsRequest {
  email: string;
  brands: Brand[];
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, brands }: SendMyFindsRequest = await req.json();

    if (!email || !brands || brands.length === 0) {
      return new Response(
        JSON.stringify({ error: "Email and brands are required" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    if (!resendApiKey) {
      console.error("RESEND_API_KEY is not set");
      return new Response(
        JSON.stringify({ error: "Email service not configured" }),
        {
          status: 500,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Build the email HTML
    const brandsHTML = brands
      .map(
        (brand) => `
      <div style="margin-bottom: 24px; padding: 16px; border: 1px solid #e5e7eb; border-radius: 8px; background: #ffffff;">
        <h3 style="margin: 0 0 8px; color: #A23E48; font-size: 18px;">${brand.brand_name}</h3>
        ${brand.category ? `<p style="margin: 4px 0; color: #6b7280; font-size: 14px;">Category: ${brand.category}</p>` : ""}
        ${brand.website_url ? `<p style="margin: 4px 0;"><a href="${brand.website_url}" style="color: #A23E48; text-decoration: none;">Visit Website →</a></p>` : ""}
        ${brand.social_media ? `<p style="margin: 4px 0;"><a href="${brand.social_media}" style="color: #A23E48; text-decoration: none;">Social Media →</a></p>` : ""}
      </div>
    `
      )
      .join("");

    const emailHTML = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
        </head>
        <body style="font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.6; color: #141414; max-width: 600px; margin: 0 auto; padding: 20px; background: #FAF9F8;">
          <div style="background: #ffffff; padding: 32px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);">
            <h1 style="color: #A23E48; font-size: 28px; margin: 0 0 8px;">Your PopUp Lane Finds</h1>
            <p style="color: #5f6163; margin: 0 0 24px;">Here are the brands you saved during your visit to The Lane:</p>
            
            ${brandsHTML}
            
            <div style="margin-top: 32px; padding-top: 24px; border-top: 1px solid #e5e7eb;">
              <p style="color: #5f6163; font-size: 14px; margin: 0;">
                Thanks for discovering small brands with PopUp Lane! Don't forget to check back when The Lane opens again for more amazing finds.
              </p>
              <p style="color: #5f6163; font-size: 14px; margin: 16px 0 0;">
                — The PopUp Lane Team
              </p>
            </div>
          </div>
        </body>
      </html>
    `;

    // Use Resend API directly via fetch
    const resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "PopUp Lane <onboarding@resend.dev>",
        to: [email],
        subject: "Your Saved Brands from PopUp Lane",
        html: emailHTML,
      }),
    });

    if (!resendResponse.ok) {
      const errorText = await resendResponse.text();
      console.error("Resend API error:", errorText);
      throw new Error(`Resend API error: ${errorText}`);
    }

    const responseData = await resendResponse.json();
    console.log("Email sent successfully:", responseData);

    return new Response(JSON.stringify({ success: true, data: responseData }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-my-finds function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
