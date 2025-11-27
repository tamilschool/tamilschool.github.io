import { useState, useEffect, useCallback } from 'react';

/**
 * Timer hook for practice and competition modes
 * Reference: old/.../practice/PracticeApp.kt timerHandler()
 * 
 * Practice mode: 240 seconds
 * Competition mode: 1200 seconds
 */
export interface UseTimerOptions {
  initialTime?: number;
  isLive?: boolean;
}

export interface UseTimerReturn {
  time: number;
  isLive: boolean;
  isPaused: boolean;
  isExpired: boolean;
  count: number;
  totalTime: number;
  start: () => void;
  pause: () => void;
  resume: () => void;
  reset: (newTime?: number) => void;
  toggle: () => void;
  incrementCount: () => void;
  decrementCount: () => void;
}

export function useTimer(options: UseTimerOptions = {}): UseTimerReturn {
  const { initialTime = 240, isLive: initialIsLive = false } = options;

  const [time, setTime] = useState(initialTime);
  const [isLive, setIsLive] = useState(initialIsLive);
  const [isPaused, setIsPaused] = useState(false);
  const [count, setCount] = useState(0);

  // Timer countdown effect
  useEffect(() => {
    if (!isLive || isPaused || time <= 0) {
      return;
    }

    const interval = setInterval(() => {
      setTime((t) => t - 1);
    }, 1000);

    // Cleanup on unmount or when dependencies change
    return () => clearInterval(interval);
  }, [isLive, isPaused, time]);

  const start = useCallback(() => {
    setIsLive(true);
    setIsPaused(false);
  }, []);

  const pause = useCallback(() => {
    setIsPaused(true);
  }, []);

  const resume = useCallback(() => {
    setIsPaused(false);
  }, []);

  const reset = useCallback(
    (newTime?: number) => {
      setTime(newTime ?? initialTime);
      setIsLive(false);
      setIsPaused(false);
      setCount(0);
    },
    [initialTime]
  );

  const toggle = useCallback(() => {
    if (isLive && time <= 0) {
      // Timer expired, reset on toggle
      reset();
    } else if (isLive && isPaused) {
      resume();
    } else if (isLive && !isPaused) {
      pause();
    } else {
      start();
    }
  }, [isLive, isPaused, time, start, pause, resume, reset]);

  const incrementCount = useCallback(() => {
    setCount((c) => c + 1);
  }, []);

  const decrementCount = useCallback(() => {
    setCount((c) => Math.max(0, c - 1));
  }, []);

  return {
    time,
    isLive,
    isPaused,
    isExpired: isLive && time <= 0,
    count,
    totalTime: initialTime,
    start,
    pause,
    resume,
    reset,
    toggle,
    incrementCount,
    decrementCount,
  };
}
