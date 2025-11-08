import type { Thirukkural } from '@/types';

export const MAX_QUESTIONS = 15;

export interface QuestionPoolState {
  lastWords: string[];
  firstWords: string[];
  kurals: Thirukkural[];
  poruls: Thirukkural[];
  athikarams: string[];
}

/**
 * Generates Round 2 question pools following the legacy algorithm
 * Reference: old/.../competition/CompetitionApp.kt createQuestionState()
 *
 * Algorithm:
 * 1. Extract 15 most frequent last words, remove those kurals
 * 2. Extract 15 most frequent first words from remaining, remove those kurals
 * 3. Extract 15 random kurals from remaining, remove those kurals
 * 4. Extract 15 random porul meanings from remaining, remove those kurals
 * 5. Extract up to 15 random athikarams from remaining
 *
 * Returns pools for: LastWord, FirstWord, Kural, Porul, Athikaram topics
 */
export function useQuestionPool(kurals: Thirukkural[]): QuestionPoolState {
  // Helper function to get distinct last words with frequency sorting
  function getLastWords(thirukkurals: Thirukkural[], max: number): string[] {
    const wordFrequency = new Map<string, number>();

    thirukkurals.forEach(k => {
      const lastWord = k.words[k.words.length - 1];
      wordFrequency.set(lastWord, (wordFrequency.get(lastWord) || 0) + 1);
    });

    // Sort by frequency (descending), then by appearance
    return Array.from(wordFrequency.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([word]) => word)
      .slice(0, max);
  }

  // Helper function to get distinct first words with frequency sorting
  function getFirstWords(thirukkurals: Thirukkural[], max: number): string[] {
    const wordFrequency = new Map<string, number>();

    thirukkurals.forEach(k => {
      const firstWord = k.words[0];
      wordFrequency.set(firstWord, (wordFrequency.get(firstWord) || 0) + 1);
    });

    // Sort by frequency (descending), then by appearance
    return Array.from(wordFrequency.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([word]) => word)
      .slice(0, max);
  }

  // Helper function to shuffle array
  function shuffle<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  let allKurals = kurals;
  let remainingKurals = [...kurals];

  console.log(`[Question Pool] Total Kurals: ${allKurals.length}`);

  // Step 1: Extract 15 last words (most frequent)
  const lastWords = getLastWords(remainingKurals, MAX_QUESTIONS);
  remainingKurals = remainingKurals.filter(k => !lastWords.includes(k.words[k.words.length - 1]));
  const afterLastWord = remainingKurals.length;
  console.log(`[Question Pool] After Last Words: ${lastWords.length} extracted, ${afterLastWord} remaining`);

  // Step 2: Extract 15 first words (most frequent from remaining)
  const firstWords = getFirstWords(remainingKurals, MAX_QUESTIONS);
  remainingKurals = remainingKurals.filter(k => !firstWords.includes(k.words[0]));
  const afterFirstWord = remainingKurals.length;
  console.log(`[Question Pool] After First Words: ${firstWords.length} extracted, ${afterFirstWord} remaining`);

  // Step 3: Extract 15 random kurals from remaining
  const kuralsPools = shuffle(remainingKurals).slice(0, MAX_QUESTIONS);
  remainingKurals = remainingKurals.filter(k => !kuralsPools.includes(k));
  const afterKural = remainingKurals.length;
  console.log(`[Question Pool] After Kurals: ${kuralsPools.length} extracted, ${afterKural} remaining`);

  // Step 4: Extract 15 random porul meanings from remaining
  const porulPools = shuffle(remainingKurals).slice(0, MAX_QUESTIONS);
  remainingKurals = remainingKurals.filter(k => !porulPools.includes(k));
  const afterPorul = remainingKurals.length;
  console.log(`[Question Pool] After Poruls: ${porulPools.length} extracted, ${afterPorul} remaining`);

  // Step 5: Extract up to 15 random athikarams from remaining
  const athikaramSet = new Set<string>();
  const shuffledRemaining = shuffle(remainingKurals);

  for (const kural of shuffledRemaining) {
    if (athikaramSet.size >= MAX_QUESTIONS) break;
    athikaramSet.add(kural.athikaram);
  }

  const athikarams = Array.from(athikaramSet);
  remainingKurals = remainingKurals.filter(k => !athikarams.includes(k.athikaram));
  const afterAthikaram = remainingKurals.length;
  console.log(`[Question Pool] After Athikarams: ${athikarams.length} extracted, ${afterAthikaram} remaining`);

  // Summary log
  console.log(
    `[Question Pool] Summary: Total=${allKurals.length}, ` +
    `LastWords=${lastWords.length}, FirstWords=${firstWords.length}, ` +
    `Kurals=${kuralsPools.length}, Poruls=${porulPools.length}, ` +
    `Athikarams=${athikarams.length}`
  );

  return {
    lastWords,
    firstWords,
    kurals: kuralsPools,
    poruls: porulPools,
    athikarams,
  };
}
