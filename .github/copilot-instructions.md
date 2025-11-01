# Thirukkural Practice & Competition App - AI Coding Agent Guide

> **Critical Reference**: The Kotlin/JS app in `old/tamilschool.github.io/` is the source of truth. Always verify your implementation against the legacy code to ensure identical user experience and behavior. When in doubt, check the old code.

## Documentation Structure

This file provides **coding conventions and patterns** for AI agents. Refer to these companion documents:

- **`PRD.md`**: Product requirements, features, business logic (WHAT to build)
- **`ARCHITECTURE.md`**: Technical design, data flow, algorithms (HOW to build)
- **`TASKS.md`**: Step-by-step implementation checklist (TODO)

## Project Goal
**Primary Objective**: Build a 100% replica of the existing Kotlin/JS app using modern React + TypeScript. This is a greenfield rewrite, NOT maintenance of the Kotlin codebase. User experience must be identical or better—no features missing, no behavioral differences.

### Tech Stack (New Implementation)
- **Framework**: React 18+ with TypeScript
- **UI Library**: shadcn/ui components (Tailwind CSS based)
- **Build Tool**: Vite (for fast development and optimized production builds)
- **Deployment**: GitHub Pages (static site)
- **State Management**: React hooks (useState, useReducer) - no Redux needed
- **Data Fetching**: Native fetch API with async/await

## Code Conventions & Patterns

> See `ARCHITECTURE.md` for detailed technical design and `PRD.md` for feature specifications.

### TypeScript Conventions
- Use **strict mode** (`strict: true` in tsconfig.json)
- Prefer **interfaces** over types for object shapes
- Use **enums** for Group, Topic, Round (matches Kotlin enums)
- Export types from `/src/types/index.ts` for centralized access

### Component Conventions
- **Functional components** with TypeScript
- Props interfaces named `<ComponentName>Props`
- Use **shadcn/ui** components as base (Button, Card, Select, etc.)
- Tailwind classes for styling—avoid inline styles
- Keep components small and focused (single responsibility)

### State Management
- Use `useState` for simple state, `useReducer` for complex state machines
- **Never mutate state directly**—always use setters
- Lift state up when multiple components need it
- Custom hooks (prefix `use*`) for reusable stateful logic

### File Naming
- Components: `PascalCase.tsx` (e.g., `KuralDisplay.tsx`)
- Hooks: `camelCase.ts` with `use` prefix (e.g., `useTimer.ts`)
- Utils/libs: `camelCase.ts` (e.g., `fetchSource.ts`)
- Types: `index.ts` in `/src/types/`

## Critical Implementation Patterns

### React Component Pattern with TypeScript
```typescript
interface QuestionStateProps {
  group: Group;
  topic: Topic;
  onNext: () => void;
}

export function QuestionView({ group, topic, onNext }: QuestionStateProps) {
  const [loaded, setLoaded] = useState(false);
  const [questionState, setQuestionState] = useState<QuestionState | null>(null);

  useEffect(() => {
    fetchSource().then(data => {
      setQuestionState(createQuestionState(group, data));
      setLoaded(true);
    });
  }, [group]);

  if (!loaded) return <LoadingSpinner />;
  
  return (
    <Card className="mt-2">
      {/* Use shadcn/ui components */}
    </Card>
  );
}
```

### Timer Hook Pattern
```typescript
function useTimer(initialTime: number, isLive: boolean) {
  const [time, setTime] = useState(initialTime);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (!isLive || isPaused || time <= 0) return;
    
    const interval = setInterval(() => {
      setTime(t => t - 1);
    }, 1000);
    
    return () => clearInterval(interval); // Proper cleanup
  }, [isLive, isPaused, time]);

  return { time, isPaused, setIsPaused, resetTimer: () => setTime(initialTime) };
}
```

### Question Navigation with History (Critical Algorithm)
**Reference**: `old/.../data/DataClass.kt` HistoryState interface

The navigation pattern ensures randomized, circular question flow without duplicates:
```typescript
// On first goNext() call, generate shuffled indices
if (history.length === 0) {
  history = Array.from({ length: targets.length }, (_, i) => i)
    .filter(i => i !== currentIndex)
    .sort(() => Math.random() - 0.5);
  history.push(currentIndex); // Add current to end
}

// Cycle through history
const next = history.shift()!;
history.push(next);
index = next;
```

**Verify against**: `old/.../data/DataClass.kt` lines 140-160

### Competition Round 2 Question Pool (Critical Algorithm)
**Reference**: `old/.../competition/CompetitionApp.kt` `createQuestionState()` method

Must follow exact sequence to match legacy behavior:
1. Extract 15 last words (most frequent from full pool)
2. Remove kurals with those last words from pool
3. Extract 15 first words (from remaining pool)
4. Remove kurals with those first words
5. Extract 15 random kurals (from remaining)
6. Remove those kurals
7. Extract 15 random meanings (from remaining)
8. Remove those kurals
9. Extract up to 15 athikarams (from remaining pool)

**Verify against**: `old/.../competition/CompetitionApp.kt` lines 90-130

### Dollar Calculation Formulas (Scoring Critical)
**Reference**: `old/.../data/CDataClass.kt` ScoreState classes

**Group I** (KuralOnly):
```typescript
dollars = round1.filter(s => s.kural > 0).length;
// 1 dollar per kural with any kural score
```

**Groups II/III** (PottiSuttru):
```typescript
// Round 1
kuralCount = round1.filter(s => s.kural === true).length;
porulCount = round1.filter(s => s.porul === true).length;
round1Dollars = (kuralCount + porulCount) / 2;

// Round 2
totalAnswers = Object.values(round2).reduce((sum, set) => sum + set.size, 0);
round2Dollars = totalAnswers / 2;

totalDollars = round1Dollars + round2Dollars;
```

**Verify against**: `old/.../data/CDataClass.kt` lines 220-260

## Common Gotchas

1. **Always Cross-Reference Legacy Code**: When implementing any feature, open the corresponding Kotlin file side-by-side. Match behavior, not just structure.

2. **Timer Cleanup**: Use `useEffect` return function to clear intervals. Legacy code had memory leaks from missing cleanup.

3. **Tamil Tokenization**: The `getWords()` function splits on specific Unicode chars (32, 39, 44, 46, 58, 8204). Test with actual Tamil text from JSON.

4. **Score Mutations**: Legacy code mutates score objects directly in `setState` blocks. In React, create new objects/arrays when updating nested state.

5. **Question Pool Logging**: Legacy code logs pool sizes to console (see `CompetitionApp.play2()`). Keep these for debugging—verify counts match.

6. **Bonus Points Condition**: Group I bonus only toggles if at least one kural has score > 0. Check before allowing bonus selection.

7. **Max Answers Enforcement**: Round 2 allows max 10 answers per topic. Disable right/wrong buttons when limit reached (unless toggling existing answer).

## Verification Checklist

Before marking any feature complete:
- [ ] Open legacy Kotlin file side-by-side
- [ ] Test with same data inputs
- [ ] Verify console logs match (e.g., pool sizes, navigation indices)
- [ ] Check edge cases (empty lists, boundary conditions)
- [ ] Compare visual layout (take screenshots)
- [ ] Test on both desktop and mobile viewports

## Development Workflow

```bash
# Start dev server
npm run dev

# In separate terminal, watch for type errors
npm run type-check -- --watch

# Before committing
npm run build  # Ensure no build errors
npm run preview  # Test production build locally
```

## When Stuck

1. **Search legacy codebase**: Use grep/search for function names, variable names
2. **Check console logs**: Legacy code logs extensively—match those outputs
3. **Refer to companion docs**: `PRD.md` for requirements, `ARCHITECTURE.md` for design, `TASKS.md` for next steps
4. **Test increments**: Build smallest working piece, verify against legacy, then expand

## Resources

- **Legacy Codebase**: `old/tamilschool.github.io/src/main/kotlin/`
- **Shadcn/ui Docs**: https://ui.shadcn.com/
- **Tailwind Docs**: https://tailwindcss.com/docs
- **React Docs**: https://react.dev/
- **Vite Docs**: https://vitejs.dev/
