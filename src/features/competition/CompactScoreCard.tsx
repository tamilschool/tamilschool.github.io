import type { CQuestionState } from '@/types';
import { Topic } from '@/types';

interface CompactScoreCardProps {
    questionState: CQuestionState;
}

export default function CompactScoreCard({ questionState }: CompactScoreCardProps) {
    const topics: Topic[] = [
        Topic.FirstWord,
        Topic.Athikaram,
        Topic.Kural,
        Topic.Porul,
        Topic.LastWord,
    ];

    // Abbreviated labels using first letter with colors - All Green as requested
    const topicConfig: Record<Topic, { label: string; colorClass: string }> = {
        [Topic.FirstWord]: { label: 'மு', colorClass: 'bg-green-100 text-green-700' },
        [Topic.Athikaram]: { label: 'அ', colorClass: 'bg-green-100 text-green-700' },
        [Topic.Kural]: { label: 'கு', colorClass: 'bg-green-100 text-green-700' },
        [Topic.Porul]: { label: 'பொ', colorClass: 'bg-green-100 text-green-700' },
        [Topic.LastWord]: { label: 'க', colorClass: 'bg-green-100 text-green-700' },
        [Topic.AllKurals]: { label: '', colorClass: '' }, // Not used in scorecard
    };

    const getAnsweredCount = (topic: Topic): number => {
        return questionState.scoreState.group23Score.round2[topic]?.size || 0;
    };

    const totalAnswered = topics.reduce((sum, topic) => sum + getAnsweredCount(topic), 0);

    return (
        <div className="flex items-center justify-center flex-wrap gap-1.5 rounded-lg border border-slate-200 bg-gradient-to-r from-slate-50 to-slate-100 px-2 py-1.5 shadow-sm">
            {topics.map((topic) => {
                const score = getAnsweredCount(topic);
                const config = topicConfig[topic];
                return (
                    <div
                        key={topic}
                        className={`flex items-center gap-1 rounded px-2 py-0.5 text-xs font-semibold shadow-sm ${config.colorClass}`}
                    >
                        <span>{config.label}:</span>
                        <span className="font-bold">{score}</span>
                    </div>
                );
            })}
            <div className="flex items-center gap-1 rounded bg-blue-600 px-2 py-0.5 text-xs font-bold text-white shadow-md">
                <span>மொ:</span>
                <span>{totalAnswered}</span>
            </div>
        </div>
    );
}
