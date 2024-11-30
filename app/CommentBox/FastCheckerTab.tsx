'use client';

import React, { useState } from 'react';

type Reference = { url: string; keyQuote: string; isSupportive: boolean };

export default function FactCheckerTab() {
  const [input, setInput] = useState('');
  const [factData, setFactData] = useState<{
    factuality: number;
    result: boolean;
    reason: string;
    references: Reference[];
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showReferences, setShowReferences] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setIsLoading(true);
    setFactData(null);

    try {
      const response = await fetch(`https://g.jina.ai/${encodeURIComponent(input)}`, {
        method: 'GET',
        headers: {
          Authorization: 'Bearer jina_d27470d3569849a4a0cb4bc0bfa860d6M0J3QnLi8jkZcsWMTPWoKrMFcRzx',
          Accept: 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }

      const data = await response.json();
      setFactData(data.data);
    } catch (error) {
      console.error('Error fetching data from API:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-800 rounded-lg p-4">
      <form onSubmit={handleSubmit} className="mb-4 space-y-2">
        <input
          name="prompt"
          value={input}
          onChange={handleInputChange}
          disabled={isLoading}
          placeholder="Enter fact to check..."
          className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        />
        <button 
          type="submit" 
          disabled={isLoading} 
          className="w-full p-3 rounded-lg bg-blue-500 text-white font-medium hover:bg-blue-600 transition-colors duration-200 disabled:opacity-50"
        >
          {isLoading ? 'Checking...' : 'Check Fact'}
        </button>
      </form>

      {isLoading && (
        <div className="flex justify-center items-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
        </div>
      )}

      {factData && (
        <div className="space-y-3 text-sm">
          <div className="p-3 rounded-lg bg-gray-700">
            <p className="flex justify-between">
              <span className="font-medium">Factuality Score:</span>
              <span className={`font-bold ${factData.factuality >= 0.7 ? 'text-green-400' : factData.factuality >= 0.4 ? 'text-yellow-400' : 'text-red-400'}`}>
                {(factData.factuality * 100).toFixed(0)}%
              </span>
            </p>
            <p className="flex justify-between">
              <span className="font-medium">Result:</span>
              <span className={`font-bold ${factData.result ? 'text-green-400' : 'text-red-400'}`}>
                {factData.result ? 'True' : 'False'}
              </span>
            </p>
          </div>

          <div className="p-3 rounded-lg bg-gray-700">
            <p className="font-medium mb-2">Analysis:</p>
            <p className="text-gray-300">{factData.reason}</p>
          </div>

          <button
            onClick={() => setShowReferences(!showReferences)}
            className="w-full p-2 text-sm text-blue-400 hover:text-blue-300 transition-colors duration-200"
          >
            {showReferences ? '↑ Hide References' : '↓ Show References'}
          </button>

          {showReferences && (
            <div className="max-h-48 overflow-y-auto rounded-lg bg-gray-700 p-3">
              <h3 className="font-medium mb-2">References:</h3>
              <ul className="space-y-3">
                {factData.references.map((ref, index) => (
                  <li key={index} className="pb-2 border-b border-gray-600 last:border-0">
                    <a 
                      href={ref.url} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-blue-400 hover:text-blue-300 break-all"
                    >
                      {ref.keyQuote}
                    </a>
                    <p className={`text-xs mt-1 ${ref.isSupportive ? 'text-green-400' : 'text-red-400'}`}>
                      {ref.isSupportive ? '✓ Supportive' : '✗ Not Supportive'}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}