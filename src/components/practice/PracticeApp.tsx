import { useState, useEffect } from 'react';
import { fetchSource } from '@/lib/data/fetchSource';
import { parseSource } from '@/lib/data/parseSource';
import { useTimer } from '@/hooks/useTimer';
import { useNavigation } from '@/hooks/useNavigation';
import { TimerDisplay } from '@/components/TimerDisplay';
import { QuestionView } from '@/components/QuestionView';
import { KuralDisplay } from '@/components/KuralDisplay';
import { GroupSelector } from './GroupSelector';
import { TopicSelector } from './TopicSelector';
import { ScholarSelector } from './ScholarSelector';
import { NavigationControls } from './NavigationControls';
import { Group, Topic, KuralMeaning } from '@/types';
import type { Thirukkural, Group as GroupType, Topic as TopicType, KuralMeaning as KuralMeaningType } from '@/types';

export interface PracticeAppProps {
  onSwitchMode?: () => void;
}

export function PracticeApp({ }: PracticeAppProps) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [allKurals, setAllKurals] = useState<Thirukkural[]>([]);

  // User selections
  const [selectedGroup, setSelectedGroup] = useState<GroupType>(Group.II);
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

        console.log('✓ Practice Mode: Data loaded successfully');
        console.log(`Total kurals: ${parsedKurals.length}`);

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
    if (!loaded || allKurals.length === 0) return;

    const filteredKurals = allKurals.filter(k => k.group.includes(selectedGroup));
    setCurrentKurals(filteredKurals);

    // Extract unique athikarams
    const uniqueAthikarams = Array.from(
      new Set(filteredKurals.map(k => k.athikaram))
    ).sort();
    setAthikarams(uniqueAthikarams);

    // Extract unique first words
    const uniqueFirstWords = Array.from(
      new Set(filteredKurals.map(k => k.words[0]).filter(Boolean))
    ).sort();
    setFirstWords(uniqueFirstWords);

    // Extract unique last words
    const uniqueLastWords = Array.from(
      new Set(filteredKurals.map(k => k.words[k.words.length - 1]).filter(Boolean))
    ).sort();
    setLastWords(uniqueLastWords);

    console.log(`Group ${selectedGroup}:`, {
      kurals: filteredKurals.length,
      athikarams: uniqueAthikarams.length,
      firstWords: uniqueFirstWords.length,
      lastWords: uniqueLastWords.length,
    });
  }, [loaded, selectedGroup, allKurals]);

  // Handle group change
  const handleGroupChange = (group: GroupType) => {
    if (group !== selectedGroup) {
      setSelectedGroup(group);
      setShowAnswer(false);
      resetTimer(false);
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

  // Timer handlers
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

  const handleTimerClick = () => {
    if (timer.isLive && timer.time <= 0) {
      // Restart
      resetTimer(true);
    } else if (timer.isLive && timer.isPaused) {
      // Resume
      timer.resume();
    } else if (timer.isLive && !timer.isPaused) {
      // Pause
      timer.pause();
    } else {
      // Start
      timer.start();
    }
  };

  // Navigation handlers
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
        // AllKurals shows all kurals, no navigation
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
        // AllKurals shows all kurals, no navigation
        break;
    }
  };

  // Get current question data based on topic
  const getCurrentQuestion = () => {
    switch (selectedTopic) {
      case Topic.Athikaram: {
        const currentAthikaram = athikaramNav.current;
        const kuralsForAthikaram = currentKurals.filter(k => k.athikaram === currentAthikaram);
        return {
          athikaram: currentAthikaram,
          answers: kuralsForAthikaram,
        };
      }
      case Topic.FirstWord: {
        const currentWord = firstWordNav.current;
        const kuralsForWord = currentKurals.filter(k => k.words[0] === currentWord);
        return {
          word: currentWord,
          answers: kuralsForWord,
        };
      }
      case Topic.LastWord: {
        const currentWord = lastWordNav.current;
        const kuralsForWord = currentKurals.filter(k => k.words[k.words.length - 1] === currentWord);
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
        // AllKurals shows all kurals
        return undefined;
    }
  };

  // Group counts for display
  const groupCounts: Record<GroupType, number> = {
    [Group.I]: allKurals.filter(k => k.group.includes(Group.I)).length,
    [Group.II]: allKurals.filter(k => k.group.includes(Group.II)).length,
    [Group.III]: allKurals.filter(k => k.group.includes(Group.III)).length,
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

  if (!loaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Loading திருக்குறள் பயிற்சி...</h1>
          <p className="text-muted-foreground">Fetching data from GitHub</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center text-destructive">
          <h1 className="text-2xl font-bold mb-4">Error</h1>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50 pb-[calc(env(safe-area-inset-bottom)+7.5rem)] md:pb-6">
      {/* Light Blue Header */}
      <div className="bg-blue-100 py-4 px-3 mb-0">
        <h1 className="text-xl font-extrabold text-blue-800 text-center">திருக்குறள் பயிற்சி</h1>
      </div>

      {/* Control Panel */}
      <div className="px-3 py-3">
        {/* Group and Topic Selectors */}
        <div className="hidden md:flex gap-3 mb-3 h-12">
          <div className="flex-1 h-full">
            <GroupSelector
              selectedGroup={selectedGroup}
              groupCounts={groupCounts}
              onGroupChange={handleGroupChange}
            />
          </div>
          <div className="flex-1 h-full">
            <TopicSelector
              selectedTopic={selectedTopic}
              onTopicChange={handleTopicChange}
            />
          </div>
        </div>

        {/* Timer and Navigation (desktop) */}
        {selectedTopic !== Topic.AllKurals && (
          <div className="hidden md:flex items-center gap-2 mb-3">
            <div className="flex-shrink-0">
              <div className="flex w-full justify-center">
                <TimerDisplay
                  time={timer.time}
                  isLive={timer.isLive}
                  isPaused={timer.isPaused}
                  totalTime={timer.totalTime}
                  onToggle={handleTimerClick}
                  onReset={() => resetTimer(true)}
                />
              </div>
            </div>

            <div className="flex-1">
              <NavigationControls
                isLive={timer.isLive && timer.time > 0}
                onPrevious={handlePrevious}
                onNext={handleNext}
                onShowAnswer={() => setShowAnswer(!showAnswer)}
                leftCount={leftCount}
                rightCount={rightCount}
              />
            </div>
          </div>
        )}

        {/* Scholar Meanings Selection - Only show for Porul and AllKurals topics when timer is live */}
        {(timer.isLive && (selectedTopic === Topic.Porul || selectedTopic === Topic.Kural) || selectedTopic === Topic.AllKurals) && (
          <div className="mb-3">
            <ScholarSelector
              selectedMeanings={selectedMeanings}
              onMeaningToggle={handleMeaningToggle}
            />
          </div>
        )}

        {/* Question Display */}
        {!timer.isLive && selectedTopic !== Topic.AllKurals ? (
          <div className="mb-3 rounded-lg overflow-hidden">
            <img
              src="thiruvalluvar.jpg"
              alt="Thiruvalluvar Statue at Kanyakumari"
              className="w-full h-64 object-cover"
            />
          </div>
        ) : selectedTopic === Topic.AllKurals ? (
          <div className="space-y-2">
            {currentKurals.map(kural => (
              <KuralDisplay
                key={kural.kuralNo}
                thirukkural={kural}
                selectedMeanings={selectedMeanings}
                variant="default"
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

      <div className="md:hidden fixed bottom-0 left-0 right-0 z-30 border-t border-slate-200 bg-gray-50/95 px-3 py-3 pb-[calc(env(safe-area-inset-bottom)+0.75rem)] backdrop-blur">
        <div className="mx-auto flex w-full max-w-4xl flex-col gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <div className="order-1 flex-1 min-w-[140px]">
              <GroupSelector
                selectedGroup={selectedGroup}
                groupCounts={groupCounts}
                onGroupChange={handleGroupChange}
              />
            </div>
            {showTimerControls && (
              <div className="order-2 flex items-center justify-center flex-none min-w-[116px]">
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
            <div className={`${showTimerControls ? 'order-3' : 'order-2'} flex-1 min-w-[160px]`}>
              <TopicSelector
                selectedTopic={selectedTopic}
                onTopicChange={handleTopicChange}
              />
            </div>
          </div>

          {showTimerControls && (
            <div className="order-4 w-full">
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
    </>
  );
}