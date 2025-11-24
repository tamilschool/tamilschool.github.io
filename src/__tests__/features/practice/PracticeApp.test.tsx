import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PracticeApp } from '@/features/practice/PracticeApp';

// Mock data fetching
vi.mock('@/lib/data/fetchSource', () => ({
    fetchSource: vi.fn(() => Promise.resolve({
        thirukkuralData: '1,கடவுள் வாழ்த்து,1,அகர முதல எழுத்தெல்லாம் ஆதி,பகவன் முதற்றே உலகு.,பொருள்,உரை1,உரை2,உரை3',
        groupsData: '1,1',
    })),
}));

vi.mock('@/lib/data/parseSource', () => ({
    parseSource: vi.fn(() => [
        {
            athikaramNo: 1,
            athikaram: 'கடவுள் வாழ்த்து',
            kuralNo: 1,
            kural: { firstLine: 'அகர முதல எழுத்தெல்லாம் ஆதி', secondLine: 'பகவன் முதற்றே உலகு.' },
            porul: 'பொருள்',
            porulMuVaradha: 'உரை1',
            porulSalamanPapa: 'உரை2',
            porulMuKarunanidhi: 'உரை3',
            words: ['அகர', 'முதல', 'எழுத்தெல்லாம்', 'ஆதி'],
            group: [1],
        },
    ]),
}));

describe('PracticeApp Component', () => {
    afterEach(() => {
        vi.clearAllMocks();
    });

    it('renders loading state initially', () => {
        render(<PracticeApp />);
        expect(screen.getAllByText(/Loading/i)[0]).toBeInTheDocument();
    });

    it('renders practice interface after loading', async () => {
        render(<PracticeApp />);

        await waitFor(() => {
            expect(screen.queryAllByText(/Loading/i)).toHaveLength(0);
        }, { timeout: 2000 });
    });

    it('displays error message on load failure', async () => {
        const mockFetchSource = await import('@/lib/data/fetchSource');
        vi.mocked(mockFetchSource.fetchSource).mockRejectedValueOnce(new Error('Failed'));

        render(<PracticeApp />);

        // Use findByText to wait for the element to appear
        expect(await screen.findByText(/Error/i)).toBeInTheDocument();
    });

    it('has topic selector', async () => {
        render(<PracticeApp />);

        await waitFor(() => {
            const topicElements = screen.queryAllByText(/முதல் சொல்|அதிகாரம்|குறள்/);
            expect(topicElements.length).toBeGreaterThan(0);
        }, { timeout: 2000 });
    });

    it('has navigation controls', async () => {
        render(<PracticeApp />);

        await waitFor(() => {
            const prevButtons = screen.queryAllByLabelText(/Previous Question/i);
            const nextButtons = screen.queryAllByLabelText(/Next Question/i);
            expect(prevButtons.length).toBeGreaterThan(0);
            expect(nextButtons.length).toBeGreaterThan(0);
        }, { timeout: 2000 });
    });
});
