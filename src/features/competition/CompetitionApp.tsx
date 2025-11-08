import { useState, useEffect, useCallback } from 'react';
import type { Thirukkural, Group, CQuestionState, CTimerState, ScoreState } from '@/types';
import { Round, Topic } from '@/types';
import { fetchSource } from '@/lib/data/fetchSource';
import { parseSource } from '@/lib/data/parseSource';
import { useQuestionPool } from '@/hooks/useQuestionPool';
import GroupSelection from './GroupSelection';
import Round2View from './Round2View';
import SignOutConfirm from './SignOutConfirm';

interface CompetitionAppProps {
  // Props for future extensions
}

export default function CompetitionApp({}: CompetitionAppProps) {
  const [loaded, setLoaded] = useState(false);
  const [allKurals, setAllKurals] = useState<Thirukkural[]>([]);
  const [activeGroup, setActiveGroup] = useState<Group | null>(null);
  const [questionState, setQuestionState] = useState<CQuestionState | null>(null);
  const [showSignOutConfirm, setShowSignOutConfirm] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  // Create question state for a group
  const createQuestionState = useCallback((group: Group): CQuestionState => {
    // Filter kurals by group
    const groupKurals = allKurals.filter(k => k.group.includes(group));
    console.log(`[Competition] Group ${group}: ${groupKurals.length} kurals`);

    // Generate question pools
    const pools = useQuestionPool(groupKurals);

    // Create athikaram state with proper formatting
    const athikarams = pools.athikarams;
    const athikaramState = {
      index: 0,
      targets: athikarams,
    };

    // Create kural state
    const kuralState = {
      index: 0,
      targets: pools.kurals,
    };

    // Create porul state
    const porulState = {
      index: 0,
      targets: pools.poruls,
    };

    // Create first word state
    const firstWordState = {
      index: 0,
      targets: pools.firstWords,
    };

    // Create last word state
    const lastWordState = {
      index: 0,
      targets: pools.lastWords,
    };

    // Create timer state
    const timerState: CTimerState = {
      isLive: false,
      isPaused: false,
      time: 1201, // 20 minutes + 1 second
    };

    // Create score state
    const scoreState: ScoreState = {
      group1Score: {
        round1: {},
        bonus: 0,
      },
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

    const cQuestionState: CQuestionState = {
      selectedGroup: group,
      selectedRound: Round.II,
      selectedTopic: Topic.FirstWord,
      round2Kurals: groupKurals,
      athikaramState: athikaramState as any,
      kuralState: kuralState as any,
      porulState: porulState as any,
      firstWordState: firstWordState as any,
      lastWordState: lastWordState as any,
      timerState,
      scoreState,
    };

    return cQuestionState;
  }, [allKurals]);

  // Handle group selection
  const handleGroupSelect = useCallback((group: Group) => {
    const newQuestionState = createQuestionState(group);
    setQuestionState(newQuestionState);
    setActiveGroup(group);
  }, [createQuestionState]);

  // Handle sign out
  const handleSignOut = useCallback(() => {
    setShowSignOutConfirm(true);
  }, []);

  // Confirm sign out
  const handleConfirmSignOut = useCallback(() => {
    setActiveGroup(null);
    setQuestionState(null);
    setShowSignOutConfirm(false);
  }, []);

  // Cancel sign out
  const handleCancelSignOut = useCallback(() => {
    setShowSignOutConfirm(false);
  }, []);

  if (error) {
    return <div className="p-6 text-red-600">Error: {error}</div>;
  }

  if (!loaded) {
    return <div className="p-6">Loading competition data...</div>;
  }

  if (showSignOutConfirm) {
    return (
      <SignOutConfirm
        onConfirm={handleConfirmSignOut}
        onCancel={handleCancelSignOut}
      />
    );
  }

  if (!activeGroup || !questionState) {
    return (
      <GroupSelection
        onSelectGroup={handleGroupSelect}
      />
    );
  }

  return (
    <div className="flex flex-col h-full">
      {questionState && (
        <Round2View
          questionState={questionState}
          onQuestionStateChange={setQuestionState}
          onSignOut={handleSignOut}
        />
      )}
    </div>
  );
}
