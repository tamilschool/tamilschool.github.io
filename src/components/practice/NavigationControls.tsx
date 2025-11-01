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
    <div className="flex gap-2 w-full h-10">
      <Button
        onClick={onPrevious}
        disabled={!isLive}
        className="flex-1 h-10 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white rounded-md flex items-center justify-center px-3"
      >
        <ChevronLeft className="h-5 w-5" />
      </Button>
      <Button
        onClick={onShowAnswer}
        disabled={!isLive}
        className="flex-1 h-10 bg-red-600 hover:bg-red-700 disabled:bg-gray-300 text-white text-sm font-semibold rounded-md flex items-center justify-center px-3"
      >
        பதில்
      </Button>
      <Button
        onClick={onNext}
        disabled={!isLive}
        className="flex-1 h-10 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white rounded-md flex items-center justify-center px-3"
      >
        <ChevronRight className="h-5 w-5" />
      </Button>
    </div>
  );
}
