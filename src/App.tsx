import { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import './App.css';
import { PracticeApp } from './features/practice/PracticeApp';
import CompetitionApp from './features/competition/CompetitionApp';
import SignOutConfirm from './features/competition/SignOutConfirm';
import HomePage from './features/home/HomePage';
import { fetchSource } from './lib/data/fetchSource';
import { parseSource } from './lib/data/parseSource';
import { analyzeQuestionPoolCoverage } from './lib/analyzeQuestionPool';
import { Group } from './types';

// Run worst-case analysis on startup
let analysisRun = false;
async function runStartupAnalysis() {
  if (analysisRun) return;
  analysisRun = true;

  try {
    const sourceData = await fetchSource();
    const allKurals = parseSource(sourceData.thirukkuralData, sourceData.groupsData);

    // Analyze Group 2
    const group2Kurals = allKurals.filter(k => k.group.includes(Group.II));
    analyzeQuestionPoolCoverage(group2Kurals, 'GROUP 2 (7-9 years)');

    // Analyze Group 3
    const group3Kurals = allKurals.filter(k => k.group.includes(Group.III));
    analyzeQuestionPoolCoverage(group3Kurals, 'GROUP 3 (10+ years)');
  } catch (err) {
    console.error('Failed to run startup analysis:', err);
  }
}

function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  // Run worst-case analysis on mount
  useEffect(() => {
    runStartupAnalysis();
  }, []);

  const isHomePage = location.pathname === '/';
  const isPracticeMode = location.pathname.startsWith('/practice');
  const isCompetitionMode = location.pathname.startsWith('/competition');

  const handleHomeClick = () => {
    if (isPracticeMode) {
      // Practice mode: Go directly to home without confirmation
      navigate('/');
    } else if (isCompetitionMode) {
      // Competition mode: Ask for confirmation
      setShowExitConfirm(true);
    }
  };

  const confirmExit = () => {
    setShowExitConfirm(false);
    navigate('/');
  };

  const cancelExit = () => {
    setShowExitConfirm(false);
  };

  return (
    <div className="flex flex-col h-screen-dynamic">
      {/* Header - Hidden on HomePage */}
      {!isHomePage && (
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-md relative z-20 overflow-hidden">
          {/* Decorative background elements for glass effect depth */}
          <div className="absolute top-[-50%] left-[-10%] w-64 h-64 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute top-[-50%] right-[-10%] w-64 h-64 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>

          <div className="max-w-7xl mx-auto px-3 py-2 md:px-4 md:py-4 flex items-center justify-between relative z-10">
            {/* Glassmorphism Title Card */}
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-300 to-purple-300 rounded-xl blur opacity-30 group-hover:opacity-50 transition duration-1000"></div>
              <div className="relative px-4 py-1.5 md:px-6 md:py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl shadow-xl">
                <h1 className="text-lg md:text-2xl font-bold text-white drop-shadow-sm tracking-wide">
                  {isPracticeMode ? 'திருக்குறள் பயிற்சி' : 'திருக்குறள் போட்டி'}
                </h1>
              </div>
            </div>

            <div className="flex gap-4 items-center">
              <button
                onClick={handleHomeClick}
                className={`px-4 py-2 bg-white/90 backdrop-blur-sm font-semibold rounded-lg shadow-sm hover:bg-white transition-all duration-300 ${isPracticeMode ? 'text-purple-700' : 'text-rose-600'
                  }`}
              >
                முகப்பு
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 overflow-hidden relative">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/practice/:groupId" element={<PracticeApp />} />
          <Route path="/competition/:groupId" element={<CompetitionApp />} />
          {/* Fallback for old routes or direct access without group */}
          <Route path="/practice" element={<HomePage />} />
          <Route path="/competition" element={<HomePage />} />
        </Routes>
      </div>

      {/* Exit Confirmation Dialog */}
      {showExitConfirm && (
        <SignOutConfirm
          onExit={confirmExit}
          onRestart={() => { }} // Not needed for Home flow
          onCancel={cancelExit}
          title="முகப்புக்கு செல்லவா?"
          description="நீங்கள் முகப்புக்குச் சென்றால், தற்போதைய போட்டி முடிவடையும்."
          confirmText="ஆம்"
          cancelText="இல்லை"
          showRestart={false} // Only Yes/No
        />
      )}
    </div>
  );
}

function App() {
  return (
    <HashRouter>
      <Layout />
    </HashRouter>
  );
}

export default App;
