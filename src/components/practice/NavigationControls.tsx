import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface NavigationControlsProps {
  isLive: boolean;
  onPrevious: () => void;
  onNext: () => void;
  onShowAnswer: () => void;
}

export function NavigationControls({
  isLive,
  onPrevious,
  onNext,
  onShowAnswer,
}: NavigationControlsProps) {
  const baseNavButton = "flex-1 h-10 rounded-lg border border-slate-200 bg-white text-slate-600 transition-colors hover:border-sky-400 hover:text-sky-600 focus-visible:ring-2 focus-visible:ring-offset-0 focus-visible:ring-sky-200 disabled:border-slate-100 disabled:bg-slate-100 disabled:text-slate-400";
  const answerActiveClasses = "border-transparent bg-amber-500 text-white shadow-[0_0_0_1px_rgba(251,191,36,0.28)] hover:bg-amber-600 focus-visible:ring-amber-200";
  return (
    <div className="flex gap-2 w-full h-10">
      <Button
        onClick={onPrevious}
        disabled={!isLive}
        className={baseNavButton}
      >
        <ChevronLeft className="h-5 w-5" />
      </Button>
      <Button
        onClick={onShowAnswer}
        disabled={!isLive}
        className={`${baseNavButton} ${isLive ? answerActiveClasses : ''} text-sm font-semibold`}
      >
        பதில்
      </Button>
      <Button
        onClick={onNext}
        disabled={!isLive}
        className={baseNavButton}
      >
        <ChevronRight className="h-5 w-5" />
      </Button>
    </div>
  );
}
