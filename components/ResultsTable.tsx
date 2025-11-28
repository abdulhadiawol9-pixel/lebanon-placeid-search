import React, { useState } from 'react';
import { PlaceResult } from '../types';

interface ResultsTableProps {
  results: PlaceResult[];
}

const CopyButton: React.FC<{ text: string }> = ({ text }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className={`inline-flex items-center space-x-1 px-2 py-1 rounded text-xs font-medium transition-colors border ${
        copied 
          ? 'bg-green-50 text-green-700 border-green-200' 
          : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
      }`}
      title="Copy Place ID"
    >
      {copied ? (
        <>
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
          <span>Copied</span>
        </>
      ) : (
        <>
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
          <span>Copy ID</span>
        </>
      )}
    </button>
  );
};

export const ResultsTable: React.FC<ResultsTableProps> = ({ results }) => {
  if (results.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-xl border border-slate-200 border-dashed">
        <p className="text-slate-500">No results found. Try a different search term.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-slate-600">
          <thead className="text-xs text-slate-700 uppercase bg-slate-50 border-b border-slate-200">
            <tr>
              <th scope="col" className="px-6 py-4 font-semibold">Listing Name</th>
              <th scope="col" className="px-6 py-4 font-semibold">Type</th>
              <th scope="col" className="px-6 py-4 font-semibold">Place ID</th>
              <th scope="col" className="px-6 py-4 font-semibold">Phone</th>
              <th scope="col" className="px-6 py-4 font-semibold">Address</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {results.map((place, index) => (
              <tr key={`${place.id}-${index}`} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 font-medium text-slate-900 whitespace-nowrap">
                  {place.name}
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    place.type.toLowerCase().includes('hotel') 
                      ? 'bg-purple-100 text-purple-800' 
                      : 'bg-orange-100 text-orange-800'
                  }`}>
                    {place.type}
                  </span>
                </td>
                <td className="px-6 py-4 font-mono text-xs">
                  <div className="flex items-center space-x-3">
                    <span className="truncate max-w-[120px]" title={place.id}>
                      {place.id}
                    </span>
                    {place.id !== 'N/A' && <CopyButton text={place.id} />}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {place.phone}
                </td>
                <td className="px-6 py-4 min-w-[200px]">
                  {place.address}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 text-xs text-slate-500 flex justify-between items-center">
        <span>Showing {results.length} result{results.length !== 1 && 's'}</span>
        <span>Data provided by Google Maps</span>
      </div>
    </div>
  );
};