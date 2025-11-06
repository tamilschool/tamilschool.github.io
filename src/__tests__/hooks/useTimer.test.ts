import { describe, it, expect } from 'vitest';
import { useTimer } from '@/hooks/useTimer';
import { renderHook, act } from '@testing-library/react';

describe('useTimer Hook', () => {
  it('initializes with correct time', () => {
    const { result } = renderHook(() => useTimer({ initialTime: 120, isLive: false }));

    expect(result.current.time).toBe(120);
    expect(result.current.isLive).toBe(false);
    expect(result.current.isPaused).toBe(false);
    expect(result.current.totalTime).toBe(120);
  });

  it('starts timer', () => {
    const { result } = renderHook(() => useTimer({ initialTime: 10, isLive: false }));

    act(() => {
      result.current.start();
    });

    expect(result.current.isLive).toBe(true);
  });

  it('pauses and resumes timer', () => {
    const { result } = renderHook(() => useTimer({ initialTime: 10, isLive: false }));

    act(() => {
      result.current.start();
    });

    expect(result.current.isLive).toBe(true);

    act(() => {
      result.current.pause();
    });

    expect(result.current.isPaused).toBe(true);

    act(() => {
      result.current.resume();
    });

    expect(result.current.isPaused).toBe(false);
  });

  it('resets timer to initial time', () => {
    const { result } = renderHook(() => useTimer({ initialTime: 120, isLive: false }));

    act(() => {
      result.current.reset();
    });

    expect(result.current.time).toBe(120);
    expect(result.current.isLive).toBe(false);
  });

  it('increments count when incrementCount is called', () => {
    const { result } = renderHook(() => useTimer({ initialTime: 120, isLive: false }));

    expect(result.current.count).toBe(0);

    act(() => {
      result.current.incrementCount();
    });

    expect(result.current.count).toBe(1);

    act(() => {
      result.current.incrementCount();
    });

    expect(result.current.count).toBe(2);
  });

  it('has correct initial properties', () => {
    const { result } = renderHook(() => useTimer({ initialTime: 240, isLive: false }));

    expect(result.current).toHaveProperty('time');
    expect(result.current).toHaveProperty('isLive');
    expect(result.current).toHaveProperty('isPaused');
    expect(result.current).toHaveProperty('totalTime');
    expect(result.current).toHaveProperty('count');
    expect(result.current).toHaveProperty('start');
    expect(result.current).toHaveProperty('pause');
    expect(result.current).toHaveProperty('resume');
    expect(result.current).toHaveProperty('reset');
    expect(result.current).toHaveProperty('incrementCount');
  });
});
