import { supabase } from '@/integrations/supabase/client';

export const useTrackMerchantAnalytics = () => {
  const trackEvent = async (
    merchantId: string,
    eventType: 'view' | 'click' | 'product_view',
    metadata?: Record<string, any>
  ) => {
    try {
      const { error } = await supabase
        .from('merchant_analytics')
        .insert({
          merchant_id: merchantId,
          event_type: eventType,
          metadata: metadata || {},
        });

      if (error) {
        console.error('Error tracking analytics:', error);
      }
    } catch (error) {
      console.error('Error tracking analytics:', error);
    }
  };

  const trackMerchantView = (merchantId: string) => {
    trackEvent(merchantId, 'view');
  };

  const trackMerchantClick = (merchantId: string) => {
    trackEvent(merchantId, 'click');
  };

  const trackProductView = (merchantId: string, productId?: string) => {
    trackEvent(merchantId, 'product_view', { product_id: productId });
  };

  return {
    trackMerchantView,
    trackMerchantClick,
    trackProductView,
  };
};
