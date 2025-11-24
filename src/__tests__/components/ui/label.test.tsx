import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { Label } from '@/components/ui/label';

describe('Label Component', () => {
    it('renders with text content', () => {
        const { container } = render(<Label>Label Text</Label>);
        expect(container.textContent).toBe('Label Text');
    });

    it('applies htmlFor attribute', () => {
        const { container } = render(<Label htmlFor="input-id">Label</Label>);
        const label = container.querySelector('label');
        expect(label).toHaveAttribute('for', 'input-id');
    });

    it('applies custom className', () => {
        const { container } = render(<Label className="custom-label">Label</Label>);
        const label = container.querySelector('label');
        expect(label).toHaveClass('custom-label');
    });

    it('renders children elements', () => {
        const { container } = render(
            <Label>
                <span>Icon</span> Text
            </Label>
        );
        expect(container.querySelector('span')).toBeInTheDocument();
    });

    it('forwards ref correctly', () => {
        const ref = { current: null as HTMLLabelElement | null };
        render(<Label ref={ref}>Label</Label>);
        expect(ref.current).toBeInstanceOf(HTMLLabelElement);
    });
});
