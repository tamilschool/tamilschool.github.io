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
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export function TimerDisplay({
  time,
  isLive,
  isPaused,
  count,
  onToggle,
}: TimerDisplayProps) {
  const isExpired = time <= 0 && isLive;

  return (
    <div className="flex items-center gap-2">
      <Button
        className={`min-w-[120px] text-lg font-bold ${
          isExpired
            ? 'bg-red-600 hover:bg-red-700'
            : isPaused
            ? 'bg-gray-500 hover:bg-gray-600'
            : 'bg-green-600 hover:bg-green-700'
        } text-white`}
        onClick={onToggle}
      >
        {formatTime(time)}
        {isLive && count !== undefined && count > 0 && (
          <span className="ml-2 bg-white text-blue-600 px-2 py-1 rounded text-sm font-bold">
            {count}
          </span>
        )}
      </Button>
    </div>
  );
}
