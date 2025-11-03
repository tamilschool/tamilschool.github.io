import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TimerDisplay } from '@/components/TimerDisplay';
import { vi } from 'vitest';

describe('TimerDisplay', () => {
  it('renders timer with correct time format', () => {
    const mockToggle = vi.fn();
    const mockReset = vi.fn();

    render(
      <TimerDisplay
        time={125}
        isLive={true}
        isPaused={false}
        totalTime={240}
        onToggle={mockToggle}
        onReset={mockReset}
      />
    );

    // 125 seconds = 2:05 (formatted as "2 : 05" with spaces)
    expect(screen.getByText(/2\s*:\s*05/)).toBeInTheDocument();
  });

  it('displays formatted time with leading zeros', () => {
    const mockToggle = vi.fn();
    const mockReset = vi.fn();

    render(
      <TimerDisplay
        time={5}
        isLive={true}
        isPaused={false}
        totalTime={240}
        onToggle={mockToggle}
        onReset={mockReset}
      />
    );

    // 5 seconds = 0:05
    expect(screen.getByText(/0\s*:\s*05/)).toBeInTheDocument();
  });

  it('displays progress indicator with conic gradient', () => {
    const mockToggle = vi.fn();
    const mockReset = vi.fn();

    const { container } = render(
      <TimerDisplay
        time={120}
        isLive={true}
        isPaused={false}
        totalTime={240}
        onToggle={mockToggle}
        onReset={mockReset}
      />
    );

    // Should have a conic-gradient background (progress indicator)
    const progressDiv = container.querySelector('div[style*="conic-gradient"]');
    expect(progressDiv).toBeInTheDocument();
  });

  it('renders timer button that calls onToggle when clicked', async () => {
    const user = (await import('@testing-library/user-event')).default;
    const mockToggle = vi.fn();
    const mockReset = vi.fn();

    render(
      <TimerDisplay
        time={125}
        isLive={true}
        isPaused={false}
        totalTime={240}
        onToggle={mockToggle}
        onReset={mockReset}
      />
    );

    const button = screen.getByRole('button');
    await user.click(button);
    expect(mockToggle).toHaveBeenCalledOnce();
  });

  it('displays "தொடங்கு" (Start) when not live', () => {
    const mockToggle = vi.fn();
    const mockReset = vi.fn();

    render(
      <TimerDisplay
        time={125}
        isLive={false}
        isPaused={false}
        totalTime={240}
        onToggle={mockToggle}
        onReset={mockReset}
      />
    );

    expect(screen.getByText('தொடங்கு')).toBeInTheDocument();
  });

  it('displays "மீண்டும்" (Again) when time expires', () => {
    const mockToggle = vi.fn();
    const mockReset = vi.fn();

    render(
      <TimerDisplay
        time={0}
        isLive={true}
        isPaused={false}
        totalTime={240}
        onToggle={mockToggle}
        onReset={mockReset}
      />
    );

    expect(screen.getByText('மீண்டும்')).toBeInTheDocument();
  });
});
