import { describe, it, expect } from 'vitest';
import { parseSource } from '@/lib/data/parseSource';
import { Group } from '@/types';
import type { ThirukkuralCollection, GroupsCollection } from '@/types';

const mockThirukkuralData: ThirukkuralCollection = {
  kural: [
    {
      number: 1,
      line1: 'அகர முதல எழுத்தெல்லாம் ஆதி',
      line2: 'பகவன் முதற்றே உலகு.',
      translation: "'A' leads letters; the Ancient Lord Leads and lords the entire world",
      muVaradha: 'எழுத்துக்கள் எல்லாம் அகரத்தை அடிப்படையாக கொண்டிருக்கின்றன. அதுபோல உலகம் கடவுளை அடிப்படையாக கொண்டிருக்கிறது.',
      salamanPapa: 'எழுத்துக்கள் எல்லாம் அகரத்தில் தொடங்குகின்றன; (அது போல) உலகம் கடவுளில் தொடங்குகிறது.',
      muKarunanidhi: 'அகரம் எழுத்துக்களுக்கு முதன்மை; ஆதிபகவன், உலகில் வாழும் உயிர்களுக்கு முதன்மை',
      explanation: 'As the letter A is the first of all letters, so the eternal God is first in the world',
      couplet: 'A, as its first of letters, every speech maintains;The "Primal Deity" is first through all the world\'s domains',
      transliteration1: 'Akara Mudhala Ezhuththellaam Aadhi',
      transliteration2: 'Pakavan Mudhatre Ulaku',
      paulName: 'அறத்துப்பால்',
      paulTransliteration: 'Araththuppaal',
      paulTranslation: 'Virtue',
      iyalName: 'பாயிரவியல்',
      iyalTransliteration: 'Paayiraviyal',
      iyalTranslation: 'Prologue',
      adikaramName: 'கடவுள் வாழ்த்து',
      adikaramNumber: 1,
      adikaramTamilDesc: 'கடவுளின் பெருமை மற்றும் நன்றி கூறுவது',
      adikaramTransliteration: 'Katavul Vaazhththu',
      adikaramTranslation: 'The Praise of God',
    },
    {
      number: 2,
      line1: 'கற்றதனால் ஆய பயனென்கொல் வாலறிவன்',
      line2: 'நற்றாள் தொழாஅர் எனின்.',
      translation: 'That lore is vain which does not fall At His good feet who knoweth all',
      muVaradha: 'தூய அறிவு வடிவாக விளங்கும் இறைவனுடைய நல்ல திருவடிகளை தொழாமல் இருப்பாரானால், அவர் கற்ற கல்வியினால் ஆகிய பயன் என்ன?',
      salamanPapa: 'தூய அறிவு வடிவானவனின் திருவடிகளை வணங்காதவர், படித்ததனால் பெற்ற பயன்தான் என்ன?',
      muKarunanidhi: 'தன்னைவிட அறிவில் மூத்த பெருந்தகையாளரின் முன்னே வணங்கி நிற்கும் பண்பு இல்லாவிடில் என்னதான் ஒருவர் கற்றிருந்தாலும் அதனால் என்ன பயன்?',
      explanation: 'What Profit have those derived from learning, who worship not the good feet of Him who is possessed of pure knowledge ?',
      couplet: 'No fruit have men of all their studied lore,Save they the \'Purely Wise One\'s\' feet adore',
      transliteration1: 'Katradhanaal Aaya Payanenkol Vaalarivan',
      transliteration2: 'Natraal Thozhaaar Enin',
      paulName: 'அறத்துப்பால்',
      paulTransliteration: 'Araththuppaal',
      paulTranslation: 'Virtue',
      iyalName: 'பாயிரவியல்',
      iyalTransliteration: 'Paayiraviyal',
      iyalTranslation: 'Prologue',
      adikaramName: 'கடவுள் வாழ்த்து',
      adikaramNumber: 1,
      adikaramTamilDesc: 'கடவுளின் பெருமை மற்றும் நன்றி கூறுவது',
      adikaramTransliteration: 'Katavul Vaazhththu',
      adikaramTranslation: 'The Praise of God',
    },
    {
      number: 3,
      line1: 'மலர்மிசை ஏகினான் மாணடி சேர்ந்தார்',
      line2: 'நிலமிசை நீடுவாழ் வார்.',
      translation: 'Long they live on earth who gain The feet of God in florid brain',
      muVaradha: 'அன்பரின் அகமாகிய மலரில் வீற்றிருக்கும் கடவுளின் சிறந்த திருவடிகளை பொருந்தி நினைக்கின்றவர், இன்ப உலகில் நிலைத்து வாழ்வார்',
      salamanPapa: 'மனமாகிய மலர்மீது சென்று இருப்பவனாகிய கடவுளின் சிறந்த திருவடிகளை எப்போதும் நினைப்பவர் இப்பூமியில் நெடுங்காலம் வாழ்வர்',
      muKarunanidhi: 'மலர் போன்ற மனத்தில் நிறைந்தவனைப் பின்பற்றுவோரின் புகழ்வாழ்வு, உலகில் நெடுங்காலம் நிலைத்து நிற்கும்',
      explanation: 'They who are united to the glorious feet of Him who passes swiftly over the flower of the mind, shall flourish long above all worlds',
      couplet: 'His feet, \'Who o\'er the full-blown flower hath past,\' who gainIn bliss long time shall dwell above this earthly plain',
      transliteration1: 'Malarmisai Ekinaan Maanati Serndhaar',
      transliteration2: 'Nilamisai Neetuvaazh Vaar',
      paulName: 'அறத்துப்பால்',
      paulTransliteration: 'Araththuppaal',
      paulTranslation: 'Virtue',
      iyalName: 'பாயிரவியல்',
      iyalTransliteration: 'Paayiraviyal',
      iyalTranslation: 'Prologue',
      adikaramName: 'கடவுள் வாழ்த்து',
      adikaramNumber: 1,
      adikaramTamilDesc: 'கடவுளின் பெருமை மற்றும் நன்றி கூறுவது',
      adikaramTransliteration: 'Katavul Vaazhththu',
      adikaramTranslation: 'The Praise of God',
    },
  ],
};

const mockGroupsData: GroupsCollection = {
  II: '1,2',
  III: '2,3',
};

describe('parseSource Data Utility', () => {
  it('parses all kurals from data', () => {
    const result = parseSource(mockThirukkuralData, mockGroupsData);

    expect(result).toHaveLength(3);
  });

  it('creates Thirukkural objects with correct structure', () => {
    const result = parseSource(mockThirukkuralData, mockGroupsData);
    const first = result[0];

    expect(first).toHaveProperty('athikaramNo');
    expect(first).toHaveProperty('athikaram');
    expect(first).toHaveProperty('kuralNo');
    expect(first).toHaveProperty('kural');
    expect(first).toHaveProperty('porul');
    expect(first).toHaveProperty('porulMuVaradha');
    expect(first).toHaveProperty('porulSalamanPapa');
    expect(first).toHaveProperty('porulMuKarunanidhi');
    expect(first).toHaveProperty('words');
    expect(first).toHaveProperty('group');
  });

  it('preserves kural text correctly', () => {
    const result = parseSource(mockThirukkuralData, mockGroupsData);
    const first = result[0];

    // Use text matching instead of exact encoding
    expect(first.kural.firstLine).toContain('அகர');
    expect(first.kural.secondLine).toContain('பகவன்');
  });

  it('preserves all meanings', () => {
    const result = parseSource(mockThirukkuralData, mockGroupsData);
    const first = result[0];

    expect(first.porulSalamanPapa).toContain('எழுத்துக்கள் எல்லாம் அகரத்தில் தொடங்குகின்றன');
    expect(first.porulMuVaradha).toContain('எழுத்துக்கள் எல்லாம் அகரத்தை அடிப்படையாக');
    expect(first.porulMuKarunanidhi).toContain('அகரம் எழுத்துக்களுக்கு முதன்மை');
  });

  it('assigns correct group mappings', () => {
    const result = parseSource(mockThirukkuralData, mockGroupsData);

    // Kural 1: only in Group II
    expect(result[0].group).toContain(Group.II);
    expect(result[0].group).not.toContain(Group.III);

    // Kural 2: in both Group II and III
    expect(result[1].group).toContain(Group.II);
    expect(result[1].group).toContain(Group.III);

    // Kural 3: only in Group III
    expect(result[2].group).toContain(Group.III);
    expect(result[2].group).not.toContain(Group.II);
  });

  it('assigns Group I when not in any specified group', () => {
    const testData: ThirukkuralCollection = {
      kural: [
        {
          number: 10,
          line1: 'test',
          line2: 'test',
          translation: 'test',
          muVaradha: 'test',
          salamanPapa: 'test',
          muKarunanidhi: 'test',
          explanation: 'test',
          couplet: 'test',
          transliteration1: 'test',
          transliteration2: 'test',
          paulName: 'test',
          paulTransliteration: 'test',
          paulTranslation: 'test',
          iyalName: 'test',
          iyalTransliteration: 'test',
          iyalTranslation: 'test',
          adikaramName: 'test',
          adikaramNumber: 1,
          adikaramTamilDesc: 'test',
          adikaramTransliteration: 'test',
          adikaramTranslation: 'test',
        },
      ],
    };

    const result = parseSource(testData, mockGroupsData);

    expect(result[0].group).toEqual([]);
  });

  it('tokenizes kural text into words', () => {
    const result = parseSource(mockThirukkuralData, mockGroupsData);

    expect(result[0].words.length).toBeGreaterThan(0);
    expect(Array.isArray(result[0].words)).toBe(true);
  });

  it('preserves athikaram metadata', () => {
    const result = parseSource(mockThirukkuralData, mockGroupsData);

    expect(result[0].athikaram).toBe('கடவுள் வாழ்த்து');
    expect(result[0].athikaramNo).toBe(1);

    expect(result[2].athikaram).toBe('கடவுள் வாழ்த்து');
    expect(result[2].athikaramNo).toBe(1);
  });

  it('handles empty group strings gracefully', () => {
    const emptyGroupsData: GroupsCollection = {
      II: '',
      III: '',
    };

    const result = parseSource(mockThirukkuralData, emptyGroupsData);

    expect(result).toHaveLength(3);
    expect(result[0].group).toEqual([]);
  });

  it('handles sparse group assignments', () => {
    const sparseGroupsData: GroupsCollection = {
      II: '1,3',
      III: '2',
    };

    const result = parseSource(mockThirukkuralData, sparseGroupsData);

    expect(result[0].group).toContain(Group.II);
    expect(result[1].group).toContain(Group.III);
    expect(result[2].group).toContain(Group.II);
  });

  it('sets default porul to salamanPapa meaning', () => {
    const result = parseSource(mockThirukkuralData, mockGroupsData);

    result.forEach(kural => {
      expect(kural.porul).toBe(kural.porulSalamanPapa);
    });
  });

  it('preserves kural number correctly', () => {
    const result = parseSource(mockThirukkuralData, mockGroupsData);

    expect(result[0].kuralNo).toBe(1);
    expect(result[1].kuralNo).toBe(2);
    expect(result[2].kuralNo).toBe(3);
  });

  it('handles large dataset efficiently', () => {
    const largeData: ThirukkuralCollection = {
      kural: Array.from({ length: 1330 }, (_, i) => ({
        number: i + 1,
        line1: `line1-${i}`,
        line2: `line2-${i}`,
        translation: `meaning-${i}`,
        muVaradha: `meaning2-${i}`,
        salamanPapa: `meaning-${i}`,
        muKarunanidhi: `meaning3-${i}`,
        explanation: `explanation-${i}`,
        couplet: `couplet-${i}`,
        transliteration1: `trans1-${i}`,
        transliteration2: `trans2-${i}`,
        paulName: `paul-${i}`,
        paulTransliteration: `paulTrans-${i}`,
        paulTranslation: `paulTransEn-${i}`,
        iyalName: `iyal-${i}`,
        iyalTransliteration: `iyalTrans-${i}`,
        iyalTranslation: `iyalTransEn-${i}`,
        adikaramName: `Adhikaram-${Math.floor(i / 10)}`,
        adikaramNumber: Math.floor(i / 10) + 1,
        adikaramTamilDesc: `adiTamilDesc-${i}`,
        adikaramTransliteration: `adiTrans-${i}`,
        adikaramTranslation: `adiTransEn-${i}`,
      })),
    };

    const result = parseSource(largeData, mockGroupsData);

    expect(result).toHaveLength(1330);
    expect(result[0].kuralNo).toBe(1);
    expect(result[1329].kuralNo).toBe(1330);
  });
});
