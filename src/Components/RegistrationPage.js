import React, { useState } from 'react';
import { AUTH_API_END_POINT } from '../config/constants.js';
import axios from 'axios';

function RegistrationPage() {
    const [formData, setFormData] = useState({
    username: '',
    email: '',
    fullname:'',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    setFormData((prevData)=>({ ...prevData, [e.target.name]: e.target.value }));
  };

  const handleCreateAccount = async (e) => {
    e.preventDefault(); // Prevents the page from refreshing
    try {
      const response = await axios.post(AUTH_API_END_POINT+'/register', formData);
      console.log(`Registration successful! Welcome, ${response.data.name}`);
    } catch (error) {
      console.log(`Registration failed: ${error.response?.data?.message || error.message}`);
    } 
    alert("hello2!");
    console.log("Form Data:", formData);
  };
  return (
    <div className="flex items-start justify-center min-h-screen bg-gray-100 py-10">
      <div className="bg-white p-4 rounded-lg w-full max-w-lg shadow-lg">
        <h2 className="text-2xl font-semibold text-center mb-6">Create Your Account</h2>
        <form className="space-y-4" onSubmit={handleCreateAccount}>
        <div className="flex items-center space-x-3">
            <label className="w-1/3 text-gray-700 text-center">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Choose a username"
              className="w-2/3 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
            />
          </div>
          <div className="flex items-center space-x-3">
            <label className="w-1/3 text-gray-700 text-center">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="w-2/3 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
            />
          </div>
          <div className="flex items-center space-x-3">
            <label className="w-1/3 text-gray-700 text-center">Full Name</label>
            <input
              type="text"
              id="fullname"
              name="fullname"
              value={formData.fullname}
              onChange={handleChange}
              placeholder="Enter your full name"
              className="w-2/3 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
            />
          </div>
          <div className="flex items-center space-x-3">
            <label className="w-1/3 text-gray-700 text-center">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create a password"
              className="w-2/3 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
            />
          </div>
          <div className="flex items-center space-x-3">
            <label className="w-1/3 text-gray-700 text-center">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
              className="w-2/3 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="text-center mt-8">
            <button
              type="submit"
              id="submitBtn"
              name="submitBtn"
              className="w-full bg-indigo-600 text-white py-3 px-4 rounded-md hover:bg-indigo-700 focus:outline-none"
            >
              Register
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default RegistrationPage;