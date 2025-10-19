import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { POPUP_LANE_CONFIG } from "@/lib/constants";

export const useMerchantSpots = () => {
  const { data: merchantCount = 0, isLoading } = useQuery({
    queryKey: ["merchantCount"],
    queryFn: async () => {
      const { count, error } = await supabase
        .from("merchants")
        .select("*", { count: "exact", head: true });

      if (error) throw error;
      return count || 0;
    },
  });

  const spotsRemaining = POPUP_LANE_CONFIG.TOTAL_MERCHANT_SPOTS - merchantCount;

  return {
    spotsRemaining: Math.max(0, spotsRemaining),
    totalSpots: POPUP_LANE_CONFIG.TOTAL_MERCHANT_SPOTS,
    isLoading,
  };
};
