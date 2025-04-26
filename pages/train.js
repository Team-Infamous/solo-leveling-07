import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Training() {
  const [energy, setEnergy] = useState(100);
  const [isTraining, setIsTraining] = useState(false);
  const [result, setResult] = useState(null);
  const router = useRouter();

  useEffect(() => {
    // Reset training when energy is depleted
    if (energy <= 0) {
      setIsTraining(false);
    }
  }, [energy]);

  const startTraining = () => {
    if (energy <= 0) return;
    
    setIsTraining(true);
    setResult(null);
    
    // Simulate training
    const interval = setInterval(() => {
      setEnergy(prev => {
        const newEnergy = prev - 5;
        if (newEnergy <= 0) {
          clearInterval(interval);
          setIsTraining(false);
          return 0;
        }
        return newEnergy;
      });
    }, 1000);

    // After random time (3-8 seconds), get results
    const trainingTime = 3000 + Math.random() * 5000;
    
    setTimeout(() => {
      clearInterval(interval);
      setIsTraining(false);
      
      // Training results
      const expGained = Math.floor(10 + Math.random() * 20);
      setResult({
        success: true,
        message: 'Training session completed!',
        exp: expGained
      });
    }, trainingTime);

    return () => clearInterval(interval);
  };

  const handleCompleteTraining = async () => {
    try {
      const response = await fetch('/api/game/train', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ exp: result.exp }),
      });

      const data = await response.json();

      if (response.ok) {
        setResult(prev => ({
          ...prev,
          levelUp: data.levelUp
        }));
      }
    } catch (error) {
      console.error('Error completing training:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-blue-400 font-solo">Training Grounds</h1>
          <button 
            onClick={() => router.push('/dashboard')}
            className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded transition-all"
          >
            Back to Dashboard
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-2xl font-bold mb-4 text-blue-400">Training Session</h2>
            
            <div className="mb-6">
              <div className="flex justify-between mb-1">
                <span className="font-bold">Energy</span>
                <span>{energy}/100</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-4">
                <div 
                  className="bg-blue-600 h-4 rounded-full" 
                  style={{ width: `${energy}%` }}
                ></div>
              </div>
            </div>
            
            {isTraining ? (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
                <p>Training in progress...</p>
              </div>
            ) : result ? (
              <div className={`p-4 rounded-lg mb-4 ${result.success ? 'bg-green-900' : 'bg-red-900'}`}>
                <p className="font-bold mb-2">{result.message}</p>
                {result.exp && <p className="text-blue-300">+{result.exp} EXP</p>}
                {result.levelUp && <p className="text-yellow-400 font-bold">LEVEL UP!</p>}
                
                <button
                  onClick={() => {
                    setResult(null);
                    setEnergy(100);
                  }}
                  className="mt-4 bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
                >
                  Train Again
                </button>
              </div>
            ) : (
              <button
                onClick={startTraining}
                disabled={energy <= 0}
                className={`w-full py-3 rounded-lg font-bold text-lg ${
                  energy > 0 
                    ? 'bg-blue-600 hover:bg-blue-700' 
                    : 'bg-gray-700 cursor-not-allowed'
                }`}
              >
                {energy > 0 ? 'Start Training' : 'Need to Rest'}
              </button>
            )}
          </div>
          
          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-2xl font-bold mb-4 text-blue-400">Training Stats</h2>
            
            <div className="space-y-4">
              <div className="bg-gray-700 p-4 rounded">
                <h3 className="font-bold mb-2">Basic Training</h3>
                <p className="text-gray-400">5 energy per second</p>
                <p className="text-gray-400">10-30 EXP per session</p>
              </div>
              
              <div className="bg-gray-700 p-4 rounded">
                <h3 className="font-bold mb-2">Advanced Training</h3>
                <p className="text-gray-400">Coming soon after rank B</p>
              </div>
              
              <div className="bg-gray-700 p-4 rounded">
                <h3 className="font-bold mb-2">Special Training</h3>
                <p className="text-gray-400">Coming soon after rank A</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
