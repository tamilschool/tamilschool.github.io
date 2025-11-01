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
  const isGreenCard = variant === 'success';
  
  const variantClasses = {
    default: 'border-gray-200',
    success: 'bg-green-600 text-white border-green-700',
    secondary: 'bg-gray-500 text-white border-gray-600',
  };

  return (
    <Card className={`mt-2 ${variantClasses[variant]}`}>
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <div className={`font-semibold text-lg ${isGreenCard ? 'text-white' : ''}`}>
          {thirukkural.athikaram}
        </div>
        <div className={`text-sm flex flex-col text-right ${isGreenCard ? 'text-gray-100' : 'text-muted-foreground'}`}>
          <small>அதிகாரம் : {thirukkural.athikaramNo}</small>
          <small>குறள் : {thirukkural.kuralNo}</small>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-2">
        <p className={`text-xl leading-relaxed ${isGreenCard ? 'text-white' : ''}`}>
          {thirukkural.kural.firstLine}
        </p>
        <p className={`text-xl leading-relaxed ${isGreenCard ? 'text-white' : ''}`}>
          {thirukkural.kural.secondLine}
        </p>
      </CardContent>

      {selectedMeanings.size > 0 && (
        <CardFooter className="flex flex-col items-start gap-4">
          {Array.from(selectedMeanings).map((meaning) => (
            <div key={meaning} className="w-full">
              <p className={`text-base leading-relaxed mb-2 ${isGreenCard ? 'text-white' : ''}`}>
                {getMeaning(thirukkural, meaning)}
              </p>
              <div className={`text-sm text-right ${isGreenCard ? 'text-gray-200' : 'text-muted-foreground'}`}>
                <small>உரை : {KuralMeaningDisplay[meaning]}</small>
              </div>
            </div>
          ))}
        </CardFooter>
      )}
    </Card>
  );
}
