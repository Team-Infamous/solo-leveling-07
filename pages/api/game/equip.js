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

  const { itemId, slot } = req.body;

  if (!itemId || !slot) {
    return res.status(422).json({ message: 'Missing item ID or slot' });
  }

  const { client, db } = await connectToDatabase();

  try {
    // Verify item exists in hunter's inventory
    const hunter = await db.collection('hunters').findOne({
      email: session.user.email,
      inventory: itemId
    });

    if (!hunter) {
      return res.status(404).json({ message: 'Item not found in inventory' });
    }

    // Get item details
    const item = await db.collection('shop-items').findOne({ _id: itemId });

    if (!item || item.type !== slot) {
      return res.status(400).json({ message: 'Invalid item for this slot' });
    }

    // Update equipped items
    const updateResult = await db.collection('hunters').updateOne(
      { email: session.user.email },
      { 
        $set: { 
          [`equipped.${slot}`]: item,
          updatedAt: new Date() 
        } 
      }
    );

    if (updateResult.modifiedCount === 0) {
      return res.status(400).json({ message: 'Failed to equip item' });
    }

    // Get updated equipped items
    const updatedHunter = await db.collection('hunters').findOne(
      { email: session.user.email },
      { projection: { equipped: 1 } }
    );

    res.status(200).json({ 
      message: 'Item equipped successfully',
      equipped: updatedHunter.equipped || {}
    });
  } catch (error) {
    console.error('Error equipping item:', error);
    res.status(500).json({ message: 'Internal server error' });
  } finally {
    client.close();
  }
}
                                 
