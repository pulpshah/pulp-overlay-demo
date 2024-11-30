'use client';

import React, { useState } from 'react';
import Image from 'next/image';
// import { useEffect } from 'react';

// Define types for the images and results
type Image = { url: string };
type Result = { title: string; url: string; score: number };

export default function AIAssistantTab() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{ id: number; role: 'user' | 'ai'; content: string }[]>([]);
  const [images, setImages] = useState<Image[]>([]);
  const [results, setResults] = useState<Result[]>([]);
  const [responseTime, setResponseTime] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const stop = () => {
    setIsLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { id: Date.now(), role: 'user' as const, content: input };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    setInput('');

    try {
      const origin = window.location.origin;
      const response = await fetch(`${origin}/api/tavily-search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          query: input,
          url: window.location.href
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }

      const data = await response.json();

      const aiMessage = { 
        id: Date.now() + 1, 
        role: 'ai' as const, 
        content: data.answer || 'No response found.' 
      };
      setMessages((prev) => [...prev, aiMessage]);

      setImages(data.images?.map(({ url }: Image) => ({ url })) || []);
      setResults(data.results?.map(({ title, url, score }: Result) => ({ title, url, score })) || []);
      setResponseTime(data.responseTime || null);
      setShowDetails(false);
    } catch (error) {
      console.error('Error fetching data from API route:', error);
      setMessages((prev) => [
        ...prev,
        { 
          id: Date.now() + 1, 
          role: 'ai' as const, 
          content: 'Error retrieving response.' 
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };
  // useEffect(() => {
  //   const handleAIAssistant = async (event: Event) => {
  //     const customEvent = event as CustomEvent<{text: string}>;
  //     const text = customEvent.detail.text;
  //     setInput(text);
      
  //     const userMessage = { id: Date.now(), role: 'user' as const, content: text };
  //     setMessages((prev) => [...prev, userMessage]);
  //     setIsLoading(true);
   
  //     try {
  //       const origin = window.location.origin;
  //       const response = await fetch(`${origin}/api/tavily-search`, {
  //         method: 'POST',
  //         headers: {
  //           'Content-Type': 'application/json',
  //         },
  //         body: JSON.stringify({ 
  //           query: text,
  //           url: window.location.href
  //         }),
  //       });
   
  //       if (!response.ok) throw new Error('Failed to fetch data');
   
  //       const data = await response.json();
  //       const aiMessage = { 
  //         id: Date.now() + 1, 
  //         role: 'ai' as const, 
  //         content: data.answer || 'No response found.' 
  //       };
        
  //       setMessages((prev) => [...prev, aiMessage]);
  //       setImages(data.images?.map(({ url }: Image) => ({ url })) || []);
  //       setResults(data.results?.map(({ title, url, score }: Result) => ({ title, url, score })) || []);
  //       setResponseTime(data.responseTime || null);
  //     } catch (error) {
  //       console.error('Error:', error);
  //       setMessages((prev) => [...prev, { 
  //         id: Date.now() + 1, 
  //         role: 'ai' as const, 
  //         content: 'Error retrieving response.' 
  //       }]);
  //     } finally {
  //       setIsLoading(false);
  //       setInput('');
  //     }
  //   };
    
  //   document.addEventListener('triggerAIAssistant', handleAIAssistant);
  //   return () => {
  //     document.removeEventListener('triggerAIAssistant', handleAIAssistant);
  //   };
  //  }, []);

  return (
    <div className="flex flex-col h-full p-4 bg-gray-900 text-white rounded-lg shadow-lg">
      <div className="flex-1 overflow-y-auto mb-4 border rounded-lg p-4 bg-gray-800 max-h-60">
        {messages.map((message) => (
          <div key={message.id} className="mb-2">
            <strong>{message.role === 'user' ? 'User:' : 'AI:'}</strong> {message.content}
          </div>
        ))}
      </div>

      {isLoading && (
        <div className="mb-4">
          <div className="spinner">Loading...</div>
          <button type="button" onClick={stop} className="text-red-500 underline">
            Stop
          </button>
        </div>
      )}

      {(images.length > 0 || results.length > 0) && (
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="text-blue-500 underline mb-4"
        >
          {showDetails ? 'Less Details' : 'More Details'}
        </button>
      )}

      {showDetails && (
        <div className="overflow-y-auto max-h-60 mb-4 border-t border-gray-700 pt-4">
          {images && images.length > 0 && (
          <div className="mt-4">
            <h3>Images:</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {images.map((image, index) => (
                <div key={index} className="relative h-48 border rounded-lg overflow-hidden">
                  <Image
                    src={image.url}
                    alt="Search result"
                    width={400}
                    height={300}
                    unoptimized
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      console.error('Image load error:', image.url);
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

          {results.length > 0 && (
            <div className="mt-4">
              <h3>Sources:</h3>
              <ul className="list-disc ml-5">
                {results.map((result, index) => (
                  <li key={index} className="mb-2">
                    <a href={result.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
                      {result.title}
                    </a>
                    <p className="text-sm text-gray-500">Relevance Score: {result.score}</p>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-4">
        <input
          name="prompt"
          value={input}
          onChange={handleInputChange}
          disabled={isLoading}
          placeholder="Type your question here..."
          className="p-2 border rounded w-full mb-2 bg-white text-gray-900 placeholder-gray-500"
        />
        <button type="submit" disabled={isLoading} className="bg-blue-500 text-white p-2 rounded w-full hover:bg-blue-600 disabled:bg-blue-400">
          Submit
        </button>
      </form>

      {responseTime !== null && (
        <div className="mt-4 text-gray-500">
          Response time: {responseTime.toFixed(2)} seconds
        </div>
      )}
    </div>
  );
}