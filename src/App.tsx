import { useState } from 'react';
import './App.css';
import { PracticeApp } from './features/practice/PracticeApp';
import CompetitionApp from './features/competition/CompetitionApp';
import SignOutConfirm from './features/competition/SignOutConfirm';

function App() {
  const [isPracticeMode, setIsPracticeMode] = useState(true);
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  const [competitionKey, setCompetitionKey] = useState(0);

  const toggleMode = () => {
    setIsPracticeMode(!isPracticeMode);
  };

  const handleExitCompetition = () => {
    setShowExitConfirm(true);
  };

  const confirmExit = () => {
    setShowExitConfirm(false);
    setIsPracticeMode(true);
    setCompetitionKey(0); // Reset key when exiting
  };

  const handleRestartCompetition = () => {
    setShowExitConfirm(false);
    setCompetitionKey(prev => prev + 1);
  };

  const cancelExit = () => {
    setShowExitConfirm(false);
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">
            {isPracticeMode ? 'திருக்குறள் பயிற்சி' : 'திருக்குறள் போட்டி'}
          </h1>
          {isPracticeMode ? (
            <button
              onClick={toggleMode}
              className="px-4 py-2 bg-white text-purple-600 font-semibold rounded hover:bg-gray-100 transition-colors"
            >
              போட்டி
            </button>
          ) : (
            <button
              onClick={handleExitCompetition}
              className="px-4 py-2 bg-white text-rose-600 font-semibold rounded hover:bg-gray-100 transition-colors"
            >
              வெளியேறு
            </button>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        {isPracticeMode ? <PracticeApp /> : <CompetitionApp key={competitionKey} />}
      </div>

      {/* Exit Confirmation Dialog */}
      {showExitConfirm && (
        <SignOutConfirm
          onExit={confirmExit}
          onRestart={handleRestartCompetition}
          onCancel={cancelExit}
        />
      )}
    </div>
  );
}

export default App;
