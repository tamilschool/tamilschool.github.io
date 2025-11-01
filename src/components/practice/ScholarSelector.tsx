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
    <div className="flex w-full flex-nowrap items-center justify-center gap-2 overflow-x-auto pb-1">
      {meanings.map((meaning) => {
        const isSelected = selectedMeanings.has(meaning);
        return (
          <Toggle
            key={meaning}
            pressed={isSelected}
            onPressedChange={() => onMeaningToggle(meaning)}
            variant="outline"
            size="lg"
            className="border border-slate-200 bg-white px-5 text-sm text-slate-600 shadow-sm transition-colors hover:border-sky-400 hover:text-sky-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-200 data-[state=on]:border-sky-500 data-[state=on]:bg-sky-500 data-[state=on]:text-white data-[state=on]:shadow-md"
          >
            {KuralMeaningDisplay[meaning]}
          </Toggle>
        );
      })}
    </div>
  );
}
