export default function InventoryItem({ item, onEquip, isEquipped }) {
  const equipSlots = {
    weapon: 'Sword Hand',
    armor: 'Body',
    helmet: 'Head',
    boots: 'Feet',
    gloves: 'Hands',
    accessory: 'Neck'
  };

  return (
    <div className="bg-gray-800 p-4 rounded-lg">
      <div className="flex items-start mb-3">
        <div className="w-12 h-12 bg-gray-700 rounded mr-3 flex items-center justify-center">
          {/* Item icon would go here */}
          <span className="text-xl">⚔️</span>
        </div>
        
        <div className="flex-1">
          <h3 className="font-bold">{item.name}</h3>
          <p className="text-sm text-gray-400 capitalize">{item.type}</p>
          <p className="text-sm">
            +{item.stats} {item.type === 'weapon' ? 'ATK' : 'DEF'}
          </p>
        </div>
      </div>
      
      <div className="flex flex-wrap gap-2 mt-4">
        {item.type !== 'consumable' && (
          <button
            onClick={() => onEquip(item._id, item.type)}
            className={`text-sm py-1 px-3 rounded ${
              isEquipped 
                ? 'bg-purple-600 hover:bg-purple-700' 
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {isEquipped ? 'Equipped' : `Equip to ${equipSlots[item.type]}`}
          </button>
        )}
        
        {item.type === 'consumable' && (
          <button className="text-sm bg-green-600 hover:bg-green-700 py-1 px-3 rounded">
            Use
          </button>
        )}
      </div>
    </div>
  );
}
