import { getSession } from 'next-auth/react';
import { connectToDatabase } from '../../../lib/db';

export default async function handler(req, res) {
  const session = await getSession({ req });

  if (!session) {
    return res.status(401).json({ message: 'Not authenticated' });
  }

  const { client, db } = await connectToDatabase();

  try {
    const hunter = await db.collection('hunters').findOne(
      { email: session.user.email },
      { projection: { inventory: 1, equipped: 1 } }
    );

    if (!hunter) {
      return res.status(404).json({ message: 'Hunter not found' });
    }

    // Get full item details from inventory
    const inventoryItems = await db.collection('shop-items').find({
      _id: { $in: hunter.inventory || [] }
    }).toArray();

    res.status(200).json({ 
      items: inventoryItems,
      equipped: hunter.equipped || {}
    });
  } catch (error) {
    console.error('Error fetching inventory:', error);
    res.status(500).json({ message: 'Internal server error' });
  } finally {
    client.close();
  }
      }
