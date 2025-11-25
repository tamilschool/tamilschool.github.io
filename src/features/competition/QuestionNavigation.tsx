import { useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';

interface QuestionNavigationProps {
  topicLabel: string;
  totalCount: number;
  currentIndex: number;
  onNavigate: (index: number) => void;
  isAnswered: (index: number) => boolean;
  disabled?: boolean;
  /** Compact mode: hides header row and scrollbar, just shows number buttons */
  compact?: boolean;
}

export default function QuestionNavigation({
  topicLabel,
  totalCount,
  currentIndex,
  onNavigate,
  isAnswered,
  disabled = false,
  compact = false,
}: QuestionNavigationProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const currentButtonRef = useRef<HTMLButtonElement>(null);

  // Scroll current button into view when it changes
  useEffect(() => {
    if (currentButtonRef.current && scrollContainerRef.current) {
      currentButtonRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center',
      });
    }
  }, [currentIndex]);

  if (totalCount === 0) {
    return null;
  }

  return (
    <Card className={`bg-white shadow-sm border border-slate-200 ${compact ? 'p-2' : 'p-3'}`}>
      {!compact && (
        <div className="mb-2 flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-600">{topicLabel}</span>
          <span className="text-xs font-medium text-slate-500">
            {currentIndex + 1} / {totalCount}
          </span>
        </div>
      )}

      <div 
        ref={scrollContainerRef} 
        className={`flex gap-1.5 overflow-x-auto md:grid md:grid-cols-15 md:overflow-visible ${compact ? 'scrollbar-none' : 'pb-1 md:pb-0 scrollbar-hide'}`}
      >
        {Array.from({ length: totalCount }, (_, index) => {
          const isCurrent = currentIndex === index;
          const answered = isAnswered(index);

          // compute base button classes depending on state
          let stateClass = '';
          if (isCurrent) {
            stateClass = 'bg-blue-500 text-white shadow-sm';
          } else if (answered) {
            // include hover only when not disabled
            stateClass = disabled ? 'bg-emerald-500 text-white' : 'bg-emerald-500 text-white hover:bg-emerald-600';
          } else {
            stateClass = disabled
              ? 'bg-white text-slate-700 border border-slate-200'
              : 'bg-white text-slate-700 border border-slate-200 hover:border-blue-400 hover:bg-blue-50';
          }

          const disabledClass = disabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : '';
          // Added min-w-[2rem] (w-8) to prevent shrinking in flex mode
          const btnClass = `flex h-7 w-8 shrink-0 items-center justify-center rounded text-xs font-semibold transition-colors ${stateClass} ${disabledClass}`;

          return (
            <button
              ref={isCurrent ? currentButtonRef : null}
              key={index}
              onClick={() => !disabled && onNavigate(index)}
              disabled={disabled}
              className={btnClass}
            >
              {index + 1}
            </button>
          );
        })}
      </div>
    </Card>
  );
}
