import React, { useState } from 'react';
import axios from 'axios';
import { AUTH_API_END_POINT } from '../config/constants.js';

function Login({ open, onClose, onLoginSuccess }) {
  const [loginUser, setLoginUser] = useState({
    username: '',
    password: '',
  });

  const handleChange = (e) => {
    setLoginUser((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${AUTH_API_END_POINT}/login`,
        loginUser
      );

      const { user, accessToken, refreshToken } = response.data;

      localStorage.setItem('currentUser', JSON.stringify(user));
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);

      onLoginSuccess(user);
      onClose();
    } catch (error) {
      console.error(
        'Login failed:',
        error.response?.data?.message || error.message
      );
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg w-96 p-6 shadow-lg">
        <form onSubmit={handleSubmit}>
          <h2 className="text-lg font-semibold mb-4">Login</h2>

          <input
            type="text"
            name="username"
            placeholder="Email (or Username)"
            value={loginUser.username}
            onChange={handleChange}
            className="w-full p-2 border rounded-md mb-4"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={loginUser.password}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
          />

          <div className="flex justify-end space-x-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded-md"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-md"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
