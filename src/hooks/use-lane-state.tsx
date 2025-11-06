import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type LaneState = "open" | "closed" | "paused";

interface LaneStateConfig {
  state: LaneState;
  nextEventDate?: string;
}

export const useLaneState = (): LaneStateConfig => {
  const { data: settings } = useQuery({
    queryKey: ["lane-settings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("lane_settings")
        .select("*")
        .order("updated_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error("Error fetching lane settings:", error);
        return null;
      }

      return data;
    },
    refetchInterval: 30000, // Refetch every 30 seconds to pick up admin changes
  });

  const state = (settings?.lane_status as LaneState) || "closed";
  const nextEventDate = state === "closed" ? settings?.early_access_date : undefined;

  return {
    state,
    nextEventDate,
  };
};
