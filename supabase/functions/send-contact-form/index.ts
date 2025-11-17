import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const resendApiKey = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface ContactFormRequest {
  name: string;
  email: string;
  subject: string;
  message: string;
  inquiryType: string;
}

const getInquiryTypeBadgeColor = (type: string): string => {
  const colors: Record<string, string> = {
    "General Question": "#3B82F6",
    "Merchant Application Support": "#8B5CF6",
    "Technical Issue": "#EF4444",
    "Partnership Inquiry": "#10B981",
    "Billing & Payments": "#F59E0B",
    "Feature Request": "#14B8A6",
    "Other": "#6B7280",
  };
  return colors[type] || colors["Other"];
};

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, email, subject, message, inquiryType }: ContactFormRequest =
      await req.json();

    // Basic validation
    if (!name || name.trim().length < 2 || name.trim().length > 100) {
      throw new Error("Name must be between 2 and 100 characters");
    }
    if (!email || !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      throw new Error("Valid email is required");
    }
    if (!subject || subject.trim().length < 5 || subject.trim().length > 200) {
      throw new Error("Subject must be between 5 and 200 characters");
    }
    if (!message || message.trim().length < 10 || message.trim().length > 2000) {
      throw new Error("Message must be between 10 and 2000 characters");
    }

    const badgeColor = getInquiryTypeBadgeColor(inquiryType);
    const timestamp = new Date().toLocaleString("en-US", {
      timeZone: "America/New_York",
      dateStyle: "long",
      timeStyle: "short",
    });

    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; background-color: #f3f4f6; }
          .container { max-width: 600px; margin: 0 auto; background-color: white; }
          .header { background: linear-gradient(to right, #8B1538, #A01C4A); color: white; padding: 30px; text-align: center; }
          .header h1 { margin: 0; font-size: 24px; font-weight: bold; }
          .badge { display: inline-block; padding: 8px 16px; border-radius: 20px; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; margin: 20px 0; }
          .content { padding: 30px; }
          .info-section { background-color: #f9fafb; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
          .info-row { margin-bottom: 10px; }
          .info-label { font-weight: 600; color: #4b5563; }
          .message-box { background-color: white; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; margin: 20px 0; line-height: 1.6; white-space: pre-wrap; }
          .cta-button { display: inline-block; background-color: #8B1538; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600; margin: 20px 0; }
          .footer { text-align: center; padding: 20px; font-size: 12px; color: #6b7280; border-top: 1px solid #e5e7eb; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>New Contact Form Submission</h1>
          </div>
          
          <div class="content">
            <div style="text-align: center;">
              <span class="badge" style="background-color: ${badgeColor}; color: white;">
                ${inquiryType}
              </span>
            </div>

            <div class="info-section">
              <div class="info-row">
                <span class="info-label">From:</span> ${name}
              </div>
              <div class="info-row">
                <span class="info-label">Email:</span> ${email}
              </div>
              <div class="info-row">
                <span class="info-label">Submitted:</span> ${timestamp} EST
              </div>
            </div>

            <h2 style="color: #1f2937; font-size: 20px; margin-bottom: 10px;">${subject}</h2>

            <div class="message-box">
              ${message}
            </div>

            <div style="text-align: center;">
              <a href="mailto:${email}?subject=Re: ${encodeURIComponent(subject)}" class="cta-button">
                Reply to ${name}
              </a>
            </div>
          </div>

          <div class="footer">
            <p>Sent from PopUp Lane Contact Form</p>
            <p>Do not reply to this email directly</p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Send email using Resend API
    const resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${resendApiKey}`,
      },
      body: JSON.stringify({
        from: "PopUp Lane Contact Form <onboarding@resend.dev>",
        to: ["founder@popuplane.com"],
        subject: `[PopUp Lane] ${inquiryType}: ${subject}`,
        html: emailHtml,
        reply_to: email,
      }),
    });

    if (!resendResponse.ok) {
      const errorData = await resendResponse.text();
      console.error("Resend API error:", errorData);
      throw new Error("Failed to send email via Resend");
    }

    const emailResult = await resendResponse.json();
    console.log("Contact form email sent successfully:", emailResult);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-contact-form function:", error);
    return new Response(
      JSON.stringify({ 
        error: error.message || "Failed to send message" 
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
