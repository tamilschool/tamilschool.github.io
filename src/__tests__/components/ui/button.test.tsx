import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from '@/components/ui/button';

describe('Button Component', () => {
    it('renders with text content', () => {
        render(<Button>Click me</Button>);
        expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument();
    });

    it('handles click events', async () => {
        const user = userEvent.setup();
        const handleClick = vi.fn();

        render(<Button onClick={handleClick}>Click me</Button>);

        await user.click(screen.getByRole('button'));
        expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('renders default variant correctly', () => {
        const { container } = render(<Button variant="default">Default</Button>);
        const button = container.querySelector('button');
        expect(button).toHaveClass('bg-primary');
    });

    it('renders destructive variant correctly', () => {
        const { container } = render(<Button variant="destructive">Delete</Button>);
        const button = container.querySelector('button');
        expect(button).toHaveClass('bg-destructive');
    });

    it('renders outline variant correctly', () => {
        const { container } = render(<Button variant="outline">Outline</Button>);
        const button = container.querySelector('button');
        expect(button).toHaveClass('border');
    });

    it('renders secondary variant correctly', () => {
        const { container } = render(<Button variant="secondary">Secondary</Button>);
        const button = container.querySelector('button');
        expect(button).toHaveClass('bg-secondary');
    });

    it('renders ghost variant correctly', () => {
        const { container } = render(<Button variant="ghost">Ghost</Button>);
        const button = container.querySelector('button');
        expect(button).toHaveClass('hover:bg-accent');
    });

    it('renders link variant correctly', () => {
        const { container } = render(<Button variant="link">Link</Button>);
        const button = container.querySelector('button');
        expect(button).toHaveClass('underline-offset-4');
    });

    it('renders default size correctly', () => {
        const { container } = render(<Button size="default">Default Size</Button>);
        const button = container.querySelector('button');
        expect(button).toHaveClass('h-9');
    });

    it('renders small size correctly', () => {
        const { container } = render(<Button size="sm">Small</Button>);
        const button = container.querySelector('button');
        expect(button).toHaveClass('h-8');
    });

    it('renders large size correctly', () => {
        const { container } = render(<Button size="lg">Large</Button>);
        const button = container.querySelector('button');
        expect(button).toHaveClass('h-10');
    });

    it('renders icon size correctly', () => {
        const { container } = render(<Button size="icon">+</Button>);
        const button = container.querySelector('button');
        expect(button).toHaveClass('h-9');
        expect(button).toHaveClass('w-9');
    });

    it('can be disabled', () => {
        render(<Button disabled>Disabled</Button>);
        const button = screen.getByRole('button');
        expect(button).toBeDisabled();
    });

    it('does not fire click when disabled', async () => {
        const user = userEvent.setup();
        const handleClick = vi.fn();

        render(<Button disabled onClick={handleClick}>Disabled</Button>);

        await user.click(screen.getByRole('button'));
        expect(handleClick).not.toHaveBeenCalled();
    });

    it('applies custom className', () => {
        const { container } = render(<Button className="custom-class">Custom</Button>);
        const button = container.querySelector('button');
        expect(button).toHaveClass('custom-class');
    });

    it('forwards ref correctly', () => {
        const ref = { current: null as HTMLButtonElement | null };
        render(<Button ref={ref}>With Ref</Button>);
        expect(ref.current).toBeInstanceOf(HTMLButtonElement);
    });
});
