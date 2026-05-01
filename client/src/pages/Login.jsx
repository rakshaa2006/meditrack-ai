import { useState } from 'react';
import API from '../api';

export default function Login({ onLogin }) {
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [error,    setError]    = useState('');

  const handleLogin = async () => {
    try {
      const res  = await API.get('/users');
      const user = res.data.find(
        u => u.email === email && u.password === password
      );
      if (user) {
        onLogin(user);
      } else {
        setError('Wrong email or password');
      }
    } catch (err) {
      setError('Something went wrong');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-blue-700 mb-2">MediTrack AI</h1>
        <p className="text-gray-500 mb-6">Sign in to your health dashboard</p>

        {error && (
          <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}

        <div className="mb-4">
          <label className="block text-sm text-gray-600 mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="raksha@gmail.com"
            className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-blue-400"
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm text-gray-600 mb-1">Password</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="your password"
            className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-blue-400"
          />
        </div>

        <button
          onClick={handleLogin}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 font-medium"
        >
          Sign In
        </button>

        <p className="text-center text-sm text-gray-500 mt-4">
          No account?{' '}
          <span
            onClick={() => onLogin('register')}
            className="text-blue-600 cursor-pointer hover:underline"
          >
            Register here
          </span>
        </p>
      </div>
    </div>
  );
}