export default function HunterCard({ hunter }) {
  const rankColors = {
    S: 'text-purple-500',
    A: 'text-red-500',
    B: 'text-orange-500',
    C: 'text-yellow-500',
    D: 'text-gray-400',
    E: 'text-gray-500'
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
      <div className="flex flex-col items-center mb-4">
        <div className="w-24 h-24 rounded-full bg-gray-700 mb-4 overflow-hidden border-2 border-yellow-400">
          {/* Character image would go here */}
          <div className="w-full h-full flex items-center justify-center text-3xl">
            {hunter.hunterName.charAt(0)}
          </div>
        </div>
        
        <h2 className="text-2xl font-bold">{hunter.hunterName}</h2>
        <p className="text-gray-400">@{hunter.username}</p>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-gray-700 p-3 rounded text-center">
          <p className="text-sm text-gray-400">Rank</p>
          <p className={`text-xl font-bold ${rankColors[hunter.rank] || 'text-white'}`}>
            {hunter.rank}
          </p>
        </div>
        
        <div className="bg-gray-700 p-3 rounded text-center">
          <p className="text-sm text-gray-400">Level</p>
          <p className="text-xl font-bold">{hunter.level}</p>
        </div>
      </div>
      
      <div className="mb-4">
        <p className="text-sm text-gray-400 mb-1">Class</p>
        <p className="font-bold capitalize">{hunter.hunterClass}</p>
      </div>
      
      <div className="mb-4">
        <p className="text-sm text-gray-400 mb-1">Gold</p>
        <p className="font-bold text-yellow-400">{hunter.gold} G</p>
      </div>
      
      <div className="bg-gray-700 p-3 rounded">
        <p className="text-sm text-gray-400 mb-1">Status</p>
        {hunter.isDead ? (
          <p className="text-red-500 font-bold">DECEASED</p>
        ) : hunter.isBanned ? (
          <p className="text-yellow-500 font-bold">BANNED</p>
        ) : (
          <p className="text-green-500 font-bold">ACTIVE</p>
        )}
      </div>
    </div>
  );
}
