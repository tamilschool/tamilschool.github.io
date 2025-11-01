# Thirukkural App - Technical Architecture

> **Reference Implementation**: `old/tamilschool.github.io/` contains the Kotlin/JS source of truth. This document describes the React architecture that replicates that behavior.

## Technology Stack

### Core
- **React 18+** with TypeScript
- **Vite** for build tooling
- **Tailwind CSS** via shadcn/ui components
- **Radix UI** primitives (via shadcn/ui)

### State Management
- React hooks (`useState`, `useReducer`, `useEffect`)
- No global state library (Redux/Zustand) needed
- Component-level state with prop drilling where appropriate

### Deployment
- GitHub Pages static hosting
- GitHub Actions CI/CD pipeline
- Vite base path: `/` (root domain deployment)

## Project Structure

```
/src
  /components          # Shadcn/ui + custom reusable components
    /ui               # Shadcn/ui primitives (Button, Card, etc.)
    KuralDisplay.tsx   # Display kural with meanings
    QuestionView.tsx   # Question display variants
    TimerDisplay.tsx   # Countdown timer UI
    ScoreCard.tsx      # Score display components
  
  /features
    /practice         # Practice mode components
      PracticeApp.tsx
      TopicSelector.tsx
      Navigation.tsx
    /competition      # Competition mode components
      CompetitionApp.tsx
      GroupSelection.tsx
      RoundSelector.tsx
      /round1
        ScoreEntry.tsx
        SearchKural.tsx
      /round2
        QuestionPool.tsx
  
  /lib
    /data
      fetchSource.ts   # JSON fetching
      parseSource.ts   # Data transformation
      tokenizer.ts     # getWords() implementation
    /utils
      navigation.ts    # Question history/randomization
      scoring.ts       # Dollar calculation formulas
  
  /types
    index.ts          # TypeScript interfaces (Thirukkural, QuestionState, etc.)
  
  /hooks
    useTimer.ts       # Timer state management
    useNavigation.ts  # Question navigation with history
    useQuestionPool.ts # Round 2 question generation
  
  App.tsx             # Root component with mode switching
  main.tsx            # Entry point

/public
  (static assets if needed)

/old                  # Legacy Kotlin/JS app (DO NOT MODIFY)
  tamilschool.github.io/
```

## Data Flow

### Application Bootstrap
```
1. main.tsx renders <App />
2. App component initializes with practice mode
3. fetchSource() called on mount (both modes)
4. parseSource() transforms JSON → TypeScript objects
5. State initialized with Group II/Group I default
6. Timer interval registered (cleanup on unmount)
```

### Practice Mode Flow
```
User selects topic → 
  Create *State object (Athikaram/Kural/FirstWord/LastWord) →
  Generate randomized history (circular navigation) →
  Display first question →
  User clicks Next/Previous →
  Update index, track answers →
  Show/Hide answer toggle →
  Timer countdown (if started)
```

### Competition Mode Flow
```
Group selection screen →
User selects group →
  Round 1: Free recitation
    Search kural by number →
    Add to score card →
    Toggle checkboxes/adjust points →
    Calculate dollars dynamically
  
  Round 2: (Groups II/III only)
    Generate question pool (5 topics × 15 questions) →
    Start timer (1201s) →
    User navigates questions →
    Mark answers (right/wrong) →
    Max 10 per topic enforced →
    Calculate dollars dynamically
  
Sign Out → Confirm modal → Clear scores → Return to selection
```

## State Architecture

### Type Definitions (TypeScript Interfaces)

```typescript
// Core data types
interface Thirukkural {
  athikaramNo: number;
  athikaram: string;
  kuralNo: number;
  kural: { firstLine: string; secondLine: string };
  porul: string;  // Default (SalamanPapa)
  porulMuVaradha: string;
  porulSalamanPapa: string;
  porulMuKarunanidhi: string;
  words: string[];
  group: Group[];
}

enum Group { I = "I", II = "II", III = "III" }
enum Topic { Athikaram, Porul, Kural, FirstWord, LastWord, AllKurals }
enum Round { I = "I", II = "II" }

// Practice mode state
interface QuestionState {
  selectedGroup: Group;
  selectedTopic: Topic;
  thirukkurals: Thirukkural[];
  athikaramState: AthikaramState;
  thirukkuralState: ThirukkuralState;
  firstWordState: FirstWordState;
  lastWordState: LastWordState;
  timerState: TimerState;
  showAnswer: boolean;
}

interface TimerState {
  isLive: boolean;
  isPaused: boolean;
  time: number;  // seconds
  count: number; // answered questions
}

// Navigation with history
interface HistoryState<T> {
  index: number;
  targets: T[];
  history: number[];
  answers: Set<string>;
  goNext(): void;
  goPrevious(): void;
}

// Competition mode state
interface CQuestionState {
  selectedGroup: Group;
  selectedRound: Round;
  selectedTopic: Topic;
  round2Kurals: Thirukkural[];
  athikaramState: CAthikaramState;
  kuralState: CThirukkuralState;
  porulState: CThirukkuralState;
  firstWordState: CFirstWordState;
  lastWordState: CLastWordState;
  timerState: CTimerState;
  scoreState: ScoreState;
}

interface ScoreState {
  group1Score: Group1Score;
  group23Score: Group23Score;
}
```

### State Management Patterns

**Practice Mode**: Single `useState<QuestionState>` in PracticeApp
- Timer: `setInterval` in `useEffect` with cleanup
- Navigation: Mutate state within `setState` callback
- Topic change: Reset timer, clear answers, regenerate history

**Competition Mode**: Single `useState<CQuestionState>` in CompetitionApp
- Round 1: Dynamic score object, search results in separate state
- Round 2: Fixed question pool (75 questions), answer set per topic
- Sign out: Reset to null activeGroup, clear all scores

## Critical Algorithms

### Question Randomization (Practice Mode)
```typescript
function generateRandomList(maxIndex: number): number[] {
  return Array.from({ length: maxIndex }, (_, i) => i)
    .sort(() => Math.random() - 0.5);
}

// HistoryState pattern
function goNext() {
  if (history.isEmpty()) {
    history = generateRandomList(targets.length);
    history = history.filter(i => i !== index);
    history.push(index); // Current index at end
  }
  const next = history.shift()!;
  history.push(next);
  index = next;
}
```

### Round 2 Question Pool (Competition Mode)
```typescript
function createQuestionPool(kurals: Thirukkural[]) {
  let remaining = [...kurals];
  
  // 1. Last words (15 most frequent)
  const lastWords = extractTopWords(remaining, 'last', 15);
  const lastWordState = new CLastWordState(lastWords);
  remaining = remaining.filter(k => !lastWords.includes(k.words[k.words.length - 1]));
  
  // 2. First words (15 most frequent from remaining)
  const firstWords = extractTopWords(remaining, 'first', 15);
  const firstWordState = new CFirstWordState(firstWords);
  remaining = remaining.filter(k => !firstWords.includes(k.words[0]));
  
  // 3. Random kurals (15 from remaining)
  const randomKurals = shuffle(remaining).slice(0, 15);
  const kuralState = new CThirukkuralState(randomKurals);
  remaining = remaining.filter(k => !randomKurals.includes(k));
  
  // 4. Random meanings (15 from remaining)
  const randomPorul = shuffle(remaining).slice(0, 15);
  const porulState = new CThirukkuralState(randomPorul);
  remaining = remaining.filter(k => !randomPorul.includes(k));
  
  // 5. Random athikarams (up to 15 from remaining)
  const athikarams = shuffle([...new Set(remaining.map(k => k.athikaram))]).slice(0, 15);
  const athikaramState = new CAthikaramState(kurals, athikarams);
  
  return { athikaramState, kuralState, porulState, firstWordState, lastWordState };
}
```

### Dollar Calculations
```typescript
// Group I (KuralOnly)
function calculateGroup1Dollars(score: Group1Score): number {
  const kuralsWithScore = score.round1.filter(s => s.kural > 0).length;
  return kuralsWithScore; // 1 dollar per kural recited
}

// Groups II/III (PottiSuttru)
function calculateGroup23Dollars(score: Group23Score): number {
  // Round 1
  const kuralCount = score.round1.filter(s => s.kural).length;
  const porulCount = score.round1.filter(s => s.porul).length;
  const round1Dollars = (kuralCount + porulCount) / 2;
  
  // Round 2
  const totalAnswers = Object.values(score.round2)
    .reduce((sum, set) => sum + set.size, 0);
  const round2Dollars = totalAnswers / 2;
  
  return round1Dollars + round2Dollars;
}
```

## Component Patterns

### Custom Hooks
```typescript
// Timer hook with cleanup
function useTimer(initialTime: number) {
  const [time, setTime] = useState(initialTime);
  const [isLive, setIsLive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  
  useEffect(() => {
    if (!isLive || isPaused || time <= 0) return;
    
    const interval = setInterval(() => {
      setTime(t => t - 1);
    }, 1000);
    
    return () => clearInterval(interval);
  }, [isLive, isPaused, time]);
  
  return { time, isLive, isPaused, setIsLive, setIsPaused, reset: () => setTime(initialTime) };
}

// Navigation hook with history
function useNavigation<T>(targets: T[]) {
  const [index, setIndex] = useState(0);
  const [history, setHistory] = useState<number[]>([]);
  const [answers, setAnswers] = useState(new Set<string>());
  
  const goNext = useCallback(() => {
    // Implementation matching HistoryState.goNext()
  }, [targets, index, history]);
  
  return { current: targets[index], index, goNext, goPrevious, answers };
}
```

### Shadcn/ui Usage
```typescript
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

function KuralDisplay({ kural }: { kural: Thirukkural }) {
  return (
    <Card className="mt-2 bg-success text-white">
      <CardHeader className="flex justify-between">
        <div>{kural.athikaram}</div>
        <div className="text-sm italic">அதிகாரம்: {kural.athikaramNo}</div>
      </CardHeader>
      <CardContent>
        <p>{kural.kural.firstLine}</p>
        <p>{kural.kural.secondLine}</p>
      </CardContent>
    </Card>
  );
}
```

## Build & Deployment

### Vite Configuration
```typescript
// vite.config.ts
export default defineConfig({
  plugins: [react()],
  base: '/', // Root deployment on tamilschool.github.io
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
});
```

### GitHub Actions Workflow
```yaml
# .github/workflows/deploy.yml
name: Deploy to GitHub Pages
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run build
      - run: echo "$(date -Iseconds)" > dist/build-info.txt
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

## Testing Strategy

### Unit Tests (Vitest)
- `parseSource()`: JSON parsing correctness
- `getWords()`: Tamil tokenization
- Scoring calculations: Dollar formulas
- Navigation logic: History management

### Component Tests (React Testing Library)
- KuralDisplay: Rendering with different scholar selections
- Timer: Countdown behavior
- ScoreCard: Dynamic dollar updates

### E2E Tests (Optional)
- Full practice mode flow
- Competition Round 2 question pool
- Sign out confirmation

## Performance Considerations

### Data Loading
- JSON files ~500KB total
- Fetch once on app mount, cache in state
- No need for pagination (1330 kurals is manageable)

### Re-rendering
- Avoid unnecessary re-renders with `useMemo` for question pools
- `useCallback` for event handlers passed to children
- React DevTools profiling to identify bottlenecks

### Timer Accuracy
- `setInterval` is sufficient (no need for Web Workers)
- Cleanup prevents memory leaks on unmount
