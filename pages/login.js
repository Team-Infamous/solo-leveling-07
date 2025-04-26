import { useState } from 'react';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import Head from 'next/head';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await signIn('credentials', {
      redirect: false,
      email,
      password
    });

    if (result?.error) {
      setError('Invalid hunter credentials');
    } else {
      window.location.href = '/dashboard';
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <Head>
        <title>Solo Leveling Arise | Hunter Login</title>
      </Head>

      <div className="w-full max-w-md bg-gray-900 border-2 border-yellow-600 rounded-xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-red-900 to-black p-6 text-center">
          <h2 className="text-3xl font-bold text-yellow-400 font-orbitron tracking-wider">
            HUNTER LOGIN
          </h2>
          <p className="text-gray-300 mt-2">Access the Hunter System</p>
        </div>

        <div className="p-8">
          {error && (
            <div className="mb-4 p-3 bg-red-900 text-white rounded-lg text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-yellow-500 mb-2">Hunter ID</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-yellow-500 focus:outline-none"
                placeholder="hunter@association.org"
                required
              />
            </div>

            <div>
              <label className="block text-yellow-500 mb-2">Access Code</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-yellow-500 focus:outline-none"
                placeholder="••••••••"
                required
                minLength={6}
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-red-700 to-red-800 hover:from-red-600 hover:to-red-700 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 shadow-lg hover:shadow-red-900/50"
            >
              SYSTEM ACCESS
            </button>
          </form>

          <div className="mt-6 text-center text-gray-400">
            Not registered?{' '}
            <Link href="/register" className="text-yellow-500 hover:underline font-semibold">
              Activate Hunter License
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
                  
