import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Group, GroupDisplay } from '@/types';
import type { Group as GroupType } from '@/types';

export interface GroupSelectorProps {
  selectedGroup: GroupType;
  groupCounts: Record<GroupType, number>;
  onGroupChange: (group: GroupType) => void;
}

export function GroupSelector({ selectedGroup, groupCounts, onGroupChange }: GroupSelectorProps) {
  const groups: GroupType[] = [Group.I, Group.II, Group.III];
  const currentDisplay = GroupDisplay[selectedGroup];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="default" className="min-w-[140px]">
          {currentDisplay.tamil} ({currentDisplay.english})
          <span className="ml-2 badge bg-white text-blue-600 px-2 py-0.5 rounded text-xs">
            {groupCounts[selectedGroup]}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {groups.map((group) => {
          const display = GroupDisplay[group];
          return (
            <DropdownMenuItem
              key={group}
              onClick={() => onGroupChange(group)}
              className="cursor-pointer"
            >
              {display.tamil} ({display.english})
              <span className="ml-2 text-muted-foreground">
                {groupCounts[group]} குறள்கள்
              </span>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
