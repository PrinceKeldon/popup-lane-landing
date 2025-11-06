import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useLaneSettings } from "./useLaneSettings";

export const useMerchantSpots = () => {
  // Get spots limit from lane_settings
  const { spotsLimit, isLoading: settingsLoading } = useLaneSettings();
  
  // Count actual approved merchants from database
  const { data: merchantCount = 0, isLoading: countLoading } = useQuery({
    queryKey: ["merchantCount"],
    queryFn: async () => {
      const { count, error } = await supabase
        .from("merchants")
        .select("*", { count: "exact", head: true })
        .eq("application_status", "Approved"); // Only count approved

      if (error) throw error;
      return count || 0;
    },
    refetchInterval: 10000, // Refetch every 10 seconds
  });

  const spotsRemaining = spotsLimit - merchantCount;

  return {
    spotsRemaining: Math.max(0, spotsRemaining),
    totalSpots: spotsLimit,
    merchantCount,
    isLoading: settingsLoading || countLoading,
  };
};
