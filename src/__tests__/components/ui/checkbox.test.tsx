import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Checkbox } from '@/components/ui/checkbox';

describe('Checkbox Component', () => {
    it('renders checkbox element', () => {
        render(<Checkbox />);
        const checkbox = screen.getByRole('checkbox');
        expect(checkbox).toBeInTheDocument();
    });

    it('can be checked', async () => {
        const user = userEvent.setup();
        const handleChange = vi.fn();

        render(<Checkbox onCheckedChange={handleChange} />);

        const checkbox = screen.getByRole('checkbox');
        await user.click(checkbox);

        expect(handleChange).toHaveBeenCalled();
    });

    it('renders checked state correctly', () => {
        render(<Checkbox checked={true} />);
        const checkbox = screen.getByRole('checkbox');
        expect(checkbox).toHaveAttribute('data-state', 'checked');
    });

    it('renders unchecked state correctly', () => {
        render(<Checkbox checked={false} />);
        const checkbox = screen.getByRole('checkbox');
        expect(checkbox).toHaveAttribute('data-state', 'unchecked');
    });

    it('can be disabled', () => {
        render(<Checkbox disabled />);
        const checkbox = screen.getByRole('checkbox');
        expect(checkbox).toBeDisabled();
    });

    it('does not trigger change when disabled', async () => {
        const user = userEvent.setup();
        const handleChange = vi.fn();

        render(<Checkbox disabled onCheckedChange={handleChange} />);

        const checkbox = screen.getByRole('checkbox');
        await user.click(checkbox);

        expect(handleChange).not.toHaveBeenCalled();
    });

    it('applies custom className', () => {
        const { container } = render(<Checkbox className="custom-checkbox" />);
        const checkbox = container.querySelector('.custom-checkbox');
        expect(checkbox).toBeInTheDocument();
    });

    it('forwards ref correctly', () => {
        const ref = { current: null };
        render(<Checkbox ref={ref as any} />);
        expect(ref.current).not.toBeNull();
    });
});
