import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface FeedbackData {
  brand_name: string;
  email: string;
  first_impression: string;
  short_quote?: string;
  excited_feature?: string;
  improvement?: string;
  rating: number;
  consent: boolean;
  merchant_id?: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    const formData = await req.formData();
    
    // Validate input
    const brand_name = formData.get('brand_name') as string;
    const email = formData.get('email') as string;
    const first_impression = formData.get('first_impression') as string;
    const short_quote = formData.get('short_quote') as string;
    const excited_feature = formData.get('excited_feature') as string;
    const improvement = formData.get('improvement') as string;
    const rating = parseInt(formData.get('rating') as string);
    const consent = formData.get('consent') === 'yes';
    const merchant_id = formData.get('merchant_id') as string;

    if (!brand_name || !email || !first_impression || !rating) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (rating < 1 || rating > 5) {
      return new Response(
        JSON.stringify({ error: 'Rating must be between 1 and 5' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    let logoUrl = null;

    // Handle logo upload if provided
    const logoFile = formData.get('logo') as File;
    if (logoFile && logoFile.size > 0) {
      // Validate file size (max 5MB)
      if (logoFile.size > 5 * 1024 * 1024) {
        return new Response(
          JSON.stringify({ error: 'Logo file must be less than 5MB' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!allowedTypes.includes(logoFile.type)) {
        return new Response(
          JSON.stringify({ error: 'Logo must be a JPEG, PNG, or WEBP image' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const fileExt = logoFile.name.split('.').pop();
      const fileName = `${crypto.randomUUID()}.${fileExt}`;
      const filePath = `public/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('lane-club-logos')
        .upload(filePath, logoFile, {
          contentType: logoFile.type,
          upsert: false
        });

      if (uploadError) {
        console.error('Storage upload error:', uploadError);
        throw uploadError;
      }
      
      const { data: { publicUrl } } = supabase.storage
        .from('lane-club-logos')
        .getPublicUrl(filePath);
      
      logoUrl = publicUrl;
    }

    // Insert feedback
    const { data: insertedFeedback, error: insertError } = await supabase
      .from('lane_club_feedback')
      .insert({
        merchant_id: merchant_id || null,
        brand_name: brand_name.trim(),
        email: email.trim().toLowerCase(),
        first_impression: first_impression.trim(),
        short_quote: short_quote?.trim() || null,
        excited_feature: excited_feature?.trim() || null,
        improvement: improvement?.trim() || null,
        rating: rating,
        consent_to_feature: consent,
        logo_url: logoUrl,
        status: 'pending'
      })
      .select()
      .single();

    if (insertError) {
      console.error('Database insert error:', insertError);
      throw insertError;
    }

    console.log('Lane Club feedback submitted:', insertedFeedback.id);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Thank you for joining The Lane Club! We\'ll review your feedback soon.',
        id: insertedFeedback.id 
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error('Error processing Lane Club feedback:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
};

serve(handler);
