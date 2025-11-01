import { useEffect, useState } from 'react';
import { fetchSource } from './lib/data/fetchSource';
import { parseSource } from './lib/data/parseSource';
import type { Thirukkural } from './types';
import './App.css';

function App() {
  const [kurals, setKurals] = useState<Thirukkural[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const { thirukkuralData, groupsData } = await fetchSource();
        const parsedKurals = parseSource(thirukkuralData, groupsData);
        
        console.log('✓ Data loaded successfully');
        console.log(`Total kurals: ${parsedKurals.length}`);
        console.log(`Group II kurals: ${parsedKurals.filter(k => k.group.includes('II')).length}`);
        console.log(`Group III kurals: ${parsedKurals.filter(k => k.group.includes('III')).length}`);
        console.log('Sample kural:', parsedKurals[0]);
        console.log('Sample words:', parsedKurals[0]?.words);
        
        setKurals(parsedKurals);
        setLoading(false);
      } catch (err) {
        console.error('Failed to load data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load data');
        setLoading(false);
      }
    }

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Loading திருக்குறள்...</h1>
          <p className="text-muted-foreground">Fetching data from GitHub</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center text-destructive">
          <h1 className="text-2xl font-bold mb-4">Error</h1>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">திருக்குறள் பயிற்சி</h1>
      <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded">
        <h2 className="font-semibold text-green-800">✓ Phase 2 Complete - Data Layer Working!</h2>
        <ul className="mt-2 text-sm text-green-700">
          <li>Total kurals loaded: {kurals.length}</li>
          <li>Group II kurals: {kurals.filter(k => k.group.includes('II')).length}</li>
          <li>Group III kurals: {kurals.filter(k => k.group.includes('III')).length}</li>
        </ul>
      </div>
      
      <div className="border rounded p-4">
        <h3 className="font-semibold mb-2">Sample Kural (First one):</h3>
        {kurals[0] && (
          <div className="space-y-2">
            <p><strong>குறள் #{kurals[0].kuralNo}:</strong></p>
            <p className="text-lg">{kurals[0].kural.firstLine}</p>
            <p className="text-lg">{kurals[0].kural.secondLine}</p>
            <p className="text-sm text-muted-foreground mt-2">
              <strong>அதிகாரம்:</strong> {kurals[0].athikaram}
            </p>
            <p className="text-sm text-muted-foreground">
              <strong>Words:</strong> {kurals[0].words.join(', ')}
            </p>
            <p className="text-sm text-muted-foreground">
              <strong>Groups:</strong> {kurals[0].group.join(', ') || 'None'}
            </p>
          </div>
        )}
      </div>
      
      <p className="mt-4 text-sm text-muted-foreground">
        Check browser console for detailed logs
      </p>
    </div>
  );
}

export default App;
