// Core data types matching old/.../data/DataClass.kt and CDataClass.kt

// ============================================================================
// Constants
// ============================================================================

export const DATA_SOURCE = {
  thirukkuralPath: 'src/data/thirukkural.json',
  groupsPath: 'src/data/kids-group.json',
};

export const MAX_QUESTIONS = 15;
export const MAX_ANSWERS = 10;

// ============================================================================
// Enums (using const objects for type-safe enum pattern via const assertion)
// ============================================================================

export const ScoreType = {
  KuralOnly: 'KuralOnly',
  PottiSuttru: 'PottiSuttru',
} as const;
export type ScoreType = (typeof ScoreType)[keyof typeof ScoreType];

export const Group = {
  I: 'I',
  II: 'II',
  III: 'III',
} as const;
export type Group = (typeof Group)[keyof typeof Group];

export const GroupDisplay = {
  [Group.I]: {
    tamil: 'பிரிவு 1',
    english: '6 & Below',
    type: ScoreType.KuralOnly,
  },
  [Group.II]: {
    tamil: 'பிரிவு 2',
    english: '7 to 9',
    type: ScoreType.PottiSuttru,
  },
  [Group.III]: {
    tamil: 'பிரிவு 3',
    english: '10 & Above',
    type: ScoreType.PottiSuttru,
  },
} as const;

export const Round = {
  I: 'I',
  II: 'II',
} as const;
export type Round = (typeof Round)[keyof typeof Round];

export const RoundDisplay = {
  [Round.I]: 'சுற்று 1',
  [Round.II]: 'சுற்று 2',
} as const;

export const Topic = {
  Athikaram: 'Athikaram',
  Porul: 'Porul',
  Kural: 'Kural',
  FirstWord: 'FirstWord',
  LastWord: 'LastWord',
  AllKurals: 'AllKurals',
} as const;
export type Topic = (typeof Topic)[keyof typeof Topic];

export const TopicDisplay = {
  [Topic.Athikaram]: 'அதிகாரம்',
  [Topic.Porul]: 'பொருள்',
  [Topic.Kural]: 'குறள்',
  [Topic.FirstWord]: 'முதல் வார்த்தை',
  [Topic.LastWord]: 'கடைசி வார்த்தை',
  [Topic.AllKurals]: 'அனைத்து குறள்கள்',
} as const;

export const KuralMeaning = {
  MuVaradha: 'MuVaradha',
  SalamanPapa: 'SalamanPapa',
  MuKarunanidhi: 'MuKarunanidhi',
} as const;
export type KuralMeaning = (typeof KuralMeaning)[keyof typeof KuralMeaning];

export const KuralMeaningDisplay = {
  [KuralMeaning.MuVaradha]: 'மு. வரதராசனார்',
  [KuralMeaning.SalamanPapa]: 'சாலமன் பாப்பையா',
  [KuralMeaning.MuKarunanidhi]: 'மு. கருணாநிதி',
} as const;

export const Group1RoundType = {
  KURAL: 'KURAL',
  PORUL: 'PORUL',
  CLARITY: 'CLARITY',
} as const;
export type Group1RoundType = (typeof Group1RoundType)[keyof typeof Group1RoundType];

export const Group1RoundTypeDisplay = {
  [Group1RoundType.KURAL]: 'குறள்',
  [Group1RoundType.PORUL]: 'பொருள்',
  [Group1RoundType.CLARITY]: 'உச்சரிப்பு',
} as const;

export const Group23Round1Type = {
  KURAL: 'KURAL',
  PORUL: 'PORUL',
} as const;
export type Group23Round1Type = (typeof Group23Round1Type)[keyof typeof Group23Round1Type];

// ============================================================================
// JSON Data Types (for parsing)
// ============================================================================

export interface ThirukkuralData {
  number: number;
  line1: string;
  line2: string;
  translation: string;
  muVaradha: string;
  salamanPapa: string;
  muKarunanidhi: string;
  explanation: string;
  couplet: string;
  transliteration1: string;
  transliteration2: string;
  paulName: string;
  paulTransliteration: string;
  paulTranslation: string;
  iyalName: string;
  iyalTransliteration: string;
  iyalTranslation: string;
  adikaramName: string;
  adikaramNumber: number;
  adikaramTamilDesc: string;
  adikaramTransliteration: string;
  adikaramTranslation: string;
}

export interface ThirukkuralCollection {
  kural: ThirukkuralData[];
}

export interface GroupsCollection {
  II: string; // Comma-separated kural numbers
  III: string; // Comma-separated kural numbers
}

// ============================================================================
// Core Domain Types
// ============================================================================

export interface KuralOnly {
  firstLine: string;
  secondLine: string;
}

export interface Thirukkural {
  athikaramNo: number;
  athikaram: string;
  kuralNo: number;
  kural: KuralOnly;
  porul: string; // Default meaning (SalamanPapa)
  porulMuVaradha: string;
  porulSalamanPapa: string;
  porulMuKarunanidhi: string;
  words: string[];
  group: Group[];
}

// ============================================================================
// Practice Mode State Types
// ============================================================================

export interface TimerState {
  isLive: boolean;
  isPaused: boolean;
  time: number; // seconds
  count: number; // answered questions count
}

export interface HistoryState {
  index: number;
  thirukkurals: Thirukkural[];
  history: number[];
  answers: Set<string>;
}

export interface AthikaramState extends HistoryState {
  athikarams: string[];
}

export interface ThirukkuralState extends HistoryState {
  kurals: Thirukkural[];
}

export interface FirstWordState extends HistoryState {
  words: string[];
}

export interface LastWordState extends HistoryState {
  words: string[];
}

export interface QuestionState {
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

// ============================================================================
// Competition Mode State Types
// ============================================================================

export interface CTimerState {
  isLive: boolean;
  isPaused: boolean;
  time: number; // seconds (1201 for competition)
}

export interface CHistoryState<T> {
  index: number;
  targets: T[];
}

export interface CAthikaramState extends CHistoryState<string> {
  // targets are athikaram names
}

export interface CThirukkuralState extends CHistoryState<Thirukkural> {
  // targets are Thirukkural objects
}

export interface CFirstWordState extends CHistoryState<string> {
  // targets are first words
}

export interface CLastWordState extends CHistoryState<string> {
  // targets are last words
}

// ============================================================================
// Competition Mode Scoring Types
// ============================================================================

export interface Group1Round1Score {
  thirukkural: Thirukkural;
  score: Record<Group1RoundType, number>; // 0-3 for KURAL, 0-2 for PORUL, 0-1 for CLARITY
}

export interface Group1Score {
  round1: Record<number, Group1Round1Score>; // kuralNo -> score
  bonus: number; // 0/1/2/3
}

export interface Group23Round1Score {
  thirukkural: Thirukkural;
  score: Record<Group23Round1Type, boolean>; // true/false checkboxes
}

export interface Group23Score {
  round1: Record<number, Group23Round1Score>; // kuralNo -> score
  round2: Record<Topic, Set<string>>; // topic -> answered questions
}

export interface ScoreState {
  group1Score: Group1Score;
  group23Score: Group23Score;
}

export interface CQuestionState {
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

// ============================================================================
// Utility Functions
// ============================================================================

export function getMeaning(
  thirukkural: Thirukkural,
  meaning: KuralMeaning
): string {
  switch (meaning) {
    case KuralMeaning.MuVaradha:
      return thirukkural.porulMuVaradha;
    case KuralMeaning.SalamanPapa:
      return thirukkural.porulSalamanPapa;
    case KuralMeaning.MuKarunanidhi:
      return thirukkural.porulMuKarunanidhi;
  }
}

export function getGroupType(group: Group): ScoreType {
  return GroupDisplay[group].type;
}

export function isGroup23(group: Group): boolean {
  return group === Group.II || group === Group.III;
}
