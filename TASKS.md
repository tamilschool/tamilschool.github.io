# Implementation Tasks

> **Critical**: Always cross-reference `old/tamilschool.github.io/` Kotlin code to ensure exact feature replication. Test against the legacy app to verify identical behavior.

## Phase 1: Project Setup

- [x] Initialize Vite + React + TypeScript at repo root
  ```bash
  npm create vite@latest . -- --template react-ts
  ```
- [x] Install shadcn/ui CLI and initialize
  ```bash
  npx shadcn@latest init
  ```
- [x] Configure Tailwind CSS (Tailwind v4 with @tailwindcss/postcss)
- [x] Install shadcn components: Button, Card, Select, Checkbox, Alert, Badge
- [x] Set up Vite config for GitHub Pages (`base: '/'`)
- [x] Create `.github/workflows/deploy.yml` for auto-deployment
- [x] Add `.gitignore` entries: `dist/`, `node_modules/`, `.env`
- [x] Test basic app runs: `npm run dev` ✓ Running on http://localhost:5173/

## Phase 2: Core Data Layer

- [x] Create `/src/types/index.ts` with TypeScript interfaces
  - Thirukkural, Group, Topic, Round enums (as const objects)
  - QuestionState, CQuestionState, TimerState, ScoreState
  - HistoryState, all *State variants
  - Verified against `old/.../data/DataClass.kt` and `CDataClass.kt` ✓
  
- [x] Implement `/src/lib/data/fetchSource.ts`
  - Fetch `thirukkural.json` and `kids-group.json` from GitHub raw URLs
  - Handle loading states and errors
  - Test with `console.log` to verify data structure ✓
  
- [x] Implement `/src/lib/data/parseSource.ts`
  - Transform JSON → Thirukkural[] with group mappings
  - Match logic from `old/.../practice/ReadSource.kt`
  - Test output matches Kotlin version ✓
  
- [x] Implement `/src/lib/data/tokenizer.ts`
  - Port `getWords()` function with Unicode char codes (32, 39, 44, 46, 58, 8204)
  - Test with Tamil text samples from JSON
  - Verify word splitting matches legacy behavior ✓

- [x] Write unit tests for data layer (optional but recommended) - Tested via App.tsx

## Phase 3: Shared Components & Hooks

- [x] Analyze practice component dependencies for question/answer styling (`src/components/practice/PracticeApp.tsx`, `src/components/QuestionView.tsx`, `src/components/KuralDisplay.tsx`)
- [x] Refactor practice `QuestionView` layout to separate question and answer styling (`src/components/QuestionView.tsx`)
- [x] Restyle `KuralDisplay` card visuals to align with updated practice view (`src/components/KuralDisplay.tsx`)
- [ ] Create `/src/hooks/useTimer.ts`
  - Practice: 240s, Competition: 1201s
  - isLive, isPaused, time state
  - `useEffect` with interval and cleanup
  - Test countdown and reset functionality
  
- [ ] Create `/src/hooks/useNavigation.ts`
  - Generic hook for HistoryState pattern
  - goNext/goPrevious with circular randomized history
  - Track answers set
  - Verify against `old/.../data/DataClass.kt` HistoryState interface
  
- [ ] Create `/src/components/KuralDisplay.tsx`
  - Card component showing kural + athikaram
  - Props: thirukkural, selectedMeanings, style variant
  - Match layout from `old/.../components/KuralDisplay.kt`
  
- [ ] Create `/src/components/QuestionView.tsx`
  - Display question text based on topic type
  - Show/hide answer toggle
  - Reusable across practice/competition
  
- [ ] Create `/src/components/TimerDisplay.tsx`
  - Show MM:SS format
  - Start/Pause/Reset buttons
  - Visual indicator when expired
  
- [ ] Test components in isolation with mock data

- [ ] Review legacy practice question/answer styling _(status: not-started)_
- [ ] Update `QuestionView` to remove header and apply new background _(status: not-started)_
- [ ] Restyle `KuralDisplay` to neutral card _(status: not-started)_

## Phase 4: Practice Mode

- [ ] Create `/src/features/practice/PracticeApp.tsx`
  - Main component matching `old/.../practice/PracticeApp.kt`
  - State: QuestionState with all *State objects
  - Fetch data on mount, initialize with Group II
  
- [ ] Create `/src/features/practice/GroupSelector.tsx`
  - Toggle between Group II and Group III
  - Update question pool on change
  
- [ ] Create `/src/features/practice/TopicSelector.tsx`
  - Dropdown/buttons for 6 topics
  - Reset answer visibility on topic change
  
- [ ] Create `/src/features/practice/ScholarSelector.tsx`
  - Multi-select checkboxes for 3 scholars
  - Default: SalamanPapa selected
  - At least one must remain checked
  
- [ ] Create `/src/features/practice/Navigation.tsx`
  - Previous/Next buttons
  - Show Answer button
  - Timer controls
  - Wire up to navigation hooks
  
- [ ] Integrate all practice components in PracticeApp
- [ ] Test each topic type thoroughly:
  - Athikaram: Shows multiple kurals for chapter
  - Porul: Shows kural with meaning
  - Kural: Shows full kural
  - FirstWord: Shows kurals starting with word
  - LastWord: Shows kurals ending with word
  - AllKurals: Browse all kurals (no navigation buttons)
  
- [ ] Test timer functionality:
  - Starts on button click
  - Pauses/resumes correctly
  - Resets and generates new question
  - Counts answered questions

## Phase 5: Competition Mode - Round 1

- [ ] Create `/src/features/competition/CompetitionApp.tsx`
  - Main component matching `old/.../competition/CompetitionApp.kt`
  - State: CQuestionState + activeGroup (nullable)
  
- [ ] Create `/src/features/competition/GroupSelection.tsx`
  - 3 buttons for Group I, II, III
  - Tamil + English age labels
  - Set activeGroup on click
  - Match layout from `old/.../competition/group/GroupSelection.kt`
  
- [ ] Create `/src/features/competition/SignOut.tsx`
  - Button in header when group is active
  - Modal confirmation: "Are you sure?"
  - Yes: Clear scores + return to selection
  - No: Close modal
  
- [ ] Create `/src/features/competition/round1/SearchKural.tsx`
  - Input for kural number
  - Search button
  - Display found kural
  - Add to score card button
  
- [ ] Create `/src/features/competition/round1/Group1ScoreCard.tsx`
  - List of added kurals
  - Per kural: Kural (0-3), Porul (0-2), Clarity (0-1)
  - Increment/decrement by 0.5
  - Bonus: 0/1/2/3 (only if ≥1 kural scored)
  - Total points display
  - Dollar calculation: `# kurals with kural score > 0`
  - Delete kural button
  
- [ ] Create `/src/features/competition/round1/Group23ScoreCard.tsx`
  - List of added kurals
  - Per kural: Kural checkbox, Porul checkbox
  - Dollar calculation: `(# kural checked + # porul checked) / 2`
  - Delete kural button
  
- [ ] Test Round 1 thoroughly:
  - Search adds kurals correctly
  - Group I scoring matches formula
  - Group II/III scoring matches formula
  - Delete removes from card
  - Bonus toggle works only when kurals scored (Group I)

## Phase 6: Competition Mode - Round 2

- [ ] Create `/src/hooks/useQuestionPool.ts`
  - Implement question pool algorithm from `CompetitionApp.createQuestionState()`
  - 15 last words (most frequent)
  - 15 first words from remaining
  - 15 random kurals from remaining
  - 15 random porul from remaining
  - Up to 15 random athikarams from remaining
  - Return all 5 *State objects
  - Log pool sizes to verify against legacy (see console.log in Kotlin code)
  
- [ ] Create `/src/features/competition/RoundSelector.tsx`
  - Toggle Round I / Round II
  - Only show Round II for Groups II/III
  
- [ ] Create `/src/features/competition/round2/TopicSelector.tsx`
  - 5 buttons (exclude AllKurals)
  - Show count: answered / total (e.g., "3/15")
  - Highlight current topic
  
- [ ] Create `/src/features/competition/round2/QuestionDisplay.tsx`
  - Show current question based on topic
  - Right/Wrong buttons (only if < 10 answered or already answered)
  - Visual feedback if max answers reached
  
- [ ] Create `/src/features/competition/round2/QuestionNavigation.tsx`
  - Previous/Next buttons
  - Question number grid (1-15)
  - Visual indicators: answered (green), current (highlight), unanswered (default)
  - Click number to jump to question
  
- [ ] Create `/src/features/competition/round2/Round2ScoreCard.tsx`
  - 5 rows (one per topic)
  - Show answered count per topic
  - Total count across all topics
  - Dollar calculation: `total / 2`
  
- [ ] Integrate Round 2 components in CompetitionApp
- [ ] Test Round 2 thoroughly:
  - Timer starts at 1201s
  - Question pool generates correctly (verify counts)
  - Navigation works (prev/next/jump)
  - Max 10 answers enforced per topic
  - Scoring updates dynamically
  - All 5 topics accessible

## Phase 7: Root App & Mode Switching

- [ ] Create `/src/App.tsx`
  - Root component with practice/competition toggle
  - State: isPracticeMode boolean
  - Header with title: "திருக்குறள் பயிற்சி" or "திருக்குறள் போட்டி"
  - Toggle button in top-right
  - Render PracticeApp or CompetitionApp based on mode
  - Match structure from `old/.../App.kt`
  
- [ ] Test mode switching:
  - Toggle preserves no state (fresh mount each time)
  - Button shows correct label
  - Header updates

## Phase 8: Polish & Deploy

- [ ] UI refinement with Tailwind
  - Match layout structure from legacy (header, container, cards)
  - Modernize colors and spacing
  - Ensure responsive behavior (mobile-friendly)
  - Test on different screen sizes
  
- [ ] Tamil text rendering
  - Verify UTF-8 encoding in all files
  - Test in Chrome, Firefox, Safari
  - Ensure proper line breaks for kural couplets
  
- [ ] Add build timestamp
  - Create script to write `build-info.txt` to dist/ during build
  - Add to `package.json` build script or GitHub Actions
  
- [ ] Create GitHub Actions workflow (if not done in Phase 1)
  - Trigger on push to main
  - Build with `npm run build`
  - Deploy dist/ to gh-pages branch
  - Add build timestamp generation
  
- [ ] Test deployment
  - Push to main, verify action runs
  - Check https://tamilschool.github.io loads correctly
  - Test all features in production
  
- [ ] Final verification
  - Side-by-side test with legacy app
  - Verify all topics work in both modes
  - Check scoring calculations match exactly
  - Test timer behavior
  - Confirm question randomization
  - Validate Round 2 question pool distribution

## Phase 9: Documentation & Handoff

- [ ] Update README.md with:
  - Project description
  - Development setup instructions
  - Build and deployment commands
  - Link to legacy app reference
  
- [ ] Add code comments for complex algorithms:
  - Question pool generation
  - Dollar calculations
  - History navigation
  
- [ ] Optional: Record video walkthrough comparing legacy vs new app

## Ongoing Tasks

- [ ] Monitor GitHub Actions for deployment failures
- [ ] Fix any bugs reported from production
- [ ] Performance profiling if app feels slow
- [ ] Add unit tests for critical functions (scoring, navigation)
