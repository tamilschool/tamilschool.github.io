import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { KuralDisplay } from '@/components/KuralDisplay';
import { KuralMeaning, Group } from '@/types';
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
  porulMuVaradha: 'எழுத்துக்கள் எல்லாம் அகரத்தை அடிப்படையாக கொண்டிருக்கின்றன',
  porulSalamanPapa: 'எழுத்துக்கள் எல்லாம் அகரத்தில் தொடங்குகின்றன',
  porulMuKarunanidhi: 'அகரம் எழுத்துக்களுக்கு முதன்மை; ஆதிபகவன், உலகில் வாழும் உயிர்களுக்கு முதன்மை',
  words: ['அகர', 'முதல', 'எழுத்தெல்லாம்', 'ஆதி'],
  group: [Group.I],
};

describe('KuralDisplay', () => {
  it('renders kural text with both lines', () => {
    const { container } = render(
      <KuralDisplay
        thirukkural={mockKural}
        selectedMeanings={new Set()}
        variant="default"
      />
    );

    // Check for Tamil kural text only
    expect(container.textContent).toContain('அகர');
    expect(container.textContent).toContain('பகவன்');
  });

  it('displays athikaram name and number', () => {
    render(
      <KuralDisplay
        thirukkural={mockKural}
        selectedMeanings={new Set()}
        variant="default"
      />
    );

    expect(screen.getByText('கடவுள் வாழ்த்து')).toBeInTheDocument();
    expect(screen.getByText('அதிகாரம் : 1')).toBeInTheDocument();
    expect(screen.getByText('குறள் : 1')).toBeInTheDocument();
  });

  it('renders with default variant styling', () => {
    const { container } = render(
      <KuralDisplay
        thirukkural={mockKural}
        selectedMeanings={new Set()}
        variant="default"
      />
    );

    const card = container.querySelector('.border');
    expect(card).toHaveClass('border-border');
  });

  it('renders with success variant styling', () => {
    const { container } = render(
      <KuralDisplay
        thirukkural={mockKural}
        selectedMeanings={new Set()}
        variant="success"
      />
    );

    const card = container.querySelector('.border');
    expect(card).toHaveClass('border-emerald-500/60');
    expect(card).toHaveClass('bg-emerald-600');
  });

  it('renders with secondary variant styling', () => {
    const { container } = render(
      <KuralDisplay
        thirukkural={mockKural}
        selectedMeanings={new Set()}
        variant="secondary"
      />
    );

    const card = container.querySelector('.border');
    expect(card).toHaveClass('border-slate-600');
    expect(card).toHaveClass('bg-slate-700');
  });

  it('displays single meaning when selected', () => {
    const { container } = render(
      <KuralDisplay
        thirukkural={mockKural}
        selectedMeanings={new Set([KuralMeaning.SalamanPapa])}
        variant="default"
      />
    );

    expect(container.textContent).toContain('சாலமன் பாப்பையா');
    expect(screen.getByText('உரை : சாலமன் பாப்பையா')).toBeInTheDocument();
  });

  it('displays multiple meanings when selected', () => {
    const { container } = render(
      <KuralDisplay
        thirukkural={mockKural}
        selectedMeanings={new Set([
          KuralMeaning.MuVaradha,
          KuralMeaning.SalamanPapa,
          KuralMeaning.MuKarunanidhi,
        ])}
        variant="default"
      />
    );

    // Check for multiple meanings rendered
    const meanings = container.querySelectorAll('.space-y-2');
    expect(meanings.length).toBeGreaterThan(0);
    expect(container.textContent).toContain('வரதராசனார்');
    expect(container.textContent).toContain('சாலமன்');
  });

  it('does not display meanings footer when no meanings selected', () => {
    const { container } = render(
      <KuralDisplay
        thirukkural={mockKural}
        selectedMeanings={new Set()}
        variant="default"
      />
    );

    // CardFooter should not be present
    const footer = container.querySelector('[class*="py-3 border-t"]');
    expect(footer).not.toBeInTheDocument();
  });

  it('displays index number when provided', () => {
    render(
      <KuralDisplay
        thirukkural={mockKural}
        selectedMeanings={new Set()}
        variant="default"
        index={5}
      />
    );

    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('does not display index when not provided', () => {
    const { container } = render(
      <KuralDisplay
        thirukkural={mockKural}
        selectedMeanings={new Set()}
        variant="default"
      />
    );

    // Check that there's no index badge
    const indexBadge = container.querySelector('.h-8.w-8.rounded-md');
    expect(indexBadge).not.toBeInTheDocument();
  });

  it('separates multiple meanings with borders', () => {
    const { container } = render(
      <KuralDisplay
        thirukkural={mockKural}
        selectedMeanings={new Set([
          KuralMeaning.MuVaradha,
          KuralMeaning.SalamanPapa,
        ])}
        variant="default"
      />
    );

    // Check for separator borders between meanings
    const separators = container.querySelectorAll('.border-t');
    expect(separators.length).toBeGreaterThan(0);
  });
});
