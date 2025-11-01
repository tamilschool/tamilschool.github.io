import type { Thirukkural, Topic, KuralMeaning } from '@/types';
import { TopicDisplay } from '@/types';
import { KuralDisplay } from './KuralDisplay';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent } from '@/components/ui/card';

/**
 * Question view component that displays questions based on topic type
 * Reusable across practice and competition modes
 */
export interface QuestionViewProps {
  topic: Topic;
  selectedMeanings: Set<KuralMeaning>;
  showAnswer: boolean;
  onToggleAnswer: () => void;
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
  onToggleAnswer,
  currentQuestion,
}: QuestionViewProps) {
  if (!currentQuestion) {
    return (
      <Card className="mt-2">
        <CardContent className="p-4">
          <p className="text-muted-foreground">No question data available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-2">
      {/* Question Header */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">{TopicDisplay[topic]}</h3>
            <Button variant="outline" size="sm" onClick={onToggleAnswer}>
              {showAnswer ? 'பதிலை மறை' : 'பதிலைக் காட்டு'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Question Text */}
          {currentQuestion.athikaram && (
            <div className="text-xl font-semibold text-center py-4">
              {currentQuestion.athikaram}
            </div>
          )}
          {currentQuestion.word && (
            <div className="text-2xl font-bold text-center py-6">
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
        </CardContent>
      </Card>

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
