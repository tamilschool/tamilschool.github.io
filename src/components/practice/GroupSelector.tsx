import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Group, GroupDisplay } from '@/types';
import type { Group as GroupType } from '@/types';

export interface GroupSelectorProps {
  selectedGroup: GroupType;
  groupCounts: Record<GroupType, number>;
  onGroupChange: (group: GroupType) => void;
}

export function GroupSelector({ selectedGroup, onGroupChange }: GroupSelectorProps) {
  // Only show Group II and III (not Group I)
  const groups: GroupType[] = [Group.II, Group.III];

  return (
    <div className="flex w-full h-full">
      <ToggleGroup
        type="single"
        value={selectedGroup}
        onValueChange={(value) => {
          if (value) onGroupChange(value as GroupType);
        }}
        className="border border-gray-300 rounded-md p-1 flex items-center gap-1 w-full h-full"
      >
        {groups.map((group) => {
          const display = GroupDisplay[group];
          return (
            <ToggleGroupItem
              key={group}
              value={group}
              aria-label={`${display.tamil} (${display.english})`}
              className="flex-1 h-full px-3 text-sm font-medium flex items-center justify-center data-[state=on]:bg-blue-600 data-[state=on]:text-white"
            >
              {display.tamil}
            </ToggleGroupItem>
          );
        })}
      </ToggleGroup>
    </div>
  );
}
