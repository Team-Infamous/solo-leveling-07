import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import HunterCard from '../components/HunterCard';

export default function Dashboard() {
  const [hunterData, setHunterData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchHunterData = async () => {
      try {
        const response = await fetch('/api/game/me');
        const data = await response.json();
        
        if (response.ok) {
          setHunterData(data);
          
          // Check if hunter is dead or banned
          if (data.isDead || data.isBanned) {
            router.push('/banned');
          }
        } else {
          router.push('/login');
        }
      } catch (error) {
        console.error('Error fetching hunter data:', error);
        router.push('/login');
      } finally {
        setIsLoading(false);
      }
    };

    fetchHunterData();
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-2xl">Loading your hunter data...</div>
      </div>
    );
  }

  if (!hunterData) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-2xl">Failed to load hunter data</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-yellow-400 font-solo">Hunter Dashboard</h1>
          <div className="flex gap-4">
            <button 
              onClick={() => router.push('/profile')}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-all"
            >
              Profile
            </button>
            <button 
              onClick={() => router.push('/inventory')}
              className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded transition-all"
            >
              Inventory
            </button>
            <button 
              onClick={() => router.push('/shop')}
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition-all"
            >
              Shop
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="col-span-1">
            <HunterCard hunter={hunterData} />
          </div>
          
          <div className="col-span-2 bg-gray-800 p-6 rounded-lg">
            <h2 className="text-2xl font-bold mb-4 text-yellow-400">Hunter Actions</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button 
                onClick={() => router.push('/dungeon')}
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-6 rounded-lg text-lg transition-all transform hover:scale-105"
              >
                Enter Dungeon
              </button>
              
              <button 
                onClick={() => router.push('/pvp')}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-lg text-lg transition-all transform hover:scale-105"
              >
                PVP Arena
              </button>
              
              <button 
                onClick={() => router.push('/train')}
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-6 rounded-lg text-lg transition-all transform hover:scale-105"
              >
                Training Grounds
              </button>
              
              <button 
                onClick={() => router.push('/missions')}
                className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 px-6 rounded-lg text-lg transition-all transform hover:scale-105"
              >
                Hunter Missions
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
      }
