import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Toggle } from '@/components/ui/toggle';

describe('Toggle Component', () => {
    it('renders toggle button', () => {
        render(<Toggle>Toggle</Toggle>);
        expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('handles pressed state', async () => {
        const user = userEvent.setup();
        const handlePressedChange = vi.fn();

        render(<Toggle onPressedChange={handlePressedChange}>Toggle</Toggle>);

        const button = screen.getByRole('button');
        await user.click(button);

        expect(handlePressedChange).toHaveBeenCalled();
    });

    it('renders pressed state correctly', () => {
        render(<Toggle pressed={true}>Pressed</Toggle>);
        const button = screen.getByRole('button');
        expect(button).toHaveAttribute('data-state', 'on');
    });

    it('renders unpressed state correctly', () => {
        render(<Toggle pressed={false}>Unpressed</Toggle>);
        const button = screen.getByRole('button');
        expect(button).toHaveAttribute('data-state', 'off');
    });

    it('renders default variant', () => {
        const { container } = render(<Toggle variant="default">Default</Toggle>);
        const button = container.querySelector('button');
        expect(button).toHaveClass('bg-transparent');
    });

    it('renders outline variant', () => {
        const { container } = render(<Toggle variant="outline">Outline</Toggle>);
        const button = container.querySelector('button');
        expect(button).toHaveClass('border');
    });

    it('can be disabled', () => {
        render(<Toggle disabled>Disabled</Toggle>);
        const button = screen.getByRole('button');
        expect(button).toBeDisabled();
    });

    it('does not toggle when disabled', async () => {
        const user = userEvent.setup();
        const handlePressedChange = vi.fn();

        render(<Toggle disabled onPressedChange={handlePressedChange}>Disabled</Toggle>);

        const button = screen.getByRole('button');
        await user.click(button);

        expect(handlePressedChange).not.toHaveBeenCalled();
    });

    it('applies size variants correctly', () => {
        const { container } = render(<Toggle size="sm">Small</Toggle>);
        const button = container.querySelector('button');
        expect(button).toHaveClass('h-9');
    });

    it('applies custom className', () => {
        const { container } = render(<Toggle className="custom-toggle">Toggle</Toggle>);
        const button = container.querySelector('button');
        expect(button).toHaveClass('custom-toggle');
    });
});
