import axios from 'axios';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema } from '../validation/loginSchema';
import { AUTH_API_END_POINT } from '../config/constants.js';

function Login({ open, onClose, onLoginSuccess }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      identifier: '',
      password: '',
    },
  });

  const onSubmit = async (data) => {
    const payload = {
      username: data.identifier.trim(),
      password: data.password,
    };

    try {
      const response = await axios.post(
        `${AUTH_API_END_POINT}/login`,
        payload
      );

      const { user, accessToken, refreshToken } = response.data;

      localStorage.setItem('currentUser', JSON.stringify(user));
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);

      onLoginSuccess(user);
      reset();
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
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <h2 className="text-lg font-semibold mb-4">Login</h2>

          {/* Identifier */}
          <div className="mb-4">
            <input
              type="text"
              placeholder="Email or Username"
              className={`w-full p-2 border rounded-md focus:outline-none focus:ring
                ${errors.identifier ? 'border-red-500' : 'border-gray-300'}`}
              {...register('identifier')}
            />
            {errors.identifier && (
              <p className="mt-1 text-sm text-red-600">
                {errors.identifier.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div className="mb-4">
            <input
              type="password"
              placeholder="Password"
              className={`w-full p-2 border rounded-md focus:outline-none focus:ring
                ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
              {...register('password')}
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">
                {errors.password.message}
              </p>
            )}
          </div>

          <div className="flex justify-end space-x-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 bg-gray-300 rounded-md"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-60"
            >
              {isSubmitting ? 'Logging in…' : 'Submit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;

