import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';

export default function Profile() {
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
        <div className="text-2xl">Loading your hunter profile...</div>
      </div>
    );
  }

  if (!hunterData) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-2xl">Failed to load hunter profile</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-yellow-400 font-solo">Hunter Profile</h1>
          <button 
            onClick={() => router.push('/dashboard')}
            className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded transition-all"
          >
            Back to Dashboard
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="col-span-1">
            <div className="bg-gray-800 p-6 rounded-lg">
              <div className="flex justify-center mb-6">
                <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-yellow-400">
                  <Image 
                    src={`/images/classes/${hunterData.hunterClass.toLowerCase()}.png`} 
                    alt={hunterData.hunterClass}
                    layout="fill"
                    objectFit="cover"
                  />
                </div>
              </div>
              
              <h2 className="text-2xl font-bold text-center mb-2">{hunterData.hunterName}</h2>
              <p className="text-center text-gray-400 mb-4">@{hunterData.username}</p>
              
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-400">Rank:</span>
                <span className="font-bold">{hunterData.rank}</span>
              </div>
              
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-400">Level:</span>
                <span className="font-bold">{hunterData.level}</span>
              </div>
              
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-400">Class:</span>
                <span className="font-bold">{hunterData.hunterClass}</span>
              </div>
              
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-400">Gold:</span>
                <span className="font-bold text-yellow-400">{hunterData.gold} G</span>
              </div>
            </div>
          </div>
          
          <div className="col-span-2">
            <div className="bg-gray-800 p-6 rounded-lg mb-6">
              <h2 className="text-2xl font-bold mb-4 text-yellow-400">Hunter License</h2>
              
              <div className="relative h-64">
                <Image 
                  src="/images/hunter-license.png" 
                  alt="Hunter License"
                  layout="fill"
                  objectFit="contain"
                />
                
                <div className="absolute top-1/4 left-1/4 text-black">
                  <p className="text-sm">Name: {hunterData.hunterName}</p>
                  <p className="text-sm">Rank: {hunterData.rank}</p>
                  <p className="text-sm">Class: {hunterData.hunterClass}</p>
                  <p className="text-sm">ID: {hunterData._id.toString().slice(-8)}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-800 p-6 rounded-lg">
              <h2 className="text-2xl font-bold mb-4 text-yellow-400">Hunter Statistics</h2>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gray-700 p-4 rounded-lg text-center">
                  <h3 className="text-lg font-bold mb-2">Strength</h3>
                  <p className="text-2xl">{(hunterData.level * 5) + (hunterData.hunterClass === 'Warrior' ? 10 : 0)}</p>
                </div>
                
                <div className="bg-gray-700 p-4 rounded-lg text-center">
                  <h3 className="text-lg font-bold mb-2">Agility</h3>
                  <p className="text-2xl">{(hunterData.level * 5) + (hunterData.hunterClass === 'Assassin' ? 10 : 0)}</p>
                </div>
                
                <div className="bg-gray-700 p-4 rounded-lg text-center">
                  <h3 className="text-lg font-bold mb-2">Intelligence</h3>
                  <p className="text-2xl">{(hunterData.level * 5) + (hunterData.hunterClass === 'Mage' ? 10 : 0)}</p>
                </div>
                
                <div className="bg-gray-700 p-4 rounded-lg text-center">
                  <h3 className="text-lg font-bold mb-2">Stamina</h3>
                  <p className="text-2xl">{(hunterData.level * 5) + (hunterData.hunterClass === 'Tank' ? 10 : 0)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  }
