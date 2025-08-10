import React from 'react';

function LargeScrollableTWList({ items }) {
  return (
    <div className="w-full max-h-96 overflow-y-auto border border-gray-300 rounded-lg">
      <ul className="divide-y divide-gray-200 ">
        {items.map((item, index) => (
          /** <li key={index} className="p-4 w-4/5 max-auto block">
            {item}
          </li> **/
          <li key={index} className="flex justify-center p-2">
            <div className="w-4/5 p-4 bg-white border rounded-lg">
              {item}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default LargeScrollableTWList;