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
    : 'தொடங்குக';

  return (
    <div className="flex items-center gap-2">
      <Button
        className={`min-w-[110px] h-12 text-base font-bold ${
          isExpired
            ? 'bg-red-600 hover:bg-red-700'
            : isPaused
            ? 'bg-gray-500 hover:bg-gray-600'
            : isLive && !isPaused
            ? 'bg-green-600 hover:bg-green-700'
            : 'bg-green-600 hover:bg-green-700'
        } text-white`}
        onClick={onToggle}
      >
        {buttonText}
        {isLive && count !== undefined && count > 0 && (
          <> {count}</>
        )}
      </Button>
    </div>
  );
}
