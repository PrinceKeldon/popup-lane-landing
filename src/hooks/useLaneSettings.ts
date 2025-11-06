import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useLaneSettings = () => {
  const { data: settings, isLoading } = useQuery({
    queryKey: ["lane-settings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("lane_settings")
        .select("*")
        .limit(1)
        .maybeSingle();
      
      if (error) throw error;
      return data;
    },
    refetchInterval: 10000, // Refetch every 10 seconds for near-real-time updates
  });

  return {
    earlyAccessDate: settings?.early_access_date 
      ? new Date(settings.early_access_date) 
      : new Date("2025-11-21T10:00:00"), // Fallback
    laneStatus: settings?.lane_status || "closed",
    spotsLimit: settings?.spots_limit || 50,
    isLoading,
  };
};
