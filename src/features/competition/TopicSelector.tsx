import type { CQuestionState } from '@/types';
import { Topic, TopicDisplay } from '@/types';

interface TopicSelectorProps {
  questionState: CQuestionState;
  onSelectTopic: (topic: Topic) => void;
}

export default function TopicSelector({ questionState, onSelectTopic }: TopicSelectorProps) {
  const topics: Topic[] = [
    Topic.FirstWord,
    Topic.LastWord,
    Topic.Kural,
    Topic.Porul,
    Topic.Athikaram,
  ];

  const getAnsweredCount = (topic: Topic): number => {
    return questionState.scoreState.group23Score.round2[topic]?.size || 0;
  };

  const getTotalCount = (topic: Topic): number => {
    switch (topic) {
      case Topic.FirstWord:
        return questionState.firstWordState.targets.length;
      case Topic.LastWord:
        return questionState.lastWordState.targets.length;
      case Topic.Kural:
        return questionState.kuralState.targets.length;
      case Topic.Porul:
        return questionState.porulState.targets.length;
      case Topic.Athikaram:
        return questionState.athikaramState.targets.length;
      default:
        return 0;
    }
  };

  return (
    <div className="bg-white rounded-lg border p-4">
      <h3 className="text-base font-semibold mb-3 text-gray-700">பிரிவைத் தேர்ந்தெடுக்கவும்</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
        {topics.map((topic) => {
          const answered = getAnsweredCount(topic);
          const total = getTotalCount(topic);
          const isSelected = questionState.selectedTopic === topic;

          return (
            <button
              key={topic}
              onClick={() => onSelectTopic(topic)}
              className={`p-3 rounded border-2 transition-colors ${
                isSelected
                  ? 'border-blue-500 bg-blue-500 text-white'
                  : 'border-gray-300 bg-white text-gray-800 hover:border-blue-300 hover:bg-blue-50'
              }`}
            >
              <div className={`text-sm font-semibold mb-1`}>
                {TopicDisplay[topic]}
              </div>
              <div className={`text-xs ${isSelected ? 'text-blue-100' : 'text-gray-600'}`}>
                {answered}/{total}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
