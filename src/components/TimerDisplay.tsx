import { Button } from '@/components/ui/button';
import type { CSSProperties } from 'react';

/**
 * Timer display component with MM:SS format and control buttons
 * Reference: Timer controls from old/.../practice/Navigation.kt
 */
export interface TimerDisplayProps {
  time: number; // seconds
  isLive: boolean;
  isPaused: boolean;
  totalTime: number;
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
  totalTime,
  onToggle,
}: TimerDisplayProps) {
  const isExpired = time <= 0 && isLive;

  const buttonText = isExpired
    ? 'மீண்டும்'
    : isLive
    ? formatTime(time)
    : 'தொடங்கு';

  const total = totalTime > 0 ? totalTime : 1;
  const normalized = Math.min(Math.max(time / total, 0), 1);
  const progressAngle = normalized * 360;
  const progressColor = isExpired ? '#f97316' : isPaused ? '#94a3b8' : isLive ? '#10b981' : '#0ea5e9';
  const trackColor = 'rgba(203, 213, 225, 0.45)';
  const borderStyle: CSSProperties = (isLive || isPaused)
    ? {
        background: `conic-gradient(${progressColor} ${progressAngle}deg, ${trackColor} ${progressAngle}deg)`
      }
    : {
        background: `linear-gradient(${trackColor}, ${trackColor})`
      };

  const buttonBase = 'min-w-[112px] h-full rounded-lg border border-slate-200 bg-white px-5 text-sm text-slate-600 transition-colors shadow-sm hover:text-emerald-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-0';
  const stateClasses = isExpired
    ? 'focus-visible:ring-amber-200'
    : isPaused
    ? 'focus-visible:ring-slate-200'
    : isLive
    ? 'focus-visible:ring-emerald-200'
    : 'focus-visible:ring-sky-200';
  const activeTextClass = isExpired
    ? 'text-amber-600'
    : isPaused
    ? 'text-slate-500'
    : isLive
    ? 'text-emerald-600'
    : 'text-emerald-600';

  return (
    <div className="flex items-center">
      <div
        className={`relative inline-flex rounded-xl p-[2px] -my-[2px] ${isLive && isPaused ? 'animate-pulse' : ''}`}
        style={borderStyle}
      >
        <Button
          className={`${buttonBase} ${stateClasses} ${activeTextClass}`}
          onClick={onToggle}
        >
          {buttonText}
        </Button>
      </div>
    </div>
  );
}
