import { useState } from 'react';
import { useTimer } from '@/hooks/useTimer';
import { useNavigation } from '@/hooks/useNavigation';
import { KuralDisplay } from './KuralDisplay';
import { TimerDisplay } from './TimerDisplay';
import { QuestionView } from './QuestionView';
import { Button } from '@/components/ui/button';
import { Topic, KuralMeaning, Group } from '@/types';
import type { Thirukkural, KuralMeaning as KuralMeaningType, Topic as TopicType } from '@/types';

// Mock data for testing
const mockKurals: Thirukkural[] = [
  {
    kuralNo: 1,
    athikaramNo: 1,
    athikaram: 'கடவுள் வாழ்த்து',
    kural: {
      firstLine: 'அகர முதல எழுத்தெல்லாம் ஆதி',
      secondLine: 'பகவன் முதற்றே உலகு',
    },
    porul: 'ஸாலமன் பாப்பையா: அகரம் எழுத்துக்களுக்கு முதன்மை.',
    porulMuVaradha: 'அகரம் எழுத்துக்கெல்லாம் முதன்மையாக இருப்பது போன்றே, ஆதிபகவன் உலகத்திற்கு முதன்மையாக இருக்கிறான்.',
    porulSalamanPapa: 'ஸாலமன் பாப்பையா: அகரம் எழுத்துக்களுக்கு முதன்மை.',
    porulMuKarunanidhi: 'மு.கருணாநிதி: அகரம் எழுத்துக்களுக்கு முதன்மை.',
    words: ['அகர', 'முதல', 'எழுத்தெல்லாம்', 'ஆதி', 'பகவன்', 'முதற்றே', 'உலகு'],
    group: [Group.I, Group.II, Group.III],
  },
  {
    kuralNo: 2,
    athikaramNo: 1,
    athikaram: 'கடவுள் வாழ்த்து',
    kural: {
      firstLine: 'கற்றதனால் ஆய பயனென்கொல் வாலறிவன்',
      secondLine: 'நற்றாள் தொழாஅர் எனின்',
    },
    porul: 'ஸாலமன் பாப்பையா: சிறந்த அறிவுடையவனுடைய திருவடியை வணங்காவிட்டால் கற்றதனால் பயன் என்ன?',
    porulMuVaradha: 'நற்றாள் தொழாதார் எனின் கற்றதனால் ஆய பயன் என்? வாலறிவன் நற்றாள் தொழாதார் எனின் கற்றதனால் யாது பயன்?',
    porulSalamanPapa: 'ஸாலமன் பாப்பையா: சிறந்த அறிவுடையவனுடைய திருவடியை வணங்காவிட்டால் கற்றதனால் பயன் என்ன?',
    porulMuKarunanidhi: 'மு.கருணாநிதி: சிறந்த அறிவாளனின் திருவடிகளை வணங்காவிட்டால் கல்வியால் பயன் என்ன?',
    words: ['கற்றதனால்', 'ஆய', 'பயனென்கொல்', 'வாலறிவன்', 'நற்றாள்', 'தொழாஅர்', 'எனின்'],
    group: [Group.I, Group.II, Group.III],
  },
];

export function Phase3Test() {
  const [selectedMeanings, setSelectedMeanings] = useState<Set<KuralMeaningType>>(
    new Set([KuralMeaning.MuVaradha, KuralMeaning.SalamanPapa])
  );
  const [showAnswer, setShowAnswer] = useState(false);
  const [currentTopic] = useState<TopicType>(Topic.Athikaram);

  // Test useTimer
  const timer = useTimer({ initialTime: 240, isLive: true });

  // Test useNavigation
  const { index, current, goNext, goPrevious } = useNavigation({
    targets: mockKurals,
    thirukkurals: mockKurals,
    initialIndex: 0,
  });

  const currentKural = current;

  return (
    <div className="container mx-auto p-4 max-w-4xl space-y-6">
      <h1 className="text-3xl font-bold mb-6">Phase 3 Component Testing</h1>

      {/* Timer Test */}
      <section className="space-y-2">
        <h2 className="text-xl font-semibold">Timer Component</h2>
        <TimerDisplay
          time={timer.time}
          isLive={true}
          isPaused={timer.isPaused}
          onToggle={() => timer.toggle()}
          onReset={() => timer.reset()}
        />
        <div className="text-sm text-muted-foreground">
          Expected: 240 seconds (4:00), countdown with play/pause/reset controls
        </div>
      </section>

      {/* Navigation Test */}
      <section className="space-y-2">
        <h2 className="text-xl font-semibold">Navigation Hook</h2>
        <div className="flex gap-2">
          <Button onClick={goPrevious}>Previous</Button>
          <Button onClick={goNext}>Next</Button>
          <span className="px-4 py-2 bg-secondary rounded">
            Kural #{currentKural.kuralNo} (Index: {index})
          </span>
        </div>
        <div className="text-sm text-muted-foreground">
          Expected: Circular navigation through 2 mock kurals, randomized order
        </div>
      </section>

      {/* KuralDisplay Test */}
      <section className="space-y-2">
        <h2 className="text-xl font-semibold">Kural Display Component</h2>
        
        <h3 className="text-lg">Default Variant:</h3>
        <KuralDisplay
          thirukkural={currentKural}
          selectedMeanings={selectedMeanings}
          variant="default"
        />

        <h3 className="text-lg">Success Variant:</h3>
        <KuralDisplay
          thirukkural={currentKural}
          selectedMeanings={selectedMeanings}
          variant="success"
        />

        <h3 className="text-lg">Secondary Variant:</h3>
        <KuralDisplay
          thirukkural={currentKural}
          selectedMeanings={selectedMeanings}
          variant="secondary"
        />

        <div className="flex gap-2 flex-wrap">
          <Button
            variant={selectedMeanings.has(KuralMeaning.MuVaradha) ? 'default' : 'outline'}
            onClick={() => {
              const newSet = new Set(selectedMeanings);
              if (newSet.has(KuralMeaning.MuVaradha)) {
                newSet.delete(KuralMeaning.MuVaradha);
              } else {
                newSet.add(KuralMeaning.MuVaradha);
              }
              setSelectedMeanings(newSet);
            }}
          >
            Toggle MV
          </Button>
          <Button
            variant={selectedMeanings.has(KuralMeaning.SalamanPapa) ? 'default' : 'outline'}
            onClick={() => {
              const newSet = new Set(selectedMeanings);
              if (newSet.has(KuralMeaning.SalamanPapa)) {
                newSet.delete(KuralMeaning.SalamanPapa);
              } else {
                newSet.add(KuralMeaning.SalamanPapa);
              }
              setSelectedMeanings(newSet);
            }}
          >
            Toggle SAL
          </Button>
        </div>
        <div className="text-sm text-muted-foreground">
          Expected: Card with athikaram header, kural couplet, scholar meanings in footer
        </div>
      </section>

      {/* QuestionView Test */}
      <section className="space-y-2">
        <h2 className="text-xl font-semibold">Question View Component</h2>
        <QuestionView
          topic={currentTopic}
          selectedMeanings={selectedMeanings}
          showAnswer={showAnswer}
          currentQuestion={{
            athikaram: currentKural.athikaram,
            answers: mockKurals.filter(k => k.athikaram === currentKural.athikaram),
          }}
        />
        <div className="text-sm text-muted-foreground">
          Expected: Question header with topic name, show/hide answer button, displays kurals for athikaram
        </div>
      </section>
    </div>
  );
}
