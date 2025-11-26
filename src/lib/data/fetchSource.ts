import type { ThirukkuralCollection, GroupsCollection } from '@/types';

/**
 * Loads Thirukkural JSON data from /data/ path
 * Both the new React app and old Kotlin app use the same data source
 */
export async function fetchSource(): Promise<{
  thirukkuralData: ThirukkuralCollection;
  groupsData: GroupsCollection;
}> {
  try {
    const baseUrl = import.meta.env.BASE_URL;
    const thirukkuralPath = `${baseUrl}data/thirukkural.json`;
    const groupsPath = `${baseUrl}data/kids-group.json`;

    console.log(`Loading data: ${thirukkuralPath}`);
    console.log(`Loading data: ${groupsPath}`);

    const [thirukkuralResponse, groupsResponse] = await Promise.all([
      fetch(thirukkuralPath),
      fetch(groupsPath),
    ]);

    if (!thirukkuralResponse.ok || !groupsResponse.ok) {
      throw new Error('Failed to fetch data files');
    }

    const thirukkuralData = (await thirukkuralResponse.json()) as ThirukkuralCollection;
    const groupsData = (await groupsResponse.json()) as GroupsCollection;

    console.log('Data loaded successfully');
    console.log(`Total kurals: ${thirukkuralData.kural.length}`);

    return { thirukkuralData, groupsData };
  } catch (error) {
    console.error('Error loading source data:', error);
    throw error;
  }
}
