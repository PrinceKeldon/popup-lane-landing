import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useRef } from "react";

export const useLaneSettings = () => {
  const { toast } = useToast();
  const hasShownError = useRef(false);

  const { data: settings, isLoading, error } = useQuery({
    queryKey: ["lane-settings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("lane_settings")
        .select("*")
        .limit(1)
        .maybeSingle();
      
      if (error) {
        console.error("Error fetching lane settings:", error);
        throw error;
      }
      
      if (!data) {
        console.error("No lane settings found in database");
        throw new Error("Lane settings not configured");
      }
      
      return data;
    },
    refetchInterval: 5000, // Refetch every 5 seconds for real-time sync
    retry: 3,
  });

  useEffect(() => {
    if (error && !hasShownError.current) {
      hasShownError.current = true;
      toast({
        title: "Configuration Error",
        description: "Failed to load lane settings. Please contact administrator.",
        variant: "destructive",
      });
    }
  }, [error, toast]);

  // Return null for dates if settings don't exist - components must handle this
  return {
    earlyAccessDate: settings?.early_access_date 
      ? new Date(settings.early_access_date) 
      : null,
    laneCloseDate: settings?.lane_close_date 
      ? new Date(settings.lane_close_date) 
      : null,
    laneStatus: settings?.lane_status || "closed",
    spotsLimit: settings?.spots_limit || 50,
    isLoading,
    hasError: !!error,
  };
};
