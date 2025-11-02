import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
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
    Topic.FirstWord,
    Topic.Athikaram,
    Topic.Kural,
    Topic.Porul,
    Topic.LastWord,
  ];

  return (
    <div className="flex w-full h-full ">
      <Select value={selectedTopic} onValueChange={onTopicChange}>
        <SelectTrigger className="h-full w-full border border-slate-200 bg-white px-2 pr-1 rounded-lg text-sm text-slate-700 shadow-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-200">
          <SelectValue placeholder="Topic" className="flex items-center" />
        </SelectTrigger>
        <SelectContent>
          {topics.map((topic) => (
            <SelectItem key={topic} value={topic}>
              {TopicDisplay[topic]}
            </SelectItem>
          ))}
          <SelectGroup>
             <SelectLabel>---------------------------</SelectLabel>
            <SelectItem value={Topic.AllKurals}>
              {TopicDisplay[Topic.AllKurals]}
            </SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
