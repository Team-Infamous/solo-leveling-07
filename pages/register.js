import { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import AuthForm from '../components/AuthForm';

export default function Register() {
  const [error, setError] = useState('');
  const router = useRouter();

  const handleRegister = async (formData) => {
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

      router.push('/dashboard');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Head>
        <title>Register - Solo Leveling: Arise</title>
      </Head>
      
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto bg-gray-800 rounded-lg overflow-hidden shadow-lg">
          <div className="bg-red-600 py-4 px-6">
            <h1 className="text-2xl font-bold">Hunter Registration</h1>
            <p className="text-sm">Join the Hunter Association</p>
          </div>
          
          <div className="p-6">
            {error && (
              <div className="mb-4 p-3 bg-red-900 text-red-200 rounded">
                {error}
              </div>
            )}
            
            <AuthForm 
              onSubmit={handleRegister}
              isRegister={true}
            />
            
            <div className="mt-4 text-center">
              <p className="text-gray-400">Already registered? <a href="/login" className="text-blue-400 hover:underline">Login here</a></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
