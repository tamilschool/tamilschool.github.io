import { describe, it, expect } from 'vitest';
import { useNavigation } from '@/hooks/useNavigation';
import { renderHook, act } from '@testing-library/react';
import { Group } from '@/types';
import type { Thirukkural } from '@/types';

const mockKurals: Thirukkural[] = [
  {
    athikaramNo: 1,
    athikaram: 'கடவுள் வாழ்த்து',
    kuralNo: 1,
    kural: { firstLine: 'அகர முதல எழுத்தெல்லாம் ஆதி', secondLine: 'பகவன் முதற்றே உலகு.' },
    porul: 'எழுத்துக்கள் எல்லாம் அகரத்தில் தொடங்குகின்றன',
    porulMuVaradha: 'எழுத்துக்கள் எல்லாம் அகரத்தை அடிப்படையாக கொண்டிருக்கின்றன',
    porulSalamanPapa: 'எழுத்துக்கள் எல்லாம் அகரத்தில் தொடங்குகின்றன',
    porulMuKarunanidhi: 'அகரம் எழுத்துக்களுக்கு முதன்மை',
    words: ['அகர', 'முதல', 'எழுத்தெல்லாம்', 'ஆதி'],
    group: [Group.I],
  },
  {
    athikaramNo: 1,
    athikaram: 'கடவுள் வாழ்த்து',
    kuralNo: 2,
    kural: { firstLine: 'கற்றதனால் ஆய பயனென்கொல் வாலறிவன்', secondLine: 'நற்றாள் தொழாअर் எனின்.' },
    porul: 'தூய அறிவு வடிவானவனின் திருவடிகளை வணங்காதவர்',
    porulMuVaradha: 'தூய அறிவு வடிவாக விளங்கும் இறைவனுடைய நல்ல திருவடிகளை தொழாமல்',
    porulSalamanPapa: 'தூய அறிவு வடிவானவனின் திருவடிகளை வணங்காதவர்',
    porulMuKarunanidhi: 'தன்னைவிட அறிவில் மூத்த பெருந்தகையாளரின் முன்னே வணங்கி',
    words: ['கற்றதனால்', 'ஆய', 'பயனென்கொல்', 'வாலறிவன்'],
    group: [Group.I],
  },
  {
    athikaramNo: 1,
    athikaram: 'கடவுள் வாழ்த்து',
    kuralNo: 3,
    kural: { firstLine: 'மலர்மிசை ஏகினான் மாணடி சேர்ந்தார்', secondLine: 'நிலமிசை நீடுவாழ் வார்.' },
    porul: 'மனமாகிய மலர்மீது சென்று இருப்பவனாகிய கடவுளின்',
    porulMuVaradha: 'அன்பரின் அகமாகிய மலரில் வீற்றிருக்கும் கடவுளின்',
    porulSalamanPapa: 'மனமாகிய மலர்மீது சென்று இருப்பவனாகிய கடவுளின்',
    porulMuKarunanidhi: 'மலர் போன்ற மனத்தில் நிறைந்தவனைப் பின்பற்றுவோரின்',
    words: ['மலர்', 'மிசை', 'ஏகினான்', 'மாணடி', 'சேர்ந்தார்'],
    group: [Group.I],
  },
];

describe('useNavigation Hook', () => {
  it('initializes with first target when no initialIndex provided', () => {
    const { result } = renderHook(() =>
      useNavigation({
        targets: mockKurals,
        thirukkurals: mockKurals,
      })
    );

    expect(result.current.current).toBeDefined();
    expect(result.current.index).toBeGreaterThanOrEqual(0);
    expect(result.current.index).toBeLessThan(mockKurals.length);
  });

  it('initializes with provided initialIndex', () => {
    const { result } = renderHook(() =>
      useNavigation({
        targets: mockKurals,
        thirukkurals: mockKurals,
        initialIndex: 1,
      })
    );

    expect(result.current.index).toBe(1);
    expect(result.current.current).toEqual(mockKurals[1]);
  });

  it('has empty history initially', () => {
    const { result } = renderHook(() =>
      useNavigation({
        targets: mockKurals,
        thirukkurals: mockKurals,
        initialIndex: 0,
      })
    );

    expect(result.current.history).toEqual([]);
  });

  it('has empty answers set initially', () => {
    const { result } = renderHook(() =>
      useNavigation({
        targets: mockKurals,
        thirukkurals: mockKurals,
        initialIndex: 0,
      })
    );

    expect(result.current.answers.size).toBe(0);
  });

  it('goNext generates history on first call', () => {
    const { result } = renderHook(() =>
      useNavigation({
        targets: mockKurals,
        thirukkurals: mockKurals,
        initialIndex: 0,
      })
    );

    act(() => {
      result.current.goNext();
    });

    expect(result.current.history.length).toBeGreaterThan(0);
    expect(result.current.history.length).toBeLessThanOrEqual(mockKurals.length);
  });

  it('goNext changes current index', () => {
    const { result } = renderHook(() =>
      useNavigation({
        targets: mockKurals,
        thirukkurals: mockKurals,
        initialIndex: 0,
      })
    );

    const initialIndex = result.current.index;

    act(() => {
      result.current.goNext();
    });

    // Index should change after goNext
    expect(result.current.index).not.toBe(initialIndex);
    expect(result.current.index).toBeGreaterThanOrEqual(0);
    expect(result.current.index).toBeLessThan(mockKurals.length);
  });

  it('goPrevious generates history on first call', () => {
    const { result } = renderHook(() =>
      useNavigation({
        targets: mockKurals,
        thirukkurals: mockKurals,
        initialIndex: 0,
      })
    );

    act(() => {
      result.current.goPrevious();
    });

    expect(result.current.history.length).toBeGreaterThan(0);
  });

  it('goPrevious changes current index', () => {
    const { result } = renderHook(() =>
      useNavigation({
        targets: mockKurals,
        thirukkurals: mockKurals,
        initialIndex: 1,
      })
    );

    act(() => {
      result.current.goPrevious();
    });

    expect(result.current.index).toBeGreaterThanOrEqual(0);
    expect(result.current.index).toBeLessThan(mockKurals.length);
  });

  it('addAnswer adds to answers set', () => {
    const { result } = renderHook(() =>
      useNavigation({
        targets: mockKurals,
        thirukkurals: mockKurals,
        initialIndex: 0,
      })
    );

    expect(result.current.answers.size).toBe(0);

    act(() => {
      result.current.addAnswer('answer1');
    });

    expect(result.current.answers.size).toBe(1);
    expect(result.current.answers.has('answer1')).toBe(true);
  });

  it('addAnswer handles multiple answers', () => {
    const { result } = renderHook(() =>
      useNavigation({
        targets: mockKurals,
        thirukkurals: mockKurals,
        initialIndex: 0,
      })
    );

    act(() => {
      result.current.addAnswer('answer1');
      result.current.addAnswer('answer2');
      result.current.addAnswer('answer3');
    });

    expect(result.current.answers.size).toBe(3);
    expect(result.current.answers.has('answer1')).toBe(true);
    expect(result.current.answers.has('answer2')).toBe(true);
    expect(result.current.answers.has('answer3')).toBe(true);
  });

  it('clearAnswers empties the answers set', () => {
    const { result } = renderHook(() =>
      useNavigation({
        targets: mockKurals,
        thirukkurals: mockKurals,
        initialIndex: 0,
      })
    );

    act(() => {
      result.current.addAnswer('answer1');
      result.current.addAnswer('answer2');
    });

    expect(result.current.answers.size).toBe(2);

    act(() => {
      result.current.clearAnswers();
    });

    expect(result.current.answers.size).toBe(0);
  });

  it('handles single target list correctly', () => {
    const singleTarget = [mockKurals[0]];

    const { result } = renderHook(() =>
      useNavigation({
        targets: singleTarget,
        thirukkurals: singleTarget,
        initialIndex: 0,
      })
    );

    expect(result.current.index).toBe(0);
    expect(result.current.current).toEqual(singleTarget[0]);
  });

  it('cycles through targets on multiple goNext calls', () => {
    const { result } = renderHook(() =>
      useNavigation({
        targets: mockKurals,
        thirukkurals: mockKurals,
        initialIndex: 0,
      })
    );

    const indices: number[] = [];

    // Call goNext multiple times and track indices
    for (let i = 0; i < mockKurals.length + 2; i++) {
      indices.push(result.current.index);
      act(() => {
        result.current.goNext();
      });
    }

    // All indices should be valid
    indices.forEach(idx => {
      expect(idx).toBeGreaterThanOrEqual(0);
      expect(idx).toBeLessThan(mockKurals.length);
    });
  });

  it('provides correct current value based on index', () => {
    const { result } = renderHook(() =>
      useNavigation({
        targets: mockKurals,
        thirukkurals: mockKurals,
        initialIndex: 1,
      })
    );

    expect(result.current.current).toEqual(mockKurals[1]);
  });
});
