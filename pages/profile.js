import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Image from 'next/image';

export default function Profile() {
  const [hunterData, setHunterData] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchHunterData = async () => {
      try {
        const response = await fetch('/api/game/me');
        const data = await response.json();

        if (!response.ok) {
          if (response.status === 403) {
            router.push('/login');
          }
          throw new Error('Failed to fetch hunter data');
        }

        setHunterData(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchHunterData();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <Head>
          <title>Loading... - Solo Leveling: Arise</title>
        </Head>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500 mx-auto"></div>
          <p className="mt-4">Accessing Hunter Profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Head>
        <title>Profile - {hunterData?.hunterName || 'Hunter'} | Solo Leveling: Arise</title>
      </Head>

      <header className="bg-black py-4 px-6 border-b border-red-900">
        {/* Same header as dashboard */}
      </header>

      <main className="container mx-auto py-8 px-4">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-1/3">
            <div className="bg-gray-800 rounded-lg p-6 shadow-lg sticky top-4">
              <div className="flex flex-col items-center">
                <Image 
                  src={`/images/ranks/${hunterData?.rank.toLowerCase()}.png`}
                  alt={`${hunterData?.rank} Rank`}
                  width={200}
                  height={200}
                  className="border-4 border-yellow-500 rounded-full mb-4"
                />
                <h2 className="text-2xl font-bold text-center">{hunterData?.hunterName}</h2>
                <p className="text-gray-400 text-center">@{hunterData?.username}</p>
                
                <div className="mt-4 w-full">
                  <h3 className="font-bold mb-2">Hunter License</h3>
                  <div className="relative">
                    <Image 
                      src="/images/hunter-license.png"
                      alt="Hunter License"
                      width={300}
                      height={180}
                      className="w-full h-auto"
                    />
                    <div className="absolute inset-0 p-4 flex flex-col justify-between">
                      <div>
                        <p className="text-xs">Name: <span className="font-bold">{hunterData?.hunterName}</span></p>
                        <p className="text-xs">Rank: <span className="font-bold">{hunterData?.rank}</span></p>
                      </div>
                      <div>
                        <p className="text-xs">Class: <span className="font-bold">{hunterData?.class}</span></p>
                        <p className="text-xs">ID: <span className="font-bold">{hunterData?.hunterId}</span></p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="md:w-2/3">
            <div className="bg-gray-800 rounded-lg p-6 shadow-lg mb-6">
              <h2 className="text-xl font-bold mb-4">Hunter Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-bold text-gray-400 mb-2">Basic Info</h3>
                  <div className="space-y-2">
                    <p><span className="text-gray-400">Level:</span> {hunterData?.level}</p>
                    <p><span className="text-gray-400">EXP:</span> {hunterData?.currentEXP}/{hunterData?.requiredEXP}</p>
                    <p><span className="text-gray-400">Guild:</span> {hunterData?.guild || 'None'}</p>
                    <p><span className="text-gray-400">Status:</span> 
                      <span className={`ml-2 px-2 py-1 rounded text-xs ${hunterData?.isBanned ? 'bg-red-900 text-red-200' : 'bg-green-900 text-green-200'}`}>
                        {hunterData?.isBanned ? 'BANNED' : 'ACTIVE'}
                      </span>
                    </p>
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-gray-400 mb-2">Combat Stats</h3>
                  <div className="space-y-2">
                    <p><span className="text-gray-400">HP:</span> {hunterData?.currentHP}/{hunterData?.maxHP}</p>
                    <p><span className="text-gray-400">MP:</span> {hunterData?.currentMP}/{hunterData?.maxMP}</p>
                    <p><span className="text-gray-400">Dungeons Cleared:</span> {hunterData?.dungeonsCleared || 0}</p>
                    <p><span className="text-gray-400">PVP Wins:</span> {hunterData?.pvpWins || 0}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-800 rounded-lg p-6 shadow-lg mb-6">
              <h2 className="text-xl font-bold mb-4">Attributes</h2>
              <div className="space-y-3">
                {Object.entries(hunterData?.stats || {}).map(([stat, value]) => (
                  <div key={stat}>
                    <div className="flex justify-between mb-1">
                      <span className="text-gray-400">{stat.toUpperCase()}:</span>
                      <span>{value}</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2.5">
                      <div 
                        className="bg-blue-600 h-2.5 rounded-full" 
                        style={{ width: `${Math.min(100, (value / 100) * 100)}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
              <h2 className="text-xl font-bold mb-4">Achievements</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {hunterData?.achievements?.length > 0 ? (
                  hunterData.achievements.map((achievement, index) => (
                    <div key={index} className="border border-gray-700 rounded p-3">
                      <div className="flex items-center space-x-3">
                        <div className="bg-yellow-500 p-2 rounded-full">
                          <Image 
                            src="/images/trophy.png"
                            alt="Trophy"
                            width={20}
                            height={20}
                          />
                        </div>
                        <div>
                          <h3 className="font-bold">{achievement.name}</h3>
                          <p className="text-sm text-gray-400">{achievement.description}</p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-400">No achievements yet</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
