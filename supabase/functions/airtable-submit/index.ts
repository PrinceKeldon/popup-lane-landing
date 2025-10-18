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
    console.error(`Airtable API error: ${error}`);
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
      await postToAirtable(MERCHANT_TABLE, {
        "Email": email,
        "Brand Name": brandName || '',
        "Website": website || '',
        "Social Media": socialMedia || '',
        "Category": category || '',
        "Status": "Pending"
      });
      return new Response(
        JSON.stringify({ success: true, message: 'Merchant application submitted successfully' }),
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
