# Thirukkural Practice & Competition App - Product Requirements

> **Reference Implementation**: All features and behaviors described below are based on the Kotlin/JS app in `old/tamilschool.github.io/`. **Always verify against the legacy code** to ensure 100% feature parity and identical user experience.

## Product Goal
Educational web app for learning Tamil Thirukkural poetry through two modes:
1. **Practice Mode**: Self-paced learning with flexible navigation
2. **Competition Mode**: Structured scoring system for group competitions

## User Groups (Age-Based)
- **Group I** (6 & Below): Recite kurals only, simpler scoring
- **Group II** (7-9): Full format with kurals + meanings
- **Group III** (10+): Full format with kurals + meanings

**Technical Distinction**:
- Group I: `ScoreType.KuralOnly`
- Groups II/III: `ScoreType.PottiSuttru` (includes multi-round format)

## Core Data Model

### Thirukkural Structure
- **Athikaram** (Chapter): 133 total chapters
- **Kural** (Couplet): ~1330 two-line verses
- **Porul** (Meaning): Interpretations from 3 scholars
  - மு. வரதராசனார் (MuVaradha)
  - சாலமன் பாப்பையா (SalamanPapa) - default selection
  - மு. கருணாநிதி (MuKarunanidhi)
- **Words**: Tokenized text splitting on spaces, punctuation, zero-width chars

### Data Source
JSON files from GitHub:
- `thirukkural.json`: All kurals with metadata (athikaram, meanings, translations)
- `kids-group.json`: Mapping of kural numbers to Group II/III

**URL**: `https://raw.githubusercontent.com/tamilschool/tamilschool.github.io/main/src/main/resources/files/`

## Practice Mode Features

### Topic Selection (6 Types)
1. **அதிகாரம் (Athikaram)**: Given a word/theme, identify which kurals belong to that chapter
2. **பொருள் (Porul)**: Given a kural, show its meaning
3. **குறள் (Kural)**: Display full kural text
4. **முதல் வார்த்தை (FirstWord)**: Show kurals starting with specific word
5. **கடைசி வார்த்தை (LastWord)**: Show kurals ending with specific word
6. **அனைத்து குறள்கள் (AllKurals)**: Browse all kurals sequentially

### Navigation Controls
- **Previous/Next**: Navigate through questions (randomized order, no duplicates until full cycle)
- **Show/Hide Answer**: Toggle answer visibility
- **Timer**: 240-second countdown
  - Start/Pause/Reset controls
  - Continues counting answered questions
  - Visual indication when time expires

### Group Selection
- Toggle between Group II and Group III
- Filters kural dataset based on selection
- Preserves topic selection across group changes

### Scholar Selection (Meaning Display)
- Multi-select checkboxes for 3 scholars
- At least one must be selected
- Shows selected meanings side-by-side

## Competition Mode Features

### Group Selection Screen
- Initial screen showing 3 group buttons (I, II, III)
- Displays Tamil and English age descriptions
- Once selected, shows "Sign Out" button to return to selection

### Round Structure

#### Round 1: Free Recitation
**Group I (KuralOnly)**:
- Participants recite any kural
- Search by kural number to add to score card
- Scoring per kural:
  - குறள் (Kural): 0-3 points (increments of 0.5)
  - பொருள் (Porul): 0-2 points (increments of 0.5)
  - உச்சரிப்பு (Clarity): 0-1 point (increments of 0.5)
  - Bonus: 0/1/2/3 points (toggle, only if at least 1 kural scored)
- Dollar calculation: `(# kurals with kural score > 0)`

**Groups II/III (PottiSuttru)**:
- Same search and add functionality
- Scoring per kural:
  - குறள் (Kural): Checkbox (true/false)
  - பொருள் (Porul): Checkbox (true/false)
- Dollar calculation: `(# kurals with kural checked + # kurals with porul checked) / 2`

#### Round 2: Structured Questions (Groups II/III Only)
**Timer**: 1201 seconds (20 minutes)

**Question Pool Generation** (15 questions per topic, max 10 can be answered):
1. Extract 15 most frequent **last words**, remove those kurals from pool
2. From remaining, extract 15 most frequent **first words**, remove from pool
3. From remaining, extract 15 random **kurals**, remove from pool
4. From remaining, extract 15 random **meanings (porul)**, remove from pool
5. From remaining, extract up to 15 random **athikarams**

**Topics**: Same 5 as practice (excluding AllKurals)

**Navigation**:
- Previous/Next buttons
- Click question number to jump directly
- Visual indicators: answered questions marked, current question highlighted
- Max 10 answers per topic enforced (right/wrong toggle buttons)

**Scoring**:
- Each correct answer = 1 checkmark
- Dollar calculation: `(total checkmarks across all 5 topics) / 2`

### Score Card Display
**Group I**:
- List of recited kurals with point breakdown
- Total points = Kural + Porul + Clarity + Bonus
- Dollar count prominently displayed

**Groups II/III**:
- Round 1: List of kurals with checkmarks
- Round 2: Topic-wise count of correct answers
- Combined dollar calculation: `Round1Dollars + Round2Dollars`
- Summary showing kural numbers answered (comma-separated)

### Sign Out Confirmation
- Modal/alert: "Are you sure you want to sign out?"
- "No": Cancel and return
- "Yes": Clear all scores, return to group selection

## UI/UX Requirements

### Layout Structure (Maintain from Legacy)
- **Header**: Title bar with mode indicator (பயிற்சி/போட்டி)
- **Mode Toggle**: Button in top-right to switch Practice ↔ Competition
- **Main Content**: Full-height container with:
  - Control panels (group/topic/round selection)
  - Question display area
  - Navigation buttons
  - Timer display
  - Score cards (competition only)

### Visual Design
- **Modernize** with Tailwind CSS (via shadcn/ui components)
- **Preserve** layout structure and interaction patterns
- **Maintain** Bootstrap-like spacing and responsiveness
- **Ensure** Tamil text renders clearly with proper UTF-8 encoding

### Responsive Behavior
- Desktop: Full layout with all controls visible
- Mobile: Adapt controls but maintain all functionality
- Mode toggle button: Hidden on small screens (`d-none d-sm-block` equivalent)

## Non-Functional Requirements

### Performance
- Initial load: Fetch JSON data asynchronously, show loading state
- Navigation: Instant response to previous/next clicks
- Timer: Smooth countdown without lag

### Data Integrity
- Question randomization must avoid duplicates within a cycle
- History navigation maintains consistent order
- Score calculations must match legacy formulas exactly

### Browser Support
- Modern browsers with ES6+ support
- UTF-8 Tamil text rendering
- No special fonts required (system Tamil fonts)

### Deployment
- Static site hosted on GitHub Pages: `https://tamilschool.github.io`
- Auto-deploy via GitHub Actions on push to main
- Build timestamp included in output (like `createBuildInfo` task)

## Out of Scope (Current Version)
- User authentication/accounts
- Persistent score storage
- Multi-language UI (beyond Tamil/English labels)
- Audio pronunciation
- Admin panel for content management
- Analytics/tracking beyond Google Analytics in HTML
