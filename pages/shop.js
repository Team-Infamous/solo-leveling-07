import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import ShopItem from '../components/ShopItem';

export default function Shop() {
  const [items, setItems] = useState([]);
  const [hunterGold, setHunterGold] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [itemsRes, hunterRes] = await Promise.all([
          fetch('/api/shop/items'),
          fetch('/api/game/me'),
        ]);

        const itemsData = await itemsRes.json();
        const hunterData = await hunterRes.json();

        if (itemsRes.ok && hunterRes.ok) {
          setItems(itemsData);
          setHunterGold(hunterData.gold);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handlePurchase = async (itemId) => {
    try {
      const response = await fetch('/api/shop/purchase', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ itemId }),
      });

      const data = await response.json();

      if (response.ok) {
        setHunterGold(data.newGold);
        router.push('/inventory');
      }
    } catch (error) {
      console.error('Error purchasing item:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-2xl">Loading shop...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-yellow-400 font-solo">Hunter Shop</h1>
          <div className="flex items-center">
            <span className="text-2xl font-bold text-yellow-400 mr-4">{hunterGold} G</span>
            <button 
              onClick={() => router.push('/dashboard')}
              className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded transition-all"
            >
              Back to Dashboard
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map(item => (
            <ShopItem 
              key={item._id}
              item={item}
              onPurchase={handlePurchase}
              canAfford={hunterGold >= item.price}
            />
          ))}
        </div>
      </div>
    </div>
  );
    }
