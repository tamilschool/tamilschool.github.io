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
        className="flex w-full h-full items-center gap-2 rounded-xl border border-slate-200 bg-white p-1 shadow-sm"
      >
        {groups.map((group) => {
          const display = GroupDisplay[group];
          return (
            <ToggleGroupItem
              key={group}
              value={group}
              aria-label={`${display.tamil} (${display.english})`}
              className="flex-1 h-10 rounded-lg border border-transparent px-3 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-200 data-[state=on]:bg-sky-500 data-[state=on]:text-white data-[state=on]:shadow-sm"
            >
              {display.tamil}
            </ToggleGroupItem>
          );
        })}
      </ToggleGroup>
    </div>
  );
}
