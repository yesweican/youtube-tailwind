import React, { useState } from 'react';
import LargeScrollableTWList from './LargeScrollableTWList';

function HorizontalTWTabs() {
  const [activeTab, setActiveTab] = useState(0);
  const items = [
    "Item 1",
    "Item 2",
    "Item 3",
    "Item 4",
    "Item 5",
    // Add more items as needed
  ];
  return (
    <div className="w-full flex flex-col items-center">
      <div className="flex border-b border-gray-200 space-x-4">
        <button
          className={`px-4 py-2 -mb-px text-sm font-medium text-center ${
            activeTab === 0 ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600'
          }`}
          onClick={() => setActiveTab(0)}
        >
          Tab One
        </button>
        <button
          className={`px-4 py-2 -mb-px text-sm font-medium text-center ${
            activeTab === 1 ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600'
          }`}
          onClick={() => setActiveTab(1)}
        >
          Tab Two
        </button>
        <button
          className={`px-4 py-2 -mb-px text-sm font-medium text-center ${
            activeTab === 2 ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600'
          }`}
          onClick={() => setActiveTab(2)}
        >
          Tab Three
        </button>
      </div>

      <div className="w-full">
        {activeTab === 0 && <p>Content for Tab One <LargeScrollableTWList items={ items } /></p>}
        {activeTab === 1 && <p>Content for Tab Two <LargeScrollableTWList items={ items } /></p>}
        {activeTab === 2 && <p>Content for Tab Three <LargeScrollableTWList items={ items } /></p>}
      </div>
    </div>
  );
}

export default HorizontalTWTabs;