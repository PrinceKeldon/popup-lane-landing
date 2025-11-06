import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.75.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const AIRTABLE_TOKEN = Deno.env.get('AIRTABLE_TOKEN');
const AIRTABLE_BASE_ID = Deno.env.get('AIRTABLE_BASE_ID');

const airtableHeaders = () => ({
  'Authorization': `Bearer ${AIRTABLE_TOKEN}`,
  'Content-Type': 'application/json'
});

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    );

    // Verify admin role
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
    if (authError || !user) {
      console.error('Auth error:', authError);
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const { data: roleData } = await supabaseClient
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .eq('role', 'admin')
      .single();

    if (!roleData) {
      console.error('[Admin] Access denied: user lacks admin role');
      return new Response(JSON.stringify({ error: 'Admin access required' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const { action, table, recordId, fields, pageSize = 100 } = await req.json();

    console.log(`[Admin] Action: ${action}, Table: ${table}`);

    switch (action) {
      case 'list': {
        const url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(table)}?pageSize=${pageSize}`;
        const response = await fetch(url, { headers: airtableHeaders() });
        
        if (!response.ok) {
          throw new Error(`Airtable list failed: ${response.status}`);
        }
        
        const data = await response.json();
        return new Response(JSON.stringify({ records: data.records || [] }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      case 'update': {
        const url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(table)}`;
        const body = JSON.stringify({ records: [{ id: recordId, fields }] });
        const response = await fetch(url, {
          method: 'PATCH',
          headers: airtableHeaders(),
          body
        });

        if (!response.ok) {
          const text = await response.text();
          throw new Error(`Airtable update failed: ${text}`);
        }

        const data = await response.json();

        // If updating Merchants table, also sync with Supabase merchants table
        if (table === 'Merchants' && fields['Application Status']) {
          try {
            // Find the merchant by airtable_record_id
            const { data: merchant } = await supabaseClient
              .from('merchants')
              .select('id')
              .eq('airtable_record_id', recordId)
              .single();

            if (merchant) {
              // Update the merchant status in Supabase
              await supabaseClient
                .from('merchants')
                .update({
                  application_status: fields['Application Status']
                })
                .eq('id', merchant.id);
            }
          } catch (syncError) {
            console.error('[Admin] Supabase sync failed');
            // Don't fail the whole request if sync fails
          }
        }

        return new Response(JSON.stringify(data), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      default:
        return new Response(JSON.stringify({ error: 'Invalid action' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    }
  } catch (error) {
    console.error('[Admin] Function error');
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
