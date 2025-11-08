import { useCallback, useMemo } from 'react';
import type { CQuestionState } from '@/types';
import {
  MAX_ANSWERS,
  Topic,
  TopicDisplay,
  KuralMeaning,
} from '@/types';
import type { Topic as TopicType, Thirukkural } from '@/types';
import { useTimer } from '@/hooks/useTimer';
import { TimerDisplay } from '@/components/TimerDisplay';
import { TopicSelector } from '@/components/practice/TopicSelector';
import { QuestionView } from '@/components/QuestionView';
import { CompetitionControls } from './CompetitionControls';
import QuestionNavigation from './QuestionNavigation';
import Round2ScoreCard from './Round2ScoreCard';

interface Round2ViewProps {
  questionState: CQuestionState;
  onQuestionStateChange: (state: CQuestionState) => void;
}

const COMPETITION_TIMER_SECONDS = 1201;

export default function Round2View({ questionState, onQuestionStateChange }: Round2ViewProps) {
  const selectedMeanings = useMemo(() => new Set([KuralMeaning.SalamanPapa]), []);
  const timer = useTimer({ initialTime: COMPETITION_TIMER_SECONDS, isLive: questionState.timerState.isLive });

  const currentTopic = questionState.selectedTopic;

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
      const nextState: CQuestionState = {
        ...questionState,
        selectedTopic: topic,
        timerState: {
          ...questionState.timerState,
          isLive: false,
          isPaused: false,
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

      timer.reset();
    //   setShowAnswer(false);
      onQuestionStateChange(nextState);
    },
    [questionState, onQuestionStateChange, timer]
  );

  const handleNavigate = useCallback(
    (index: number) => {
      updateTopicIndex(currentTopic, index);
    //   setShowAnswer(false);
    },
    [currentTopic, updateTopicIndex]
  );

  const handlePrevious = useCallback(() => {
    if (currentIndex > 0) {
      updateTopicIndex(currentTopic, currentIndex - 1);
    //   setShowAnswer(false);
    }
  }, [currentIndex, currentTopic, updateTopicIndex]);

  const handleNext = useCallback(() => {
    if (currentIndex < totalCount - 1) {
      updateTopicIndex(currentTopic, currentIndex + 1);
    //   setShowAnswer(false);
    }
  }, [currentIndex, currentTopic, totalCount, updateTopicIndex]);

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
    <div className="flex min-h-screen flex-col bg-gray-50 pb-6">
      <div className="flex-1 min-h-0 px-3 py-4">
        <div className="mx-auto flex h-full w-full max-w-6xl flex-col gap-4 lg:flex-row">
          <div className="flex-1 min-w-0 space-y-3 lg:max-w-3xl lg:space-y-4">
            <div className="mx-auto w-full rounded-xl bg-white p-3 shadow-sm lg:p-4">
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-[160px]">
                  <TopicSelector
                    selectedTopic={questionState.selectedTopic}
                    onTopicChange={handleSelectTopic}
                    includeAllKurals={false}
                  />
                </div>

                <CompetitionControls
                  currentIndex={currentIndex}
                  totalCount={totalCount}
                  answer={isAnswered ? true : false}
                  isMaxAnswered={isMaxAnswered}
                  onPrevious={handlePrevious}
                  onNext={handleNext}
                  onToggleAnswer={handleToggleAnswer}
                />

                <div className="flex items-center">
                  <TimerDisplay
                    time={timer.time}
                    isLive={timer.isLive}
                    isPaused={timer.isPaused}
                    totalTime={timer.totalTime}
                    onToggle={handleTimerToggle}
                    onReset={() => timer.reset()}
                  />
                </div>
              </div>
            </div>

            <div className="mx-auto w-full">
              <QuestionNavigation
                topicLabel={TopicDisplay[currentTopic]}
                totalCount={totalCount}
                currentIndex={currentIndex}
                onNavigate={handleNavigate}
                isAnswered={answeredPredicate}
              />
            </div>

            {timer.isLive ? (
              <QuestionView
                topic={currentTopic}
                selectedMeanings={selectedMeanings}
                showAnswer={true}
                currentQuestion={currentQuestion}
              />
            ) : (
              <div className="mx-auto w-full max-w-3xl overflow-hidden rounded-lg">
                <img
                  src="thiruvalluvar.jpg"
                  alt="Thiruvalluvar Statue at Kanyakumari"
                  className="h-128 w-full object-cover"
                />
              </div>
            )}
          </div>

          <aside className="w-full shrink-0 lg:w-80 lg:pt-1 lg:sticky lg:top-4 lg:ml-6">
            <Round2ScoreCard questionState={questionState} />
          </aside>
        </div>
      </div>
    </div>
  );
}
