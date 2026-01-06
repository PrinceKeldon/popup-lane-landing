import { useState, useEffect, useMemo } from "react";

interface CountdownReturn {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
}

export const useCountdown = (targetDate: Date | string): CountdownReturn => {
  // Memoize the target timestamp to prevent infinite loops
  const targetTimestamp = useMemo(() => {
    if (typeof targetDate === 'string') {
      return new Date(targetDate).getTime();
    }
    return targetDate.getTime();
  }, [typeof targetDate === 'string' ? targetDate : targetDate.getTime()]);

  const [timeRemaining, setTimeRemaining] = useState<CountdownReturn>(() => {
    const now = Date.now();
    const difference = targetTimestamp - now;

    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true };
    }

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
      minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
      seconds: Math.floor((difference % (1000 * 60)) / 1000),
      isExpired: false,
    };
  });

  useEffect(() => {
    const calculateTimeRemaining = () => {
      const now = Date.now();
      const difference = targetTimestamp - now;

      if (difference <= 0) {
        setTimeRemaining({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          isExpired: true,
        });
        return;
      }

      setTimeRemaining({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((difference % (1000 * 60)) / 1000),
        isExpired: false,
      });
    };

    const interval = setInterval(calculateTimeRemaining, 1000);
    return () => clearInterval(interval);
  }, [targetTimestamp]);

  return timeRemaining;
};
