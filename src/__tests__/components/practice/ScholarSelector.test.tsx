import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ScholarSelector } from '@/components/practice/ScholarSelector';
import { KuralMeaning } from '@/types';

describe('ScholarSelector', () => {
  it('renders all three scholar options', () => {
    const mockToggle = vi.fn();

    render(
      <ScholarSelector selectedMeanings={new Set()} onMeaningToggle={mockToggle} />
    );

    // Check for full names as they appear in KuralMeaningDisplay
    expect(screen.getByText('மு. வரதராசனார்')).toBeInTheDocument();
    expect(screen.getByText('சாலமன் பாப்பையா')).toBeInTheDocument();
    expect(screen.getByText('மு. கருணாநிதி')).toBeInTheDocument();
  });

  it('toggles meaning selection when clicked', async () => {
    const user = userEvent.setup();
    const mockToggle = vi.fn();

    render(
      <ScholarSelector selectedMeanings={new Set()} onMeaningToggle={mockToggle} />
    );

    const buttons = screen.getAllByRole('button');
    await user.click(buttons[0]);

    expect(mockToggle).toHaveBeenCalledOnce();
    expect(mockToggle).toHaveBeenCalledWith(KuralMeaning.MuVaradha);
  });

  it('highlights selected meanings', () => {
    const mockToggle = vi.fn();
    const selected = new Set([KuralMeaning.SalamanPapa]);

    const { container } = render(
      <ScholarSelector selectedMeanings={selected} onMeaningToggle={mockToggle} />
    );

    const toggles = container.querySelectorAll('[data-state="on"]');
    expect(toggles).toHaveLength(1);
  });

  it('allows multiple selections', async () => {
    const user = userEvent.setup();
    const mockToggle = vi.fn();

    render(
      <ScholarSelector selectedMeanings={new Set()} onMeaningToggle={mockToggle} />
    );

    const buttons = screen.getAllByRole('button');
    await user.click(buttons[0]);
    await user.click(buttons[1]);

    expect(mockToggle).toHaveBeenCalledTimes(2);
  });

  it('renders buttons with full width on all sizes', () => {
    const mockToggle = vi.fn();

    const { container } = render(
      <ScholarSelector selectedMeanings={new Set()} onMeaningToggle={mockToggle} />
    );

    const buttons = container.querySelectorAll('button');
    buttons.forEach(button => {
      const classList = button.className;
      expect(classList).toContain('flex-1');
    });
  });
});
