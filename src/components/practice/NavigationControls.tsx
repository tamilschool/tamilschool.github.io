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
        onClick={onPrevious}
        disabled={!isLive}
        className="w-12 h-12 p-0 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white"
      >
        <ChevronLeft className="h-6 w-6" />
      </Button>
      <Button
        onClick={onShowAnswer}
        disabled={!isLive}
        className="min-w-[100px] h-12 bg-red-600 hover:bg-red-700 disabled:bg-gray-300 text-white text-lg"
      >
        பதில்
      </Button>
      <Button
        onClick={onNext}
        disabled={!isLive}
        className="w-12 h-12 p-0 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white"
      >
        <ChevronRight className="h-6 w-6" />
      </Button>
    </div>
  );
}
