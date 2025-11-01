/**
 * Tokenizes Tamil text into words
 * Reference: old/.../practice/ReadSource.kt getWords()
 * 
 * Splits on specific Unicode characters:
 * - 32: Space
 * - 39: Apostrophe
 * - 44: Comma
 * - 46: Period
 * - 58: Colon
 * - 8204: Zero-width non-joiner
 */
export function getWords(line: string): string[] {
  const words: string[] = [];
  let currentWord = '';

  const separators = new Set([32, 39, 44, 46, 58, 8204]);

  for (const char of line) {
    const charCode = char.charCodeAt(0);

    if (separators.has(charCode)) {
      if (currentWord.trim().length > 0) {
        words.push(currentWord);
      }
      currentWord = '';
    } else {
      currentWord += char;
    }
  }

  // Add final word if exists
  if (currentWord.trim().length > 0) {
    words.push(currentWord);
  }

  return words;
}
