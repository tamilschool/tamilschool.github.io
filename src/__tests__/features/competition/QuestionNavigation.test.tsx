import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import QuestionNavigation from '@/features/competition/QuestionNavigation';

describe('QuestionNavigation Component', () => {
    const defaultProps = {
        topicLabel: 'முதல் சொல்',
        totalCount: 15,
        currentIndex: 5,
        onNavigate: vi.fn(),
        isAnswered: vi.fn(() => false),
        disabled: false,
    };

    it('renders all question numbers', () => {
        render(<QuestionNavigation {...defaultProps} />);

        for (let i = 1; i <= 15; i++) {
            expect(screen.getByText(i.toString())).toBeInTheDocument();
        }
    });

    it('displays topic label', () => {
        render(<QuestionNavigation {...defaultProps} />);
        expect(screen.getByText(/முதல் சொல்/i)).toBeInTheDocument();
    });

    it('displays current position', () => {
        render(<QuestionNavigation {...defaultProps} />);
        expect(screen.getByText(/6 \/ 15/)).toBeInTheDocument();
    });

    it('highlights current question', () => {
        const { container } = render(<QuestionNavigation {...defaultProps} currentIndex={5} />);
        const currentButton = screen.getByText('6'); // currentIndex 5 = button text 6
        expect(currentButton).toHaveClass('bg-blue-500');
    });

    it('calls onNavigate when question number clicked', async () => {
        const user = userEvent.setup();
        const onNavigate = vi.fn();

        render(<QuestionNavigation {...defaultProps} onNavigate={onNavigate} />);

        await user.click(screen.getByText('10'));
        expect(onNavigate).toHaveBeenCalledWith(9); // index 9 for button "10"
    });

    it('shows answered questions in green', () => {
        const isAnswered = (index: number) => index === 0 || index === 2;
        render(<QuestionNavigation {...defaultProps} isAnswered={isAnswered} />);

        const answeredButton1 = screen.getByText('1');
        const answeredButton2 = screen.getByText('3');
        expect(answeredButton1).toHaveClass('bg-emerald-500');
        expect(answeredButton2).toHaveClass('bg-emerald-500');
    });

    it('disables all buttons when disabled prop is true', () => {
        render(<QuestionNavigation {...defaultProps} disabled={true} />);

        const buttons = screen.getAllByRole('button');
        buttons.forEach(button => {
            expect(button).toBeDisabled();
        });
    });

    it('does not call onNavigate when disabled', async () => {
        const user = userEvent.setup();
        const onNavigate = vi.fn();

        render(<QuestionNavigation {...defaultProps} onNavigate={onNavigate} disabled={true} />);

        await user.click(screen.getByText('10'));
        expect(onNavigate).not.toHaveBeenCalled();
    });

    it('renders nothing when totalCount is 0', () => {
        const { container } = render(<QuestionNavigation {...defaultProps} totalCount={0} />);
        expect(container.firstChild).toBeNull();
    });
});
