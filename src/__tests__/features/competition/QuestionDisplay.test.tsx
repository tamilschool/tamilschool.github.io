import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import QuestionDisplay from '@/features/competition/QuestionDisplay';
import { Topic, Group, Round, CQuestionState, CTimerState, ScoreState } from '@/types';

const createMockQuestionState = (topic: Topic): CQuestionState => {
    const scoreState: ScoreState = {
        group1Score: { round1: {}, bonus: 0 },
        group23Score: {
            round1: {},
            round2: {
                [Topic.FirstWord]: new Set(),
                [Topic.Athikaram]: new Set(),
                [Topic.Kural]: new Set(),
                [Topic.Porul]: new Set(),
                [Topic.LastWord]: new Set(),
                [Topic.AllKurals]: new Set(),
            },
        },
    };

    return {
        selectedGroup: Group.II,
        selectedRound: Round.II,
        selectedTopic: topic,
        round2Kurals: [],
        athikaramState: { index: 0, targets: ['கடவுள் வாழ்த்து'] },
        kuralState: { index: 0, targets: [{ kural: { firstLine: 'அகர முதல', secondLine: 'பகவன் முதற்றே' } } as any] },
        porulState: { index: 0, targets: [{ porul: 'எழுத்துக்கள் எல்லாம்' } as any] },
        firstWordState: { index: 0, targets: ['அகர'] },
        lastWordState: { index: 0, targets: ['உலகு'] },
        timerState: { isLive: true, isPaused: false, time: 1200 },
        scoreState,
    };
};

describe('QuestionDisplay Component', () => {
    it('renders question for FirstWord topic', () => {
        const questionState = createMockQuestionState(Topic.FirstWord);
        render(<QuestionDisplay questionState={questionState} onToggleAnswer={vi.fn()} />);

        expect(screen.getByText('அகர')).toBeInTheDocument();
    });

    it('renders question for LastWord topic', () => {
        const questionState = createMockQuestionState(Topic.LastWord);
        render(<QuestionDisplay questionState={questionState} onToggleAnswer={vi.fn()} />);

        expect(screen.getByText('உலகு')).toBeInTheDocument();
    });

    it('renders question for Athikaram topic', () => {
        const questionState = createMockQuestionState(Topic.Athikaram);
        render(<QuestionDisplay questionState={questionState} onToggleAnswer={vi.fn()} />);

        expect(screen.getByText('கடவுள் வாழ்த்து')).toBeInTheDocument();
    });

    it('toggles answer visibility', async () => {
        const user = userEvent.setup();
        const questionState = createMockQuestionState(Topic.FirstWord);
        render(<QuestionDisplay questionState={questionState} onToggleAnswer={vi.fn()} />);

        const showButton = screen.getByText('காட்டு');
        await user.click(showButton);

        expect(screen.getByText('மறை')).toBeInTheDocument();
    });

    it('calls onToggleAnswer when சரி button clicked', async () => {
        const user = userEvent.setup();
        const onToggleAnswer = vi.fn();
        const questionState = createMockQuestionState(Topic.FirstWord);

        render(<QuestionDisplay questionState={questionState} onToggleAnswer={onToggleAnswer} />);

        await user.click(screen.getByText('சரி'));
        expect(onToggleAnswer).toHaveBeenCalledWith('அகர');
    });

    it('displays answer count', () => {
        const questionState = createMockQuestionState(Topic.FirstWord);
        render(<QuestionDisplay questionState={questionState} onToggleAnswer={vi.fn()} />);

        expect(screen.getByText(/விடைகள்: 0 \/ 10/)).toBeInTheDocument();
    });

    it('disables answer button when max answered', () => {
        const questionState = createMockQuestionState(Topic.FirstWord);
        questionState.scoreState.group23Score.round2[Topic.FirstWord] = new Set(Array.from({ length: 10 }, (_, i) => `word${i}`));

        render(<QuestionDisplay questionState={questionState} onToggleAnswer={vi.fn()} />);

        const answerButton = screen.getByText('சரி');
        expect(answerButton).toBeDisabled();
    });
});
