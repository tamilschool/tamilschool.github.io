import { useState } from 'react';
import { PracticeApp } from './components/practice/PracticeApp';
import { Phase3Test } from './components/Phase3Test';
import './App.css';

function App() {
  const [showTest, setShowTest] = useState(false);

  if (showTest) {
    return (
      <div>
        <button
          onClick={() => setShowTest(false)}
          className="fixed top-4 right-4 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 z-50"
        >
          Back to App
        </button>
        <Phase3Test />
      </div>
    );
  }

  return (
    <div>
      <button
        onClick={() => setShowTest(true)}
        className="fixed bottom-4 right-4 px-3 py-1 bg-gray-300 text-gray-700 rounded text-sm hover:bg-gray-400 z-50"
      >
        Test Components
      </button>
      <PracticeApp />
    </div>
  );
}

export default App;
