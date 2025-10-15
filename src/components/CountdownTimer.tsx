import { useEffect, useState } from "react";

interface CountdownTimerProps {
  targetDate: string;
  isOpen?: boolean;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export const CountdownTimer = ({ targetDate, isOpen = false }: CountdownTimerProps) => {
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
    <div className="flex flex-col items-center min-w-[72px]">
      <div 
        className={`font-bold text-[30px] font-mono text-foreground bg-card px-4.5 py-2 rounded-lg border border-input shadow-[var(--shadow-subtle)] transition-opacity duration-350 ${
          isOpen ? 'opacity-75' : ''
        }`}
      >
        {value.toString().padStart(2, '0')}
      </div>
      <span className="text-[12px] text-muted-foreground uppercase tracking-wide mt-2">{label}</span>
    </div>
  );

  return (
    <div 
      className="flex gap-4.5 justify-center items-end my-7 font-mono"
      role="timer"
      aria-live="polite"
      aria-atomic="true"
      aria-label={isOpen ? "Time until lane closes" : "Time until lane opens"}
    >
      <TimeBlock value={timeLeft.days} label="Days" />
      <TimeBlock value={timeLeft.hours} label="Hrs" />
      <TimeBlock value={timeLeft.minutes} label="Min" />
      <TimeBlock value={timeLeft.seconds} label="Sec" />
    </div>
  );
};
