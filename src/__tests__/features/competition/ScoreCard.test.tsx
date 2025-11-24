import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import ScoreCard from '@/features/competition/ScoreCard';
import { Topic, Group, Round, CQuestionState, CTimerState, ScoreState } from '@/types';
import type { Thirukkural } from '@/types';

// Create mock question state
const createMockQuestionState = (scores: { [key in Topic]?: number }): CQuestionState => {
    const scoreState: ScoreState = {
        group1Score: {
            round1: {},
            bonus: 0,
        },
        group23Score: {
            round1: {},
            round2: {
                [Topic.FirstWord]: new Set(Array.from({ length: scores[Topic.FirstWord] || 0 }, (_, i) => i)),
                [Topic.Athikaram]: new Set(Array.from({ length: scores[Topic.Athikaram] || 0 }, (_, i) => i)),
                [Topic.Kural]: new Set(Array.from({ length: scores[Topic.Kural] || 0 }, (_, i) => i)),
                [Topic.Porul]: new Set(Array.from({ length: scores[Topic.Porul] || 0 }, (_, i) => i)),
                [Topic.LastWord]: new Set(Array.from({ length: scores[Topic.LastWord] || 0 }, (_, i) => i)),
                [Topic.AllKurals]: new Set(),
            },
        },
    };

    const timerState: CTimerState = {
        isLive: false,
        isPaused: false,
        time: 1200,
    };

    return {
        selectedGroup: Group.II,
        selectedRound: Round.II,
        selectedTopic: Topic.FirstWord,
        round2Kurals: [],
        athikaramState: { index: 0, targets: [] },
        kuralState: { index: 0, targets: [] },
        porulState: { index: 0, targets: [] },
        firstWordState: { index: 0, targets: [] },
        lastWordState: { index: 0, targets: [] },
        timerState,
        scoreState,
    };
};

describe('ScoreCard Component', () => {
    it('renders scorecard title', () => {
        const questionState = createMockQuestionState({});
        render(<ScoreCard questionState={questionState} />);

        expect(screen.getByText(/மதிப்பெண் அட்டை/i)).toBeInTheDocument();
    });

    it('displays all five topics', () => {
        const questionState = createMockQuestionState({});
        render(<ScoreCard questionState={questionState} />);

        expect(screen.getByText(/முதல் சொல்/i)).toBeInTheDocument();
        expect(screen.getByText(/அதிகாரம்/i)).toBeInTheDocument();
        expect(screen.getByText(/குறள்/i)).toBeInTheDocument();
        expect(screen.getByText(/பொருள்/i)).toBeInTheDocument();
        expect(screen.getByText(/கடைசி சொல்/i)).toBeInTheDocument();
    });

    it('displays zero scores initially', () => {
        const questionState = createMockQuestionState({});
        render(<ScoreCard questionState={questionState} />);

        const scoreTexts = screen.getAllByText(/0\/10/i);
        expect(scoreTexts.length).toBeGreaterThanOrEqual(5);
    });

    it('displays correct scores for each topic', () => {
        const questionState = createMockQuestionState({
            [Topic.FirstWord]: 3,
            [Topic.Athikaram]: 5,
            [Topic.Kural]: 7,
            [Topic.Porul]: 2,
            [Topic.LastWord]: 4,
        });
        render(<ScoreCard questionState={questionState} />);

        expect(screen.getByText('3/10')).toBeInTheDocument();
        expect(screen.getByText('5/10')).toBeInTheDocument();
        expect(screen.getByText('7/10')).toBeInTheDocument();
        expect(screen.getByText('2/10')).toBeInTheDocument();
        expect(screen.getByText('4/10')).toBeInTheDocument();
    });

    it('displays correct total score', () => {
        const questionState = createMockQuestionState({
            [Topic.FirstWord]: 3,
            [Topic.Athikaram]: 5,
            [Topic.Kural]: 7,
            [Topic.Porul]: 2,
            [Topic.LastWord]: 4,
        });
        render(<ScoreCard questionState={questionState} />);

        expect(screen.getByText(/மொத்தம்/i)).toBeInTheDocument();
        expect(screen.getByText('21')).toBeInTheDocument(); // 3+5+7+2+4 = 21
    });

    it('displays max score of 10 per topic', () => {
        const questionState = createMockQuestionState({
            [Topic.FirstWord]: 10,
        });
        render(<ScoreCard questionState={questionState} />);

        expect(screen.getByText('10/10')).toBeInTheDocument();
    });

    it('renders progress bars for each topic', () => {
        const questionState = createMockQuestionState({
            [Topic.FirstWord]: 5,
        });
        const { container } = render(<ScoreCard questionState={questionState} />);

        // Each topic should have 10 progress bar segments
        const progressBars = container.querySelectorAll('.h-3.flex-1.rounded-full');
        expect(progressBars.length).toBeGreaterThanOrEqual(50); // 5 topics × 10 segments
    });

    it('fills correct number of progress bars', () => {
        const questionState = createMockQuestionState({
            [Topic.FirstWord]: 3,
        });
        const { container } = render(<ScoreCard questionState={questionState} />);

        const filledBars = container.querySelectorAll('.bg-green-500');
        const emptyBars = container.querySelectorAll('.bg-slate-100');

        expect(filledBars.length).toBeGreaterThan(0);
        expect(emptyBars.length).toBeGreaterThan(0);
    });
});
