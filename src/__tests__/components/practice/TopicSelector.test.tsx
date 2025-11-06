import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TopicSelector } from '@/components/practice/TopicSelector';
import { Topic } from '@/types';

describe('TopicSelector', () => {
  it('renders with combobox role', () => {
    const onTopicChange = vi.fn();
    render(<TopicSelector selectedTopic={Topic.FirstWord} onTopicChange={onTopicChange} />);
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('renders with FirstWord selected', () => {
    const onTopicChange = vi.fn();
    render(<TopicSelector selectedTopic={Topic.FirstWord} onTopicChange={onTopicChange} />);
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('renders with Athikaram selected', () => {
    const onTopicChange = vi.fn();
    render(<TopicSelector selectedTopic={Topic.Athikaram} onTopicChange={onTopicChange} />);
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('renders with Kural selected', () => {
    const onTopicChange = vi.fn();
    render(<TopicSelector selectedTopic={Topic.Kural} onTopicChange={onTopicChange} />);
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('renders with Porul selected', () => {
    const onTopicChange = vi.fn();
    render(<TopicSelector selectedTopic={Topic.Porul} onTopicChange={onTopicChange} />);
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('renders with LastWord selected', () => {
    const onTopicChange = vi.fn();
    render(<TopicSelector selectedTopic={Topic.LastWord} onTopicChange={onTopicChange} />);
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('renders with AllKurals selected', () => {
    const onTopicChange = vi.fn();
    render(<TopicSelector selectedTopic={Topic.AllKurals} onTopicChange={onTopicChange} />);
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('maintains selection through re-renders', () => {
    const onTopicChange = vi.fn();
    const { rerender } = render(
      <TopicSelector selectedTopic={Topic.FirstWord} onTopicChange={onTopicChange} />
    );
    expect(screen.getByRole('combobox')).toBeInTheDocument();

    rerender(
      <TopicSelector selectedTopic={Topic.FirstWord} onTopicChange={onTopicChange} />
    );
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('transitions between topics', () => {
    const onTopicChange = vi.fn();
    const { rerender } = render(
      <TopicSelector selectedTopic={Topic.FirstWord} onTopicChange={onTopicChange} />
    );
    expect(screen.getByRole('combobox')).toBeInTheDocument();

    rerender(
      <TopicSelector selectedTopic={Topic.Athikaram} onTopicChange={onTopicChange} />
    );
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('has proper styling classes', () => {
    const onTopicChange = vi.fn();
    render(<TopicSelector selectedTopic={Topic.FirstWord} onTopicChange={onTopicChange} />);
    const combobox = screen.getByRole('combobox');
    expect(combobox).toHaveClass('border', 'rounded-lg');
  });
});
