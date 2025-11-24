import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import CompetitionApp from '@/features/competition/CompetitionApp';

// Mock the data fetching
vi.mock('@/lib/data/fetchSource', () => ({
    fetchSource: vi.fn(() => Promise.resolve({
        thirukkuralData: '1,கடவுள் வாழ்த்து,1,அகர முதல எழுத்தெல்லாம் ஆதி,பகவன் முதற்றே உலகு.,பொருள்,உரை1,உரை2,உரை3',
        groupsData: '1,1',
    })),
}));

vi.mock('@/lib/data/parseSource', () => ({
    parseSource: vi.fn(() => []),
}));

describe('CompetitionApp Component', () => {
    it('renders loading state initially', () => {
        render(<CompetitionApp />);
        expect(screen.getByText(/Loading competition data/i)).toBeInTheDocument();
    });

    it('renders group selection after loading', async () => {
        render(<CompetitionApp />);

        await waitFor(() => {
            expect(screen.queryByText(/Loading/i)).not.toBeInTheDocument();
        }, { timeout: 2000 });
    });

    it('displays error message on load failure', async () => {
        const mockFetchSource = await import('@/lib/data/fetchSource');
        vi.mocked(mockFetchSource.fetchSource).mockRejectedValueOnce(new Error('Failed to load'));

        render(<CompetitionApp />);

        await waitFor(() => {
            expect(screen.getByText(/Error/i)).toBeInTheDocument();
        });
    });
});
