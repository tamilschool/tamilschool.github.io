import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Check, X, Eye, EyeOff } from 'lucide-react';

interface CompetitionControlsProps {
  currentIndex: number;
  totalCount: number;
  showAnswer: boolean;
  answeredCount: number;
  isAnswered: boolean;
  isMaxAnswered: boolean;
  onPrevious: () => void;
  onNext: () => void;
  onToggleAnswer: () => void;
  onMarkCorrect: () => void;
  onMarkWrong: () => void;
}

export function CompetitionControls({
  currentIndex,
  totalCount,
  showAnswer,
  answeredCount,
  isAnswered,
  isMaxAnswered,
  onPrevious,
  onNext,
  onToggleAnswer,
  onMarkCorrect,
  onMarkWrong,
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

      {/* <Button
        onClick={onToggleAnswer}
        className={`flex h-9 min-w-[88px] items-center justify-center gap-1 rounded-lg border px-3 text-xs font-semibold transition-colors ${
          showAnswer
            ? 'border-amber-500 bg-amber-500 text-white hover:bg-amber-600'
            : 'border-slate-200 bg-white text-slate-600 shadow-sm hover:border-blue-400 hover:bg-blue-50 hover:text-blue-600'
        }`}
      >
        {showAnswer ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        {showAnswer ? 'பதில் மறை' : 'பதில்'}
      </Button> */}

      <Button
        onClick={onMarkCorrect}
        disabled={isAnswered || isMaxAnswered}
        className={`flex h-9 min-w-[88px] items-center justify-center gap-1 rounded-lg border px-3 text-xs font-semibold transition-colors ${
          isAnswered
            ? 'border-emerald-500 bg-emerald-500 text-white'
            : isMaxAnswered
            ? 'border-slate-200 bg-slate-100 text-slate-400'
            : 'border-emerald-500 bg-white text-emerald-600 hover:bg-emerald-50'
        } disabled:cursor-not-allowed`}
      >
        <Check className="h-4 w-4" />
        சரி
      </Button>

      <Button
        onClick={onMarkWrong}
        disabled={!isAnswered}
        className={`flex h-9 min-w-[88px] items-center justify-center gap-1 rounded-lg border px-3 text-xs font-semibold transition-colors ${
          isAnswered
            ? 'border-rose-500 bg-white text-rose-600 hover:bg-rose-50'
            : 'border-slate-200 bg-slate-100 text-slate-400'
        } disabled:cursor-not-allowed`}
      >
        <X className="h-4 w-4" />
        தவறு
      </Button>

      <Button
        onClick={onNext}
        disabled={currentIndex >= totalCount - 1}
        className="flex h-9 min-w-[44px] items-center justify-center rounded-lg border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-600 shadow-sm transition-colors hover:border-blue-400 hover:bg-blue-50 hover:text-blue-600 disabled:border-slate-100 disabled:bg-slate-100 disabled:text-slate-400"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>

      <div className="flex flex-col items-start justify-center text-[11px] font-semibold text-slate-500">
        <span>
          {currentIndex + 1} / {totalCount}
        </span>
        <span>விடைகள்: {answeredCount}</span>
      </div>
    </div>
  );
}
