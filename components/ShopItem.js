export default function ShopItem({ item, onPurchase, canAfford }) {
  return (
    <div className="bg-gray-800 p-4 rounded-lg">
      <div className="flex justify-center mb-4">
        <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center">
          {/* Item icon would go here */}
          <span className="text-2xl">🛡️</span>
        </div>
      </div>
      
      <h3 className="text-xl font-bold text-center mb-2">{item.name}</h3>
      <p className="text-gray-400 text-center mb-4">{item.description}</p>
      
      <div className="flex justify-between items-center mb-4">
        <span className="text-yellow-400 font-bold">{item.price} G</span>
        <span className="text-sm bg-blue-600 px-2 py-1 rounded">
          {item.type.toUpperCase()}
        </span>
      </div>
      
      <button
        onClick={() => onPurchase(item._id)}
        disabled={!canAfford}
        className={`w-full py-2 rounded font-bold transition-all ${
          canAfford 
            ? 'bg-green-600 hover:bg-green-700' 
            : 'bg-gray-700 cursor-not-allowed'
        }`}
      >
        {canAfford ? 'Purchase' : 'Not Enough Gold'}
      </button>
    </div>
  );
    }
