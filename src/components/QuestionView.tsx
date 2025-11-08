import type { Thirukkural, Topic as TopicValue, KuralMeaning } from '@/types';
import { Topic, getMeaning, KuralMeaningDisplay } from '@/types';
import { KuralDisplay } from './KuralDisplay';

/**
 * Question view component that displays questions based on topic type
 * Reusable across practice and competition modes
 */
export interface QuestionViewProps {
  topic: TopicValue;
  selectedMeanings: Set<KuralMeaning>;
  showAnswer: boolean;
  // Topic-specific data
  currentQuestion?: {
    athikaram?: string;
    word?: string;
    kural?: Thirukkural;
    answers?: Thirukkural[]; // For topics that show multiple kurals as answers
  };
}

export function QuestionView({
  topic,
  selectedMeanings,
  showAnswer,
  currentQuestion,
}: QuestionViewProps) {
  if (!currentQuestion) {
    return (
      <div className="mx-auto max-w-3xl rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center">
        <p className="text-sm text-muted-foreground">No question data available</p>
      </div>
    );
  }

  const renderQuestionContent = () => {
    if (topic === Topic.Porul && currentQuestion.kural && selectedMeanings.size > 0) {
      return (
        <div className="space-y-4">
          {Array.from(selectedMeanings).map((meaning) => (
            <div key={meaning} className="space-y-2">
              <p className="text-lg font-semibold leading-relaxed text-amber-900">
                {getMeaning(currentQuestion.kural!, meaning)}
              </p>
              <p className="text-xs font-medium uppercase tracking-wide text-amber-700">
                உரை : {KuralMeaningDisplay[meaning]}
              </p>
            </div>
          ))}
        </div>
      );
    }

    if (currentQuestion.athikaram) {
      return (
        <p className="text-2xl font-bold leading-tight text-amber-900">
          {currentQuestion.athikaram}
        </p>
      );
    }

    if (currentQuestion.word) {
      return (
        <p className="text-2xl font-bold leading-tight text-amber-900">
          {currentQuestion.word}
        </p>
      );
    }

    if (currentQuestion.kural) {
      return (
        <div className="space-y-3">
          <p className="text-xl font-semibold leading-relaxed text-amber-900">
            {currentQuestion.kural.kural.firstLine}
          </p>
          <p className="text-xl font-semibold leading-relaxed text-amber-900">
            {currentQuestion.kural.kural.secondLine}
          </p>
        </div>
      );
    }

    return <p className="text-base font-medium text-amber-900">No question content available</p>;
  };

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col space-y-4">
      <div className="rounded-xl border border-amber-200 bg-amber-50 px-6 py-6 text-center shadow-sm">
        {renderQuestionContent()}
      </div>

      {showAnswer && (
        <div className="flex flex-col space-y-4 max-h-[60vh] overflow-y-auto pb-1">
          {currentQuestion.answers?.length ? (
            currentQuestion.answers.map((kural) => (
              <KuralDisplay
                key={kural.kuralNo}
                thirukkural={kural}
                selectedMeanings={selectedMeanings}
                variant="default"
              />
            ))
          ) : currentQuestion.kural ? (
            <KuralDisplay
              thirukkural={currentQuestion.kural}
              selectedMeanings={selectedMeanings}
              variant="default"
            />
          ) : null}
        </div>
      )}
    </div>
  );
}
