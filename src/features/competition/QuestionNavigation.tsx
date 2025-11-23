import { Card } from '@/components/ui/card';

interface QuestionNavigationProps {
  topicLabel: string;
  totalCount: number;
  currentIndex: number;
  onNavigate: (index: number) => void;
  isAnswered: (index: number) => boolean;
  disabled?: boolean;
}

export default function QuestionNavigation({
  topicLabel,
  totalCount,
  currentIndex,
  onNavigate,
  isAnswered,
  disabled = false,
}: QuestionNavigationProps) {
  if (totalCount === 0) {
    return null;
  }

  return (
    <Card className="bg-white p-3 shadow-sm border border-slate-200">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-600">{topicLabel}</span>
        <span className="text-xs font-medium text-slate-500">
          {currentIndex + 1} / {totalCount}
        </span>
      </div>

      <div className="grid grid-cols-5 gap-1.5 sm:grid-cols-7 md:grid-cols-10">
        {Array.from({ length: totalCount }, (_, index) => (
          <button
            key={index}
            onClick={() => !disabled && onNavigate(index)}
            disabled={disabled}
            className={`flex h-7 items-center justify-center rounded text-xs font-semibold transition-colors ${currentIndex === index
                ? 'bg-blue-500 text-white shadow-sm'
                : isAnswered(index)
                  ? 'bg-emerald-500 text-white hover:bg-emerald-600'
                  : 'bg-white text-slate-700 border border-slate-200 hover:border-blue-400 hover:bg-blue-50'
              } ${disabled ? 'opacity-50 cursor-not-allowed hover:border-slate-200 hover:bg-white' : ''}`}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </Card>
  );
}
