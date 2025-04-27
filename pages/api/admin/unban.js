import { getSession } from '../../../lib/auth';
import { connectToDatabase } from '../../../lib/mongodb';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const session = await getSession(req, res);

  if (!session || !session.isAdmin) {
    return res.status(403).json({ message: 'Unauthorized' });
  }

  const { hunterId } = req.body;

  if (!hunterId) {
    return res.status(400).json({ message: 'Hunter ID is required' });
  }

  try {
    const { db } = await connectToDatabase();

    // Check if hunter exists
    const hunter = await db.collection('hunters').findOne({ hunterId: parseInt(hunterId) });

    if (!hunter) {
      return res.status(404).json({ message: 'Hunter not found' });
    }

    // Update hunter status
    await db.collection('hunters').updateOne(
      { hunterId: parseInt(hunterId) },
      { 
        $set: { 
          isBanned: false,
          banType: null,
          updatedAt: new Date()
        } 
      }
    );

    res.status(200).json({ 
      message: 'Hunter unbanned',
      hunterId 
    });
  } catch (error) {
    console.error('Unban error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
