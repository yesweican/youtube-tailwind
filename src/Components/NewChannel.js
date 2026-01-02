import React, { useState } from 'react';
import { CHANNEL_API_END_POINT } from '../config/constants.js';
import axios from 'axios';

function NewChannel() {
    const [formData, setFormData] = useState({
    name: '',
    description: '',
  });

  const handleChange = (e) => {
    setFormData((prevData)=>({ ...prevData, [e.target.name]: e.target.value }));
  };

  const handleNewArticle = async (e) => {
    e.preventDefault(); // Prevents the page from refreshing

    try {
      const accessToken = localStorage.getItem('accessToken');
      const response = await axios.post(
        CHANNEL_API_END_POINT, 
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`, // Token in header
          },
        }
      );

      console.log(`Create Article successful! Welcome, ${response.data.name}`);
    } catch (error) {
      console.log(`Create Article failed: ${error.response?.data?.message || error.message}`);
    } 
    alert("hello2!");
    console.log("Form Data:", formData);
  };
  return (
    <div className="flex items-start justify-center min-h-screen bg-gray-100 py-10">
      <div className="bg-white p-4 rounded-lg w-full max-w-lg shadow-lg">
        <h2 className="text-2xl font-semibold text-center mb-6">Create New Article</h2>
        <form className="space-y-4" onSubmit={handleNewArticle}>
        <div className="flex items-center space-x-3">
            <label className="w-1/3 text-gray-700 text-center">Title</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Channel Name"
              className="w-2/3 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
            />
          </div>
          <div className="flex items-center space-x-3">
            <label className="w-1/3 text-gray-700 text-center">Description</label>
              <textarea id="description" 
              name="description"
              value={formData.description}
              onChange={handleChange}              
              rows="8" 
              class="block p-2.5 w-2/3 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500" 
              placeholder="Write your channel description here...">
            </textarea>
          </div>
          <div className="text-center mt-8">
            <button
              type="submit"
              id="submitBtn"
              name="submitBtn"
              className="w-full bg-indigo-600 text-white py-3 px-4 rounded-md hover:bg-indigo-700 focus:outline-none"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default NewChannel;