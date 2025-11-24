import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { Badge } from '@/components/ui/badge';

describe('Badge Component', () => {
    it('renders with text content', () => {
        const { container } = render(<Badge>New</Badge>);
        expect(container.textContent).toBe('New');
    });

    it('renders default variant correctly', () => {
        const { container } = render(<Badge variant="default">Default</Badge>);
        const badge = container.firstChild;
        expect(badge).toHaveClass('bg-primary');
    });

    it('renders secondary variant correctly', () => {
        const { container } = render(<Badge variant="secondary">Secondary</Badge>);
        const badge = container.firstChild;
        expect(badge).toHaveClass('bg-secondary');
    });

    it('renders destructive variant correctly', () => {
        const { container } = render(<Badge variant="destructive">Error</Badge>);
        const badge = container.firstChild;
        expect(badge).toHaveClass('bg-destructive');
    });

    it('renders outline variant correctly', () => {
        const { container } = render(<Badge variant="outline">Outline</Badge>);
        const badge = container.firstChild;
        expect(badge).toHaveClass('border');
    });

    it('applies custom className', () => {
        const { container } = render(<Badge className="custom-badge">Custom</Badge>);
        const badge = container.firstChild;
        expect(badge).toHaveClass('custom-badge');
    });

    it('renders children elements correctly', () => {
        const { container } = render(
            <Badge>
                <span>Icon</span> Text
            </Badge>
        );
        expect(container.querySelector('span')).toBeInTheDocument();
        expect(container.textContent).toContain('Text');
    });
});
