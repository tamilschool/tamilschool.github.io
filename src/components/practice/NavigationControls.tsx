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
        className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white rounded flex items-center justify-center"
      >
        <ChevronLeft className="h-5 w-5" />
      </Button>
      <Button
        onClick={onShowAnswer}
        disabled={!isLive}
        className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-gray-300 text-white text-sm font-semibold rounded flex items-center justify-center"
      >
        பதில்
      </Button>
      <Button
        onClick={onNext}
        disabled={!isLive}
        className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white rounded flex items-center justify-center"
      >
        <ChevronRight className="h-5 w-5" />
      </Button>
    </div>
  );
}
