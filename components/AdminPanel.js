import { useState } from 'react';

export default function AdminPanel({ hunters, onBan, onUnban }) {
  const [selectedHunter, setSelectedHunter] = useState(null);
  const [banReason, setBanReason] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredHunters = hunters.filter(hunter =>
    hunter.hunterName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    hunter.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    hunter.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <div className="bg-gray-800 p-6 rounded-lg mb-6">
          <h2 className="text-2xl font-bold mb-4 text-red-400">Hunter Management</h2>
          
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search hunters..."
              className="w-full p-2 bg-gray-700 rounded"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="overflow-y-auto max-h-96">
            <table className="w-full">
              <thead className="bg-gray-700">
                <tr>
                  <th className="p-2 text-left">Hunter</th>
                  <th className="p-2 text-left">Rank</th>
                  <th className="p-2 text-left">Status</th>
                  <th className="p-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredHunters.map(hunter => (
                  <tr 
                    key={hunter._id} 
                    className={`border-b border-gray-700 hover:bg-gray-700 ${selectedHunter?._id === hunter._id ? 'bg-gray-700' : ''}`}
                    onClick={() => setSelectedHunter(hunter)}
                  >
                    <td className="p-2">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-gray-600 mr-2 overflow-hidden">
                          {/* Hunter avatar would go here */}
                        </div>
                        <div>
                          <p className="font-bold">{hunter.hunterName}</p>
                          <p className="text-sm text-gray-400">@{hunter.username}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-2">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${
                        hunter.rank === 'S' ? 'bg-purple-600' :
                        hunter.rank === 'A' ? 'bg-red-600' :
                        hunter.rank === 'B' ? 'bg-orange-600' :
                        hunter.rank === 'C' ? 'bg-yellow-600' :
                        'bg-gray-600'
                      }`}>
                        {hunter.rank}
                      </span>
                    </td>
                    <td className="p-2">
                      {hunter.isDead ? (
                        <span className="text-red-500">DEAD</span>
                      ) : hunter.isBanned ? (
                        <span className="text-yellow-500">BANNED</span>
                      ) : (
                        <span className="text-green-500">ACTIVE</span>
                      )}
                    </td>
                    <td className="p-2">
                      <button 
                        className="text-xs bg-blue-600 hover:bg-blue-700 px-2 py-1 rounded mr-1"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedHunter(hunter);
                        }}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      <div className="lg:col-span-1">
        {selectedHunter ? (
          <div className="bg-gray-800 p-6 rounded-lg sticky top-4">
            <h2 className="text-2xl font-bold mb-4 text-red-400">Hunter Details</h2>
            
            <div className="mb-4">
              <h3 className="font-bold">{selectedHunter.hunterName}</h3>
              <p className="text-gray-400">@{selectedHunter.username}</p>
              <p className="text-gray-400">{selectedHunter.email}</p>
              <p className="mt-2">
                <span className="font-bold">Class:</span> {selectedHunter.hunterClass}
              </p>
              <p>
                <span className="font-bold">Rank:</span> {selectedHunter.rank}
              </p>
              <p>
                <span className="font-bold">Level:</span> {selectedHunter.level}
              </p>
            </div>
            
            {selectedHunter.isBanned || selectedHunter.isDead ? (
              <div className="mb-4 p-3 bg-red-900 rounded">
                <p className="font-bold">BANNED</p>
                {selectedHunter.banReason && (
                  <p className="text-sm">Reason: {selectedHunter.banReason}</p>
                )}
              </div>
            ) : (
              <div className="mb-4">
                <textarea
                  placeholder="Ban reason..."
                  className="w-full p-2 bg-gray-700 rounded mb-2"
                  rows={3}
                  value={banReason}
                  onChange={(e) => setBanReason(e.target.value)}
                />
                
                <div className="flex gap-2">
                  <button 
                    className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded flex-1"
                    onClick={() => onBan(selectedHunter._id, banReason, false)}
                  >
                    Ban Hunter
                  </button>
                  <button 
                    className="bg-red-800 hover:bg-red-900 text-white font-bold py-2 px-4 rounded flex-1"
                    onClick={() => onBan(selectedHunter._id, banReason, true)}
                  >
                    Permanent Ban
                  </button>
                </div>
              </div>
            )}
            
            {(selectedHunter.isBanned || selectedHunter.isDead) && (
              <button 
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                onClick={() => onUnban(selectedHunter._id)}
              >
                Revive/Unban Hunter
              </button>
            )}
          </div>
        ) : (
          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-2xl font-bold mb-4 text-red-400">No Hunter Selected</h2>
            <p className="text-gray-400">Select a hunter from the list to view details and perform actions.</p>
          </div>
        )}
      </div>
    </div>
  );
}
