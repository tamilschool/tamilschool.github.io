import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="min-w-[160px] bg-blue-600 hover:bg-blue-700 text-white">
          {TopicDisplay[selectedTopic]}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {topics.map((topic) => (
          <DropdownMenuItem
            key={topic}
            onClick={() => onTopicChange(topic)}
            className="cursor-pointer"
          >
            {TopicDisplay[topic]}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
