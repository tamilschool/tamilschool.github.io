import { Group } from '@/types';
import type {
  Thirukkural,
  ThirukkuralCollection,
  GroupsCollection,
  KuralOnly,
} from '@/types';
import { getWords } from './tokenizer';

/**
 * Parses JSON data into Thirukkural objects with group mappings
 * Reference: old/.../practice/ReadSource.kt parseSource()
 */
export function parseSource(
  thirukkuralData: ThirukkuralCollection,
  groupsData: GroupsCollection
): Thirukkural[] {
  // Build group mapping from JSON
  const groupsMap = new Map<number, Group[]>();

  // Parse Group II kurals
  if (groupsData.II.trim()) {
    groupsData.II.split(',').forEach((numStr) => {
      const kuralNo = parseInt(numStr.trim());
      if (!isNaN(kuralNo)) {
        if (!groupsMap.has(kuralNo)) {
          groupsMap.set(kuralNo, []);
        }
        groupsMap.get(kuralNo)!.push(Group.II);
      }
    });
  }

  // Parse Group III kurals
  if (groupsData.III.trim()) {
    groupsData.III.split(',').forEach((numStr) => {
      const kuralNo = parseInt(numStr.trim());
      if (!isNaN(kuralNo)) {
        if (!groupsMap.has(kuralNo)) {
          groupsMap.set(kuralNo, []);
        }
        groupsMap.get(kuralNo)!.push(Group.III);
      }
    });
  }

  // Transform JSON to Thirukkural objects
  const thirukkurals: Thirukkural[] = thirukkuralData.kural.map((data) => {
    const kural: KuralOnly = {
      firstLine: data.line1,
      secondLine: data.line2,
    };

    const fullText = `${data.line1} ${data.line2}`;
    const words = getWords(fullText);

    return {
      athikaramNo: data.adikaramNumber,
      athikaram: data.adikaramName,
      kuralNo: data.number,
      kural,
      porul: data.salamanPapa, // Default meaning
      porulMuVaradha: data.muVaradha,
      porulSalamanPapa: data.salamanPapa,
      porulMuKarunanidhi: data.muKarunanidhi,
      words,
      group: groupsMap.get(data.number) || [],
    };
  });

  return thirukkurals;
}
