import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TopicSelector from '@/features/competition/TopicSelector';
import { Topic, Group, Round } from '@/types';
import type { CQuestionState, ScoreState } from '@/types';

const createMockQuestionState = (): CQuestionState => {
    const scoreState: ScoreState = {
        group1Score: { round1: {}, bonus: 0 },
        group23Score: {
            round1: {},
            round2: {
                [Topic.FirstWord]: new Set(['1', '2', '3']),
                [Topic.Athikaram]: new Set(['1', '2']),
                [Topic.Kural]: new Set(),
                [Topic.Porul]: new Set(['1']),
                [Topic.LastWord]: new Set(['1', '2', '3', '4']),
                [Topic.AllKurals]: new Set(),
            },
        },
    };

    return {
        selectedGroup: Group.II,
        selectedRound: Round.II,
        selectedTopic: Topic.FirstWord,
        round2Kurals: [],
        athikaramState: { index: 0, targets: Array(15).fill('') },
        kuralState: { index: 0, targets: Array(15).fill({}) },
        porulState: { index: 0, targets: Array(15).fill({}) },
        firstWordState: { index: 0, targets: Array(15).fill('') },
        lastWordState: { index: 0, targets: Array(15).fill('') },
        timerState: { isLive: true, isPaused: false, time: 1200 },
        scoreState,
    };
};

describe('TopicSelector Component', () => {
    it('renders all five topics', () => {
        const questionState = createMockQuestionState();
        render(<TopicSelector questionState={questionState} onSelectTopic={vi.fn()} />);

        expect(screen.getByText(/முதல் வார்த்தை/)).toBeInTheDocument();
        expect(screen.getByText(/கடைசி வார்த்தை/)).toBeInTheDocument();
        expect(screen.getByText(/குறள்/)).toBeInTheDocument();
        expect(screen.getByText(/பொருள்/)).toBeInTheDocument();
        expect(screen.getByText(/அதிகாரம்/)).toBeInTheDocument();
    });

    it('displays answer counts for each topic', () => {
        const questionState = createMockQuestionState();
        render(<TopicSelector questionState={questionState} onSelectTopic={vi.fn()} />);

        expect(screen.getByText('3/15')).toBeInTheDocument(); // FirstWord
        expect(screen.getByText('2/15')).toBeInTheDocument(); // Athikaram
        expect(screen.getByText('0/15')).toBeInTheDocument(); // Kural
        expect(screen.getByText('1/15')).toBeInTheDocument(); // Porul
        expect(screen.getByText('4/15')).toBeInTheDocument(); // LastWord
    });

    it('highlights selected topic', () => {
        const questionState = createMockQuestionState();
        questionState.selectedTopic = Topic.Kural;

        render(<TopicSelector questionState={questionState} onSelectTopic={vi.fn()} />);

        const kuralButton = screen.getByText(/குறள்/).closest('button');
        expect(kuralButton).toHaveClass('bg-blue-500');
    });

    it('calls onSelectTopic when topic clicked', async () => {
        const user = userEvent.setup();
        const onSelectTopic = vi.fn();
        const questionState = createMockQuestionState();

        render(<TopicSelector questionState={questionState} onSelectTopic={onSelectTopic} />);

        const kuralButton = screen.getByText(/குறள்/).closest('button');
        if (kuralButton) {
            await user.click(kuralButton);
            expect(onSelectTopic).toHaveBeenCalledWith(Topic.Kural);
        }
    });

    it('allows switching between topics', async () => {
        const user = userEvent.setup();
        const onSelectTopic = vi.fn();
        const questionState = createMockQuestionState();

        render(<TopicSelector questionState={questionState} onSelectTopic={onSelectTopic} />);

        await user.click(screen.getByText(/பொருள்/).closest('button')!);
        expect(onSelectTopic).toHaveBeenCalledWith(Topic.Porul);

        await user.click(screen.getByText(/அதிகாரம்/).closest('button')!);
        expect(onSelectTopic).toHaveBeenCalledWith(Topic.Athikaram);
    });
});
