import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Topic, TopicDisplay } from '@/types';
import type { Topic as TopicType } from '@/types';

export interface TopicSelectorProps {
  selectedTopic: TopicType;
  onTopicChange: (topic: TopicType) => void;
}

export function TopicSelector({ selectedTopic, onTopicChange }: TopicSelectorProps) {
  const topics: TopicType[] = [
    Topic.Athikaram,
    Topic.Porul,
    Topic.Kural,
    Topic.FirstWord,
    Topic.LastWord,
    Topic.AllKurals,
  ];

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <label className="text-sm font-medium text-gray-700 whitespace-nowrap">பொருள்:</label>
      <Select value={selectedTopic} onValueChange={onTopicChange}>
        <SelectTrigger className="w-auto min-w-[140px] bg-white border-gray-300 border">
          <SelectValue placeholder="பொருள் தேர்ந்து" />
        </SelectTrigger>
        <SelectContent>
          {topics.map((topic) => (
            <SelectItem key={topic} value={topic}>
              {TopicDisplay[topic]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
