import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter,
} from '@/components/ui/card';

describe('Card Components', () => {
    it('renders Card with children', () => {
        render(<Card>Card content</Card>);
        expect(screen.getByText('Card content')).toBeInTheDocument();
    });

    it('renders CardHeader with children', () => {
        render(
            <Card>
                <CardHeader>Header content</CardHeader>
            </Card>
        );
        expect(screen.getByText('Header content')).toBeInTheDocument();
    });

    it('renders CardTitle with text', () => {
        render(
            <Card>
                <CardHeader>
                    <CardTitle>Card Title</CardTitle>
                </CardHeader>
            </Card>
        );
        expect(screen.getByText('Card Title')).toBeInTheDocument();
    });

    it('renders CardDescription with text', () => {
        render(
            <Card>
                <CardHeader>
                    <CardDescription>Card description text</CardDescription>
                </CardHeader>
            </Card>
        );
        expect(screen.getByText('Card description text')).toBeInTheDocument();
    });

    it('renders CardContent with children', () => {
        render(
            <Card>
                <CardContent>Main content</CardContent>
            </Card>
        );
        expect(screen.getByText('Main content')).toBeInTheDocument();
    });

    it('renders CardFooter with children', () => {
        render(
            <Card>
                <CardFooter>Footer content</CardFooter>
            </Card>
        );
        expect(screen.getByText('Footer content')).toBeInTheDocument();
    });

    it('renders complete card structure', () => {
        render(
            <Card>
                <CardHeader>
                    <CardTitle>Title</CardTitle>
                    <CardDescription>Description</CardDescription>
                </CardHeader>
                <CardContent>Content</CardContent>
                <CardFooter>Footer</CardFooter>
            </Card>
        );

        expect(screen.getByText('Title')).toBeInTheDocument();
        expect(screen.getByText('Description')).toBeInTheDocument();
        expect(screen.getByText('Content')).toBeInTheDocument();
        expect(screen.getByText('Footer')).toBeInTheDocument();
    });

    it('applies custom className to Card', () => {
        const { container } = render(<Card className="custom-card">Content</Card>);
        const card = container.firstChild;
        expect(card).toHaveClass('custom-card');
    });

    it('applies custom className to CardHeader', () => {
        const { container } = render(
            <Card>
                <CardHeader className="custom-header">Header</CardHeader>
            </Card>
        );
        expect(container.querySelector('.custom-header')).toBeInTheDocument();
    });

    it('applies custom className to CardContent', () => {
        const { container } = render(
            <Card>
                <CardContent className="custom-content">Content</CardContent>
            </Card>
        );
        expect(container.querySelector('.custom-content')).toBeInTheDocument();
    });
});
