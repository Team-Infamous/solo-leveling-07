import { useState } from 'react';
import { useRouter } from 'next/router';
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

      if (response.ok) {
        router.push('/dashboard');
      } else {
        setError(data.message || 'Registration failed');
      }
    } catch (err) {
      setError('An error occurred during registration');
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
      <div className="w-full max-w-md p-8 bg-gray-800 rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold mb-6 text-center text-yellow-400 font-solo">Hunter Registration</h2>
        
        {error && (
          <div className="mb-4 p-3 bg-red-600 text-white rounded">
            {error}
          </div>
        )}
        
        <AuthForm 
          onSubmit={handleRegister} 
          isRegister={true}
        />
        
        <p className="mt-4 text-center">
          Already a hunter? <a href="/login" className="text-blue-400 hover:underline">Login here</a>
        </p>
      </div>
    </div>
  );
}
