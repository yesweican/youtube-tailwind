import React, { useState } from 'react';

function ScrollableTWImageList({ images }) {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearch = () => {
    console.log(`Searching for: ${searchTerm}`);
    // API call to fetch images based on searchTerm would go here
  };

  return (
    <div className="max-w-lg mx-auto p-4 border border-gray-300 rounded-lg space-y-4">
      {/* Top Section: Search Bar */}
      <div className="flex space-x-2">
        <input
          type="text"
          className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Search images..."
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <button
          onClick={handleSearch}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none"
        >
          Search
        </button>
      </div>

      {/* Bottom Section: Scrollable Image List */}
      <div className="max-h-96 overflow-y-auto mt-2 border-t border-gray-200 pt-2">
        <div className="grid grid-cols-3 gap-2">
          {images.map((image, index) => (
            <div key={index} className="w-full aspect-square overflow-hidden rounded-lg">
              <img
                src={image.img}
                alt={image.title}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ScrollableTWImageList;