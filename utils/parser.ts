import { PlaceResult } from '../types';

/**
 * Parses a markdown table string into an array of PlaceResult objects.
 * Assumes the columns are somewhat consistent based on the prompt instructions.
 */
export const parseMarkdownTable = (text: string): PlaceResult[] => {
  const lines = text.split('\n');
  const results: PlaceResult[] = [];

  // Find the separator line (e.g., |---|---|...)
  const separatorIndex = lines.findIndex(line => line.trim().match(/^\|?(\s*:?-+:?\s*\|)+\s*:?-+:?\s*\|?$/));

  if (separatorIndex === -1) {
    return results;
  }

  // Iterate through lines after the separator
  for (let i = separatorIndex + 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line || !line.includes('|')) continue;

    // Remove leading/trailing pipes and split
    const columns = line.split('|').map(col => col.trim()).filter((_, idx, arr) => {
        // Handle cases where split results in empty strings at start/end due to pipe placement
        if (idx === 0 && line.startsWith('|')) return false;
        if (idx === arr.length - 1 && line.endsWith('|')) return false;
        return true;
    });
    
    // We filter again to be safe against the strict split above vs simplistic split
    const cleanColumns = line.split('|').map(c => c.trim()).filter(c => c !== '');

    // Expected columns from prompt: Name | Type | Phone | Address | Place ID
    if (cleanColumns.length >= 5) {
      results.push({
        name: cleanColumns[0] || 'Unknown',
        type: cleanColumns[1] || 'Unknown',
        phone: cleanColumns[2] || 'N/A',
        address: cleanColumns[3] || 'N/A',
        id: cleanColumns[4] || 'N/A',
      });
    }
  }

  return results;
};