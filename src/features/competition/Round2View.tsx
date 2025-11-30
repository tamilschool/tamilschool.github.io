import { useCallback, useMemo, useState } from 'react';
import type { CQuestionState } from '@/types';
import {
  MAX_ANSWERS,
  Topic,
  TopicDisplay,
  KuralMeaning,
  COMPETITION_TIMER_SECONDS,
  GroupDisplay,
} from '@/types';
import type { Topic as TopicType, Thirukkural, KuralMeaning as KuralMeaningType } from '@/types';
import { useTimer } from '@/hooks/useTimer';
import { TimerDisplay } from '@/components/TimerDisplay';
import { TopicSelector } from '@/components/shared/TopicSelector';
import { ScholarSelector } from '@/components/shared/ScholarSelector';
import { QuestionView } from '@/components/QuestionView';
import { CompetitionControls } from './CompetitionControls';
import QuestionNavigation from './QuestionNavigation';
import ScoreCard from './ScoreCard';
import CompactScoreCard from './CompactScoreCard';
import { trackTimerStart, trackTopicChange, trackNavigation, trackEvent } from '@/lib/analytics';

interface Round2ViewProps {
  questionState: CQuestionState;
  onQuestionStateChange: (state: CQuestionState) => void;
}

export default function Round2View({ questionState, onQuestionStateChange }: Round2ViewProps) {
  const [selectedMeanings, setSelectedMeanings] = useState<Set<KuralMeaningType>>(
    new Set([KuralMeaning.SalamanPapa])
  );
  const timer = useTimer({ initialTime: COMPETITION_TIMER_SECONDS, isLive: questionState.timerState.isLive });

  const currentTopic = questionState.selectedTopic;
  const showScholarSelection = timer.isLive && (currentTopic === Topic.Porul || currentTopic === Topic.Kural);

  const handleMeaningToggle = useCallback((meaning: KuralMeaningType) => {
    setSelectedMeanings((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(meaning)) {
        newSet.delete(meaning);
      } else {
        newSet.add(meaning);
      }
      return newSet;
    });
  }, []);

  const getCurrentIndex = useCallback(
    (topic: Topic): number => {
      switch (topic) {
        case Topic.FirstWord:
          return questionState.firstWordState.index;
        case Topic.LastWord:
          return questionState.lastWordState.index;
        case Topic.Kural:
          return questionState.kuralState.index;
        case Topic.Porul:
          return questionState.porulState.index;
        case Topic.Athikaram:
          return questionState.athikaramState.index;
        default:
          return 0;
      }
    },
    [questionState]
  );

  const getTargets = useCallback(
    (topic: Topic): Array<string | Thirukkural> => {
      switch (topic) {
        case Topic.FirstWord:
          return questionState.firstWordState.targets;
        case Topic.LastWord:
          return questionState.lastWordState.targets;
        case Topic.Kural:
          return questionState.kuralState.targets;
        case Topic.Porul:
          return questionState.porulState.targets;
        case Topic.Athikaram:
          return questionState.athikaramState.targets;
        default:
          return [];
      }
    },
    [questionState]
  );

  const updateTopicIndex = useCallback(
    (topic: Topic, index: number) => {
      const nextState: CQuestionState = {
        ...questionState,
        firstWordState:
          topic === Topic.FirstWord
            ? { ...questionState.firstWordState, index }
            : questionState.firstWordState,
        lastWordState:
          topic === Topic.LastWord
            ? { ...questionState.lastWordState, index }
            : questionState.lastWordState,
        kuralState:
          topic === Topic.Kural ? { ...questionState.kuralState, index } : questionState.kuralState,
        porulState:
          topic === Topic.Porul ? { ...questionState.porulState, index } : questionState.porulState,
        athikaramState:
          topic === Topic.Athikaram
            ? { ...questionState.athikaramState, index }
            : questionState.athikaramState,
      };

      onQuestionStateChange(nextState);
    },
    [questionState, onQuestionStateChange]
  );

  const getQuestionKey = useCallback(
    (topic: Topic, index: number): string => {
      switch (topic) {
        case Topic.FirstWord: {
          const word = questionState.firstWordState.targets[index];
          return word ? `FW:${word}` : `FW:${index}`;
        }
        case Topic.LastWord: {
          const word = questionState.lastWordState.targets[index];
          return word ? `LW:${word}` : `LW:${index}`;
        }
        case Topic.Kural: {
          const kural = questionState.kuralState.targets[index];
          return kural ? `K:${kural.kuralNo}` : `K:${index}`;
        }
        case Topic.Porul: {
          const porul = questionState.porulState.targets[index];
          return porul ? `P:${porul.kuralNo}` : `P:${index}`;
        }
        case Topic.Athikaram: {
          const athikaram = questionState.athikaramState.targets[index];
          return athikaram ? `A:${athikaram}` : `A:${index}`;
        }
        default:
          return `${topic}:${index}`;
      }
    },
    [questionState]
  );

  const currentIndex = getCurrentIndex(currentTopic);
  const targets = getTargets(currentTopic);
  const totalCount = targets.length;
  const answeredSet = questionState.scoreState.group23Score.round2[currentTopic];
  const answeredCount = answeredSet?.size ?? 0;
  const currentKey = totalCount > 0 ? getQuestionKey(currentTopic, currentIndex) : '';
  const isAnswered = currentKey ? answeredSet?.has(currentKey) ?? false : false;
  const isMaxAnswered = !isAnswered && answeredCount >= MAX_ANSWERS;

  const currentQuestion = useMemo(() => {
    if (!totalCount) return undefined;

    switch (currentTopic) {
      case Topic.FirstWord: {
        const word = questionState.firstWordState.targets[currentIndex];
        if (!word) return undefined;
        const answers = questionState.round2Kurals.filter((kural) => kural.words[0] === word);
        return { word, answers };
      }
      case Topic.LastWord: {
        const word = questionState.lastWordState.targets[currentIndex];
        if (!word) return undefined;
        const answers = questionState.round2Kurals.filter(
          (kural) => kural.words[kural.words.length - 1] === word
        );
        return { word, answers };
      }
      case Topic.Kural: {
        const kural = questionState.kuralState.targets[currentIndex];
        return kural ? { kural } : undefined;
      }
      case Topic.Porul: {
        const kural = questionState.porulState.targets[currentIndex];
        return kural ? { kural } : undefined;
      }
      case Topic.Athikaram: {
        const athikaram = questionState.athikaramState.targets[currentIndex];
        if (!athikaram) return undefined;
        const answers = questionState.round2Kurals.filter((kural) => kural.athikaram === athikaram);
        return { athikaram, answers };
      }
      default:
        return undefined;
    }
  }, [currentTopic, currentIndex, questionState, totalCount]);

  const handleSelectTopic = useCallback(
    (topic: TopicType) => {
      // Track topic change
      trackTopicChange(topic, questionState.selectedGroup ? GroupDisplay[questionState.selectedGroup].english : '');
      
      // Pause timer and reset to current time (effectively stopping the round but keeping time)
      timer.reset(timer.time);

      const nextState: CQuestionState = {
        ...questionState,
        selectedTopic: topic,
        timerState: {
          ...questionState.timerState,
          isLive: false,
          time: timer.time,
        },
      };

      switch (topic) {
        case Topic.FirstWord:
          nextState.firstWordState = { ...questionState.firstWordState, index: 0 };
          break;
        case Topic.LastWord:
          nextState.lastWordState = { ...questionState.lastWordState, index: 0 };
          break;
        case Topic.Kural:
          nextState.kuralState = { ...questionState.kuralState, index: 0 };
          break;
        case Topic.Porul:
          nextState.porulState = { ...questionState.porulState, index: 0 };
          break;
        case Topic.Athikaram:
          nextState.athikaramState = { ...questionState.athikaramState, index: 0 };
          break;
        default:
          break;
      }

      //   setShowAnswer(false);
      onQuestionStateChange(nextState);
    },
    [questionState, onQuestionStateChange, timer]
  );

  const handleNavigate = useCallback(
    (index: number) => {
      if (!timer.isLive || timer.isPaused || timer.isExpired) return;
      updateTopicIndex(currentTopic, index);
      //   setShowAnswer(false);
    },
    [currentTopic, updateTopicIndex, timer.isLive, timer.isPaused, timer.isExpired]
  );

  const handlePrevious = useCallback(() => {
    if (!timer.isLive || timer.isPaused || timer.isExpired) return;
    if (currentIndex > 0) {
      trackNavigation('previous', currentTopic);
      updateTopicIndex(currentTopic, currentIndex - 1);
      //   setShowAnswer(false);
    }
  }, [currentIndex, currentTopic, updateTopicIndex, timer.isLive, timer.isPaused, timer.isExpired]);

  const handleNext = useCallback(() => {
    if (!timer.isLive || timer.isPaused || timer.isExpired) return;
    if (currentIndex < totalCount - 1) {
      trackNavigation('next', currentTopic);
      updateTopicIndex(currentTopic, currentIndex + 1);
      //   setShowAnswer(false);
    }
  }, [currentIndex, currentTopic, totalCount, updateTopicIndex, timer.isLive, timer.isPaused, timer.isExpired]);

  const handleTimerToggle = useCallback(() => {
    let nextTimerState = { ...questionState.timerState };

    if (timer.isExpired) {
      timer.reset();
      nextTimerState = {
        isLive: false,
        isPaused: false,
        time: COMPETITION_TIMER_SECONDS,
      };
    } else if (timer.isLive && timer.isPaused) {
      timer.resume();
      nextTimerState = {
        ...nextTimerState,
        isLive: true,
        isPaused: false,
      };
    } else if (timer.isLive && !timer.isPaused) {
      timer.pause();
      nextTimerState = {
        ...nextTimerState,
        isLive: true,
        isPaused: true,
      };
    } else {
      // Timer starting - track it
      trackTimerStart(currentTopic, questionState.selectedGroup ? GroupDisplay[questionState.selectedGroup].english : '');
      timer.start();
      nextTimerState = {
        isLive: true,
        isPaused: false,
        time: COMPETITION_TIMER_SECONDS,
      };
    }

    onQuestionStateChange({
      ...questionState,
      timerState: nextTimerState,
    });
  }, [questionState, onQuestionStateChange, timer]);

  const handleToggleAnswer = useCallback(
    (value: boolean) => {
      if (totalCount === 0 || isMaxAnswered) return;

      const key = getQuestionKey(currentTopic, currentIndex);
      const answered = questionState.scoreState.group23Score.round2[currentTopic];

      // Track the score action
      trackEvent('competition_score_toggle', {
        topic: currentTopic,
        action: value ? 'correct' : 'incorrect',
        question_index: currentIndex,
        group: questionState.selectedGroup ? GroupDisplay[questionState.selectedGroup].english : '',
      });

      const updatedSet = new Set(answered);
      if (value) {
        updatedSet.add(key);
      } else {
        updatedSet.delete(key);
      }

      const nextState: CQuestionState = {
        ...questionState,
        scoreState: {
          ...questionState.scoreState,
          group23Score: {
            ...questionState.scoreState.group23Score,
            round2: {
              ...questionState.scoreState.group23Score.round2,
              [currentTopic]: updatedSet,
            },
          },
        },
      };

      onQuestionStateChange(nextState);
    },
    [currentTopic, currentIndex, getQuestionKey, isMaxAnswered, questionState, onQuestionStateChange, totalCount]
  );

  const answeredPredicate = useCallback(
    (index: number) => {
      const key = getQuestionKey(currentTopic, index);
      return questionState.scoreState.group23Score.round2[currentTopic]?.has(key) ?? false;
    },
    [currentTopic, getQuestionKey, questionState]
  );

  return (
    <div className="flex h-full flex-col bg-gray-50 overflow-hidden">
      <div className="flex-1 min-h-0 px-3 py-4">
        <div className="mx-auto flex h-full w-full max-w-6xl flex-col gap-4 lg:flex-row">
          <div className="flex-1 min-w-0 flex flex-col gap-3 lg:max-w-3xl lg:gap-4 h-full">
            {/* Desktop controls - hidden on mobile */}
            <div className="mx-auto w-full max-w-3xl rounded-xl bg-white p-3 shadow-sm lg:p-4 hidden md:block">
              <div className="flex flex-wrap items-stretch gap-3 lg:gap-4">
                {/* Topic selector - grows on both mobile and desktop */}
                <div className="flex-1 min-w-[140px] order-1">
                  <TopicSelector
                    selectedTopic={questionState.selectedTopic}
                    onTopicChange={handleSelectTopic}
                    includeAllKurals={false}
                    disabled={timer.isExpired}
                  />
                </div>

                {/* Timer - mobile/tablet only, grows to fill space */}
                <div className="flex-1 min-w-[100px] xl:hidden order-2">
                  <TimerDisplay
                    time={timer.time}
                    isLive={timer.isLive}
                    isPaused={timer.isPaused}
                    totalTime={timer.totalTime}
                    isCompetition={true}
                    onToggle={handleTimerToggle}
                    onReset={() => timer.reset()}
                  />
                </div>

                {/* Navigation controls - full width on mobile/tablet, grows on desktop */}
                <div className="w-full xl:w-auto xl:flex-[2] order-3 xl:order-2">
                  <CompetitionControls
                    currentIndex={currentIndex}
                    totalCount={totalCount}
                    answer={isAnswered ? true : false}
                    isMaxAnswered={isMaxAnswered}
                    isTimerLive={timer.isLive}
                    isTimerPaused={timer.isPaused}
                    isTimerExpired={timer.isExpired}
                    onPrevious={handlePrevious}
                    onNext={handleNext}
                    onToggleAnswer={handleToggleAnswer}
                  />
                </div>

                {/* Timer - large desktop only, grows to fill space */}
                <div className="hidden xl:flex flex-1 min-w-[100px] order-4">
                  <TimerDisplay
                    time={timer.time}
                    isLive={timer.isLive}
                    isPaused={timer.isPaused}
                    totalTime={timer.totalTime}
                    isCompetition={true}
                    onToggle={handleTimerToggle}
                    onReset={() => timer.reset()}
                  />
                </div>
              </div>
              {showScholarSelection && (
                <div className="mt-2 border-t border-slate-100 pt-3">
                  <ScholarSelector
                    selectedMeanings={selectedMeanings}
                    onMeaningToggle={handleMeaningToggle}
                  />
                </div>
              )}
            </div>

            {/* Desktop question navigation - hidden on mobile */}
            <div className="mx-auto w-full max-w-3xl hidden md:block">
              <QuestionNavigation
                topicLabel={TopicDisplay[currentTopic]}
                totalCount={totalCount}
                currentIndex={currentIndex}
                onNavigate={handleNavigate}
                isAnswered={answeredPredicate}
                disabled={!timer.isLive || timer.isPaused || timer.isExpired}
              />
            </div>

            {/* Compact scorecard for small screens - shows below navigation */}
            <div className="mx-auto w-full max-w-3xl lg:hidden">
              <CompactScoreCard questionState={questionState} />
            </div>

            {timer.isLive && !timer.isPaused ? (
              <QuestionView
                topic={currentTopic}
                selectedMeanings={selectedMeanings}
                showAnswer={true}
                currentQuestion={currentQuestion}
              />
            ) : (
              <div className="mx-auto w-full max-w-3xl overflow-hidden rounded-lg">
                <img
                  src={`${import.meta.env.BASE_URL}thiruvalluvar.jpg`}
                  alt="Thiruvalluvar Statue at Kanyakumari"
                  className="h-128 w-full object-cover"
                />
              </div>
            )}
          </div>

          {/* Full scorecard sidebar - only visible on large screens */}
          <aside className="hidden lg:block w-80 shrink-0 pt-1 sticky top-4 ml-6">
            <ScoreCard questionState={questionState} />
          </aside>
        </div>
      </div>

      {/* Mobile bottom bar - part of flex layout, not fixed */}
      <div className="shrink-0 border-t border-slate-200 bg-white px-3 py-3 pb-[calc(env(safe-area-inset-bottom)+0.75rem)] md:hidden">
        <div className="mx-auto flex w-full max-w-4xl flex-col gap-2">
          {showScholarSelection && (
            <div className="w-full">
              <ScholarSelector
                selectedMeanings={selectedMeanings}
                onMeaningToggle={handleMeaningToggle}
              />
            </div>
          )}

            <div className="mx-auto w-full max-w-3xl md:block">
              <QuestionNavigation
                topicLabel={TopicDisplay[currentTopic]}
                totalCount={totalCount}
                currentIndex={currentIndex}
                onNavigate={handleNavigate}
                isAnswered={answeredPredicate}
                disabled={!timer.isLive || timer.isPaused || timer.isExpired}
                compact
              />
            </div>

          <div className="flex items-center gap-2">
            <div className="flex-1">
              <TopicSelector
                selectedTopic={questionState.selectedTopic}
                onTopicChange={handleSelectTopic}
                includeAllKurals={false}
                disabled={timer.isExpired}
              />
            </div>
            <div className="flex-1">
              <TimerDisplay
                time={timer.time}
                isLive={timer.isLive}
                isPaused={timer.isPaused}
                totalTime={timer.totalTime}
                isCompetition={true}
                onToggle={handleTimerToggle}
                onReset={() => timer.reset()}
              />
            </div>
          </div>

          <div className="w-full">
            <CompetitionControls
              currentIndex={currentIndex}
              totalCount={totalCount}
              answer={isAnswered ? true : false}
              isMaxAnswered={isMaxAnswered}
              isTimerLive={timer.isLive}
              isTimerPaused={timer.isPaused}
              isTimerExpired={timer.isExpired}
              onPrevious={handlePrevious}
              onNext={handleNext}
              onToggleAnswer={handleToggleAnswer}
            />
          </div>

        </div>
      </div>
    </div>
  );
}
