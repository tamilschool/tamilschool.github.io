import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchSource } from '@/lib/data/fetchSource';
import { parseSource } from '@/lib/data/parseSource';
import { useTimer } from '@/hooks/useTimer';
import { useNavigation } from '@/hooks/useNavigation';
import { TimerDisplay } from '@/components/TimerDisplay';
import { QuestionView } from '@/components/QuestionView';
import { KuralDisplay } from '@/components/KuralDisplay';
import { TopicSelector } from '@/components/shared/TopicSelector';
import { ScholarSelector } from '@/components/shared/ScholarSelector';
import { NavigationControls } from './NavigationControls';
import { Group, Topic, KuralMeaning } from '@/types';
import type {
  Thirukkural,
  Topic as TopicType,
  KuralMeaning as KuralMeaningType,
} from '@/types';

export function PracticeApp() {
  const { groupId } = useParams<{ groupId: string }>();
  const navigate = useNavigate();
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [allKurals, setAllKurals] = useState<Thirukkural[]>([]);

  // Convert groupId string to number
  const selectedGroup = useMemo(() => {
    if (!groupId) return null;
    // Check if groupId matches any Group value
    return Object.values(Group).includes(groupId as Group) ? (groupId as Group) : null;
  }, [groupId]);

  // Redirect if invalid group
  useEffect(() => {
    if (!selectedGroup) {
      navigate('/');
    }
  }, [selectedGroup, navigate]);

  // User selections
  const [selectedTopic, setSelectedTopic] = useState<TopicType>(Topic.FirstWord);
  const [selectedMeanings, setSelectedMeanings] = useState<Set<KuralMeaningType>>(
    new Set([KuralMeaning.SalamanPapa])
  );
  const [showAnswer, setShowAnswer] = useState(false);

  // Derived data based on selected group
  const [currentKurals, setCurrentKurals] = useState<Thirukkural[]>([]);
  const [athikarams, setAthikarams] = useState<string[]>([]);
  const [firstWords, setFirstWords] = useState<string[]>([]);
  const [lastWords, setLastWords] = useState<string[]>([]);

  // Timer - 240 seconds for practice mode
  const timer = useTimer({ initialTime: 240, isLive: false });

  // Navigation state managers for different topics
  const athikaramNav = useNavigation({
    targets: athikarams,
    thirukkurals: currentKurals,
    initialIndex: 0,
  });

  const kuralNav = useNavigation({
    targets: currentKurals,
    thirukkurals: currentKurals,
    initialIndex: 0,
  });

  const firstWordNav = useNavigation({
    targets: firstWords,
    thirukkurals: currentKurals,
    initialIndex: 0,
  });

  const lastWordNav = useNavigation({
    targets: lastWords,
    thirukkurals: currentKurals,
    initialIndex: 0,
  });

  // Load data on mount
  useEffect(() => {
    async function loadData() {
      try {
        const { thirukkuralData, groupsData } = await fetchSource();
        const parsedKurals = parseSource(thirukkuralData, groupsData);
        setAllKurals(parsedKurals);
        setLoaded(true);
      } catch (err) {
        console.error('Failed to load data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load data');
      }
    }
    loadData();
  }, []);

  // Update current kurals and derived data when group changes
  useEffect(() => {
    if (!loaded || allKurals.length === 0 || !selectedGroup) return;

    const filteredKurals = allKurals.filter((k) => k.group.includes(selectedGroup));
    setCurrentKurals(filteredKurals);

    // Extract unique athikarams
    const uniqueAthikarams = Array.from(new Set(filteredKurals.map((k) => k.athikaram))).sort();
    setAthikarams(uniqueAthikarams);

    // Extract unique first words
    const uniqueFirstWords = Array.from(
      new Set(filteredKurals.map((k) => k.words[0]).filter(Boolean))
    ).sort();
    setFirstWords(uniqueFirstWords);

    // Extract unique last words
    const uniqueLastWords = Array.from(
      new Set(filteredKurals.map((k) => k.words[k.words.length - 1]).filter(Boolean))
    ).sort();
    setLastWords(uniqueLastWords);
  }, [loaded, selectedGroup, allKurals]);

  const resetTimer = (startLive: boolean) => {
    timer.reset();
    setShowAnswer(false);
    athikaramNav.clearAnswers();
    kuralNav.clearAnswers();
    firstWordNav.clearAnswers();
    lastWordNav.clearAnswers();
    if (startLive) {
      timer.start();
    }
  };

  // Handle topic change
  const handleTopicChange = (topic: TopicType) => {
    if (topic !== selectedTopic) {
      setSelectedTopic(topic);
      setShowAnswer(false);
      resetTimer(false);
    }
  };

  // Handle meaning toggle
  const handleMeaningToggle = (meaning: KuralMeaningType) => {
    const newSet = new Set(selectedMeanings);
    if (newSet.has(meaning)) {
      newSet.delete(meaning);
    } else {
      newSet.add(meaning);
    }
    setSelectedMeanings(newSet);
  };

  const handleTimerClick = () => {
    if (timer.isLive && timer.time <= 0) {
      resetTimer(true);
    } else if (timer.isLive && timer.isPaused) {
      timer.resume();
    } else if (timer.isLive && !timer.isPaused) {
      timer.pause();
    } else {
      timer.start();
    }
  };

  const handleNext = () => {
    setShowAnswer(false);

    switch (selectedTopic) {
      case Topic.Athikaram:
        athikaramNav.goNext();
        timer.incrementCount();
        break;
      case Topic.Porul:
      case Topic.Kural:
        kuralNav.goNext();
        timer.incrementCount();
        break;
      case Topic.FirstWord:
        firstWordNav.goNext();
        timer.incrementCount();
        break;
      case Topic.LastWord:
        lastWordNav.goNext();
        timer.incrementCount();
        break;
      case Topic.AllKurals:
        break;
    }
  };

  const handlePrevious = () => {
    setShowAnswer(false);

    switch (selectedTopic) {
      case Topic.Athikaram:
        athikaramNav.goPrevious();
        break;
      case Topic.Porul:
      case Topic.Kural:
        kuralNav.goPrevious();
        break;
      case Topic.FirstWord:
        firstWordNav.goPrevious();
        break;
      case Topic.LastWord:
        lastWordNav.goPrevious();
        break;
      case Topic.AllKurals:
        break;
    }
  };

  const getCurrentQuestion = () => {
    switch (selectedTopic) {
      case Topic.Athikaram: {
        const currentAthikaram = athikaramNav.current;
        const kuralsForAthikaram = currentKurals.filter((k) => k.athikaram === currentAthikaram);
        return {
          athikaram: currentAthikaram,
          answers: kuralsForAthikaram,
        };
      }
      case Topic.FirstWord: {
        const currentWord = firstWordNav.current;
        const kuralsForWord = currentKurals.filter((k) => k.words[0] === currentWord);
        return {
          word: currentWord,
          answers: kuralsForWord,
        };
      }
      case Topic.LastWord: {
        const currentWord = lastWordNav.current;
        const kuralsForWord = currentKurals.filter(
          (k) => k.words[k.words.length - 1] === currentWord
        );
        return {
          word: currentWord,
          answers: kuralsForWord,
        };
      }
      case Topic.Porul:
      case Topic.Kural: {
        const currentKural = kuralNav.current;
        return {
          kural: currentKural,
        };
      }
      case Topic.AllKurals:
        return undefined;
    }
  };

  const totalsByTopic: Record<TopicType, number> = {
    [Topic.Athikaram]: athikarams.length,
    [Topic.Porul]: currentKurals.length,
    [Topic.Kural]: currentKurals.length,
    [Topic.FirstWord]: firstWords.length,
    [Topic.LastWord]: lastWords.length,
    [Topic.AllKurals]: currentKurals.length,
  };

  const totalForTopic = totalsByTopic[selectedTopic] ?? 0;
  const leftCount = timer.count;
  const rightCount = Math.max(totalForTopic - leftCount - 1, 0);
  const showTimerControls = selectedTopic !== Topic.AllKurals;
  const showScholarSelection =
    (timer.isLive && (selectedTopic === Topic.Porul || selectedTopic === Topic.Kural)) ||
    selectedTopic === Topic.AllKurals;

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center text-destructive">
          <h1 className="mb-4 text-2xl font-bold">Error</h1>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!loaded || !selectedGroup) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="mb-4 text-2xl font-bold">Loading திருக்குறள் பயிற்சி...</h1>
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto" />
        </div>
      </div>
    );
  }

  return (
    <div className='flex flex-col h-full'>
      <div className="flex flex-1 flex-col bg-gray-50 overflow-hidden min-h-0">
        <div className="flex-1 min-h-0 px-3 py-3 overflow-hidden">
          <div className="mx-auto flex h-full w-full max-w-5xl flex-col min-h-0">
            <div className="mb-4 hidden flex-col items-center gap-2 md:flex shrink-0">
              <div className="mx-auto flex w-full max-w-3xl items-stretch gap-3">
                <div className="flex-1">
                  <TopicSelector selectedTopic={selectedTopic} onTopicChange={handleTopicChange} />
                </div>
                {showTimerControls && (
                  <div className="flex flex-1 items-center justify-center">
                    <TimerDisplay
                      time={timer.time}
                      isLive={timer.isLive}
                      isPaused={timer.isPaused}
                      totalTime={timer.totalTime}
                      onToggle={handleTimerClick}
                      onReset={() => resetTimer(true)}
                    />
                  </div>
                )}
              </div>

              {showTimerControls && (
                <div className="mx-auto w-full max-w-3xl">
                  <NavigationControls
                    isLive={timer.isLive && timer.time > 0}
                    onPrevious={handlePrevious}
                    onNext={handleNext}
                    onShowAnswer={() => setShowAnswer(!showAnswer)}
                    leftCount={leftCount}
                    rightCount={rightCount}
                  />
                </div>
              )}

              {showScholarSelection && (
                <div className="mx-auto w-full max-w-3xl">
                  <ScholarSelector
                    selectedMeanings={selectedMeanings}
                    onMeaningToggle={handleMeaningToggle}
                  />
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0 flex flex-col min-h-0">
              {!timer.isLive && selectedTopic !== Topic.AllKurals ? (
                <div className="mx-auto w-full max-w-3xl overflow-hidden rounded-lg">
                  <img
                    src={`${import.meta.env.BASE_URL}thiruvalluvar.jpg`}
                    alt="Thiruvalluvar Statue at Kanyakumari"
                    className="h-128 w-full object-cover"
                  />
                </div>
              ) : selectedTopic === Topic.AllKurals ? (
                <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-2 overflow-y-auto pr-1 min-h-0">
                  {currentKurals.map((kural, idx) => (
                    <KuralDisplay
                      key={kural.kuralNo}
                      thirukkural={kural}
                      selectedMeanings={selectedMeanings}
                      variant="default"
                      index={idx + 1}
                    />
                  ))}
                </div>
              ) : (
                <QuestionView
                  topic={selectedTopic}
                  selectedMeanings={selectedMeanings}
                  showAnswer={showAnswer}
                  currentQuestion={getCurrentQuestion()}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile bottom bar - part of flex layout, not fixed */}
      <div className="shrink-0 border-t border-slate-200 bg-gray-50 px-3 py-3 pb-[calc(env(safe-area-inset-bottom)+0.75rem)] md:hidden">
        <div className="mx-auto flex w-full max-w-4xl flex-col gap-2">
          {showScholarSelection && (
            <div className="w-full">
              <ScholarSelector
                selectedMeanings={selectedMeanings}
                onMeaningToggle={handleMeaningToggle}
              />
            </div>
          )}

          <div className="flex items-center gap-2">
            <div className="flex-1">
              <TopicSelector selectedTopic={selectedTopic} onTopicChange={handleTopicChange} />
            </div>
            {showTimerControls && (
              <div className="flex flex-1 items-center justify-center">
                <TimerDisplay
                  time={timer.time}
                  isLive={timer.isLive}
                  isPaused={timer.isPaused}
                  totalTime={timer.totalTime}
                  onToggle={handleTimerClick}
                  onReset={() => resetTimer(true)}
                />
              </div>
            )}
          </div>

          {showTimerControls && (
            <div className="w-full">
              <NavigationControls
                isLive={timer.isLive && timer.time > 0}
                onPrevious={handlePrevious}
                onNext={handleNext}
                onShowAnswer={() => setShowAnswer(!showAnswer)}
                leftCount={leftCount}
                rightCount={rightCount}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
