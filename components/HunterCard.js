import Image from 'next/image';

const HunterCard = ({ hunter }) => {
  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
      <div className="relative h-48 bg-gray-700">
        <Image 
          src={`/images/classes/${hunter.class.toLowerCase()}.png`}
          alt={hunter.class}
          layout="fill"
          objectFit="cover"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
          <h3 className="text-xl font-bold">{hunter.hunterName}</h3>
          <p className="text-sm text-gray-300">@{hunter.username}</p>
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-center mb-2">
          <span className="px-2 py-1 bg-blue-900 rounded-full text-xs">Lv. {hunter.level}</span>
          <span className={`px-2 py-1 rounded-full text-xs ${
            hunter.rank === 'S' ? 'bg-purple-900' :
            hunter.rank === 'A' ? 'bg-red-900' :
            hunter.rank === 'B' ? 'bg-orange-900' :
            hunter.rank === 'C' ? 'bg-yellow-900' :
            'bg-gray-700'
          }`}>
            {hunter.rank}-Rank
          </span>
        </div>
        
        <div className="mb-3">
          <div className="flex justify-between text-xs text-gray-400 mb-1">
            <span>HP: {hunter.currentHP}/{hunter.maxHP}</span>
            <span>EXP: {hunter.currentEXP}/{hunter.requiredEXP}</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2 mb-2">
            <div 
              className="bg-red-600 h-2 rounded-full" 
              style={{ width: `${(hunter.currentHP / hunter.maxHP) * 100}%` }}
            ></div>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full" 
              style={{ width: `${(hunter.currentEXP / hunter.requiredEXP) * 100}%` }}
            ></div>
          </div>
        </div>
        
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Class:</span>
          <span className="font-bold">{hunter.class}</span>
        </div>
      </div>
    </div>
  );
};

export default HunterCard;
