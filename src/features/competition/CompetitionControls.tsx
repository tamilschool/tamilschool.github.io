import { Button } from '@/components/ui/button';
import { Toggle } from '@/components/ui/toggle';
import { ChevronLeft, ChevronRight, Check, X } from 'lucide-react';

interface CompetitionControlsProps {
  currentIndex: number;
  totalCount: number;
  answer: boolean | null;
  isMaxAnswered: boolean;
  onPrevious: () => void;
  onNext: () => void;
  onToggleAnswer: (value: boolean) => void;
}

export function CompetitionControls({
  currentIndex,
  totalCount,
  answer,
  isMaxAnswered,
  onPrevious,
  onNext,
  onToggleAnswer,
}: CompetitionControlsProps) {
  return (
    <div className="flex flex-1 flex-wrap items-center gap-2">
      <Button
        onClick={onPrevious}
        disabled={currentIndex === 0}
        className="flex h-9 min-w-[44px] items-center justify-center rounded-lg border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-600 shadow-sm transition-colors hover:border-blue-400 hover:bg-blue-50 hover:text-blue-600 disabled:border-slate-100 disabled:bg-slate-100 disabled:text-slate-400"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      <div className="flex gap-1 rounded-lg border border-slate-200 bg-white p-1 shadow-sm">
        <Toggle
          pressed={answer === false}
          onPressedChange={(pressed) => {
            if (pressed) onToggleAnswer(false);
          }}
          disabled={isMaxAnswered}
          className="h-7 min-w-[40px] text-xs data-[state=on]:bg-rose-500 data-[state=on]:text-white"
          title="தவறு"
        >
          <X className="h-4 w-4" />
        </Toggle>

        <Toggle
          pressed={answer === true}
          onPressedChange={(pressed) => {
            if (pressed) onToggleAnswer(true);
          }}
          disabled={isMaxAnswered}
          className="h-7 min-w-[40px] text-xs data-[state=on]:bg-emerald-500 data-[state=on]:text-white"
          title="சரி"
        >
          <Check className="h-4 w-4" />
        </Toggle>
      </div>

      <Button
        onClick={onNext}
        disabled={currentIndex >= totalCount - 1}
        className="flex h-9 min-w-[44px] items-center justify-center rounded-lg border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-600 shadow-sm transition-colors hover:border-blue-400 hover:bg-blue-50 hover:text-blue-600 disabled:border-slate-100 disabled:bg-slate-100 disabled:text-slate-400"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>

      <div className="flex items-center text-[11px] font-semibold text-slate-500">
        {currentIndex + 1} / {totalCount}
      </div>
    </div>
  );
}
