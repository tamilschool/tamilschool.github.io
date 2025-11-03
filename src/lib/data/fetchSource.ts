import { DATA_SOURCE } from '@/types';
import type { ThirukkuralCollection, GroupsCollection } from '@/types';

/**
 * Loads Thirukkural JSON data from the local project copy
 * Reference: old/.../practice/PracticeApp.kt fetchSource()
 */
export async function fetchSource(): Promise<{
  thirukkuralData: ThirukkuralCollection;
  groupsData: GroupsCollection;
}> {
  try {
    console.log(`Loading local data: ${DATA_SOURCE.thirukkuralPath}`);
    console.log(`Loading local data: ${DATA_SOURCE.groupsPath}`);

    const [thirukkuralModule, groupsModule] = await Promise.all([
      import('@/data/thirukkural.json'),
      import('@/data/kids-group.json'),
    ]);

    const thirukkuralData =
      thirukkuralModule.default as ThirukkuralCollection;
    const groupsData = groupsModule.default as GroupsCollection;

    console.log('Source: local thirukkural.json loaded');
    console.log(`Total kurals: ${thirukkuralData.kural.length}`);

    return { thirukkuralData, groupsData };
  } catch (error) {
    console.error('Error loading source data:', error);
    throw error;
  }
}
