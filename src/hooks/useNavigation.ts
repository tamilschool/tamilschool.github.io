import { useState, useCallback } from 'react';
import type { Thirukkural } from '@/types';

/**
 * Navigation hook implementing HistoryState pattern with circular randomized navigation
 * Reference: old/.../data/DataClass.kt HistoryState interface
 * 
 * On first goNext(), generates shuffled list of all indices except current
 * Cycles through the list, providing randomized but non-duplicate navigation
 */
export interface UseNavigationOptions<T> {
  targets: T[];
  thirukkurals: Thirukkural[];
  initialIndex?: number;
}

export interface UseNavigationReturn<T> {
  index: number;
  current: T;
  history: number[];
  answers: Set<string>;
  goNext: () => number;
  goPrevious: () => void;
  clearAnswers: () => void;
  addAnswer: (answer: string) => void;
}

/**
 * Generates a randomized list of indices from 0 to maxIndex-1
 * Reference: old/.../data/DataClass.kt generateRandomList()
 */
function generateRandomList(maxIndex: number): number[] {
  const list: number[] = [];
  for (let i = 0; i < maxIndex; i++) {
    list.push(i);
  }
  // Shuffle using Fisher-Yates algorithm
  for (let i = list.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [list[i], list[j]] = [list[j], list[i]];
  }
  return list;
}

/**
 * Generates next random index that's different from current (for initialization)
 * Reference: old/.../data/DataClass.kt nextIndex()
 */
function nextIndex(currentIndex: number, maxIndex: number): number {
  if (maxIndex === 1) return 0;
  
  let newIndex: number;
  do {
    newIndex = Math.floor(Math.random() * maxIndex);
  } while (newIndex === currentIndex);
  
  console.log(`Current: ${currentIndex} to New: ${newIndex} of Total: ${maxIndex}`);
  return newIndex;
}

export function useNavigation<T>({
  targets,
  initialIndex,
}: UseNavigationOptions<T>): UseNavigationReturn<T> {
  const [index, setIndex] = useState(() => 
    initialIndex ?? nextIndex(0, targets.length)
  );
  const [history, setHistory] = useState<number[]>([]);
  const [answers, setAnswers] = useState<Set<string>>(new Set());

  const goNext = useCallback(() => {
    setHistory((currentHistory) => {
      let newHistory = [...currentHistory];
      
      // On first call, generate randomized history
      if (newHistory.length === 0) {
        newHistory = generateRandomList(targets.length);
        // Remove current index and add it to the end
        newHistory = newHistory.filter((i) => i !== index);
        newHistory.push(index);
      }

      // Cycle: take first, move to end
      const nextIdx = newHistory.shift()!;
      newHistory.push(nextIdx);

      console.log(`HistoryState: Current: ${index} to New: ${nextIdx} of Total: ${targets.length}`);
      setIndex(nextIdx);

      return newHistory;
    });

    return answers.size;
  }, [index, targets.length, answers.size]);

  const goPrevious = useCallback(() => {
    setHistory((currentHistory) => {
      let newHistory = [...currentHistory];

      // On first call, generate randomized history
      if (newHistory.length === 0) {
        newHistory = generateRandomList(targets.length);
        newHistory = newHistory.filter((i) => i !== index);
        newHistory.push(index);
      }

      // Reverse cycle: take last, move to front
      const prevIdx = newHistory.pop()!;
      newHistory.unshift(prevIdx);
      const nextIdx = newHistory[newHistory.length - 1];

      console.log(`HistoryState: Current: ${index} to New: ${nextIdx} of Total: ${targets.length}`);
      setIndex(nextIdx);

      return newHistory;
    });
  }, [index, targets.length]);

  const clearAnswers = useCallback(() => {
    setAnswers(new Set());
  }, []);

  const addAnswer = useCallback((answer: string) => {
    setAnswers((prev) => new Set(prev).add(answer));
  }, []);

  return {
    index,
    current: targets[index],
    history,
    answers,
    goNext,
    goPrevious,
    clearAnswers,
    addAnswer,
  };
}
