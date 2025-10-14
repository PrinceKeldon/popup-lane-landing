import { useEffect, useState } from "react";

interface CountdownTimerProps {
  targetDate: string;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export const CountdownTimer = ({ targetDate }: CountdownTimerProps) => {
  const calculateTimeLeft = (): TimeLeft => {
    const difference = +new Date(targetDate) - +new Date();
    
    if (difference > 0) {
      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }
    
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  };

  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  const TimeBlock = ({ value, label }: { value: number; label: string }) => (
    <div className="flex flex-col items-center gap-1">
      <div className="bg-card border-2 border-primary/20 rounded-lg px-4 py-3 min-w-[80px] shadow-lg">
        <span className="text-3xl md:text-4xl font-bold text-primary">
          {value.toString().padStart(2, '0')}
        </span>
      </div>
      <span className="text-sm text-muted-foreground uppercase tracking-wide">{label}</span>
    </div>
  );

  return (
    <div className="flex gap-3 justify-center items-center py-6">
      <TimeBlock value={timeLeft.days} label="Days" />
      <span className="text-2xl text-muted-foreground">:</span>
      <TimeBlock value={timeLeft.hours} label="Hours" />
      <span className="text-2xl text-muted-foreground">:</span>
      <TimeBlock value={timeLeft.minutes} label="Minutes" />
      <span className="text-2xl text-muted-foreground">:</span>
      <TimeBlock value={timeLeft.seconds} label="Seconds" />
    </div>
  );
};
