import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';

export default function Dungeon() {
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const enterDungeon = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/game/dungeon', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (response.ok) {
        setResult(data);
        
        // If hunter died, redirect to banned page
        if (data.dead) {
          setTimeout(() => {
            router.push('/banned');
          }, 3000);
        }
      }
    } catch (error) {
      console.error('Error entering dungeon:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-red-500 font-solo">Dungeon Gate</h1>
          <button 
            onClick={() => router.push('/dashboard')}
            className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded transition-all"
          >
            Back to Dashboard
          </button>
        </div>

        <div className="flex flex-col items-center">
          <div className="relative w-full h-64 mb-8">
            <Image 
              src="/images/dungeon-gate.jpg"
              alt="Dungeon Gate"
              layout="fill"
              objectFit="cover"
              className="rounded-lg"
            />
          </div>

          {!result ? (
            <div className="text-center">
              <p className="text-xl mb-6">Enter the dungeon and face the monsters within. Will you emerge victorious or perish?</p>
              <button
                onClick={enterDungeon}
                disabled={isLoading}
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-lg text-lg transition-all transform hover:scale-105 disabled:opacity-50"
              >
                {isLoading ? 'Entering Dungeon...' : 'Enter Dungeon'}
              </button>
            </div>
          ) : (
            <div className={`text-center p-6 rounded-lg w-full max-w-md ${result.dead ? 'bg-red-900' : result.reward ? 'bg-green-900' : 'bg-yellow-900'}`}>
              <h2 className="text-2xl font-bold mb-4">
                {result.dead ? 'YOU DIED' : result.reward ? 'VICTORY!' : 'DEFEAT'}
              </h2>
              
              <p className="mb-4">{result.message}</p>
              
              {result.reward && (
                <div className="bg-black bg-opacity-50 p-4 rounded mb-4">
                  <p className="text-yellow-400">+{result.reward.gold} Gold</p>
                  <p className="text-blue-400">+{result.reward.exp} EXP</p>
                  {result.reward.levelUp && <p className="text-green-400 font-bold">LEVEL UP!</p>}
                </div>
              )}

              <button
                onClick={() => setResult(null)}
                className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-6 rounded transition-all"
              >
                {result.dead ? 'Accept Fate' : 'Try Again'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
              }
