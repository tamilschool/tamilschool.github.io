import { describe, it, expect } from 'vitest';
import { useQuestionPool, MAX_QUESTIONS, QuestionPoolState } from '@/hooks/useQuestionPool';
import { Group } from '@/types';
import type { Thirukkural } from '@/types';

// Mock kural data for testing
const createMockKural = (
    kuralNo: number,
    athikaram: string,
    firstWord: string,
    lastWord: string
): Thirukkural => ({
    athikaramNo: Math.floor(kuralNo / 10) + 1,
    athikaram,
    kuralNo,
    kural: {
        firstLine: `${firstWord} முதல் வரி ${kuralNo}`,
        secondLine: `இரண்டாம் வரி ${lastWord}`,
    },
    porul: `பொருள் ${kuralNo}`,
    porulMuVaradha: `வரதராசனார் உரை ${kuralNo}`,
    porulSalamanPapa: `சாலமன் பாப்பையா உரை ${kuralNo}`,
    porulMuKarunanidhi: `கருணாநிதி உரை ${kuralNo}`,
    words: [firstWord, 'நடு', 'சொல்', lastWord],
    group: [Group.II],
});

// Create a set of mock kurals with varied words and athikarams
const createMockKurals = (count: number): Thirukkural[] => {
    const kurals: Thirukkural[] = [];
    const firstWords = ['அகர', 'கற்ற', 'மலர்', 'வான்', 'நீர்', 'அறம்', 'அன்பு', 'இன்பம்'];
    const lastWords = ['உலகு', 'வாழ்வார்', 'நீடு', 'சேர்ந்தார்', 'வரும்', 'தரும்', 'பெரும்', 'இரும்'];
    const athikarams = [
        'கடவுள் வாழ்த்து',
        'வான் சிறப்பு',
        'நீத்தார் பெருமை',
        'அறன் வலியுறுத்தல்',
        'இல்வாழ்க்கை',
    ];

    for (let i = 0; i < count; i++) {
        kurals.push(
            createMockKural(
                i + 1,
                athikarams[i % athikarams.length],
                firstWords[i % firstWords.length],
                lastWords[i % lastWords.length]
            )
        );
    }

    return kurals;
};

describe('useQuestionPool Hook', () => {
    it('generates pools with correct structure', () => {
        const kurals = createMockKurals(100);
        const pools = useQuestionPool(kurals);

        expect(pools).toHaveProperty('lastWords');
        expect(pools).toHaveProperty('firstWords');
        expect(pools).toHaveProperty('kurals');
        expect(pools).toHaveProperty('poruls');
        expect(pools).toHaveProperty('athikarams');
    });

    it('generates up to MAX_QUESTIONS for each pool', () => {
        const kurals = createMockKurals(100);
        const pools = useQuestionPool(kurals);

        expect(pools.lastWords.length).toBeLessThanOrEqual(MAX_QUESTIONS);
        expect(pools.firstWords.length).toBeLessThanOrEqual(MAX_QUESTIONS);
        expect(pools.kurals.length).toBeLessThanOrEqual(MAX_QUESTIONS);
        expect(pools.poruls.length).toBeLessThanOrEqual(MAX_QUESTIONS);
        expect(pools.athikarams.length).toBeLessThanOrEqual(MAX_QUESTIONS);
    });

    it('extracts distinct last words', () => {
        const kurals = createMockKurals(50);
        const pools = useQuestionPool(kurals);

        const uniqueLastWords = new Set(pools.lastWords);
        expect(uniqueLastWords.size).toBe(pools.lastWords.length);
    });

    it('extracts distinct first words', () => {
        const kurals = createMockKurals(50);
        const pools = useQuestionPool(kurals);

        const uniqueFirstWords = new Set(pools.firstWords);
        expect(uniqueFirstWords.size).toBe(pools.firstWords.length);
    });

    it('extracts distinct athikarams', () => {
        const kurals = createMockKurals(50);
        const pools = useQuestionPool(kurals);

        const uniqueAthikarams = new Set(pools.athikarams);
        expect(uniqueAthikarams.size).toBe(pools.athikarams.length);
    });

    it('handles small kural sets correctly', () => {
        const kurals = createMockKurals(10);
        const pools = useQuestionPool(kurals);

        // With only 10 kurals, some pools may be smaller
        expect(pools.lastWords.length).toBeGreaterThan(0);
        expect(pools.firstWords.length).toBeGreaterThan(0);
        expect(pools.kurals.length).toBeGreaterThan(0);
        expect(pools.poruls.length).toBeGreaterThan(0);
        expect(pools.athikarams.length).toBeGreaterThan(0);
    });

    it('handles large kural sets correctly', () => {
        const kurals = createMockKurals(200);
        const pools = useQuestionPool(kurals);

        // With 200 kurals, should be able to generate full pools
        expect(pools.lastWords.length).toBe(MAX_QUESTIONS);
        expect(pools.firstWords.length).toBe(MAX_QUESTIONS);
        expect(pools.kurals.length).toBe(MAX_QUESTIONS);
        expect(pools.poruls.length).toBe(MAX_QUESTIONS);
        expect(pools.athikarams.length).toBeGreaterThan(0);
    });

    it('generates different pools on multiple runs (randomization)', () => {
        const kurals = createMockKurals(100);

        const pools1 = useQuestionPool(kurals);
        const pools2 = useQuestionPool(kurals);

        // Due to randomization, at least some pools should be different
        // Check if at least one of the pools differs
        const kuralsDiffer = JSON.stringify(pools1.kurals) !== JSON.stringify(pools2.kurals);
        const porulsDiffer = JSON.stringify(pools1.poruls) !== JSON.stringify(pools2.poruls);
        const lastWordsDiffer = JSON.stringify(pools1.lastWords) !== JSON.stringify(pools2.lastWords);
        const firstWordsDiffer = JSON.stringify(pools1.firstWords) !== JSON.stringify(pools2.firstWords);

        const hasRandomization = kuralsDiffer || porulsDiffer || lastWordsDiffer || firstWordsDiffer;
        expect(hasRandomization).toBe(true);
    });

    it('returns valid kural objects in kurals pool', () => {
        const kurals = createMockKurals(50);
        const pools = useQuestionPool(kurals);

        pools.kurals.forEach((kural) => {
            expect(kural).toHaveProperty('kuralNo');
            expect(kural).toHaveProperty('athikaram');
            expect(kural).toHaveProperty('kural');
            expect(kural).toHaveProperty('porul');
            expect(kural).toHaveProperty('words');
            expect(Array.isArray(kural.words)).toBe(true);
        });
    });

    it('returns valid kural objects in poruls pool', () => {
        const kurals = createMockKurals(50);
        const pools = useQuestionPool(kurals);

        pools.poruls.forEach((kural) => {
            expect(kural).toHaveProperty('kuralNo');
            expect(kural).toHaveProperty('porul');
            expect(kural.porul).toBeTruthy();
        });
    });

    it('returns string arrays for word pools', () => {
        const kurals = createMockKurals(50);
        const pools = useQuestionPool(kurals);

        pools.lastWords.forEach((word) => {
            expect(typeof word).toBe('string');
            expect(word.length).toBeGreaterThan(0);
        });

        pools.firstWords.forEach((word) => {
            expect(typeof word).toBe('string');
            expect(word.length).toBeGreaterThan(0);
        });
    });

    it('returns string array for athikarams pool', () => {
        const kurals = createMockKurals(50);
        const pools = useQuestionPool(kurals);

        pools.athikarams.forEach((athikaram) => {
            expect(typeof athikaram).toBe('string');
            expect(athikaram.length).toBeGreaterThan(0);
        });
    });

    it('handles edge case with minimum kurals', () => {
        const kurals = createMockKurals(1);
        const pools = useQuestionPool(kurals);

        // With 1 kural, should still generate pools (may be very small)
        expect(pools.lastWords.length).toBeGreaterThanOrEqual(0);
        expect(pools.firstWords.length).toBeGreaterThanOrEqual(0);
        expect(pools.kurals.length).toBeGreaterThanOrEqual(0);
        expect(pools.poruls.length).toBeGreaterThanOrEqual(0);
        expect(pools.athikarams.length).toBeGreaterThanOrEqual(0);
    });

    it('ensures kurals are not reused across different pools', () => {
        const kurals = createMockKurals(100);
        const pools = useQuestionPool(kurals);

        // Get all kural numbers from kurals and poruls pools
        const kuralNumbers = new Set(pools.kurals.map((k) => k.kuralNo));
        const porulNumbers = new Set(pools.poruls.map((k) => k.kuralNo));

        // Check for overlap - ideally should be minimal or none
        const overlap = Array.from(kuralNumbers).filter((num) => porulNumbers.has(num));

        // Due to sequential extraction, there should be no overlap
        expect(overlap.length).toBe(0);
    });
});
