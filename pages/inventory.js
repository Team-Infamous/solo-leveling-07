import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import InventoryItem from '../components/InventoryItem';

export default function Inventory() {
  const [inventory, setInventory] = useState([]);
  const [equippedItems, setEquippedItems] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const response = await fetch('/api/game/inventory');
        const data = await response.json();

        if (response.ok) {
          setInventory(data.items);
          setEquippedItems(data.equipped || {});
        }
      } catch (error) {
        console.error('Error fetching inventory:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInventory();
  }, []);

  const handleEquip = async (itemId, slot) => {
    try {
      const response = await fetch('/api/game/equip', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ itemId, slot }),
      });

      const data = await response.json();

      if (response.ok) {
        setEquippedItems(data.equipped);
      }
    } catch (error) {
      console.error('Error equipping item:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-2xl">Loading inventory...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-yellow-400 font-solo">Hunter Inventory</h1>
          <button 
            onClick={() => router.push('/dashboard')}
            className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded transition-all"
          >
            Back to Dashboard
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1 bg-gray-800 p-6 rounded-lg">
            <h2 className="text-2xl font-bold mb-4 text-yellow-400">Equipped Items</h2>
            
            <div className="space-y-4">
              {['weapon', 'armor', 'helmet', 'boots', 'gloves', 'accessory'].map(slot => (
                <div key={slot} className="bg-gray-700 p-3 rounded">
                  <h3 className="font-bold capitalize mb-2">{slot}</h3>
                  {equippedItems[slot] ? (
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gray-600 rounded mr-2"></div>
                      <div>
                        <p className="font-bold">{equippedItems[slot].name}</p>
                        <p className="text-sm text-gray-400">+{equippedItems[slot].stats} {slot === 'weapon' ? 'ATK' : 'DEF'}</p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-400">Empty</p>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-3">
            <h2 className="text-2xl font-bold mb-4 text-yellow-400">Your Items</h2>
            
            {inventory.length === 0 ? (
              <div className="bg-gray-800 p-6 rounded-lg text-center">
                <p className="text-lg">Your inventory is empty</p>
                <button 
                  onClick={() => router.push('/shop')}
                  className="mt-4 bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-2 px-6 rounded transition-all"
                >
                  Visit Shop
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {inventory.map(item => (
                  <InventoryItem 
                    key={item._id}
                    item={item}
                    onEquip={handleEquip}
                    isEquipped={Object.values(equippedItems).some(eq => eq?._id === item._id)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
