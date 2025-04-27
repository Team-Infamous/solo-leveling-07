import { useState } from 'react';

export default function AdminPanel({ hunters }) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredHunters = hunters.filter(hunter =>
    hunter.hunterName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    hunter.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleBan = async (hunterId, permanent = false) => {
    const res = await fetch('/api/admin/ban', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ hunterId, permanent })
    });
    // Add refresh logic
  };

  const handleUnban = async (hunterId) => {
    const res = await fetch('/api/admin/unban', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ hunterId })
    });
    // Add refresh logic
  };

  return (
    <div className="admin-panel">
      <input
        type="text"
        placeholder="Search hunters..."
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      
      <table className="hunters-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Rank</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredHunters.map(hunter => (
            <tr key={hunter.hunterId}>
              <td>{hunter.hunterId}</td>
              <td>{hunter.hunterName} (@{hunter.username})</td>
              <td>{hunter.rank}-Rank</td>
              <td>{hunter.isBanned ? 'BANNED' : 'ACTIVE'}</td>
              <td>
                {hunter.isBanned ? (
                  <button onClick={() => handleUnban(hunter.hunterId)}>
                    Unban
                  </button>
                ) : (
                  <>
                    <button onClick={() => handleBan(hunter.hunterId)}>
                      Ban
                    </button>
                    <button onClick={() => handleBan(hunter.hunterId, true)}>
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
  );                               
}
