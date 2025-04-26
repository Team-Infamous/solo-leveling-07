import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function PvpArena() {
  const [opponents, setOpponents] = useState([]);
  const [selectedOpponent, setSelectedOpponent] = useState(null);
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchOpponents = async () => {
      try {
        const response = await fetch('/api/game/pvp/opponents');
        const data = await response.json();

        if (response.ok) {
          setOpponents(data);
        }
      } catch (error) {
        console.error('Error fetching opponents:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOpponents();
  }, []);

  const startBattle = async () => {
    if (!selectedOpponent) return;
    
    try {
      const response = await fetch('/api/game/pvp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ opponentId: selectedOpponent._id }),
      });

      const data = await response.json();

      if (response.ok) {
        setResult(data);
        
        // If hunter died, redirect after delay
        if (data.dead) {
          setTimeout(() => {
            router.push('/banned');
          }, 3000);
        }
      }
    } catch (error) {
      console.error('Error starting battle:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-2xl">Loading PVP arena...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-red-500 font-solo">PVP Arena</h1>
          <button 
            onClick={() => router.push('/dashboard')}
            className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded transition-all"
          >
            Back to Dashboard
          </button>
        </div>

        {result ? (
          <div className={`text-center p-8 rounded-lg max-w-md mx-auto ${
            result.dead ? 'bg-red-900' : 
            result.reward ? 'bg-green-900' : 'bg-yellow-900'
          }`}>
            <h2 className="text-3xl font-bold mb-4">
              {result.dead ? 'DEFEAT' : result.reward ? 'VICTORY!' : 'DRAW'}
            </h2>
            
            <p className="text-xl mb-6">{result.message}</p>
            
            {result.reward && (
              <div className="bg-black bg-opacity-50 p-4 rounded mb-6">
                <p className="text-yellow-400">+{result.reward.gold} Gold</p>
                <p className="text-blue-400">+{result.reward.exp} EXP</p>
                {result.reward.levelUp && (
                  <p className="text-green-400 font-bold">LEVEL UP!</p>
                )}
              </div>
            )}
            
            <button
              onClick={() => setResult(null)}
              className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-6 rounded"
            >
              {result.dead ? 'Accept Fate' : 'Battle Again'}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="bg-gray-800 p-6 rounded-lg mb-6">
                <h2 className="text-2xl font-bold mb-4 text-red-400">Select Opponent</h2>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {opponents.map(opponent => (
                    <div 
                      key={opponent._id}
                      className={`p-4 rounded-lg cursor-pointer transition-all ${
                        selectedOpponent?._id === opponent._id 
                          ? 'bg-red-900' 
                          : 'bg-gray-700 hover:bg-gray-600'
                      }`}
                      onClick={() => setSelectedOpponent(opponent)}
                    >
                      <div className="flex items-center">
                        <div className="w-12 h-12 rounded-full bg-gray-600 mr-3"></div>
                        <div>
                          <h3 className="font-bold">{opponent.hunterName}</h3>
                          <div className="flex items-center mt-1">
                            <span className={`px-2 py-1 rounded text-xs font-bold mr-2 ${
                              opponent.rank === 'S' ? 'bg-purple-600' :
                              opponent.rank === 'A' ? 'bg-red-600' :
                              opponent.rank === 'B' ? 'bg-orange-600' :
                              opponent.rank === 'C' ? 'bg-yellow-600' :
                              'bg-gray-600'
                            }`}>
                              {opponent.rank}
                            </span>
                            <span className="text-sm">Lv. {opponent.level}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="lg:col-span-1">
              <div className="bg-gray-800 p-6 rounded-lg sticky top-4">
                <h2 className="text-2xl font-bold mb-4 text-red-400">Battle Setup</h2>
                
                {selectedOpponent ? (
                  <>
                    <div className="mb-6">
                      <h3 className="font-bold mb-2">Selected Opponent</h3>
                      <div className="flex items-center">
                        <div className="w-16 h-16 rounded-full bg-gray-700 mr-3"></div>
                        <div>
                          <p className="font-bold">{selectedOpponent.hunterName}</p>
                          <p className="text-sm text-gray-400">@{selectedOpponent.username}</p>
                          <div className="flex items-center mt-1">
                            <span className={`px-2 py-1 rounded text-xs font-bold mr-2 ${
                              selectedOpponent.rank === 'S' ? 'bg-purple-600' :
                              selectedOpponent.rank === 'A' ? 'bg-red-600' :
                              selectedOpponent.rank === 'B' ? 'bg-orange-600' :
                              selectedOpponent.rank === 'C' ? 'bg-yellow-600' :
                              'bg-gray-600'
                            }`}>
                              {selectedOpponent.rank}
                            </span>
                            <span className="text-sm">Lv. {selectedOpponent.level}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <button
                      onClick={startBattle}
                      className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg text-lg"
                    >
                      Start Battle
                    </button>
                    
                    <div className="mt-6 p-4 bg-gray-700 rounded">
                      <h4 className="font-bold mb-2">Battle Rules</h4>
                      <ul className="text-sm list-disc pl-5 space-y-1">
                        <li>5% chance of permanent death</li>
                        <li>Winner earns gold and EXP</li>
                        <li>No items allowed in arena</li>
                        <li>No healing during battle</li>
                      </ul>
                    </div>
                  </>
                ) : (
                  <p className="text-gray-400">Select an opponent from the list to begin</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
