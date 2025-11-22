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
  isCompetition?: boolean;
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
  onReset,
  isCompetition = false,
}: TimerDisplayProps) {
  const isExpired = time <= 0 && isLive;

  const buttonText = (() => {
    if (isExpired) return isCompetition ? formatTime(time) : 'மீண்டும்';
    if (isLive) return formatTime(time);
    return 'தொடங்கு';
  })();

  const total = totalTime > 0 ? totalTime : 1;
  const normalized = Math.min(Math.max(time / total, 0), 1);
  const progressAngle = normalized * 360;

  // Colors: progress (green/amber/gray), and an opaque track so no pale inner band appears
  const progressColor = isExpired ? '#f97316' : isPaused ? '#94a3b8' : isLive ? '#059669' : '#0ea5e9';
  const trackColor = '#e5e7eb'; // slate-200 - opaque

  const borderStyle: CSSProperties = (isLive || isPaused)
    ? {
        background: `conic-gradient(${progressColor} ${progressAngle}deg, ${trackColor} ${progressAngle}deg)`,
      }
    : {
        background: `${trackColor}`,
      };

  // Button base: use explicit height so overall outer size (button + wrapper padding) matches other header buttons
  const buttonBase = isPaused
    ? 'select-none min-w-[112px] h-9 rounded-lg border border-amber-400 bg-amber-100 px-5 text-sm transition-colors shadow-md hover:bg-amber-200 animate-pulse'
    : 'select-none min-w-[112px] h-9 rounded-lg border border-transparent bg-white px-5 text-sm text-slate-600 transition-colors shadow-sm hover:bg-sky-100 hover:text-emerald-600';

  const stateClasses = isExpired
    ? ''
    : isPaused
    ? 'text-amber-800'
    : isLive
    ? 'text-emerald-600'
    : 'text-emerald-600';

  return (
    <div className="flex items-center">
      {/* outer gradient ring: small padding so outer size matches other buttons */}
      <div
        className={`relative inline-flex rounded-lg p-[2px] -my-[2px] ${isLive && isPaused ? 'animate-pulse' : ''}`}
        style={borderStyle}
      >
        <Button
          className={`${buttonBase} ${stateClasses} hover:border-sky-400 hover:text-sky-600 focus-visible:ring-0 focus-visible:shadow-none focus-visible:outline-none focus:ring-0 focus:shadow-none`}
          onClick={() => {
            if (isExpired && !isCompetition) {
              onReset();
            } else {
              onToggle();
            }
          }}
          disabled={isExpired && isCompetition}
        >
          {buttonText}
        </Button>
      </div>
    </div>
  );
}
