import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="mb-8 text-center">
      <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">
        Lebanon Places Search
      </h1>
      <p className="text-slate-500 text-sm max-w-lg mx-auto">
        Internal tool to retrieve Google Maps Place IDs for restaurants and hotels.
      </p>
    </header>
  );
};