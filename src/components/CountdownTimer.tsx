import { useCountdown } from "@/hooks/useCountdown";
import { Heart } from "lucide-react";

interface CountdownTimerProps {
  targetDate?: string;
  isOpen?: boolean;
}

export const CountdownTimer = ({ targetDate, isOpen = false }: CountdownTimerProps) => {
  const { days, hours, minutes, seconds, isExpired } = useCountdown(targetDate || "");

  if (!targetDate || isExpired) return null;

  const TimeBlock = ({ value, label }: { value: number; label: string }) => (
    <div className="flex flex-col items-center min-w-[60px] sm:min-w-[72px]">
      <div 
        className={`font-bold text-[24px] sm:text-[28px] md:text-[30px] font-mono text-foreground bg-card/80 backdrop-blur-sm px-3 sm:px-4 md:px-4.5 py-2 rounded-lg border border-wine/15 shadow-[var(--shadow-subtle)] transition-opacity duration-350 ${
          isOpen ? 'opacity-75' : ''
        }`}
      >
        {value.toString().padStart(2, '0')}
      </div>
      <span className="text-[10px] sm:text-[11px] md:text-[12px] text-muted-foreground uppercase tracking-wide mt-2">{label}</span>
    </div>
  );

  return (
    <div 
      className="flex gap-2 sm:gap-3 md:gap-4.5 justify-center items-end my-7 font-mono"
      role="timer"
      aria-live="polite"
      aria-atomic="true"
      aria-label={isOpen ? "Time until lane closes" : "Time until lane opens"}
    >
      <TimeBlock value={days} label="Days" />
      <Heart className="w-4 h-4 text-wine/40 mb-6 animate-pulse-heart" fill="currentColor" />
      <TimeBlock value={hours} label="Hrs" />
      <Heart className="w-4 h-4 text-valentine-rose/40 mb-6 animate-pulse-heart" fill="currentColor" />
      <TimeBlock value={minutes} label="Min" />
      <Heart className="w-4 h-4 text-wine/40 mb-6 animate-pulse-heart" fill="currentColor" />
      <TimeBlock value={seconds} label="Sec" />
    </div>
  );
};
