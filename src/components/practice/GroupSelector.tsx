import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Group, GroupDisplay } from '@/types';
import type { Group as GroupType } from '@/types';

export interface GroupSelectorProps {
  selectedGroup: GroupType;
  groupCounts: Record<GroupType, number>;
  onGroupChange: (group: GroupType) => void;
}

export function GroupSelector({ selectedGroup, groupCounts, onGroupChange }: GroupSelectorProps) {
  // Only show Group II and III (not Group I)
  const groups: GroupType[] = [Group.II, Group.III];

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <label className="text-sm font-medium text-gray-700 whitespace-nowrap">குழு:</label>
      <ToggleGroup
        type="single"
        value={selectedGroup}
        onValueChange={(value) => {
          if (value) onGroupChange(value as GroupType);
        }}
        className="border border-gray-300 rounded-md p-1 flex gap-1"
      >
        {groups.map((group) => {
          const display = GroupDisplay[group];
          return (
            <ToggleGroupItem
              key={group}
              value={group}
              aria-label={`${display.tamil} (${display.english})`}
              className="px-3 py-1.5 text-sm font-medium data-[state=on]:bg-blue-600 data-[state=on]:text-white"
            >
              {display.tamil}
              <span className="ml-1 text-xs opacity-80">
                ({groupCounts[group]})
              </span>
            </ToggleGroupItem>
          );
        })}
      </ToggleGroup>
    </div>
  );
}
