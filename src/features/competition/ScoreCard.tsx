import type { CQuestionState } from '@/types';
import { Topic, TopicDisplay } from '@/types';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface ScoreCardProps {
  questionState: CQuestionState;
}

export default function ScoreCard({ questionState }: ScoreCardProps) {
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
    <Card className="w-full max-w-2xl rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h3 className="mb-6 text-lg font-bold text-slate-800">மதிப்பெண் அட்டை</h3>

      <div className="space-y-6">
        {topics.map((topic) => {
          const score = getAnsweredCount(topic);
          const maxScore = 10;

          return (
            <div key={topic} className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium text-slate-700">{TopicDisplay[topic]}</div>
                <div className="text-sm font-bold text-slate-900">{score}/{maxScore}</div>
              </div>

              <div className="flex items-center gap-1">
                {Array.from({ length: maxScore }).map((_, index) => {
                  const isFilled = index < score;
                  return (
                    <div
                      key={index}
                      className={cn(
                        "h-3 flex-1 rounded-full transition-all duration-300",
                        isFilled ? "bg-green-500" : "bg-slate-100"
                      )}
                    />
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 border-t border-slate-100 pt-4">
        <div className="flex items-center justify-between">
          <span className="text-base font-bold text-slate-700">மொத்தம்</span>
          <span className="text-2xl font-bold text-blue-600">{totalAnswered}</span>
        </div>
      </div>
    </Card>
  );
}
