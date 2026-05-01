import { useState } from 'react';
import API from '../api';

export default function Register({ onRegister }) {
  const [form, setForm] = useState({
    name: '', email: '', password: '', dob: '', blood_type: ''
  });
  const [error,   setError]   = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async () => {
    try {
      await API.post('/users', form);
      setSuccess('Account created! You can now sign in.');
      setTimeout(() => onRegister(), 2000);
    } catch (err) {
      setError('Email already exists or something went wrong');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-blue-700 mb-2">Create Account</h1>
        <p className="text-gray-500 mb-6">Join MediTrack AI</p>

        {error && (
          <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-50 text-green-600 px-4 py-3 rounded-lg mb-4 text-sm">
            {success}
          </div>
        )}

        <div className="mb-3">
          <label className="block text-sm text-gray-600 mb-1">Full Name</label>
          <input name="name" onChange={handleChange} placeholder="Raksha"
            className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-blue-400"/>
        </div>
        <div className="mb-3">
          <label className="block text-sm text-gray-600 mb-1">Email</label>
          <input name="email" type="email" onChange={handleChange} placeholder="raksha@gmail.com"
            className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-blue-400"/>
        </div>
        <div className="mb-3">
          <label className="block text-sm text-gray-600 mb-1">Password</label>
          <input name="password" type="password" onChange={handleChange} placeholder="choose a password"
            className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-blue-400"/>
        </div>
        <div className="mb-3">
          <label className="block text-sm text-gray-600 mb-1">Date of Birth</label>
          <input name="dob" type="date" onChange={handleChange}
            className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-blue-400"/>
        </div>
        <div className="mb-6">
          <label className="block text-sm text-gray-600 mb-1">Blood Type</label>
          <select name="blood_type" onChange={handleChange}
            className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-blue-400">
            <option value="">Select blood type</option>
            <option>A+</option><option>A-</option>
            <option>B+</option><option>B-</option>
            <option>O+</option><option>O-</option>
            <option>AB+</option><option>AB-</option>
          </select>
        </div>

        <button onClick={handleRegister}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 font-medium">
          Create Account
        </button>

        <p className="text-center text-sm text-gray-500 mt-4">
          Already have an account?{' '}
          <span onClick={() => onRegister()}
            className="text-blue-600 cursor-pointer hover:underline">
            Sign in
          </span>
        </p>
      </div>
    </div>
  );
}