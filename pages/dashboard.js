import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';

export default function Dashboard() {
  const [hunterData, setHunterData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
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
          throw new Error(data.message || 'Failed to fetch hunter data');
        }

        setHunterData(data);
      } catch (err) {
        setError(err.message);
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
          <p className="mt-4">Accessing Hunter System...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <Head>
          <title>Error - Solo Leveling: Arise</title>
        </Head>
        <div className="text-center p-6 bg-gray-800 rounded-lg">
          <h2 className="text-2xl text-red-500 mb-4">System Error</h2>
          <p>{error}</p>
          <button 
            onClick={() => router.push('/login')}
            className="mt-4 px-4 py-2 bg-blue-600 rounded hover:bg-blue-700"
          >
            Return to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Head>
        <title>Dashboard - {hunterData?.hunterName || 'Hunter'} | Solo Leveling: Arise</title>
      </Head>

      <header className="bg-black py-4 px-6 border-b border-red-900">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Image 
              src="/images/logo.png" 
              alt="Solo Leveling" 
              width={40} 
              height={40}
            />
            <h1 className="text-xl font-bold">SOLO LEVELING ARISE</h1>
          </div>
          <nav>
            <ul className="flex space-x-6">
              <li>
                <Link href="/dashboard" className="text-red-500 font-bold">Dashboard</Link>
              </li>
              <li>
                <Link href="/profile">Profile</Link>
              </li>
              <li>
                <Link href="/inventory">Inventory</Link>
              </li>
              <li>
                <Link href="/shop">Shop</Link>
              </li>
              {hunterData?.isAdmin && (
                <li>
                  <Link href="/admin" className="text-yellow-500">Admin Panel</Link>
                </li>
              )}
            </ul>
          </nav>
          <button 
            onClick={() => {
              fetch('/api/auth/logout', { method: 'POST' });
              router.push('/login');
            }}
            className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="container mx-auto py-8 px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <div className="bg-gray-800 rounded-lg p-6 shadow-lg mb-6">
              <div className="flex items-center space-x-6">
                <Image 
                  src={`/images/ranks/${hunterData?.rank.toLowerCase()}.png`}
                  alt={`${hunterData?.rank} Rank`}
                  width={100}
                  height={100}
                  className="border-2 border-yellow-500 rounded-full"
                />
                <div>
                  <h2 className="text-2xl font-bold">{hunterData?.hunterName}</h2>
                  <p className="text-gray-400">@{hunterData?.username}</p>
                  <div className="mt-2 flex items-center space-x-4">
                    <span className="px-3 py-1 bg-blue-900 rounded-full text-sm">Level {hunterData?.level}</span>
                    <span className="px-3 py-1 bg-purple-900 rounded-full text-sm">{hunterData?.rank} Rank</span>
                    <span className="px-3 py-1 bg-green-900 rounded-full text-sm">{hunterData?.class}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-800 rounded-lg p-4 shadow-lg">
                <h3 className="font-bold mb-2">Stats</h3>
                <div className="space-y-2">
                  <div>
                    <span className="text-gray-400">STR:</span> {hunterData?.stats?.strength}
                  </div>
                  <div>
                    <span className="text-gray-400">AGI:</span> {hunterData?.stats?.agility}
                  </div>
                  <div>
                    <span className="text-gray-400">INT:</span> {hunterData?.stats?.intelligence}
                  </div>
                  <div>
                    <span className="text-gray-400">VIT:</span> {hunterData?.stats?.vitality}
                  </div>
                </div>
              </div>
              <div className="bg-gray-800 rounded-lg p-4 shadow-lg">
                <h3 className="font-bold mb-2">Combat</h3>
                <div className="space-y-2">
                  <div>
                    <span className="text-gray-400">HP:</span> {hunterData?.currentHP}/{hunterData?.maxHP}
                  </div>
                  <div>
                    <span className="text-gray-400">MP:</span> {hunterData?.currentMP}/{hunterData?.maxMP}
                  </div>
                  <div>
                    <span className="text-gray-400">EXP:</span> {hunterData?.currentEXP}/{hunterData?.requiredEXP}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="md:col-span-1">
            <div className="bg-gray-800 rounded-lg p-6 shadow-lg mb-6">
              <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <Link href="/dungeon" className="block w-full px-4 py-3 bg-red-700 rounded hover:bg-red-600 text-center font-bold">
                  Enter Dungeon
                </Link>
                <Link href="/pvp" className="block w-full px-4 py-3 bg-blue-700 rounded hover:bg-blue-600 text-center font-bold">
                  PvP Arena
                </Link>
                <Link href="/train" className="block w-full px-4 py-3 bg-green-700 rounded hover:bg-green-600 text-center font-bold">
                  Training Grounds
                </Link>
                <Link href="/shop" className="block w-full px-4 py-3 bg-purple-700 rounded hover:bg-purple-600 text-center font-bold">
                  Hunter Shop
                </Link>
              </div>
            </div>

            <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
              <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
              <div className="space-y-3">
                {hunterData?.recentActivity?.length > 0 ? (
                  hunterData.recentActivity.map((activity, index) => (
                    <div key={index} className="border-b border-gray-700 pb-3">
                      <p className="text-sm">{activity}</p>
                      <p className="text-xs text-gray-500 mt-1">{new Date().toLocaleString()}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-400 text-sm">No recent activity</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
