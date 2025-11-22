import type { CQuestionState } from '@/types';
import { Topic, TopicDisplay } from '@/types';
import { Card } from '@/components/ui/card';

interface Round2ScoreCardProps {
  questionState: CQuestionState;
}

export default function Round2ScoreCard({ questionState }: Round2ScoreCardProps) {
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

  const totalAnswered = topics.reduce((sum, topic) => sum + getAnsweredCount(topic), 0);

  return (
    <Card className="rounded-xl border border-blue-100 bg-white p-4 shadow-sm">
      <h3 className="mb-3 text-sm font-bold text-slate-800">மதிப்பெண் அட்டை</h3>

      <div className="mb-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
        {topics.map((topic) => {
          const answered = getAnsweredCount(topic);
          const total = 10;

          return (
            <div
              key={topic}
              className="rounded-lg border border-blue-100 bg-blue-50 px-2 py-2 text-center"
            >
              <div className="text-xs font-semibold text-slate-700">{TopicDisplay[topic]}</div>
              <div className="text-sm font-semibold text-blue-600">
                {answered}/{total}
              </div>
            </div>
          );
        })}
      </div>

      <div className="rounded-lg border border-blue-100 bg-blue-50 p-3">
        <div className="mb-2 flex items-center justify-between text-xs font-semibold text-slate-600">
          <span>மொத்தம்</span>
          <span className="text-sm font-bold text-blue-700">{totalAnswered}</span>
        </div>
      </div>
    </Card>
  );
}
