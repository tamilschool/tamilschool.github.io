import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { NavigationControls } from '@/features/practice/NavigationControls';

describe('NavigationControls', () => {
  it('renders three buttons', () => {
    const mockPrevious = vi.fn();
    const mockNext = vi.fn();
    const mockShowAnswer = vi.fn();

    render(
      <NavigationControls
        isLive={true}
        onPrevious={mockPrevious}
        onNext={mockNext}
        onShowAnswer={mockShowAnswer}
      />
    );

    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(3);
  });

  it('calls onPrevious when previous button is clicked', async () => {
    const user = userEvent.setup();
    const mockPrevious = vi.fn();
    const mockNext = vi.fn();
    const mockShowAnswer = vi.fn();

    render(
      <NavigationControls
        isLive={true}
        onPrevious={mockPrevious}
        onNext={mockNext}
        onShowAnswer={mockShowAnswer}
      />
    );

    const buttons = screen.getAllByRole('button');
    await user.click(buttons[0]);
    expect(mockPrevious).toHaveBeenCalledOnce();
  });

  it('calls onNext when next button is clicked', async () => {
    const user = userEvent.setup();
    const mockPrevious = vi.fn();
    const mockNext = vi.fn();
    const mockShowAnswer = vi.fn();

    render(
      <NavigationControls
        isLive={true}
        onPrevious={mockPrevious}
        onNext={mockNext}
        onShowAnswer={mockShowAnswer}
      />
    );

    const buttons = screen.getAllByRole('button');
    await user.click(buttons[2]);
    expect(mockNext).toHaveBeenCalledOnce();
  });

  it('displays badge counts when provided', () => {
    const mockPrevious = vi.fn();
    const mockNext = vi.fn();
    const mockShowAnswer = vi.fn();

    render(
      <NavigationControls
        isLive={true}
        onPrevious={mockPrevious}
        onNext={mockNext}
        onShowAnswer={mockShowAnswer}
        leftCount={5}
        rightCount={10}
      />
    );

    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument();
  });

  it('disables buttons when isLive is false', () => {
    const mockPrevious = vi.fn();
    const mockNext = vi.fn();
    const mockShowAnswer = vi.fn();

    render(
      <NavigationControls
        isLive={false}
        onPrevious={mockPrevious}
        onNext={mockNext}
        onShowAnswer={mockShowAnswer}
      />
    );

    const buttons = screen.getAllByRole('button');
    buttons.forEach(button => {
      expect(button).toBeDisabled();
    });
  });

  it('displays answer button with Tamil text', () => {
    const mockPrevious = vi.fn();
    const mockNext = vi.fn();
    const mockShowAnswer = vi.fn();

    render(
      <NavigationControls
        isLive={true}
        onPrevious={mockPrevious}
        onNext={mockNext}
        onShowAnswer={mockShowAnswer}
      />
    );

    expect(screen.getByText('பதில்')).toBeInTheDocument();
  });
});
