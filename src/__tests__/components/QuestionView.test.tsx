import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { QuestionView } from '@/components/QuestionView';
import { Topic, KuralMeaning, Group } from '@/types';
import type { Thirukkural } from '@/types';

const mockKural: Thirukkural = {
  athikaramNo: 1,
  athikaram: 'கடவுள் வாழ்த்து',
  kuralNo: 1,
  kural: {
    firstLine: 'அகர முதல எழுத்தெல்லாம் ஆதி',
    secondLine: 'பகவன் முதற்றே உலகு.',
  },
  porul: 'எழுத்துக்கள் எல்லாம் அகரத்தில் தொடங்குகின்றன; (அது போல) உலகம் கடவுளில் தொடங்குகிறது.',
  porulMuVaradha: 'எழுத்துக்கள் எல்லாம் அகரத்தை அடிப்படையாக கொண்டிருக்கின்றன. அதுபோல உலகம் கடவுளை அடிப்படையாக கொண்டிருக்கிறது.',
  porulSalamanPapa: 'எழுத்துக்கள் எல்லாம் அகரத்தில் தொடங்குகின்றன; (அது போல) உலகம் கடவுளில் தொடங்குகிறது.',
  porulMuKarunanidhi: 'அகரம் எழுத்துக்களுக்கு முதன்மை; ஆதிபகவன், உலகில் வாழும் உயிர்களுக்கு முதன்மை',
  words: ['அகர', 'முதல', 'எழுத்தெல்லாம்', 'ஆதி'],
  group: [Group.I],
};

describe('QuestionView', () => {
  it('renders no question data message when currentQuestion is undefined', () => {
    render(
      <QuestionView
        topic={Topic.Athikaram}
        selectedMeanings={new Set()}
        showAnswer={false}
        currentQuestion={undefined}
      />
    );

    expect(screen.getByText('No question data available')).toBeInTheDocument();
  });

  it('displays first word when topic is FirstWord', () => {
    render(
      <QuestionView
        topic={Topic.FirstWord}
        selectedMeanings={new Set()}
        showAnswer={false}
        currentQuestion={{ word: 'அகர' }}
      />
    );

    expect(screen.getByText('அகர')).toBeInTheDocument();
  });

  it('displays last word when topic is LastWord', () => {
    render(
      <QuestionView
        topic={Topic.LastWord}
        selectedMeanings={new Set()}
        showAnswer={false}
        currentQuestion={{ word: 'உலகு' }}
      />
    );

    expect(screen.getByText('உலகு')).toBeInTheDocument();
  });

  it('displays kural when topic is Kural', () => {
    const { container } = render(
      <QuestionView
        topic={Topic.Kural}
        selectedMeanings={new Set()}
        showAnswer={false}
        currentQuestion={{ kural: mockKural }}
      />
    );

    // Check for kural content - Tamil text only
    expect(container.textContent).toContain('அகர');
  });

  it('does not show answer initially', () => {
    render(
      <QuestionView
        topic={Topic.Athikaram}
        selectedMeanings={new Set()}
        showAnswer={false}
        currentQuestion={{ athikaram: 'கடவுள் வாழ்த்து', answers: [mockKural] }}
      />
    );

    // Answer should not be visible initially
    expect(screen.queryByText('1')).not.toBeInTheDocument();
  });

  it('shows answer when showAnswer is true with multiple kurals', () => {
    const { container } = render(
      <QuestionView
        topic={Topic.Athikaram}
        selectedMeanings={new Set([KuralMeaning.SalamanPapa])}
        showAnswer={true}
        currentQuestion={{ athikaram: 'கடவுள் வாழ்த்து', answers: [mockKural, mockKural] }}
      />
    );

    // Should display answers (KuralDisplay component renders the kurals)
    expect(container.textContent).toContain('அகர');
    // Should contain meaning (may have multiple since there are multiple kurals)
    const meaningElements = screen.queryAllByText(function(content, element) {
      return element && element.textContent.includes('எழுத்துக்கள்');
    });
    expect(meaningElements.length).toBeGreaterThan(0);
  });

  it('displays meanings when Porul topic with selectedMeanings', () => {
    const meaningSet = new Set([KuralMeaning.SalamanPapa]);

    const { container } = render(
      <QuestionView
        topic={Topic.Porul}
        selectedMeanings={meaningSet}
        showAnswer={false}
        currentQuestion={{ kural: mockKural }}
      />
    );

    expect(container.textContent).toContain('சாலமன் பாப்பையா');
  });

  it('does not display meanings when no meanings selected', () => {
    render(
      <QuestionView
        topic={Topic.Porul}
        selectedMeanings={new Set()}
        showAnswer={false}
        currentQuestion={{ kural: mockKural }}
      />
    );

    // Should not show the meaning when no meanings selected
    const container = render(
      <QuestionView
        topic={Topic.Porul}
        selectedMeanings={new Set()}
        showAnswer={false}
        currentQuestion={{ kural: mockKural }}
      />
    ).container;
    // Check that no meaning is displayed
    expect(container.querySelector('.text-lg')).not.toBeInTheDocument();
  });

  it('displays multiple selected meanings', () => {
    const meaningSet = new Set([KuralMeaning.MuVaradha, KuralMeaning.SalamanPapa]);

    const { container } = render(
      <QuestionView
        topic={Topic.Porul}
        selectedMeanings={meaningSet}
        showAnswer={false}
        currentQuestion={{ kural: mockKural }}
      />
    );

    // Check for Tamil meanings in the rendered output
    expect(container.textContent).toContain('அகரத்தை');
    expect(container.textContent).toContain('வரதராசனார');
  });
});
