import { useState, useEffect, useCallback, useMemo } from 'react';
import type { Thirukkural, CQuestionState, ScoreState } from '@/types';
import { Group, Round, Topic, COMPETITION_TIMER_SECONDS } from '@/types';
import { fetchSource } from '@/lib/data/fetchSource';
import { parseSource } from '@/lib/data/parseSource';
import { useQuestionPool } from '@/hooks/useQuestionPool';
import Round2View from './Round2View';
import { useNavigate, useParams } from 'react-router-dom';

interface CompetitionAppProps {
  // Props for future extensions
}

export default function CompetitionApp({ }: CompetitionAppProps) {
  const { groupId } = useParams<{ groupId: string }>();
  const navigate = useNavigate();
  const [loaded, setLoaded] = useState(false);
  const [allKurals, setAllKurals] = useState<Thirukkural[]>([]);
  const [activeGroup, setActiveGroup] = useState<Group | null>(null);
  const [questionState, setQuestionState] = useState<CQuestionState | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Convert groupId string to Group enum
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

  // Load data on mount
  useEffect(() => {
    async function initializeData() {
      try {
        const sourceData = await fetchSource();
        const parsedData = parseSource(sourceData.thirukkuralData, sourceData.groupsData);
        setAllKurals(parsedData);
        setLoaded(true);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load data');
      }
    }

    initializeData();
  }, []);

  // Filter kurals by group and generate question pools
  const groupKurals = useMemo(() => {
    if (!selectedGroup || !allKurals.length) return [];
    return allKurals.filter((k) => k.group.includes(selectedGroup));
  }, [allKurals, selectedGroup]);

  // Generate question pools using the original algorithm
  const questionPools = useQuestionPool(groupKurals);

  // Create initial question state
  const createQuestionState = useCallback((group: Group): CQuestionState => {
    // Initial Score State
    const initialScoreState: ScoreState = {
      group1Score: { round1: {}, bonus: 0 },
      group23Score: {
        round1: {},
        round2: {
          [Topic.Athikaram]: new Set(),
          [Topic.Porul]: new Set(),
          [Topic.Kural]: new Set(),
          [Topic.FirstWord]: new Set(),
          [Topic.LastWord]: new Set(),
          [Topic.AllKurals]: new Set(),
        },
      },
    };

    return {
      selectedGroup: group,
      selectedRound: Round.II,
      selectedTopic: Topic.FirstWord,
      round2Kurals: groupKurals,
      athikaramState: { index: 0, targets: questionPools.athikarams },
      kuralState: { index: 0, targets: questionPools.kurals },
      porulState: { index: 0, targets: questionPools.poruls },
      firstWordState: { index: 0, targets: questionPools.firstWords },
      lastWordState: { index: 0, targets: questionPools.lastWords },
      timerState: {
        isLive: false,
        isPaused: false,
        time: COMPETITION_TIMER_SECONDS,
      },
      scoreState: initialScoreState,
    };
  }, [groupKurals, questionPools]);

  // Handle group selection
  const handleGroupSelect = useCallback((group: Group) => {
    const newQuestionState = createQuestionState(group);
    setQuestionState(newQuestionState);
    setActiveGroup(group);
  }, [createQuestionState]);

  // Initialize with selected group once loaded
  useEffect(() => {
    if (selectedGroup && loaded && allKurals.length > 0 && !activeGroup) {
      handleGroupSelect(selectedGroup);
    }
  }, [selectedGroup, loaded, allKurals, activeGroup, handleGroupSelect]);

  if (error) {
    return <div className="p-6 text-red-600">Error: {error}</div>;
  }

  if (!loaded || !activeGroup || !questionState) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <Round2View
      questionState={questionState}
      onQuestionStateChange={setQuestionState}
    />
  );
}
