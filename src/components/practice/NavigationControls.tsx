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
    <div className="flex gap-2 w-full">
      <Button
        onClick={onPrevious}
        disabled={!isLive}
        className="flex-1 h-12 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white rounded"
      >
        <ChevronLeft className="h-5 w-5" />
      </Button>
      <Button
        onClick={onShowAnswer}
        disabled={!isLive}
        className="flex-1 h-12 bg-red-600 hover:bg-red-700 disabled:bg-gray-300 text-white text-base font-semibold rounded"
      >
        பதில்
      </Button>
      <Button
        onClick={onNext}
        disabled={!isLive}
        className="flex-1 h-12 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white rounded"
      >
        <ChevronRight className="h-5 w-5" />
      </Button>
    </div>
  );
}
