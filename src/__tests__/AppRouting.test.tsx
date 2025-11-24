import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import App from '../App';

// Mock the child components to avoid complex rendering and focus on routing
// We need to mock PracticeApp to simulate the LandingView behavior or just check props
vi.mock('../features/practice/PracticeApp', () => ({
    PracticeApp: ({ selectedGroup, onGroupSelect }: { selectedGroup: any, onGroupSelect: any }) => (
        <div data-testid="practice-app">
            {!selectedGroup ? (
                <div data-testid="landing-view">
                    <button onClick={() => onGroupSelect('II')}>Select Group II</button>
                    <a href="/old/index.html">Old App</a>
                    <button data-testid="competition-btn">Competition</button>
                </div>
            ) : (
                <div data-testid="practice-view">Practice Active</div>
            )}
        </div>
    )
}));

vi.mock('../features/competition/CompetitionApp', () => ({
    default: () => <div data-testid="competition-app">Competition App Content</div>
}));

vi.mock('../features/competition/SignOutConfirm', () => ({
    default: ({ onExit, onCancel }: { onExit: () => void, onCancel: () => void }) => (
        <div data-testid="sign-out-confirm">
            <button onClick={onExit}>Confirm Exit</button>
            <button onClick={onCancel}>Cancel</button>
        </div>
    )
}));

describe('App Routing', () => {
    it('redirects to /practice by default', () => {
        window.history.pushState({}, 'Test page', '/#/');
        render(<App />);
        expect(screen.getByTestId('practice-app')).toBeInTheDocument();
        expect(screen.getByText('திருக்குறள் பயிற்சி')).toBeInTheDocument();
    });

    it('shows landing view initially in practice mode', () => {
        window.history.pushState({}, 'Test page', '/#/practice');
        render(<App />);
        expect(screen.getByTestId('landing-view')).toBeInTheDocument();
        expect(screen.getByText('Old App')).toBeInTheDocument();
    });

    it('navigates to competition mode', () => {
        window.history.pushState({}, 'Test page', '/#/competition');
        render(<App />);
        expect(screen.getByTestId('competition-app')).toBeInTheDocument();
        expect(screen.getByText('திருக்குறள் போட்டி')).toBeInTheDocument();
    });

    it('shows home button after group selection in practice mode', () => {
        window.history.pushState({}, 'Test page', '/#/practice');
        render(<App />);

        // Select a group
        fireEvent.click(screen.getByText('Select Group II'));

        // Should show practice view
        expect(screen.getByTestId('practice-view')).toBeInTheDocument();

        // Should show Home button in header
        const homeBtn = screen.getByText('முகப்பு');
        expect(homeBtn).toBeInTheDocument();
    });

    it('shows confirmation when home button is clicked', () => {
        window.history.pushState({}, 'Test page', '/#/practice');
        render(<App />);

        // Select group to see Home button
        fireEvent.click(screen.getByText('Select Group II'));

        // Click Home
        fireEvent.click(screen.getByText('முகப்பு'));

        expect(screen.getByTestId('sign-out-confirm')).toBeInTheDocument();

        // Confirm
        fireEvent.click(screen.getByText('Confirm Exit'));

        // Should be back to landing view
        expect(screen.getByTestId('landing-view')).toBeInTheDocument();
    });
});
