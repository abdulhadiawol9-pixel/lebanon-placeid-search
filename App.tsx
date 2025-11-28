import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { SearchInput } from './components/SearchInput';
import { ResultsTable } from './components/ResultsTable';
import { PlaceResult, SearchState, SearchFilters } from './types';
import { searchPlacesWithGemini } from './services/geminiService';
import { parseMarkdownTable } from './utils/parser';

const App: React.FC = () => {
  const [status, setStatus] = useState<SearchState>(SearchState.IDLE);
  const [results, setResults] = useState<PlaceResult[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = useCallback(async (query: string, filters: SearchFilters) => {
    setStatus(SearchState.LOADING);
    setError(null);
    setResults([]);

    try {
      const apiKeyAvailable = await window.aistudio?.hasSelectedApiKey();
      
      // If we are in the development environment without the wrapper, we might fail here
      // but the instructions say to assume we can call openSelectKey if needed.
      // However, usually process.env.API_KEY is available if injected.
      // Let's implement the logic requested by the prompt for Veo/Imagen regarding keys,
      // but adapted for this general app context if the key is missing.
      
      if (!process.env.API_KEY) {
         if (window.aistudio && typeof window.aistudio.openSelectKey === 'function') {
            await window.aistudio.openSelectKey();
            // Retry logic would go here or user has to click search again
            // For now, let's just warn and ask to search again
            setStatus(SearchState.IDLE);
            return;
         }
      }

      const rawMarkdown = await searchPlacesWithGemini(query, filters);
      const parsedResults = parseMarkdownTable(rawMarkdown);
      
      setResults(parsedResults);
      setStatus(SearchState.SUCCESS);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An unexpected error occurred while searching.");
      setStatus(SearchState.ERROR);
    }
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <Header />
        
        <SearchInput onSearch={handleSearch} isLoading={status === SearchState.LOADING} />

        <div className="space-y-4">
            {status === SearchState.ERROR && (
                <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 border border-red-200" role="alert">
                    <span className="font-medium">Error:</span> {error}
                </div>
            )}

            {status === SearchState.LOADING && (
                <div className="flex flex-col items-center justify-center py-12 space-y-4">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
                    <p className="text-slate-500 text-sm animate-pulse">Consulting Google Maps...</p>
                </div>
            )}

            {(status === SearchState.SUCCESS || (status === SearchState.IDLE && results.length > 0)) && (
                <ResultsTable results={results} />
            )}
            
            {status === SearchState.SUCCESS && results.length === 0 && (
                 <div className="text-center py-12 bg-white rounded-xl border border-slate-200 border-dashed">
                    <p className="text-slate-500">No results found in the model output. The query might be too specific or data unavailable.</p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default App;