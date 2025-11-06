import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.75.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface MerchantStats {
  id: string;
  brand_name: string;
  tier: string | null;
  clicks_7d: number;
  views_7d: number;
  clicks_24h: number;
  views_24h: number;
  total_clicks: number;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const lovableApiKey = Deno.env.get('LOVABLE_API_KEY')!;

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    console.log('Fetching merchant analytics data...');

    // Fetch merchant stats from the view
    const { data: merchantStats, error: statsError } = await supabase
      .from('merchant_trending_stats')
      .select('*')
      .order('clicks_7d', { ascending: false });

    if (statsError) {
      console.error('Error fetching merchant stats:', statsError);
      throw statsError;
    }

    console.log(`Analyzing ${merchantStats?.length || 0} merchants for trending status...`);

    // Prepare data for AI analysis
    const analyticsData = merchantStats?.map((m: MerchantStats) => ({
      brand_name: m.brand_name,
      clicks_7d: m.clicks_7d,
      views_7d: m.views_7d,
      clicks_24h: m.clicks_24h,
      views_24h: m.views_24h,
      total_clicks: m.total_clicks,
      current_tier: m.tier,
    })) || [];

    // Use AI to determine which merchants should be trending
    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${lovableApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'system',
            content: `You are an analytics AI that determines which merchants should be marked as "trending" based on engagement data.
            
Consider these factors:
- Recent activity (24h and 7d clicks/views) is more important than total historical clicks
- Merchants with high click-to-view ratios show strong engagement
- Sudden spikes in activity indicate trending content
- Select 3-5 merchants maximum to be trending
- Merchants with "featured" tier should remain featured, not become trending
- Only merchants with "standard" tier can be promoted to "trending"

Return ONLY a JSON array of merchant brand names that should be marked as trending, ordered by trending priority.
Example: ["Brand A", "Brand B", "Brand C"]`
          },
          {
            role: 'user',
            content: `Analyze this merchant data and determine which should be trending:\n\n${JSON.stringify(analyticsData, null, 2)}`
          }
        ],
        temperature: 0.3,
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error('AI API error:', aiResponse.status, errorText);
      throw new Error(`AI API error: ${aiResponse.status}`);
    }

    const aiResult = await aiResponse.json();
    const aiContent = aiResult.choices[0]?.message?.content || '[]';
    
    // Parse AI response
    let trendingBrands: string[] = [];
    try {
      // Extract JSON array from AI response
      const jsonMatch = aiContent.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        trendingBrands = JSON.parse(jsonMatch[0]);
      }
    } catch (parseError) {
      console.error('Error parsing AI response:', parseError);
      console.log('AI response:', aiContent);
    }

    console.log('AI selected trending brands:', trendingBrands);

    // Get merchant IDs for trending brands
    const trendingMerchantIds = merchantStats
      ?.filter((m: MerchantStats) => 
        trendingBrands.includes(m.brand_name) && 
        (m.tier === 'standard' || m.tier === null || m.tier === 'trending')
      )
      .map((m: MerchantStats) => m.id) || [];

    console.log(`Updating ${trendingMerchantIds.length} merchants to trending...`);

    // Reset all standard and trending merchants to standard
    const { error: resetError } = await supabase
      .from('merchants')
      .update({ tier: 'standard' })
      .in('tier', ['standard', 'trending'])
      .neq('tier', 'featured');

    if (resetError) {
      console.error('Error resetting tiers:', resetError);
    }

    // Update selected merchants to trending
    if (trendingMerchantIds.length > 0) {
      const { error: updateError } = await supabase
        .from('merchants')
        .update({ 
          tier: 'trending',
          last_trending_update: new Date().toISOString()
        })
        .in('id', trendingMerchantIds);

      if (updateError) {
        console.error('Error updating trending merchants:', updateError);
        throw updateError;
      }
    }

    console.log('Trending update completed successfully');

    return new Response(
      JSON.stringify({
        success: true,
        trending_count: trendingMerchantIds.length,
        trending_brands: trendingBrands,
        analyzed_merchants: merchantStats?.length || 0,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in update-trending-merchants:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error',
        success: false
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
