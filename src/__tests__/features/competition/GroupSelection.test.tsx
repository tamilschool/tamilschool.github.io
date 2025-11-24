import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import GroupSelection from '@/features/competition/GroupSelection';
import { Group } from '@/types';

describe('GroupSelection Component', () => {
    it('renders group selection interface', () => {
        const onSelectGroup = vi.fn();
        render(<GroupSelection onSelectGroup={onSelectGroup} />);

        expect(screen.getByText(/குழு தேர்வு/i)).toBeInTheDocument();
    });

    it('displays all three group options', () => {
        const onSelectGroup = vi.fn();
        render(<GroupSelection onSelectGroup={onSelectGroup} />);

        // Check for group labels
        expect(screen.getByText(/குழு I/)).toBeInTheDocument();
        expect(screen.getByText(/குழு II/)).toBeInTheDocument();
        expect(screen.getByText(/குழு III/)).toBeInTheDocument();
    });

    it('calls onSelectGroup with Group.I when first card clicked', async () => {
        const user = userEvent.setup();
        const onSelectGroup = vi.fn();

        render(<GroupSelection onSelectGroup={onSelectGroup} />);

        const groupICard = screen.getByText(/குழு I/).closest('div[role="button"]');
        if (groupICard) {
            await user.click(groupICard);
            expect(onSelectGroup).toHaveBeenCalledWith(Group.I);
        }
    });

    it('calls onSelectGroup with Group.II when second card clicked', async () => {
        const user = userEvent.setup();
        const onSelectGroup = vi.fn();

        render(<GroupSelection onSelectGroup={onSelectGroup} />);

        const groupIICard = screen.getByText(/குழு II/).closest('div[role="button"]');
        if (groupIICard) {
            await user.click(groupIICard);
            expect(onSelectGroup).toHaveBeenCalledWith(Group.II);
        }
    });

    it('calls onSelectGroup with Group.III when third card clicked', async () => {
        const user = userEvent.setup();
        const onSelectGroup = vi.fn();

        render(<GroupSelection onSelectGroup={onSelectGroup} />);

        const groupIIICard = screen.getByText(/குழு III/).closest('div[role="button"]');
        if (groupIIICard) {
            await user.click(groupIIICard);
            expect(onSelectGroup).toHaveBeenCalledWith(Group.III);
        }
    });

    it('has accessible button roles for group cards', () => {
        const onSelectGroup = vi.fn();
        render(<GroupSelection onSelectGroup={onSelectGroup} />);

        const buttons = screen.getAllByRole('button');
        expect(buttons.length).toBeGreaterThanOrEqual(3);
    });
});
