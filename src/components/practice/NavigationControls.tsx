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
  return (
    <div className="flex gap-2">
      <Button
        variant="outline"
        size="icon"
        onClick={onPrevious}
        disabled={!isLive}
        className="w-10 h-10"
      >
        <ChevronLeft className="h-5 w-5" />
      </Button>
      <Button
        variant="destructive"
        onClick={onShowAnswer}
        disabled={!isLive}
        className="min-w-[100px]"
      >
        பதில்
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={onNext}
        disabled={!isLive}
        className="w-10 h-10"
      >
        <ChevronRight className="h-5 w-5" />
      </Button>
    </div>
  );
}
