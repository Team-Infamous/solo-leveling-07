// components/AuthForm.js
import { useState } from 'react';
import Link from 'next/link';

export default function AuthForm({ isRegister = false }) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    hunterName: '',
    username: '',
    hunterClass: 'Warrior'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Add your form submission logic here
  };

  return (
    <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
      <h2 className="text-3xl font-bold mb-6 text-center text-yellow-400">
        {isRegister ? 'Hunter Registration' : 'Hunter Login'}
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {isRegister && (
          <>
            <div>
              <label className="block text-gray-400 mb-2">Hunter Name</label>
              <input
                type="text"
                name="hunterName"
                value={formData.hunterName}
                onChange={handleChange}
                className="w-full p-3 bg-gray-700 rounded text-white"
                required
              />
            </div>
            <div>
              <label className="block text-gray-400 mb-2">Username</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full p-3 bg-gray-700 rounded text-white"
                required
              />
            </div>
            <div>
              <label className="block text-gray-400 mb-2">Hunter Class</label>
              <select
                name="hunterClass"
                value={formData.hunterClass}
                onChange={handleChange}
                className="w-full p-3 bg-gray-700 rounded text-white"
              >
                <option value="Warrior">Warrior</option>
                <option value="Mage">Mage</option>
                <option value="Assassin">Assassin</option>
                <option value="Tank">Tank</option>
              </select>
            </div>
          </>
        )}

        <div>
          <label className="block text-gray-400 mb-2">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-3 bg-gray-700 rounded text-white"
            required
          />
        </div>

        <div>
          <label className="block text-gray-400 mb-2">Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full p-3 bg-gray-700 rounded text-white"
            required
            minLength={6}
          />
        </div>

        <button
          type="submit"
          className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded transition-colors"
        >
          {isRegister ? 'Register' : 'Login'}
        </button>
      </form>

      <p className="mt-4 text-center text-gray-400">
        {isRegister ? (
          <>Already a hunter? <Link href="/login" className="text-blue-400 hover:underline">Login here</Link></>
        ) : (
          <>New hunter? <Link href="/register" className="text-blue-400 hover:underline">Register here</Link></>
        )}
      </p>
    </div>
  );
}
        
