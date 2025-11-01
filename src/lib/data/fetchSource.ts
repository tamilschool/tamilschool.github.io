import { DATA_SOURCE } from '@/types';
import type { ThirukkuralCollection, GroupsCollection } from '@/types';

/**
 * Fetches Thirukkural JSON data from GitHub raw URLs
 * Reference: old/.../practice/PracticeApp.kt fetchSource()
 */
export async function fetchSource(): Promise<{
  thirukkuralData: ThirukkuralCollection;
  groupsData: GroupsCollection;
}> {
  try {
    console.log(`Fetching from: ${DATA_SOURCE.thirukkuralUrl}`);
    console.log(`Fetching from: ${DATA_SOURCE.groupsUrl}`);

    const [thirukkuralResponse, groupsResponse] = await Promise.all([
      fetch(DATA_SOURCE.thirukkuralUrl),
      fetch(DATA_SOURCE.groupsUrl),
    ]);

    if (!thirukkuralResponse.ok) {
      throw new Error(
        `Failed to fetch thirukkural.json: ${thirukkuralResponse.statusText}`
      );
    }

    if (!groupsResponse.ok) {
      throw new Error(
        `Failed to fetch kids-group.json: ${groupsResponse.statusText}`
      );
    }

    const thirukkuralData =
      (await thirukkuralResponse.json()) as ThirukkuralCollection;
    const groupsData = (await groupsResponse.json()) as GroupsCollection;

    console.log(`Source: ${DATA_SOURCE.thirukkuralUrl} loaded`);
    console.log(`Total kurals: ${thirukkuralData.kural.length}`);

    return { thirukkuralData, groupsData };
  } catch (error) {
    console.error('Error fetching source data:', error);
    throw error;
  }
}
