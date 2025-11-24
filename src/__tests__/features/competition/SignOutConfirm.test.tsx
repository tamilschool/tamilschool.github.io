import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SignOutConfirm from '@/features/competition/SignOutConfirm';

describe('SignOutConfirm Component', () => {
    it('renders confirm dialog with message', () => {
        const onExit = vi.fn();
        const onRestart = vi.fn();
        const onCancel = vi.fn();

        render(<SignOutConfirm onExit={onExit} onRestart={onRestart} onCancel={onCancel} />);

        expect(screen.getByText(/வெளியேற்றத்தை உறுதிப்படுத்தவும்/i)).toBeInTheDocument();
    });

    it('displays all three action options', () => {
        const onExit = vi.fn();
        const onRestart = vi.fn();
        const onCancel = vi.fn();

        render(<SignOutConfirm onExit={onExit} onRestart={onRestart} onCancel={onCancel} />);

        expect(screen.getByText(/ரத்து செய்/i)).toBeInTheDocument();
        expect(screen.getByText(/அடுத்த போட்டியாளர்/i)).toBeInTheDocument();
        expect(screen.getByText(/வெளியேறு/i)).toBeInTheDocument();
    });

    it('calls onCancel when cancel button clicked', async () => {
        const user = userEvent.setup();
        const onExit = vi.fn();
        const onRestart = vi.fn();
        const onCancel = vi.fn();

        render(<SignOutConfirm onExit={onExit} onRestart={onRestart} onCancel={onCancel} />);

        const cancelButton = screen.getByText(/ரத்து செய்/i);
        await user.click(cancelButton);

        expect(onCancel).toHaveBeenCalledTimes(1);
        expect(onExit).not.toHaveBeenCalled();
        expect(onRestart).not.toHaveBeenCalled();
    });

    it('calls onRestart when restart button clicked', async () => {
        const user = userEvent.setup();
        const onExit = vi.fn();
        const onRestart = vi.fn();
        const onCancel = vi.fn();

        render(<SignOutConfirm onExit={onExit} onRestart={onRestart} onCancel={onCancel} />);

        const restartButton = screen.getByText(/அடுத்த போட்டியாளர்/i);
        await user.click(restartButton);

        expect(onRestart).toHaveBeenCalledTimes(1);
        expect(onExit).not.toHaveBeenCalled();
        expect(onCancel).not.toHaveBeenCalled();
    });

    it('calls onExit when exit button clicked', async () => {
        const user = userEvent.setup();
        const onExit = vi.fn();
        const onRestart = vi.fn();
        const onCancel = vi.fn();

        render(<SignOutConfirm onExit={onExit} onRestart={onRestart} onCancel={onCancel} />);

        const exitButton = screen.getByText(/வெளியேறு/i);
        await user.click(exitButton);

        expect(onExit).toHaveBeenCalledTimes(1);
        expect(onRestart).not.toHaveBeenCalled();
        expect(onCancel).not.toHaveBeenCalled();
    });

    it('renders accessible buttons', () => {
        const onExit = vi.fn();
        const onRestart = vi.fn();
        const onCancel = vi.fn();

        render(<SignOutConfirm onExit={onExit} onRestart={onRestart} onCancel={onCancel} />);

        const buttons = screen.getAllByRole('button');
        expect(buttons.length).toBe(3);
    });
});
