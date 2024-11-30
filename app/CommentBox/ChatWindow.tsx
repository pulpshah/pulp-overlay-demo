'use client';

import { useState } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CommentsTab from './CommentsTab';
import AIAssistantTab from './AIAssistantTab';
import FactCheckerTab from './FastCheckerTab';
// import { useEffect } from 'react';

enum Tab {
  COMMENTS = 'COMMENTS',
  AI_ASSISTANT = 'AI_ASSISTANT',
  FACT_CHECKER = 'FACT_CHECKER',
}

export default function ChatWindow({ slug, email }: { slug: string; email: string | null }) {
  console.log(slug);
  console.log(email);
  const [selectedTab, setSelectedTab] = useState<Tab>(Tab.COMMENTS);

  const handleTabChange = (tab: Tab) => {
    setSelectedTab(tab);
  };
  // useEffect(() => {
  //   const handleAIAssistant = () => {
  //     setSelectedTab(Tab.AI_ASSISTANT);
  //   };
    
  //   document.addEventListener('triggerAIAssistant', handleAIAssistant as EventListener);
  //   return () => {
  //     document.removeEventListener('triggerAIAssistant', handleAIAssistant as EventListener);
  //   };
  // }, []);

  return (
    <div className="flex flex-col h-full bg-gray-900 text-white p-4 max-w-lg mx-auto rounded-lg shadow-lg">
      <ToastContainer />

      <div className="flex justify-center space-x-2 mb-4">
        <button
          onClick={() => handleTabChange(Tab.COMMENTS)}
          className={`px-4 py-2 ${selectedTab === Tab.COMMENTS ? 'bg-blue-500' : 'bg-gray-700'} 
            text-white rounded-lg transition-colors duration-200 hover:bg-blue-600`}
        >
          Comments
        </button>
        <button
          onClick={() => handleTabChange(Tab.AI_ASSISTANT)}
          className={`px-4 py-2 ${selectedTab === Tab.AI_ASSISTANT ? 'bg-blue-500' : 'bg-gray-700'} 
            text-white rounded-lg transition-colors duration-200 hover:bg-blue-600`}
        >
          AI Assistant
        </button>
        <button
          onClick={() => handleTabChange(Tab.FACT_CHECKER)}
          className={`px-4 py-2 ${selectedTab === Tab.FACT_CHECKER ? 'bg-blue-500' : 'bg-gray-700'} 
            text-white rounded-lg transition-colors duration-200 hover:bg-blue-600`}
        >
          Fact Checker
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {selectedTab === Tab.COMMENTS && <CommentsTab/>}
        {selectedTab === Tab.AI_ASSISTANT && <AIAssistantTab />}
        {selectedTab === Tab.FACT_CHECKER && <FactCheckerTab />}
      </div>
    </div>
  );
}