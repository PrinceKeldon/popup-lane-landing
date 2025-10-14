import { useState, useEffect } from "react";

export type LaneState = "open" | "closed";

interface LaneStateConfig {
  state: LaneState;
  nextEventDate?: string;
}

export const useLaneState = (): LaneStateConfig => {
  const [state, setState] = useState<LaneState>("open");

  useEffect(() => {
    // Check if we're in an active season
    // For now, we'll check if we're within Black Friday season (late Nov)
    const now = new Date();
    const currentMonth = now.getMonth(); // 0-indexed (November = 10)
    const currentDay = now.getDate();
    
    // Open from Nov 15 to Dec 5 (Black Friday season)
    const isBlackFridaySeason = 
      (currentMonth === 10 && currentDay >= 15) || // Nov 15-30
      (currentMonth === 11 && currentDay <= 5);     // Dec 1-5
    
    setState(isBlackFridaySeason ? "open" : "closed");
  }, []);

  return {
    state,
    nextEventDate: state === "closed" ? "2025-11-15" : undefined,
  };
};
