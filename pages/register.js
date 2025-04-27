import { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';

export default function Register() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    hunterName: '',
    username: '',
    hunterClass: 'Warrior'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      // Redirect to dashboard after successful registration
      router.push('/dashboard');
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
      <Head>
        <title>Register - Solo Leveling: Arise</title>
      </Head>

      <div className="w-full max-w-md p-8 bg-gray-800 rounded-lg shadow-lg">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-red-500 mb-2">Hunter Registration</h1>
          <p className="text-gray-400">Join the Hunter Association</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-900 text-red-200 rounded text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-gray-400 mb-1">Hunter Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-gray-400 mb-1">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
              required
              minLength="6"
            />
          </div>

          <div>
            <label htmlFor="hunterName" className="block text-gray-400 mb-1">Hunter Name</label>
            <input
              type="text"
              id="hunterName"
              name="hunterName"
              value={formData.hunterName}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
              required
            />
          </div>

          <div>
            <label htmlFor="username" className="block text-gray-400 mb-1">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
              required
            />
          </div>

          <div>
            <label htmlFor="hunterClass" className="block text-gray-400 mb-1">Hunter Class</label>
            <select
              id="hunterClass"
              name="hunterClass"
              value={formData.hunterClass}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
              required
            >
              <option value="Warrior">Warrior</option>
              <option value="Mage">Mage</option>
              <option value="Assassin">Assassin</option>
              <option value="Tanker">Tanker</option>
              <option value="Healer">Healer</option>
              <option value="Ranger">Ranger</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 px-4 rounded font-bold ${loading ? 'bg-gray-600' : 'bg-red-600 hover:bg-red-700'}`}
          >
            {loading ? 'Registering...' : 'Register as Hunter'}
          </button>
        </form>

        <div className="mt-4 text-center text-gray-400">
          Already registered? <Link href="/login" className="text-blue-400 hover:underline">Login here</Link>
        </div>
      </div>
    </div>
  );    
}
