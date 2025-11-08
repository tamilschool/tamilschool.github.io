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

  const totalAnswered = topics.reduce((sum, topic) => sum + getAnsweredCount(topic), 0);
  const dollarAmount = Math.floor(totalAnswered / 2);

  return (
    <Card className="rounded-xl border border-blue-100 bg-white p-4 shadow-sm">
      <h3 className="mb-3 text-sm font-bold text-slate-800">மதிப்பெண் அட்டை</h3>

      <div className="mb-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
        {topics.map((topic) => {
          const answered = getAnsweredCount(topic);
          const total = getTotalCount(topic);

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

        <div className="rounded-md border border-blue-200 bg-white p-3 text-center">
          <div className="text-xs font-medium text-blue-600">டாலர்</div>
          <div className="text-2xl font-bold text-blue-700">${dollarAmount}</div>
          <div className="text-[11px] text-blue-500">({totalAnswered} ÷ 2)</div>
        </div>
      </div>
    </Card>
  );
}
