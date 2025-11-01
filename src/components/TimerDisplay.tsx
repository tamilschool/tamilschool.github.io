import { Button } from '@/components/ui/button';

/**
 * Timer display component with MM:SS format and control buttons
 * Reference: Timer controls from old/.../practice/Navigation.kt
 */
export interface TimerDisplayProps {
  time: number; // seconds
  isLive: boolean;
  isPaused: boolean;
  count?: number; // Optional answered questions count
  onToggle: () => void;
  onReset: () => void;
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins} : ${secs.toString().padStart(2, '0')}`;
}

export function TimerDisplay({
  time,
  isLive,
  isPaused,
  count,
  onToggle,
}: TimerDisplayProps) {
  const isExpired = time <= 0 && isLive;

  const buttonText = isLive 
    ? formatTime(time)
    : 'தொடங்கு';

  const baseClasses = "min-w-[112px] h-10 rounded-full px-5 text-sm font-semibold transition-colors flex items-center justify-center focus-visible:ring-2 focus-visible:ring-offset-0";
  const stateClasses = isExpired
    ? "bg-amber-500 text-white hover:bg-amber-600 focus-visible:ring-amber-200 shadow-[0_0_0_1px_rgba(251,191,36,0.35)]"
    : isPaused
    ? "bg-slate-400 text-white hover:bg-slate-500 focus-visible:ring-slate-300 shadow-[0_0_0_1px_rgba(148,163,184,0.35)]"
    : isLive
    ? "bg-emerald-500 text-white hover:bg-emerald-600 focus-visible:ring-emerald-200 shadow-[0_0_0_1px_rgba(16,185,129,0.35)]"
    : "border border-emerald-200 bg-white text-emerald-600 hover:bg-emerald-50 focus-visible:ring-emerald-100 shadow-[0_0_0_1px_rgba(16,185,129,0.25)]";

  return (
    <div className="flex items-center gap-0">
      <Button className={`${baseClasses} ${stateClasses}`} onClick={onToggle}>
        {buttonText}
        {isLive && count !== undefined && count > 0 && (
          <span className="ml-1 rounded-full bg-white/20 px-2 text-xs font-semibold text-white">
            {count}
          </span>
        )}
      </Button>
    </div>
  );
}
