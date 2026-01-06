import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useLaneSettings = () => {
  const { data: settings, isLoading, refetch } = useQuery({
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
    refetchInterval: 5000, // Refetch every 5 seconds for real-time sync
  });

  // Compute status based on dates
  const now = new Date();
  const earlyAccessDate = settings?.early_access_date 
    ? new Date(settings.early_access_date) 
    : new Date("2026-02-01T15:00:00");
  const laneCloseDate = settings?.lane_close_date 
    ? new Date(settings.lane_close_date) 
    : new Date("2026-02-15T23:59:00");

  // Determine if lane is open based on current time
  const isLaneOpen = now >= earlyAccessDate && now <= laneCloseDate;
  const computedStatus = isLaneOpen ? "open" : "closed";

  return {
    earlyAccessDate,
    laneCloseDate,
    laneStatus: settings?.lane_status === "open" ? "open" : computedStatus,
    spotsLimit: settings?.spots_limit || 50,
    isLoading,
    refetch,
  };
};
