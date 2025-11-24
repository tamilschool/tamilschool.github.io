import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

describe('ToggleGroup Component', () => {
    it('renders toggle group with items', () => {
        render(
            <ToggleGroup type="single">
                <ToggleGroupItem value="a">A</ToggleGroupItem>
                <ToggleGroupItem value="b">B</ToggleGroupItem>
            </ToggleGroup>
        );

        expect(screen.getByText('A')).toBeInTheDocument();
        expect(screen.getByText('B')).toBeInTheDocument();
    });

    it('handles single selection mode', async () => {
        const user = userEvent.setup();
        const handleValueChange = vi.fn();

        render(
            <ToggleGroup type="single" onValueChange={handleValueChange}>
                <ToggleGroupItem value="a">A</ToggleGroupItem>
                <ToggleGroupItem value="b">B</ToggleGroupItem>
            </ToggleGroup>
        );

        await user.click(screen.getByText('A'));
        expect(handleValueChange).toHaveBeenCalled();
    });

    it('handles multiple selection mode', async () => {
        const user = userEvent.setup();
        const handleValueChange = vi.fn();

        render(
            <ToggleGroup type="multiple" onValueChange={handleValueChange}>
                <ToggleGroupItem value="a">A</ToggleGroupItem>
                <ToggleGroupItem value="b">B</ToggleGroupItem>
            </ToggleGroup>
        );

        await user.click(screen.getByText('A'));
        await user.click(screen.getByText('B'));
        expect(handleValueChange).toHaveBeenCalledTimes(2);
    });

    it('disables all items when disabled', () => {
        render(
            <ToggleGroup type="single" disabled>
                <ToggleGroupItem value="a">A</ToggleGroupItem>
                <ToggleGroupItem value="b">B</ToggleGroupItem>
            </ToggleGroup>
        );

        const buttons = screen.getAllByRole('radio');
        buttons.forEach(button => {
            expect(button).toBeDisabled();
        });
    });

    it('can disable individual items', () => {
        render(
            <ToggleGroup type="single">
                <ToggleGroupItem value="a" disabled>A</ToggleGroupItem>
                <ToggleGroupItem value="b">B</ToggleGroupItem>
            </ToggleGroup>
        );

        expect(screen.getByText('A').closest('button')).toBeDisabled();
        expect(screen.getByText('B').closest('button')).not.toBeDisabled();
    });

    it('applies variant to items', () => {
        const { container } = render(
            <ToggleGroup type="single" variant="outline">
                <ToggleGroupItem value="a">A</ToggleGroupItem>
            </ToggleGroup>
        );

        const button = container.querySelector('button');
        expect(button).toHaveClass('border-input');
    });

    it('applies size to items', () => {
        const { container } = render(
            <ToggleGroup type="single" size="sm">
                <ToggleGroupItem value="a">A</ToggleGroupItem>
            </ToggleGroup>
        );

        const button = container.querySelector('button');
        expect(button).toHaveClass('h-8');
    });
});
