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
  // Helper function to get distinct last words (legacy algorithm)
  // Reference: old/.../data/CDataClass.kt cGetLastWords()
  function getLastWords(thirukkurals: Thirukkural[], max: number): string[] {
    const shuffled = shuffle(thirukkurals);
    const words: string[] = [];
    const seen = new Set<string>();

    for (const kural of shuffled) {
      const lastWord = kural.words[kural.words.length - 1];
      if (!seen.has(lastWord)) {
        seen.add(lastWord);
        words.push(lastWord);
        if (words.length >= max) break;
      }
    }

    return words;
  }

  // Helper function to get distinct first words (legacy algorithm)
  // Reference: old/.../data/CDataClass.kt cGetFirstWords()
  function getFirstWords(thirukkurals: Thirukkural[], max: number): string[] {
    const shuffled = shuffle(thirukkurals);
    const words: string[] = [];
    const seen = new Set<string>();

    for (const kural of shuffled) {
      const firstWord = kural.words[0];
      if (!seen.has(firstWord)) {
        seen.add(firstWord);
        words.push(firstWord);
        if (words.length >= max) break;
      }
    }

    return words;
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

  console.log(`\n========== QUESTION POOL ANALYSIS ==========`);
  console.log(`Total Kurals: ${allKurals.length}`);

  // Step 1: Extract 15 last words (most frequent)
  const lastWords = getLastWords(remainingKurals, MAX_QUESTIONS);
  const lastWordKurals = remainingKurals.filter(k => lastWords.includes(k.words[k.words.length - 1]));
  const lastWordKuralsCount = lastWordKurals.length;
  remainingKurals = remainingKurals.filter(k => !lastWords.includes(k.words[k.words.length - 1]));
  console.log(`\n1. Last Words Round:`);
  console.log(`   - Selected 15 unique last words`);
  console.log(`   - Covered Kurals: ${lastWordKuralsCount}`);
  console.log(`   - Remaining: ${remainingKurals.length}`);

  // Step 2: Extract 15 first words (most frequent from remaining)
  const firstWords = getFirstWords(remainingKurals, MAX_QUESTIONS);
  const firstWordKurals = remainingKurals.filter(k => firstWords.includes(k.words[0]));
  const firstWordKuralsCount = firstWordKurals.length;
  remainingKurals = remainingKurals.filter(k => !firstWords.includes(k.words[0]));
  console.log(`\n2. First Words Round:`);
  console.log(`   - Selected 15 unique first words`);
  console.log(`   - Covered Kurals: ${firstWordKuralsCount}`);
  console.log(`   - Remaining: ${remainingKurals.length}`);

  // Step 3: Extract 15 random kurals from remaining
  const kuralsPools = shuffle(remainingKurals).slice(0, MAX_QUESTIONS);
  const kuralsCount = kuralsPools.length;
  remainingKurals = remainingKurals.filter(k => !kuralsPools.includes(k));
  console.log(`\n3. Kural Round:`);
  console.log(`   - Selected Kurals: ${kuralsCount}`);
  console.log(`   - Remaining: ${remainingKurals.length}`);

  // Step 4: Extract 15 random porul meanings from remaining
  const porulPools = shuffle(remainingKurals).slice(0, MAX_QUESTIONS);
  const porulsCount = porulPools.length;
  remainingKurals = remainingKurals.filter(k => !porulPools.includes(k));
  console.log(`\n4. Porul Round:`);
  console.log(`   - Selected Kurals: ${porulsCount}`);
  console.log(`   - Remaining: ${remainingKurals.length}`);

  // Step 5: Extract up to 15 random athikarams from remaining
  const athikaramSet = new Set<string>();
  const shuffledRemaining = shuffle(remainingKurals);

  for (const kural of shuffledRemaining) {
    if (athikaramSet.size >= MAX_QUESTIONS) break;
    athikaramSet.add(kural.athikaram);
  }

  const athikarams = Array.from(athikaramSet);

  // Calculate total unique athikarams in remaining
  const totalUniqueAthikarams = new Set(remainingKurals.map(k => k.athikaram)).size;

  console.log(`\n5. Athikaram Round:`);
  console.log(`   - Selected Athikarams: ${athikarams.length}`);
  console.log(`   - Total Unique Athikarams Available: ${totalUniqueAthikarams}`);
  console.log(`   - Remaining Kurals: ${remainingKurals.length}`);

  // Summary
  const totalCoveredKurals = lastWordKuralsCount + firstWordKuralsCount + kuralsCount + porulsCount;
  console.log(`\n========== SUMMARY ==========`);
  console.log(`Total Covered Kurals: ${totalCoveredKurals} / ${allKurals.length}`);
  console.log(`  - Last Words: ${lastWordKuralsCount}`);
  console.log(`  - First Words: ${firstWordKuralsCount}`);
  console.log(`  - Kurals: ${kuralsCount}`);
  console.log(`  - Poruls: ${porulsCount}`);
  console.log(`Athikarams: ${athikarams.length} selected from ${totalUniqueAthikarams} available`);
  console.log(`Status: ${totalUniqueAthikarams >= MAX_QUESTIONS ? '✓ SUFFICIENT' : '⚠ INSUFFICIENT'}`);
  console.log(`================================\n`);

  return {
    lastWords,
    firstWords,
    kurals: kuralsPools,
    poruls: porulPools,
    athikarams,
  };
}
