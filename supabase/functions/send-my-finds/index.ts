import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const resendApiKey = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// Validation schemas
const productSchema = z.object({
  id: z.string().uuid(),
  product_name: z.string().trim().min(1).max(200),
  product_description: z.string().max(1000).nullable().optional(),
  offer_text: z.string().max(200).nullable().optional(),
  price: z.number().nullable().optional(),
  original_price: z.number().nullable().optional(),
  discount_percentage: z.number().nullable().optional(),
  website_url: z.preprocess(
    (val) => (val === null || val === '' || val === undefined) ? undefined : val,
    z.string().url().startsWith('http').max(500).optional()
  ),
  is_featured: z.boolean().optional()
});

const brandSchema = z.object({
  id: z.string().uuid(),
  brand_name: z.string().trim().min(1).max(100),
  category: z.string().max(50).nullable().optional(),
  website_url: z.preprocess(
    (val) => {
      // Convert null, empty string, or undefined to undefined
      if (val === null || val === '' || val === undefined) return undefined;
      return val;
    },
    z.string().url().startsWith('http').max(500).optional()
  ),
  social_media: z.preprocess(
    (val) => {
      // Convert null, empty string, or undefined to undefined
      if (val === null || val === '' || val === undefined) return undefined;
      return val;
    },
    // Social media can be a handle (e.g., "@username", "hushara_merch") or a URL
    z.string().trim().max(500).optional()
  ),
  merchant_products: z.array(productSchema).optional()
});

const requestSchema = z.object({
  email: z.string().email().max(255),
  brands: z.array(brandSchema).min(1).max(50),
  laneClosingDate: z.string().datetime().optional()
});

interface Product {
  id: string;
  product_name: string;
  product_description?: string | null;
  offer_text?: string | null;
  price?: number | null;
  original_price?: number | null;
  discount_percentage?: number | null;
  website_url?: string | null;
  is_featured?: boolean;
}

interface Brand {
  id: string;
  brand_name: string;
  category?: string | null;
  website_url?: string | null;
  social_media?: string | null;
  merchant_products?: Product[];
}

// HTML escaping function to prevent XSS
function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

interface SendMyFindsRequest {
  email: string;
  brands: Brand[];
  laneClosingDate?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    
    // Validate input
    const validation = requestSchema.safeParse(body);
    if (!validation.success) {
      console.error("Validation failed:", validation.error);
      return new Response(
        JSON.stringify({ 
          error: "Invalid input data", 
          details: validation.error.issues 
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    const { email, brands, laneClosingDate } = validation.data;

    // Calculate days remaining until lane closes
    let daysRemaining = 3; // Default
    if (laneClosingDate) {
      const closing = new Date(laneClosingDate);
      const now = new Date();
      const diffTime = closing.getTime() - now.getTime();
      daysRemaining = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
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

    // Build product cards HTML
    const productCardsHTML = brands
      .flatMap(brand => {
        const products = brand.merchant_products || [];
        
        // If no products, create a card for the brand itself
        if (products.length === 0) {
          return [`
            <div style="border: 1px solid rgba(17,18,23,0.08); border-radius: 10px; padding: 16px; background-color: #fdfdfd; box-shadow: 0 3px 10px rgba(0,0,0,0.03);">
              <div style="font-weight: 700; color: #221111; font-size: 16px; margin-bottom: 4px;">${escapeHtml(brand.brand_name)}</div>
              ${brand.category ? `<div style="font-size: 13px; color: #666; margin-bottom: 8px;">${escapeHtml(brand.category)}</div>` : ''}
              ${brand.website_url 
                ? `<a href="${escapeHtml(brand.website_url)}" style="display: inline-block; text-decoration: none; background-color: #111; color: #fff; padding: 8px 12px; border-radius: 8px; font-size: 13px; font-weight: 600;">Visit Brand →</a>` 
                : ''}
            </div>
          `];
        }
        
        // Create card for each product
        return products.map(product => {
          const tagline = product.product_description 
            ? product.product_description.substring(0, 120) + (product.product_description.length > 120 ? '...' : '')
            : '';
          
          const offerText = product.offer_text || 
            (product.discount_percentage ? `${product.discount_percentage}% off` : '');
          
          const productUrl = product.website_url || brand.website_url || '#';
          
          return `
            <div style="border: 1px solid rgba(17,18,23,0.08); border-radius: 10px; padding: 16px; background-color: #fdfdfd; box-shadow: 0 3px 10px rgba(0,0,0,0.03);">
              <div style="font-weight: 700; color: #221111; font-size: 16px; margin-bottom: 4px;">${escapeHtml(brand.brand_name)}</div>
              <div style="font-weight: 500; font-size: 15px; margin-bottom: 6px; color: #333;">${escapeHtml(product.product_name)}</div>
              ${offerText ? `<div style="background-color: #a23e48; color: #fff; font-size: 12px; font-weight: 600; padding: 3px 8px; border-radius: 6px; display: inline-block; margin-bottom: 8px;">${escapeHtml(offerText)}</div>` : ''}
              ${tagline ? `<div style="font-size: 13px; color: #555; margin-bottom: 10px; line-height: 1.4;">${escapeHtml(tagline)}</div>` : ''}
              <a href="${escapeHtml(productUrl)}" style="display: inline-block; text-decoration: none; background-color: #111; color: #fff; padding: 8px 12px; border-radius: 8px; font-size: 13px; font-weight: 600;">View on the Lane →</a>
            </div>
          `;
        });
      })
      .join('');

    const emailHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Your Lane Finds — PopUp Lane</title>
<style>
  body {
    font-family: 'Inter', Arial, sans-serif;
    background-color: #f9f9f9;
    color: #111;
    margin: 0;
    padding: 0;
  }
  .email-container {
    max-width: 640px;
    margin: 0 auto;
    background: #fff;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 4px 16px rgba(0,0,0,0.05);
  }
  .header {
    background-color: #221111;
    color: #fff;
    padding: 24px 20px;
    text-align: center;
  }
  .header h1 {
    font-family: 'Playfair Display', serif;
    margin: 0;
    font-size: 24px;
  }
  .subtext {
    font-size: 14px;
    color: #ddd;
    margin-top: 6px;
  }
  .finds {
    padding: 24px;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
    gap: 16px;
  }
  .closing {
    text-align: center;
    padding: 20px;
    font-size: 14px;
    color: #555;
  }
  .footer {
    text-align: center;
    font-size: 12px;
    color: #999;
    padding: 16px;
    border-top: 1px solid #eee;
  }
  .footer a {
    color: #999;
    text-decoration: none;
  }
  .footer a:hover {
    color: #a23e48;
  }
  @media (max-width: 480px) {
    .finds {
      grid-template-columns: 1fr;
      padding: 16px;
    }
    .header h1 { font-size: 20px; }
  }
</style>
</head>
<body>
  <div class="email-container">
    <div class="header">
      <h1>Your Lane Finds Are Here</h1>
      <p class="subtext">Limited-time drops you saved — still live for a few days.</p>
    </div>

    <div class="finds">
      ${productCardsHTML}
    </div>

    <div class="closing">
      🔔 The Lane closes in <strong>${daysRemaining} day${daysRemaining !== 1 ? 's' : ''}</strong> — don't miss your Finds before they disappear.
    </div>

    <div class="footer">
      © 2025 PopUp Lane — Discover Small Brands<br>
      <a href="mailto:founder@popuplane.com">Contact Us</a>
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
        from: "PopUp Lane <founder@popuplane.com>",
        reply_to: "founder@popuplane.com",
        to: [email],
        subject: "Your Lane Finds — Closing Soon! 🔔",
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
