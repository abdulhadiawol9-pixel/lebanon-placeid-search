import { GoogleGenAI } from "@google/genai";
import { SearchFilters } from "../types";

const getSystemInstruction = () => `
You are a helpful assistant acting as an interface for the Google Places API. 
Your goal is to find specific details about businesses.

RULES:
1.  Search specifically using the Google Maps tool.
2.  Output ONLY a Markdown table.
3.  The table MUST have exactly these columns in this order: Name | Type | Phone | Address | Google Place ID.
4.  If a specific detail (like Phone) is not available, put "N/A".
5.  Do not include any conversational text before or after the table.
6.  Ensure the "Google Place ID" is the actual alphanumeric string used by Google Maps API.
7.  Format the "Type" column as either "Restaurant" or "Hotel" (or specific subtype like "Cafe").
`;

export const searchPlacesWithGemini = async (
  query: string, 
  filters: SearchFilters
): Promise<string> => {
  if (!process.env.API_KEY) {
    throw new Error("API Key is missing. Please select a paid API key.");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  // Construct a specific prompt based on filters
  let refinedQuery = `Search for "${query}"`;
  
  if (filters.onlyLebanon) {
    refinedQuery += ` located in Lebanon`;
  }
  
  if (filters.type === 'restaurant') {
    refinedQuery += ` that are restaurants, cafes, or bakeries.`;
  } else if (filters.type === 'hotel') {
    refinedQuery += ` that are hotels, resorts, or guesthouses.`;
  } else {
    refinedQuery += ` that are restaurants or hotels.`;
  }

  refinedQuery += ` Provide the list in a markdown table with columns: Name | Type | Phone | Address | Google Place ID. Avoid duplicates.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: refinedQuery,
      config: {
        systemInstruction: getSystemInstruction(),
        tools: [{ googleMaps: {} }],
        // We do NOT use responseMimeType: "application/json" because we are using googleMaps tool
        // and we want a markdown table which is more reliable for the model to structure combined with tool output.
      },
    });

    return response.text || "";
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};