import type { Thirukkural } from '@/types';

const MAX_QUESTIONS = 15;

/**
 * Analyzes the worst-case scenario for question pool generation
 * This simulates selecting the most common words/topics to maximize kural consumption
 */
export function analyzeQuestionPoolCoverage(kurals: Thirukkural[], groupName: string) {
    console.log(`\n╔════════════════════════════════════════════════════════════╗`);
    console.log(`║  WORST-CASE QUESTION POOL ANALYSIS - ${groupName.padEnd(20)} ║`);
    console.log(`╚════════════════════════════════════════════════════════════╝`);
    console.log(`Total Kurals: ${kurals.length}\n`);

    let remainingKurals = [...kurals];
    let totalConsumed = 0;

    // Helper to create frequency map
    function getWordFrequencyMap(kurals: Thirukkural[], getWord: (k: Thirukkural) => string): Map<string, number> {
        const freqMap = new Map<string, number>();
        for (const kural of kurals) {
            const word = getWord(kural);
            freqMap.set(word, (freqMap.get(word) || 0) + 1);
        }
        return freqMap;
    }

    // Round 1: Last Words (worst case - select 15 most common last words)
    const lastWordFreq = getWordFrequencyMap(remainingKurals, k => k.words[k.words.length - 1]);
    const topLastWords = Array.from(lastWordFreq.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, MAX_QUESTIONS);

    const lastWordsConsumed = topLastWords.reduce((sum, [_, count]) => sum + count, 0);
    const selectedLastWords = topLastWords.map(([word]) => word);
    remainingKurals = remainingKurals.filter(k => !selectedLastWords.includes(k.words[k.words.length - 1]));
    totalConsumed += lastWordsConsumed;

    console.log(`1️⃣  LAST WORDS ROUND (Worst Case):`);
    console.log(`   Selected: 15 most common last words`);
    console.log(`   Kurals Consumed: ${lastWordsConsumed}`);
    console.log(`   Remaining: ${remainingKurals.length}`);

    // Round 2: First Words (worst case - select 15 most common first words from remaining)
    const firstWordFreq = getWordFrequencyMap(remainingKurals, k => k.words[0]);
    const topFirstWords = Array.from(firstWordFreq.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, MAX_QUESTIONS);

    const firstWordsConsumed = topFirstWords.reduce((sum, [_, count]) => sum + count, 0);
    const selectedFirstWords = topFirstWords.map(([word]) => word);
    remainingKurals = remainingKurals.filter(k => !selectedFirstWords.includes(k.words[0]));
    totalConsumed += firstWordsConsumed;

    console.log(`\n2️⃣  FIRST WORDS ROUND (Worst Case):`);
    console.log(`   Selected: 15 most common first words`);
    console.log(`   Kurals Consumed: ${firstWordsConsumed}`);
    console.log(`   Remaining: ${remainingKurals.length}`);

    // Round 3: Kural Round (15 random kurals)
    const kuralsConsumed = Math.min(MAX_QUESTIONS, remainingKurals.length);
    remainingKurals = remainingKurals.slice(kuralsConsumed);
    totalConsumed += kuralsConsumed;

    console.log(`\n3️⃣  KURAL ROUND:`);
    console.log(`   Kurals Consumed: ${kuralsConsumed}`);
    console.log(`   Remaining: ${remainingKurals.length}`);

    // Round 4: Porul/Meaning Round (15 random kurals)
    const porulConsumed = Math.min(MAX_QUESTIONS, remainingKurals.length);
    remainingKurals = remainingKurals.slice(porulConsumed);
    totalConsumed += porulConsumed;

    console.log(`\n4️⃣  PORUL/MEANING ROUND:`);
    console.log(`   Kurals Consumed: ${porulConsumed}`);
    console.log(`   Remaining: ${remainingKurals.length}`);

    // Round 5: Athikaram Analysis
    const uniqueAthikarams = new Set(remainingKurals.map(k => k.athikaram));
    const athikaramCount = uniqueAthikarams.size;

    console.log(`\n5️⃣  ATHIKARAM ROUND:`);
    console.log(`   Unique Athikarams Available: ${athikaramCount}`);
    console.log(`   Required: ${MAX_QUESTIONS}`);

    // Final Summary
    const coveragePercent = ((totalConsumed / kurals.length) * 100).toFixed(1);
    const isSufficient = athikaramCount >= MAX_QUESTIONS;

    console.log(`\n${'='.repeat(60)}`);
    console.log(`SUMMARY:`);
    console.log(`  Total Kurals: ${kurals.length}`);
    console.log(`  Maximum Consumed: ${totalConsumed} (${coveragePercent}%)`);
    console.log(`  Breakdown:`);
    console.log(`    • Last Words:  ${lastWordsConsumed.toString().padStart(3)} kurals`);
    console.log(`    • First Words: ${firstWordsConsumed.toString().padStart(3)} kurals`);
    console.log(`    • Kural Round: ${kuralsConsumed.toString().padStart(3)} kurals`);
    console.log(`    • Porul Round: ${porulConsumed.toString().padStart(3)} kurals`);
    console.log(`  Remaining Kurals: ${remainingKurals.length}`);
    console.log(`  Unique Athikarams: ${athikaramCount} / ${MAX_QUESTIONS} needed`);
    console.log(`\n  STATUS: ${isSufficient ? '✅ SUFFICIENT - No issues' : '❌ INSUFFICIENT - Will run out!'}`);
    console.log(`${'='.repeat(60)}\n`);

    return {
        totalKurals: kurals.length,
        consumed: totalConsumed,
        remaining: remainingKurals.length,
        uniqueAthikarams: athikaramCount,
        isSufficient
    };
}
