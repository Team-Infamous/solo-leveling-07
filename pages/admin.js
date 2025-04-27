import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

export default function AdminPanel() {
  const [hunters, setHunters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchHunters = async () => {
      try {
        const response = await fetch('/api/admin/hunters');
        const data = await response.json();

        if (!response.ok) {
          if (response.status === 403) {
            router.push('/dashboard');
          }
          throw new Error(data.message || 'Failed to fetch hunters');
        }

        if (!data.isAdmin) {
          router.push('/dashboard');
        }

        setHunters(data.hunters);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchHunters();
  }, [router]);

  const handleBan = async (hunterId, permanent = false) => {
    try {
      const response = await fetch('/api/admin/ban', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ hunterId, permanent }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to ban hunter');
      }

      // Update local state
      setHunters(hunters.map(h => 
        h._id === hunterId ? { ...h, isBanned: true, banType: permanent ? 'PERMANENT' : 'TEMPORARY' } : h
      ));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleUnban = async (hunterId) => {
    try {
      const response = await fetch('/api/admin/unban', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ hunterId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to unban hunter');
      }

      // Update local state
      setHunters(hunters.map(h => 
        h._id === hunterId ? { ...h, isBanned: false, banType: null } : h
      ));
    } catch (err) {
      setError(err.message);
    }
  };

  const filteredHunters = hunters.filter(hunter =>
    hunter.hunterName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    hunter.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    hunter.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <Head>
          <title>Loading... - Solo Leveling: Arise</title>
        </Head>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500 mx-auto"></div>
          <p className="mt-4">Accessing Admin System...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Head>
        <title>Admin Panel - Solo Leveling: Arise</title>
      </Head>

      <header className="bg-black py-4 px-6 border-b border-yellow-900">
        {/* Same header as dashboard */}
      </header>

      <main className="container mx-auto py-8 px-4">
        <div className="bg-gray-800 rounded-lg p-6 shadow-lg mb-6">
          <h1 className="text-2xl font-bold mb-6 text-yellow-500">Shadow Monarch Control Panel</h1>
          
          {error && (
            <div className="mb-4 p-3 bg-red-900 text-red-200 rounded">
              {error}
            </div>
          )}

          <div className="mb-6">
            <input
              type="text"
              placeholder="Search hunters..."
              className="w-full px-4 py-2 bg-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-yellow-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-700">
                <tr>
                  <th className="px-4 py-2 text-left">Hunter ID</th>
                  <th className="px-4 py-2 text-left">Name</th>
                  <th className="px-4 py-2 text-left">Rank</th>
                  <th className="px-4 py-2 text-left">Level</th>
                  <th className="px-4 py-2 text-left">Status</th>
                  <th className="px-4 py-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredHunters.map((hunter) => (
                  <tr key={hunter._id} className="border-b border-gray-700 hover:bg-gray-700">
                    <td className="px-4 py-3">{hunter.hunterId}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-2">
                        <span>{hunter.hunterName}</span>
                        <span className="text-xs text-gray-400">@{hunter.username}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">{hunter.rank}</td>
                    <td className="px-4 py-3">{hunter.level}</td>
                    <td className="px-4 py-3">
                      {hunter.isBanned ? (
                        <span className={`px-2 py-1 rounded text-xs ${hunter.banType === 'PERMANENT' ? 'bg-red-900 text-red-200' : 'bg-orange-900 text-orange-200'}`}>
                          {hunter.banType === 'PERMANENT' ? 'PERMA-BANNED' : 'BANNED'}
                        </span>
                      ) : (
                        <span className="px-2 py-1 rounded text-xs bg-green-900 text-green-200">ACTIVE</span>
                      )}
                    </td>
                    <td className="px-4 py-3 space-x-2">
                      {hunter.isBanned ? (
                        <button
                          onClick={() => handleUnban(hunter._id)}
                          className="px-3 py-1 bg-blue-600 rounded text-sm hover:bg-blue-700"
                        >
                          Unban
                        </button>
                      ) : (
                        <>
                          <button
                            onClick={() => handleBan(hunter._id)}
                            className="px-3 py-1 bg-red-600 rounded text-sm hover:bg-red-700"
                          >
                            Ban
                          </button>
                          <button
                            onClick={() => handleBan(hunter._id, true)}
                            className="px-3 py-1 bg-red-900 rounded text-sm hover:bg-red-800"
                          >
                            Perma-Ban
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
          <h2 className="text-xl font-bold mb-4 text-yellow-500">Shadow Army Commands</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="px-4 py-3 bg-gray-700 rounded hover:bg-gray-600 font-bold">
              Summon Shadows
            </button>
            <button className="px-4 py-3 bg-gray-700 rounded hover:bg-gray-600 font-bold">
              Raid Dungeon
            </button>
            <button className="px-4 py-3 bg-gray-700 rounded hover:bg-gray-600 font-bold">
              Hunt Monsters
            </button>
          </div>
        </div>
      </main>
    </div>
  );      
}
