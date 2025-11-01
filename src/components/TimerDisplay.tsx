import { Button } from '@/components/ui/button';
import { Play, Pause, RotateCcw } from 'lucide-react';

/**
 * Timer display component with MM:SS format and control buttons
 * Reference: Timer controls from old/.../practice/Navigation.kt
 */
export interface TimerDisplayProps {
  time: number; // seconds
  isLive: boolean;
  isPaused: boolean;
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
  onToggle,
  onReset,
}: TimerDisplayProps) {
  const isExpired = time <= 0 && isLive;

  return (
    <div className="flex items-center gap-2">
      <div
        className={`text-2xl font-mono font-bold min-w-[80px] ${
          isExpired ? 'text-destructive' : 'text-foreground'
        }`}
      >
        {formatTime(time)}
      </div>

      <Button
        variant={isLive && !isPaused ? 'default' : 'outline'}
        size="sm"
        onClick={onToggle}
      >
        {isLive && !isPaused ? (
          <>
            <Pause className="h-4 w-4 mr-1" />
            Pause
          </>
        ) : (
          <>
            <Play className="h-4 w-4 mr-1" />
            {isExpired ? 'Restart' : 'Start'}
          </>
        )}
      </Button>

      {isLive && (
        <Button variant="ghost" size="sm" onClick={onReset}>
          <RotateCcw className="h-4 w-4 mr-1" />
          Reset
        </Button>
      )}
    </div>
  );
}
