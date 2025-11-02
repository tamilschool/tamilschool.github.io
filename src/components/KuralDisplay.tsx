import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { cn } from '@/lib/utils';
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
  /** Optional index to show (only used in AllKurals list) */
  index?: number;
}

export function KuralDisplay({
  thirukkural,
  selectedMeanings,
  variant = 'default',
  index,
}: KuralDisplayProps) {
  const variantStyles = {
    default: {
      container: 'border border-border bg-card text-card-foreground shadow-sm',
      headerBorder: 'border-border/60',
      heading: 'text-card-foreground',
      meta: 'text-muted-foreground',
      body: 'text-card-foreground',
      meaning: 'text-card-foreground',
      credit: 'text-muted-foreground',
    },
    success: {
      container: 'border border-emerald-500/60 bg-emerald-600 text-emerald-50 shadow-md',
      headerBorder: 'border-emerald-500',
      heading: 'text-emerald-50',
      meta: 'text-emerald-100',
      body: 'text-emerald-50',
      meaning: 'text-emerald-50',
      credit: 'text-emerald-200',
    },
    secondary: {
      container: 'border border-slate-600 bg-slate-700 text-slate-50 shadow-md',
      headerBorder: 'border-slate-500',
      heading: 'text-slate-50',
      meta: 'text-slate-200',
      body: 'text-slate-50',
      meaning: 'text-slate-50',
      credit: 'text-slate-200',
    },
  } as const;

  const styles = variantStyles[variant];

  return (
    <Card className={cn('mb-3 rounded-xl', styles.container)}>
      <CardHeader
        className={cn(
          'flex flex-row items-center justify-between space-y-0 px-4 py-3 border-b',
          styles.headerBorder,
        )}
      >
        <div className="flex items-center gap-3">
          {typeof index === 'number' && (
            <div className="flex-shrink-0 inline-flex items-center justify-center h-8 w-8 rounded-md bg-slate-100 text-xs font-semibold text-slate-600">
              {index}
            </div>
          )}
          <div className={cn('leading-snug', styles.heading)}>
            {thirukkural.athikaram}
          </div>
        </div>
        <div className={cn('text-xs flex flex-col text-right gap-1 font-medium', styles.meta)}>
          <span>அதிகாரம் : {thirukkural.athikaramNo}</span>
          <span>குறள் : {thirukkural.kuralNo}</span>
        </div>
      </CardHeader>

      <CardContent
        className={cn(
          'px-4 py-4 space-y-2 font-semibold leading-relaxed',
          styles.body,
        )}
      >
        <p>{thirukkural.kural.firstLine}</p>
        <p>{thirukkural.kural.secondLine}</p>
      </CardContent>

      {selectedMeanings.size > 0 && (
        <CardFooter
          className={cn('flex flex-col gap-4 px-4 py-3 border-t', styles.headerBorder)}
        >
          {Array.from(selectedMeanings).map((meaning, index) => (
            <div
              key={meaning}
              className={cn(
                'space-y-2',
                index > 0 && 'pt-3 border-t',
                index > 0 && styles.headerBorder,
              )}
            >
              <p className={cn('leading-relaxed', styles.meaning)}>
                {getMeaning(thirukkural, meaning)}
              </p>
              <div
                className={cn(
                  'text-xs italic uppercase tracking-wide text-right',
                  styles.credit,
                )}
              >
                உரை : {KuralMeaningDisplay[meaning]}
              </div>
            </div>
          ))}
        </CardFooter>
      )}
    </Card>
  );
}
