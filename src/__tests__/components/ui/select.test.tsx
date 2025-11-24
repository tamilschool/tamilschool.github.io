import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from '@/components/ui/select';

describe('Select Component', () => {
    it('renders select trigger', () => {
        render(
            <Select>
                <SelectTrigger>
                    <SelectValue placeholder="Select option" />
                </SelectTrigger>
            </Select>
        );

        expect(screen.getByRole('combobox')).toBeInTheDocument();
    });

    it('displays placeholder text', () => {
        render(
            <Select>
                <SelectTrigger>
                    <SelectValue placeholder="Choose an option" />
                </SelectTrigger>
            </Select>
        );

        expect(screen.getByText('Choose an option')).toBeInTheDocument();
    });

    it('opens dropdown on click', async () => {
        const user = userEvent.setup();

        render(
            <Select>
                <SelectTrigger>
                    <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="option1">Option 1</SelectItem>
                    <SelectItem value="option2">Option 2</SelectItem>
                </SelectContent>
            </Select>
        );

        await user.click(screen.getByRole('combobox'));

        // Options should appear after click
        expect(screen.getByText('Option 1')).toBeInTheDocument();
        expect(screen.getByText('Option 2')).toBeInTheDocument();
    });

    it('handles value selection', async () => {
        const user = userEvent.setup();
        const handleValueChange = vi.fn();

        render(
            <Select onValueChange={handleValueChange}>
                <SelectTrigger>
                    <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="option1">Option 1</SelectItem>
                    <SelectItem value="option2">Option 2</SelectItem>
                </SelectContent>
            </Select>
        );

        await user.click(screen.getByRole('combobox'));
        await user.click(screen.getByText('Option 1'));

        expect(handleValueChange).toHaveBeenCalledWith('option1');
    });

    it('can be disabled', () => {
        render(
            <Select disabled>
                <SelectTrigger>
                    <SelectValue placeholder="Select" />
                </SelectTrigger>
            </Select>
        );

        const trigger = screen.getByRole('combobox');
        expect(trigger).toBeDisabled();
    });

    it('displays selected value', () => {
        render(
            <Select value="option1">
                <SelectTrigger>
                    <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="option1">Option 1</SelectItem>
                    <SelectItem value="option2">Option 2</SelectItem>
                </SelectContent>
            </Select>
        );

        expect(screen.getByText('Option 1')).toBeInTheDocument();
    });
});
