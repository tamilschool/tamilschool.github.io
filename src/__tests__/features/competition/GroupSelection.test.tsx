import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import GroupSelection from '@/features/competition/GroupSelection';
import { Group } from '@/types';

describe('GroupSelection Component', () => {
    it('renders group selection interface', () => {
        const onSelectGroup = vi.fn();
        render(<GroupSelection onSelectGroup={onSelectGroup} />);

        expect(screen.getByText(/திருக்குறள் போட்டி/i)).toBeInTheDocument();
        expect(screen.getByText(/உங்கள் பிரிவைத் தேர்ந்தெடுக்கவும்/i)).toBeInTheDocument();
    });

    it('displays available group options', () => {
        const onSelectGroup = vi.fn();
        render(<GroupSelection onSelectGroup={onSelectGroup} />);

        // Check for group labels (Group I is not in competition mode currently)
        expect(screen.getByText(/பிரிவு 2/)).toBeInTheDocument();
        expect(screen.getByText(/பிரிவு 3/)).toBeInTheDocument();
    });

    it('calls onSelectGroup with Group.II when first card clicked', async () => {
        const user = userEvent.setup();
        const onSelectGroup = vi.fn();

        render(<GroupSelection onSelectGroup={onSelectGroup} />);

        const groupIICard = screen.getByText(/பிரிவு 2/).closest('button');
        if (groupIICard) {
            await user.click(groupIICard);
            expect(onSelectGroup).toHaveBeenCalledWith(Group.II);
        }
    });

    it('calls onSelectGroup with Group.III when second card clicked', async () => {
        const user = userEvent.setup();
        const onSelectGroup = vi.fn();

        render(<GroupSelection onSelectGroup={onSelectGroup} />);

        const groupIIICard = screen.getByText(/பிரிவு 3/).closest('button');
        if (groupIIICard) {
            await user.click(groupIIICard);
            expect(onSelectGroup).toHaveBeenCalledWith(Group.III);
        }
    });

    it('has accessible button roles for group cards', () => {
        const onSelectGroup = vi.fn();
        render(<GroupSelection onSelectGroup={onSelectGroup} />);

        const buttons = screen.getAllByRole('button');
        expect(buttons.length).toBeGreaterThanOrEqual(2);
    });
});
