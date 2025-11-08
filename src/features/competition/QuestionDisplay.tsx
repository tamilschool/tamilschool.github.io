import { useState } from 'react';
import type { CQuestionState } from '@/types';
import { Topic, MAX_ANSWERS } from '@/types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface QuestionDisplayProps {
  questionState: CQuestionState;
  onToggleAnswer: (question: string) => void;
}

export default function QuestionDisplay({ questionState, onToggleAnswer }: QuestionDisplayProps) {
  const [showAnswer, setShowAnswer] = useState(false);
  const topic = questionState.selectedTopic;

  // Get current question text
  const getCurrentQuestion = (): string => {
    switch (topic) {
      case Topic.FirstWord:
        return questionState.firstWordState.targets[questionState.firstWordState.index];
      case Topic.LastWord:
        return questionState.lastWordState.targets[questionState.lastWordState.index];
      case Topic.Kural: {
        const kural = questionState.kuralState.targets[questionState.kuralState.index];
        return `${kural.kural.firstLine}\n${kural.kural.secondLine}`;
      }
      case Topic.Porul: {
        const kural = questionState.porulState.targets[questionState.porulState.index];
        return kural.porul;
      }
      case Topic.Athikaram:
        return questionState.athikaramState.targets[questionState.athikaramState.index];
      default:
        return '';
    }
  };

  const question = getCurrentQuestion();
  const answeredCount = questionState.scoreState.group23Score.round2[topic]?.size || 0;
  const isAnswerSelected = questionState.scoreState.group23Score.round2[topic]?.has(question) || false;
  const isMaxAnswered = !isAnswerSelected && answeredCount >= MAX_ANSWERS;

  return (
    <Card className="bg-amber-50 border-amber-200 p-3">
      {/* Question Display */}
      <div className="text-center py-3">
        <div className="text-lg font-bold text-gray-900 whitespace-pre-line mb-2">
          {question}
        </div>
      </div>

      {/* Show Answer content if toggled */}
      {showAnswer && (
        <div className="mb-2 p-2 bg-white rounded border">
          <div className="text-xs text-gray-700">
            <div className="font-semibold mb-1">விருந்தோம்பல்</div>
            <p className="mb-1 text-xs">{question}</p>
            <p className="text-xs text-gray-600 italic">உரை : சாலமன் பாப்பையா</p>
          </div>
        </div>
      )}

      {/* Buttons */}
      <div className="flex justify-center gap-2 mb-2">
        <Button
          onClick={() => setShowAnswer(!showAnswer)}
          className="px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600 h-8"
        >
          {showAnswer ? 'மறை' : 'காட்டு'}
        </Button>

        <Button
          onClick={() => onToggleAnswer(question)}
          disabled={isMaxAnswered}
          className={`px-3 py-1 text-xs rounded font-medium h-8 ${
            isAnswerSelected
              ? 'bg-green-600 text-white hover:bg-green-700'
              : isMaxAnswered
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-green-500 text-white hover:bg-green-600'
          }`}
        >
          {isAnswerSelected ? '✓ சரி' : 'சரி'}
        </Button>
      </div>

      {/* Status Messages */}
      <div className="text-center text-xs text-gray-500">
        விடைகள்: {answeredCount} / {MAX_ANSWERS}
        {isMaxAnswered && <div className="text-red-600 font-medium">அதிகபட்சம் சேர்க்கப்பட்டுவிட்டன</div>}
      </div>
    </Card>
  );
}
