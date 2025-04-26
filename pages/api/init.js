import { connectToDatabase } from '../../lib/db';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { client, db } = await connectToDatabase();

  try {
    // Admin user (Jinwoo) create करें
    const adminUser = {
      email: "lord_izana@yahoo.com",
      password: "$2a$12$hashedpassword", // password you know
      hunterName: "Sung Jinwoo",
      username: "shadow_monarch",
      hunterClass: "Shadow Monarch",
      rank: "S",
      level: 100,
      gold: 9999,
      inventory: [],
      equipped: {},
      shadowArmy: [],
      isBanned: false,
      isDead: false,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    await db.collection('hunters').insertOne(adminUser);

    // Sample shop items add करें
    const shopItems = [
      {
        name: "Iron Sword",
        description: "Basic sword for novice hunters",
        type: "weapon",
        stats: 5,
        price: 50,
        rarity: "common"
      },
      // ... more items
    ];

    await db.collection('shop-items').insertMany(shopItems);

    res.status(200).json({ message: 'Database initialized successfully' });
  } catch (error) {
    console.error('Initialization error:', error);
    res.status(500).json({ message: 'Initialization failed' });
  } finally {
    client.close();
  }
      }
