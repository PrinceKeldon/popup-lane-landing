import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const AIRTABLE_TOKEN = Deno.env.get('AIRTABLE_TOKEN');
const AIRTABLE_BASE_ID = Deno.env.get('AIRTABLE_BASE_ID');
const SHOPPER_TABLE = "Shoppers";
const MERCHANT_TABLE = "Merchants";
const MERCHANT_NOTICES_TABLE = "Merchant Notices";
const MERCHANT_FEEDBACK_TABLE = "Merchant Feedback";

const VALID_TABLES = [
  SHOPPER_TABLE,
  MERCHANT_TABLE,
  MERCHANT_NOTICES_TABLE,
  MERCHANT_FEEDBACK_TABLE
] as const;

// Rate limiting: Track submissions by IP
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour in milliseconds
const MAX_REQUESTS_PER_WINDOW = 3;

// Validation schemas
const shopperSchema = z.object({
  type: z.literal('shopper'),
  email: z.string().email().max(255).trim().toLowerCase(),
});

const merchantSchema = z.object({
  type: z.literal('merchant'),
  email: z.string().email().max(255).trim().toLowerCase(),
  brandName: z.string().trim().min(1, "Brand name is required").max(100),
  website: z.string().url().max(500).refine(
    (url) => url.startsWith('http://') || url.startsWith('https://'),
    { message: "Website must be a valid HTTP/HTTPS URL" }
  ).optional().or(z.literal('')),
  socialMedia: z.string().trim().max(200).optional().or(z.literal('')),
  category: z.enum(['Fashion', 'Home', 'Beauty & Wellness', 'Art & Lifestyle', 'Other']),
});

const merchantNoticeSchema = z.object({
  table: z.literal('Merchant Notices'),
  fields: z.object({
    merchant_name: z.string().trim().min(1).max(100),
    title: z.string().trim().min(1).max(200),
    message: z.string().trim().min(1).max(2000),
    category: z.enum(['Update', 'Offer', 'Collab', 'Event']),
    link: z.string().url().max(500).optional(),
    visibility: z.enum(['Public', 'Merchant-only']),
    status: z.string().default('pending'),
  })
});

const merchantFeedbackSchema = z.object({
  table: z.literal('Merchant Feedback'),
  fields: z.object({
    merchant_name: z.string().trim().min(1).max(100),
    brand_website: z.string().url().max(500),
    rating: z.number().int().min(1).max(5),
    feedback: z.string().trim().min(10).max(2000),
    allow_quote: z.boolean(),
    status: z.string().default('pending'),
  })
});

// Sanitize text input to prevent XSS
function sanitizeText(text: string): string {
  return text
    .replace(/[<>]/g, '') // Remove < and > to prevent HTML injection
    .trim();
}

// Check rate limit for IP
function checkRateLimit(ip: string): { allowed: boolean; message?: string } {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record || now > record.resetTime) {
    // No record or expired - create new
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return { allowed: true };
  }

  if (record.count >= MAX_REQUESTS_PER_WINDOW) {
    const minutesLeft = Math.ceil((record.resetTime - now) / 60000);
    return { 
      allowed: false, 
      message: `Rate limit exceeded. Please try again in ${minutesLeft} minute(s).` 
    };
  }

  // Increment count
  record.count++;
  rateLimitMap.set(ip, record);
  return { allowed: true };
}

// Clean up old rate limit entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [ip, record] of rateLimitMap.entries()) {
    if (now > record.resetTime) {
      rateLimitMap.delete(ip);
    }
  }
}, 5 * 60 * 1000); // Clean up every 5 minutes

async function postToAirtable(table: string, data: Record<string, any>) {
  console.log(`[Airtable] Posting to table with ${Object.keys(data).length} fields`);
  
  const response = await fetch(
    `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${table}`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${AIRTABLE_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ fields: data }),
    }
  );

  if (!response.ok) {
    console.error(`[Airtable] API error: ${response.status}`);
    throw new Error(`Airtable API error: ${response.status}`);
  }

  const result = await response.json();
  console.log(`[Airtable] Successfully posted record`);
  return result;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get client IP for rate limiting
    const clientIp = req.headers.get('x-forwarded-for')?.split(',')[0] || 
                     req.headers.get('x-real-ip') || 
                     'unknown';

    // Check rate limit
    const rateLimitCheck = checkRateLimit(clientIp);
    if (!rateLimitCheck.allowed) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: rateLimitCheck.message 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 429,
        }
      );
    }

    // Parse and validate request body
    const body = await req.json();
    const { type, table } = body;

    // Handle new Airtable direct submissions (Merchant Notices & Feedback)
    if (table && VALID_TABLES.includes(table)) {
      if (table === MERCHANT_NOTICES_TABLE) {
        const validationResult = merchantNoticeSchema.safeParse(body);
        if (!validationResult.success) {
          return new Response(
            JSON.stringify({ 
              success: false, 
              error: 'Invalid input', 
              details: validationResult.error.issues 
            }),
            { 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
              status: 400,
            }
          );
        }

        const { fields } = validationResult.data;
        await postToAirtable(MERCHANT_NOTICES_TABLE, {
          "Merchant Name": sanitizeText(fields.merchant_name),
          "Title": sanitizeText(fields.title),
          "Message": sanitizeText(fields.message),
          "Category": fields.category,
          "Link": fields.link || '',
          "Visibility": fields.visibility,
          "Status": fields.status,
          "Featured": false,
        });

        return new Response(
          JSON.stringify({ success: true, message: 'Notice submitted successfully' }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200,
          }
        );
      } else if (table === MERCHANT_FEEDBACK_TABLE) {
        const validationResult = merchantFeedbackSchema.safeParse(body);
        if (!validationResult.success) {
          return new Response(
            JSON.stringify({ 
              success: false, 
              error: 'Invalid input', 
              details: validationResult.error.issues 
            }),
            { 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
              status: 400,
            }
          );
        }

        const { fields } = validationResult.data;
        await postToAirtable(MERCHANT_FEEDBACK_TABLE, {
          "Merchant Name": sanitizeText(fields.merchant_name),
          "Brand Website": fields.brand_website,
          "Rating": fields.rating,
          "Feedback": sanitizeText(fields.feedback),
          "Allow Quote": fields.allow_quote,
          "Status": fields.status,
        });

        return new Response(
          JSON.stringify({ success: true, message: 'Feedback submitted successfully' }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200,
          }
        );
      }
    }

    if (type === 'shopper') {
      // Validate shopper data
      const validationResult = shopperSchema.safeParse(body);
      if (!validationResult.success) {
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: 'Invalid input', 
            details: validationResult.error.issues 
          }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400,
          }
        );
      }

      const { email } = validationResult.data;
      
      await postToAirtable(SHOPPER_TABLE, { 
        "Email Address": email,
        "Opt-in Confirmation": true
      });

      return new Response(
        JSON.stringify({ success: true, message: 'Shopper registered successfully' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      );
    } else if (type === 'merchant') {
      // Validate merchant data
      const validationResult = merchantSchema.safeParse(body);
      if (!validationResult.success) {
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: 'Invalid input', 
            details: validationResult.error.issues 
          }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400,
          }
        );
      }

      const { email, brandName, website, socialMedia, category } = validationResult.data;

      // Sanitize text inputs
      const sanitizedBrandName = sanitizeText(brandName);
      const sanitizedSocialMedia = socialMedia ? sanitizeText(socialMedia) : '';

      // Post to Airtable
      const airtableResult = await postToAirtable(MERCHANT_TABLE, {
        "Email": email,
        "Brand Name": sanitizedBrandName,
        "Website URL": website || '',
        "Social Media Handle / Link": sanitizedSocialMedia,
        "Category": category,
        "Application Status": "Pending"
      });

      // Create merchant record in Supabase
      const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
      const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

      const merchantResponse = await fetch(`${supabaseUrl}/rest/v1/merchants`, {
        method: 'POST',
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation'
        },
        body: JSON.stringify({
          email: email,
          brand_name: sanitizedBrandName,
          website_url: website || '',
          social_media: sanitizedSocialMedia,
          category: category,
          application_status: 'Pending',
          airtable_record_id: airtableResult.id
        })
      });

      if (!merchantResponse.ok) {
        const error = await merchantResponse.text();
        console.error('Supabase merchant creation error');
      }

      // Get total merchant count for spots remaining
      const countResponse = await fetch(`${supabaseUrl}/rest/v1/merchants?select=count`, {
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
          'Content-Type': 'application/json',
          'Prefer': 'count=exact'
        }
      });

      let spotsRemaining = 50; // Default
      if (countResponse.ok) {
        const countHeader = countResponse.headers.get('content-range');
        if (countHeader) {
          const total = parseInt(countHeader.split('/')[1]);
          spotsRemaining = Math.max(0, 50 - total);
        }
      }

      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Merchant application submitted successfully',
          merchantData: {
            email,
            brandName: sanitizedBrandName,
            spotsRemaining
          }
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      );
    } else {
      return new Response(
        JSON.stringify({ success: false, error: 'Invalid submission type' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      );
    }
  } catch (error) {
    console.error('Error processing submission');
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});
