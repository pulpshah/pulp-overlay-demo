'use client';

import { useState } from 'react';
import ChatWindow from './ChatWindow';
import React from 'react';
// import { useEffect } from 'react';

export default function ChatPill({ slug, email }: { slug: string, email: string | null }) {
  const [isOpen, setIsOpen] = useState(false);
  // useEffect(() => {
  //   const handleAIAssistant = () => {
  //     setIsOpen(true);
  //   };
    
  //   document.addEventListener('triggerAIAssistant', handleAIAssistant);
  //   return () => {
  //     document.removeEventListener('triggerAIAssistant', handleAIAssistant);
  //   };
  // }, []);

  const toggleChat = () => setIsOpen(!isOpen);

  return (
    <>
      {/* Floating chat icon */}
      <button
        onClick={toggleChat}
        className="fixed bottom-10 right-10 bg-black text-white rounded-full p-4 shadow-lg hover:bg-gray-700 transition z-50"
        aria-label="Open Chat"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
          <path
            fill="white"
            d="M12 3C6.48 3 2 7.48 2 12c0 4.52 4.48 9 10 9 5.52 0 10-4.48 10-9 0-4.52-4.48-9-10-9zm0 16c-4.14 0-8-3.36-8-7 0-3.64 3.86-7 8-7 4.14 0 8 3.36 8 7 0 3.64-3.86 7-8 7zm0-10c-1.1 0-2 .9-2 2 0 .55.45 1 1 1s1-.45 1-1h2c0 1.66-1.34 3-3 3-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1h2c0 1.66-1.34 3-3 3-2.21 0-4-1.79-4-4 0-2.21 1.79-4 4-4s4 1.79 4 4h-2c0-1.1-.9-2-2-2z"
          />
        </svg>
      </button>

      {/* Chat window */}
      {isOpen && (
        <div className="fixed bottom-20 right-10 w-96 max-h-[80vh] bg-white border shadow-lg rounded-lg p-4 z-50 overflow-y-auto">
          <ChatWindow slug={slug} email={email} />
        </div>
      )}
    </>
  );
}
