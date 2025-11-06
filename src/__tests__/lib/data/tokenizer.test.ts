import { describe, it, expect } from 'vitest';
import { getWords } from '@/lib/data/tokenizer';

describe('getWords Tokenizer Utility', () => {
  it('splits on spaces', () => {
    const result = getWords('word1 word2 word3');
    expect(result).toEqual(['word1', 'word2', 'word3']);
  });

  it('splits on commas', () => {
    const result = getWords('word1,word2,word3');
    expect(result).toEqual(['word1', 'word2', 'word3']);
  });

  it('splits on periods', () => {
    const result = getWords('word1.word2.word3');
    expect(result).toEqual(['word1', 'word2', 'word3']);
  });

  it('splits on colons', () => {
    const result = getWords('word1:word2:word3');
    expect(result).toEqual(['word1', 'word2', 'word3']);
  });

  it('splits on apostrophes', () => {
    const result = getWords("word1'word2'word3");
    expect(result).toEqual(['word1', 'word2', 'word3']);
  });

  it('handles multiple separator types', () => {
    const result = getWords('word1, word2. word3: word4');
    expect(result).toEqual(['word1', 'word2', 'word3', 'word4']);
  });

  it('handles Tamil text', () => {
    const result = getWords('அகரமுதல எழுக्षरम्');
    expect(result.length).toBe(2);
    expect(result[0]).toContain('அகரமுதல');
  });

  it('handles mixed Tamil and English', () => {
    const result = getWords('அகரமுதல word2 எழுक्षरम्');
    expect(result).toEqual(['அகரமுதல', 'word2', 'எழுक्षरम्']);
  });

  it('ignores leading/trailing whitespace', () => {
    const result = getWords('  word1  word2  ');
    expect(result).toEqual(['word1', 'word2']);
  });

  it('handles empty string', () => {
    const result = getWords('');
    expect(result).toEqual([]);
  });

  it('handles string with only separators', () => {
    const result = getWords(',. : \'');
    expect(result).toEqual([]);
  });

  it('handles consecutive separators', () => {
    const result = getWords('word1,,,word2');
    expect(result).toEqual(['word1', 'word2']);
  });

  it('returns empty array for whitespace only', () => {
    const result = getWords('   ');
    expect(result).toEqual([]);
  });

  it('handles zero-width non-joiner character', () => {
    // Zero-width non-joiner (U+200C)
    const text = 'word1\u200Cword2';
    const result = getWords(text);
    expect(result).toEqual(['word1', 'word2']);
  });

  it('preserves word boundaries correctly', () => {
    const result = getWords('அகரமுதல, எழुक्षरम्. आदि भगवान्');
    expect(result.length).toBe(4);
    expect(result[0]).toContain('அகரமுதல');
    expect(result[2]).toContain('आदि');
  });

  it('handles single word', () => {
    const result = getWords('word');
    expect(result).toEqual(['word']);
  });

  it('handles Unicode Tamil characters', () => {
    const result = getWords('ஆ இ உ ஊ ஏ');
    expect(result).toEqual(['ஆ', 'இ', 'உ', 'ஊ', 'ஏ']);
  });

  it('handles complex Tamil text from Thirukkural', () => {
    const result = getWords('அகரமுதல எழுக्षरम् सर्वे आदि भगवान् सर्वे');
    expect(result.length).toBeGreaterThan(0);
    expect(result).toContain('அகரமுதல');
  });

  it('filters empty words after trimming', () => {
    const result = getWords('word1,  , word2');
    expect(result).toEqual(['word1', 'word2']);
  });

  it('returns consistent results for same input', () => {
    const text = 'word1, word2. word3';
    const result1 = getWords(text);
    const result2 = getWords(text);
    expect(result1).toEqual(result2);
  });

  it('handles real Thirukkural couplet', () => {
    // Real example from Thirukkural
    const result = getWords('அகரமுதல எழுक्षरम् सर्वे, आदि भगवान् सर्वे.');
    expect(result.length).toBeGreaterThan(0);
    expect(Array.isArray(result)).toBe(true);
  });

  it('does not include pure whitespace as words', () => {
    const result = getWords('word1   word2');
    expect(result).not.toContain('');
    expect(result).not.toContain('   ');
  });
});
