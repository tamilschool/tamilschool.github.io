import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CompetitionControls } from '@/features/competition/CompetitionControls';

describe('CompetitionControls Component', () => {
    const defaultProps = {
        currentIndex: 5,
        totalCount: 15,
        answer: null as boolean | null,
        isMaxAnswered: false,
        isTimerLive: true,
        isTimerPaused: false,
        isTimerExpired: false,
        onPrevious: vi.fn(),
        onNext: vi.fn(),
        onToggleAnswer: vi.fn(),
    };

    it('renders navigation buttons', () => {
        render(<CompetitionControls {...defaultProps} />);

        expect(screen.getByText(/முந்தைய/i)).toBeInTheDocument();
        expect(screen.getByText(/அடுத்த/i)).toBeInTheDocument();
    });

    it('renders answer toggle buttons', () => {
        render(<CompetitionControls {...defaultProps} />);

        expect(screen.getByText(/சரி/i)).toBeInTheDocument();
        expect(screen.getByText(/தவறு/i)).toBeInTheDocument();
    });

    it('enables navigation when timer is running', () => {
        render(<CompetitionControls {...defaultProps} />);

        const previousButton = screen.getByText(/முந்தைய/i);
        const nextButton = screen.getByText(/அடுத்த/i);

        expect(previousButton).not.toBeDisabled();
        expect(nextButton).not.toBeDisabled();
    });

    it('disables navigation when timer is paused', () => {
        render(<CompetitionControls {...defaultProps} isTimerPaused={true} />);

        const previousButton = screen.getByText(/முந்தைய/i);
        const nextButton = screen.getByText(/அடுத்த/i);

        expect(previousButton).toBeDisabled();
        expect(nextButton).toBeDisabled();
    });

    it('disables navigation when timer is not live', () => {
        render(<CompetitionControls {...defaultProps} isTimerLive={false} />);

        const previousButton = screen.getByText(/முந்தைய/i);
        const nextButton = screen.getByText(/அடுத்த/i);

        expect(previousButton).toBeDisabled();
        expect(nextButton).toBeDisabled();
    });

    it('disables navigation when timer is expired', () => {
        render(<CompetitionControls {...defaultProps} isTimerExpired={true} />);

        const previousButton = screen.getByText(/முந்தைய/i);
        const nextButton = screen.getByText(/அடுத்த/i);

        expect(previousButton).toBeDisabled();
        expect(nextButton).toBeDisabled();
    });

    it('disables previous button at first question', () => {
        render(<CompetitionControls {...defaultProps} currentIndex={0} />);

        const previousButton = screen.getByText(/முந்தைய/i);
        expect(previousButton).toBeDisabled();
    });

    it('disables next button at last question', () => {
        render(<CompetitionControls {...defaultProps} currentIndex={14} totalCount={15} />);

        const nextButton = screen.getByText(/அடுத்த/i);
        expect(nextButton).toBeDisabled();
    });

    it('calls onPrevious when previous button clicked', async () => {
        const user = userEvent.setup();
        const onPrevious = vi.fn();

        render(<CompetitionControls {...defaultProps} onPrevious={onPrevious} />);

        await user.click(screen.getByText(/முந்தைய/i));
        expect(onPrevious).toHaveBeenCalledTimes(1);
    });

    it('calls onNext when next button clicked', async () => {
        const user = userEvent.setup();
        const onNext = vi.fn();

        render(<CompetitionControls {...defaultProps} onNext={onNext} />);

        await user.click(screen.getByText(/அடுத்த/i));
        expect(onNext).toHaveBeenCalledTimes(1);
    });

    it('calls onToggleAnswer with true when correct button clicked', async () => {
        const user = userEvent.setup();
        const onToggleAnswer = vi.fn();

        render(<CompetitionControls {...defaultProps} onToggleAnswer={onToggleAnswer} />);

        await user.click(screen.getByText(/சரி/i));
        expect(onToggleAnswer).toHaveBeenCalledWith(true);
    });

    it('calls onToggleAnswer with false when wrong button clicked', async () => {
        const user = userEvent.setup();
        const onToggleAnswer = vi.fn();

        render(<CompetitionControls {...defaultProps} onToggleAnswer={onToggleAnswer} />);

        await user.click(screen.getByText(/தவறு/i));
        expect(onToggleAnswer).toHaveBeenCalledWith(false);
    });

    it('disables answer toggles when max answered', () => {
        render(<CompetitionControls {...defaultProps} isMaxAnswered={true} />);

        const correctButton = screen.getByText(/சரி/i);
        const wrongButton = screen.getByText(/தவறு/i);

        expect(correctButton).toBeDisabled();
        expect(wrongButton).toBeDisabled();
    });

    it('shows correct answer as pressed', () => {
        render(<CompetitionControls {...defaultProps} answer={true} />);

        const correctButton = screen.getByText(/சரி/i);
        expect(correctButton).toHaveAttribute('data-state', 'on');
    });

    it('shows wrong answer as pressed', () => {
        render(<CompetitionControls {...defaultProps} answer={false} />);

        const wrongButton = screen.getByText(/தவறு/i);
        expect(wrongButton).toHaveAttribute('data-state', 'on');
    });

    it('enables answer toggles even when timer expired', () => {
        render(<CompetitionControls {...defaultProps} isTimerExpired={true} />);

        const correctButton = screen.getByText(/சரி/i);
        const wrongButton = screen.getByText(/தவறு/i);

        // Answer toggles should be enabled when expired (allow marking current question)
        expect(correctButton).not.toBeDisabled();
        expect(wrongButton).not.toBeDisabled();
    });
});
