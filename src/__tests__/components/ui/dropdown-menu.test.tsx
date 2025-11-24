import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuCheckboxItem,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuSub,
    DropdownMenuSubTrigger,
    DropdownMenuSubContent,
} from '@/components/ui/dropdown-menu';

describe('DropdownMenu Component', () => {
    it('renders dropdown trigger', () => {
        render(
            <DropdownMenu>
                <DropdownMenuTrigger>Open Menu</DropdownMenuTrigger>
            </DropdownMenu>
        );

        expect(screen.getByText('Open Menu')).toBeInTheDocument();
    });

    it('opens menu on trigger click', async () => {
        const user = userEvent.setup();

        render(
            <DropdownMenu>
                <DropdownMenuTrigger>Open</DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuItem>Item 1</DropdownMenuItem>
                    <DropdownMenuItem>Item 2</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        );

        await user.click(screen.getByText('Open'));

        expect(screen.getByText('Item 1')).toBeInTheDocument();
        expect(screen.getByText('Item 2')).toBeInTheDocument();
    });

    it('fires onSelect when menu item clicked', async () => {
        const user = userEvent.setup();
        const handleSelect = vi.fn();

        render(
            <DropdownMenu>
                <DropdownMenuTrigger>Open</DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuItem onSelect={handleSelect}>Item 1</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        );

        await user.click(screen.getByText('Open'));
        await user.click(screen.getByText('Item 1'));

        expect(handleSelect).toHaveBeenCalled();
    });

    it('renders menu label', async () => {
        const user = userEvent.setup();

        render(
            <DropdownMenu>
                <DropdownMenuTrigger>Open</DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuItem>Profile</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        );

        await user.click(screen.getByText('Open'));

        expect(screen.getByText('My Account')).toBeInTheDocument();
    });

    it('renders menu separator', async () => {
        const user = userEvent.setup();

        render(
            <DropdownMenu>
                <DropdownMenuTrigger>Open</DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuItem>Item 1</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Item 2</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        );

        await user.click(screen.getByText('Open'));

        // Radix UI Separator should have role="separator"
        // Since it's in a Portal, we must use screen, not container
        const separator = screen.getByRole('separator');
        expect(separator).toBeInTheDocument();
        expect(separator).toHaveClass('h-px');
    });

    it('handles checkbox items', async () => {
        const user = userEvent.setup();
        const handleCheckedChange = vi.fn();

        render(
            <DropdownMenu>
                <DropdownMenuTrigger>Open</DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuCheckboxItem
                        checked={false}
                        onCheckedChange={handleCheckedChange}
                    >
                        Enable notifications
                    </DropdownMenuCheckboxItem>
                </DropdownMenuContent>
            </DropdownMenu>
        );

        await user.click(screen.getByText('Open'));
        await user.click(screen.getByText('Enable notifications'));

        expect(handleCheckedChange).toHaveBeenCalled();
    });

    it('handles radio group items', async () => {
        const user = userEvent.setup();
        const handleValueChange = vi.fn();

        render(
            <DropdownMenu>
                <DropdownMenuTrigger>Open</DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuRadioGroup value="option1" onValueChange={handleValueChange}>
                        <DropdownMenuRadioItem value="option1">Option 1</DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="option2">Option 2</DropdownMenuRadioItem>
                    </DropdownMenuRadioGroup>
                </DropdownMenuContent>
            </DropdownMenu>
        );

        await user.click(screen.getByText('Open'));
        await user.click(screen.getByText('Option 2'));

        expect(handleValueChange).toHaveBeenCalledWith('option2');
    });

    it('renders sub-menu', async () => {
        const user = userEvent.setup();

        render(
            <DropdownMenu>
                <DropdownMenuTrigger>Open</DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuSub>
                        <DropdownMenuSubTrigger>More options</DropdownMenuSubTrigger>
                        <DropdownMenuSubContent>
                            <DropdownMenuItem>Sub Item 1</DropdownMenuItem>
                        </DropdownMenuSubContent>
                    </DropdownMenuSub>
                </DropdownMenuContent>
            </DropdownMenu>
        );

        await user.click(screen.getByText('Open'));

        expect(screen.getByText('More options')).toBeInTheDocument();
    });

    it('can disabled menu items', async () => {
        const user = userEvent.setup();

        render(
            <DropdownMenu>
                <DropdownMenuTrigger>Open</DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuItem disabled>Disabled Item</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        );

        await user.click(screen.getByText('Open'));

        const disabledItem = screen.getByText('Disabled Item');
        expect(disabledItem).toHaveAttribute('data-disabled');
    });
});
