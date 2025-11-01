import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import type { Thirukkural, KuralMeaning } from '@/types';
import { KuralMeaningDisplay, getMeaning } from '@/types';

/**
 * Displays a Thirukkural (couplet) with athikaram and selected scholar meanings
 * Reference: old/.../components/KuralDisplay.kt
 */
export interface KuralDisplayProps {
  thirukkural: Thirukkural;
  selectedMeanings: Set<KuralMeaning>;
  variant?: 'default' | 'success' | 'secondary';
}

export function KuralDisplay({
  thirukkural,
  selectedMeanings,
  variant = 'success',
}: KuralDisplayProps) {
  const variantClasses = {
    default: '',
    success: 'bg-green-600 text-white',
    secondary: 'bg-slate-600 text-white',
  };

  return (
    <Card className={`mt-2 ${variantClasses[variant]}`}>
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <div className="font-semibold">{thirukkural.athikaram}</div>
        <div className="text-sm italic text-right flex flex-col">
          <small>அதிகாரம் : {thirukkural.athikaramNo}</small>
          <small>குறள் : {thirukkural.kuralNo}</small>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-2">
        <p className="text-lg">{thirukkural.kural.firstLine}</p>
        <p className="text-lg">{thirukkural.kural.secondLine}</p>
      </CardContent>

      {selectedMeanings.size > 0 && (
        <CardFooter className="flex flex-col items-start gap-4">
          {Array.from(selectedMeanings).map((meaning) => (
            <div key={meaning} className="w-full">
              <p className="text-sm mb-1">{getMeaning(thirukkural, meaning)}</p>
              <div className="text-xs italic text-right opacity-80">
                <small>உரை : {KuralMeaningDisplay[meaning]}</small>
              </div>
            </div>
          ))}
        </CardFooter>
      )}
    </Card>
  );
}
