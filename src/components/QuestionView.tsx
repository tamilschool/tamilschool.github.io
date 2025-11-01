import type { Thirukkural, Topic, KuralMeaning } from '@/types';
import { TopicDisplay } from '@/types';
import { KuralDisplay } from './KuralDisplay';

/**
 * Question view component that displays questions based on topic type
 * Reusable across practice and competition modes
 */
export interface QuestionViewProps {
  topic: Topic;
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
      <div className="mt-2 border rounded p-4">
        <p className="text-muted-foreground">No question data available</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {/* Question Header with Yellow Background */}
      <div className="mb-3">
        <div className="bg-yellow-500 text-center py-3 rounded-t">
          <h3 className="text-xl font-bold text-gray-900">{TopicDisplay[topic]}</h3>
        </div>
        <div className="bg-white p-0 rounded-b">
          {/* Question Text */}
          {currentQuestion.athikaram && (
            <div className="text-xl font-semibold text-center py-6 bg-white">
              {currentQuestion.athikaram}
            </div>
          )}
          {currentQuestion.word && (
            <div className="text-xl font-semibold text-center py-6 bg-white">
              {currentQuestion.word}
            </div>
          )}
          {currentQuestion.kural && !currentQuestion.athikaram && !currentQuestion.word && (
            <KuralDisplay
              thirukkural={currentQuestion.kural}
              selectedMeanings={selectedMeanings}
              variant="default"
            />
          )}
        </div>
      </div>

      {/* Answer Section */}
      {showAnswer && (
        <div className="space-y-2">
          {currentQuestion.answers && currentQuestion.answers.length > 0 ? (
            // Multiple kurals as answers (Athikaram, FirstWord, LastWord topics)
            currentQuestion.answers.map((kural) => (
              <KuralDisplay
                key={kural.kuralNo}
                thirukkural={kural}
                selectedMeanings={selectedMeanings}
                variant="success"
              />
            ))
          ) : currentQuestion.kural ? (
            // Single kural as answer (Kural, Porul topics)
            <KuralDisplay
              thirukkural={currentQuestion.kural}
              selectedMeanings={selectedMeanings}
              variant="success"
            />
          ) : null}
        </div>
      )}
    </div>
  );
}
