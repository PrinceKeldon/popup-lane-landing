import { supabase } from '@/integrations/supabase/client';

type EventType = 'view' | 'click' | 'product_view';
type Mode = 'active' | 'backroom';

export const useTrackMerchantAnalytics = () => {
  const trackEvent = async (
    merchantId: string,
    eventType: EventType,
    mode: Mode,
    metadata?: Record<string, any>
  ) => {
    try {
      // Track in merchant_analytics with mode context
      const { error } = await supabase
        .from('merchant_analytics')
        .insert({
          merchant_id: merchantId,
          event_type: eventType,
          metadata: { ...metadata, mode },
        });

      if (error) {
        console.error('Error tracking analytics:', error);
      }

      // Update backroom-specific stats if in backroom mode
      if (mode === 'backroom') {
        try {
          await supabase.rpc('increment_backroom_stat' as any, {
            p_merchant_id: merchantId,
            p_stat_type: eventType === 'view' ? 'views' : 'clicks'
          });
        } catch (rpcError) {
          console.error('Error updating backroom stats:', rpcError);
        }
      }
    } catch (error) {
      console.error('Error tracking analytics:', error);
    }
  };

  return { trackEvent };
};
