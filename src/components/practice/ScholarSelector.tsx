import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { KuralMeaning, KuralMeaningDisplay } from '@/types';
import type { KuralMeaning as KuralMeaningType } from '@/types';

export interface ScholarSelectorProps {
  selectedMeanings: Set<KuralMeaningType>;
  onMeaningToggle: (meaning: KuralMeaningType) => void;
}

export function ScholarSelector({ selectedMeanings, onMeaningToggle }: ScholarSelectorProps) {
  const meanings: KuralMeaningType[] = [
    KuralMeaning.MuVaradha,
    KuralMeaning.SalamanPapa,
    KuralMeaning.MuKarunanidhi,
  ];

  return (
    <div className="flex flex-wrap gap-4">
      {meanings.map((meaning) => (
        <div key={meaning} className="flex items-center space-x-2">
          <Checkbox
            id={meaning}
            checked={selectedMeanings.has(meaning)}
            onCheckedChange={() => onMeaningToggle(meaning)}
          />
          <Label
            htmlFor={meaning}
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
          >
            {KuralMeaningDisplay[meaning]}
          </Label>
        </div>
      ))}
    </div>
  );
}
