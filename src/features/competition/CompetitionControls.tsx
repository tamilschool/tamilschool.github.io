import { Button } from '@/components/ui/button';
import { Toggle } from '@/components/ui/toggle';
import { ChevronLeft, ChevronRight, Check, X } from 'lucide-react';

interface CompetitionControlsProps {
  currentIndex: number;
  totalCount: number;
  answer: boolean | null;
  isMaxAnswered: boolean;
  isTimerLive: boolean;
  isTimerPaused: boolean;
  isTimerExpired: boolean;
  onPrevious: () => void;
  onNext: () => void;
  onToggleAnswer: (value: boolean) => void;
}

export function CompetitionControls({
  currentIndex,
  totalCount,
  answer,
  isMaxAnswered,
  isTimerLive,
  isTimerPaused,
  isTimerExpired,
  onPrevious,
  onNext,
  onToggleAnswer,
}: CompetitionControlsProps) {
  // Timer is actively running (not paused, not expired)
  const isTimerRunning = isTimerLive && !isTimerPaused && !isTimerExpired;

  // Navigation buttons only enabled when timer is actively running
  const navigationDisabled = !isTimerRunning;

  // Answer toggles disabled unless timer is running OR timer expired (allow marking current question)
  const answerDisabled = !isTimerRunning && !isTimerExpired;

  return (
    <div className="flex items-center gap-2 w-full">
      <Button
        onClick={onPrevious}
        disabled={navigationDisabled || currentIndex === 0}
        className="select-none flex flex-1 h-10 min-w-[60px] items-center justify-center gap-1 rounded-lg border border-slate-200 bg-white px-4 text-xs font-semibold text-slate-600 shadow-sm transition-colors hover:border-blue-400 hover:bg-blue-50 hover:text-blue-600 disabled:border-slate-100 disabled:bg-slate-100 disabled:text-slate-400"
      >
        <ChevronLeft className="h-4 w-4" />
        <span>முந்தைய</span>
      </Button>

      <div className="flex flex-1 gap-1 rounded-lg border border-slate-200 bg-white p-1 shadow-sm h-10 items-center">
        <Toggle
          pressed={answer === false}
          onPressedChange={(pressed) => {
            if (pressed) onToggleAnswer(false);
          }}
          disabled={answerDisabled || isMaxAnswered}
          className="select-none flex-1 h-8 flex items-center justify-center gap-1 px-2 text-xs data-[state=on]:bg-rose-500 data-[state=on]:text-white"
          title="தவறு"
        >
          <X className="h-4 w-4" />
          <span>தவறு</span>
        </Toggle>

        <Toggle
          pressed={answer === true}
          onPressedChange={(pressed) => {
            if (pressed) onToggleAnswer(true);
          }}
          disabled={answerDisabled || isMaxAnswered}
          className="select-none flex-1 h-8 flex items-center justify-center gap-1 px-2 text-xs data-[state=on]:bg-emerald-500 data-[state=on]:text-white"
          title="சரி"
        >
          <Check className="h-4 w-4" />
          <span>சரி</span>
        </Toggle>
      </div>

      <Button
        onClick={onNext}
        disabled={navigationDisabled || currentIndex >= totalCount - 1}
        className="select-none flex flex-1 h-10 min-w-[60px] items-center justify-center gap-1 rounded-lg border border-slate-200 bg-white px-4 text-xs font-semibold text-slate-600 shadow-sm transition-colors hover:border-blue-400 hover:bg-blue-50 hover:text-blue-600 disabled:border-slate-100 disabled:bg-slate-100 disabled:text-slate-400"
      >
        <span>அடுத்த</span>
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
