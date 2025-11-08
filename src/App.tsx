import { useState } from 'react';
import './App.css';
import { PracticeApp } from './components/practice/PracticeApp';
import CompetitionApp from './features/competition/CompetitionApp';

function App() {
  const [isPracticeMode, setIsPracticeMode] = useState(true);

  const toggleMode = () => {
    setIsPracticeMode(!isPracticeMode);
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">
            {isPracticeMode ? 'திருக்குறள் பயிற்சி' : 'திருக்குறள் போட்டி'}
          </h1>
          <button
            onClick={toggleMode}
            className="px-4 py-2 bg-white text-purple-600 font-semibold rounded hover:bg-gray-100 transition-colors"
          >
            {isPracticeMode ? 'போட்டி' : 'பயிற்சி'}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        {isPracticeMode ? <PracticeApp /> : <CompetitionApp />}
      </div>
    </div>
  );
}

export default App;
