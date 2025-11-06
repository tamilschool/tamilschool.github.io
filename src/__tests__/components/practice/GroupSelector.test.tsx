import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { GroupSelector } from '@/components/practice/GroupSelector';
import { Group } from '@/types';

describe('GroupSelector', () => {
  const groupCounts = {
    [Group.I]: 10,
    [Group.II]: 20,
    [Group.III]: 30,
  };

  it('renders both group options (II and III)', () => {
    const onGroupChange = vi.fn();
    render(
      <GroupSelector
        selectedGroup={Group.II}
        groupCounts={groupCounts}
        onGroupChange={onGroupChange}
      />
    );

    const radioButtons = screen.getAllByRole('radio');
    expect(radioButtons).toHaveLength(2);
  });

  it('highlights selected group with data-state on', () => {
    const onGroupChange = vi.fn();
    render(
      <GroupSelector
        selectedGroup={Group.II}
        groupCounts={groupCounts}
        onGroupChange={onGroupChange}
      />
    );

    const radioButtons = screen.getAllByRole('radio');
    expect(radioButtons[0]).toHaveAttribute('data-state', 'on');
  });

  it('calls onGroupChange when different group is selected', async () => {
    const user = userEvent.setup();
    const onGroupChange = vi.fn();

    render(
      <GroupSelector
        selectedGroup={Group.II}
        groupCounts={groupCounts}
        onGroupChange={onGroupChange}
      />
    );

    const radioButtons = screen.getAllByRole('radio');
    await user.click(radioButtons[1]);

    expect(onGroupChange).toHaveBeenCalled();
  });

  it('does not show Group I option', () => {
    const onGroupChange = vi.fn();
    render(
      <GroupSelector
        selectedGroup={Group.II}
        groupCounts={groupCounts}
        onGroupChange={onGroupChange}
      />
    );

    // Should only have 2 radio buttons (Group II and III)
    const radioButtons = screen.getAllByRole('radio');
    expect(radioButtons).toHaveLength(2);
  });

  it('displays correct aria labels for accessibility', () => {
    const onGroupChange = vi.fn();
    render(
      <GroupSelector
        selectedGroup={Group.II}
        groupCounts={groupCounts}
        onGroupChange={onGroupChange}
      />
    );

    const radioButtons = screen.getAllByRole('radio');
    expect(radioButtons[0]).toHaveAttribute('aria-label');
    expect(radioButtons[1]).toHaveAttribute('aria-label');
  });

  it('maintains group selection when re-rendered', () => {
    const onGroupChange = vi.fn();

    const { rerender } = render(
      <GroupSelector
        selectedGroup={Group.II}
        groupCounts={groupCounts}
        onGroupChange={onGroupChange}
      />
    );

    let radioButtons = screen.getAllByRole('radio');
    expect(radioButtons[0]).toHaveAttribute('data-state', 'on');

    rerender(
      <GroupSelector
        selectedGroup={Group.II}
        groupCounts={groupCounts}
        onGroupChange={onGroupChange}
      />
    );

    radioButtons = screen.getAllByRole('radio');
    expect(radioButtons[0]).toHaveAttribute('data-state', 'on');
  });

  it('handles rapid group changes', async () => {
    const user = userEvent.setup();
    const onGroupChange = vi.fn();

    const { rerender } = render(
      <GroupSelector
        selectedGroup={Group.II}
        groupCounts={groupCounts}
        onGroupChange={onGroupChange}
      />
    );

    let radioButtons = screen.getAllByRole('radio');
    await user.click(radioButtons[1]);

    rerender(
      <GroupSelector
        selectedGroup={Group.III}
        groupCounts={groupCounts}
        onGroupChange={onGroupChange}
      />
    );

    radioButtons = screen.getAllByRole('radio');
    expect(radioButtons[1]).toHaveAttribute('data-state', 'on');
  });
});
