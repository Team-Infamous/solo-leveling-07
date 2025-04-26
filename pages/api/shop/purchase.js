import { getSession } from 'next-auth/react';
import { connectToDatabase } from '../../../lib/db';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const session = await getSession({ req });

  if (!session) {
    return res.status(401).json({ message: 'Not authenticated' });
  }

  const { itemId } = req.body;

  if (!itemId) {
    return res.status(422).json({ message: 'Missing item ID' });
  }

  const { client, db } = await connectToDatabase();

  try {
    // Get item details
    const item = await db.collection('shop-items').findOne({ _id: itemId });

    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    // Get hunter data
    const hunter = await db.collection('hunters').findOne({ email: session.user.email });

    if (!hunter) {
      return res.status(404).json({ message: 'Hunter not found' });
    }

    // Check if hunter has enough gold
    if (hunter.gold < item.price) {
      return res.status(400).json({ message: 'Not enough gold' });
    }

    // Transaction: deduct gold and add item to inventory
    const result = await db.collection('hunters').updateOne(
      { email: session.user.email },
      { 
        $inc: { gold: -item.price },
        $push: { inventory: item._id },
        $set: { updatedAt: new Date() }
      }
    );

    if (result.modifiedCount === 0) {
      return res.status(400).json({ message: 'Purchase failed' });
    }

    res.status(200).json({ 
      message: 'Purchase successful',
      newGold: hunter.gold - item.price
    });
  } catch (error) {
    console.error('Error processing purchase:', error);
    res.status(500).json({ message: 'Internal server error' });
  } finally {
    client.close();
  }
          }
