import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

describe('Alert Components', () => {
    it('renders alert with role', () => {
        render(<Alert>Alert content</Alert>);
        expect(screen.getByRole('alert')).toBeInTheDocument();
    });

    it('renders default variant correctly', () => {
        const { container } = render(<Alert variant="default">Default alert</Alert>);
        const alert = container.querySelector('[role="alert"]');
        expect(alert).toHaveClass('bg-background');
    });

    it('renders destructive variant correctly', () => {
        const { container } = render(<Alert variant="destructive">Error alert</Alert>);
        const alert = container.querySelector('[role="alert"]');
        expect(alert).toHaveClass('border-destructive/50');
    });

    it('renders AlertTitle correctly', () => {
        render(
            <Alert>
                <AlertTitle>Alert Title</AlertTitle>
            </Alert>
        );
        expect(screen.getByText('Alert Title')).toBeInTheDocument();
    });

    it('renders AlertDescription correctly', () => {
        render(
            <Alert>
                <AlertDescription>Alert description text</AlertDescription>
            </Alert>
        );
        expect(screen.getByText('Alert description text')).toBeInTheDocument();
    });

    it('renders complete alert structure', () => {
        render(
            <Alert>
                <AlertTitle>Title</AlertTitle>
                <AlertDescription>Description</AlertDescription>
            </Alert>
        );

        expect(screen.getByText('Title')).toBeInTheDocument();
        expect(screen.getByText('Description')).toBeInTheDocument();
    });

    it('applies custom className to Alert', () => {
        const { container } = render(<Alert className="custom-alert">Content</Alert>);
        const alert = container.querySelector('.custom-alert');
        expect(alert).toBeInTheDocument();
    });

    it('applies custom className to AlertTitle', () => {
        const { container } = render(
            <Alert>
                <AlertTitle className="custom-title">Title</AlertTitle>
            </Alert>
        );
        expect(container.querySelector('.custom-title')).toBeInTheDocument();
    });

    it('applies custom className to AlertDescription', () => {
        const { container } = render(
            <Alert>
                <AlertDescription className="custom-description">Description</AlertDescription>
            </Alert>
        );
        expect(container.querySelector('.custom-description')).toBeInTheDocument();
    });

    it('renders with icon', () => {
        render(
            <Alert>
                <svg data-testid="alert-icon" />
                <AlertTitle>Title</AlertTitle>
                <AlertDescription>Description</AlertDescription>
            </Alert>
        );

        expect(screen.getByTestId('alert-icon')).toBeInTheDocument();
    });
});
