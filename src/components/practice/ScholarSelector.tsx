import { Toggle } from '@/components/ui/toggle';
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
    <div className="flex w-full flex-nowrap items-center justify-center gap-2 overflow-x-auto">
      {meanings.map((meaning) => {
        const isSelected = selectedMeanings.has(meaning);
        return (
          <Toggle
            key={meaning}
            pressed={isSelected}
            onPressedChange={() => onMeaningToggle(meaning)}
            variant="outline"
            size="lg"
            className="border px-4 text-sm text-gray-700 shadow-sm transition-colors data-[state=on]:border-blue-600 data-[state=on]:bg-blue-600 data-[state=on]:text-white"
          >
            {KuralMeaningDisplay[meaning]}
          </Toggle>
        );
      })}
    </div>
  );
}
