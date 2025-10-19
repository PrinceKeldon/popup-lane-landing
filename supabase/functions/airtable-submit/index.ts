import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const AIRTABLE_TOKEN = Deno.env.get('AIRTABLE_TOKEN');
const AIRTABLE_BASE_ID = "app25rRyBeipA50Rt";
const SHOPPER_TABLE = "Shoppers";
const MERCHANT_TABLE = "Merchants";

async function postToAirtable(table: string, data: Record<string, any>) {
  console.log(`Posting to Airtable table: ${table}`, { fields: data });
  
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
    const error = await response.text();
    console.error(`Airtable API error for ${table}:`, error);
    console.error(`Attempted to post fields:`, JSON.stringify(data, null, 2));
    throw new Error(`Airtable API error: ${response.status}`);
  }

  const result = await response.json();
  console.log(`Successfully posted to ${table}:`, result.id);
  return result;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, email, brandName, website, socialMedia, category } = await req.json();

    console.log(`Processing ${type} submission for email: ${email}`);

    if (type === 'shopper') {
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
      // Post to Airtable
      const airtableResult = await postToAirtable(MERCHANT_TABLE, {
        "Email": email,
        "Brand Name": brandName || '',
        "Website URL": website || '',
        "Social Media Handle / Link": socialMedia || '',
        "Category": category || '',
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
          brand_name: brandName || '',
          website_url: website || '',
          social_media: socialMedia || '',
          category: category || '',
          application_status: 'Pending',
          airtable_record_id: airtableResult.id
        })
      });

      if (!merchantResponse.ok) {
        const error = await merchantResponse.text();
        console.error('Supabase merchant creation error:', error);
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
            brandName: brandName || '',
            spotsRemaining
          }
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      );
    } else {
      throw new Error('Invalid submission type');
    }
  } catch (error) {
    console.error('Error processing submission:', error);
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
