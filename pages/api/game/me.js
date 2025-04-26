import { getSession } from 'next-auth/react';
import { connectToDatabase } from '../../../lib/db';

export default async function handler(req, res) {
  const session = await getSession({ req });

  if (!session) {
    return res.status(401).json({ message: 'Not authenticated' });
  }

  const { client, db } = await connectToDatabase();

  try {
    const hunter = await db.collection('hunters').findOne({ email: session.user.email });

    if (!hunter) {
      return res.status(404).json({ message: 'Hunter not found' });
    }

    // Don't send password hash to client
    const { password, ...hunterData } = hunter;

    res.status(200).json(hunterData);
  } catch (error) {
    console.error('Error fetching hunter data:', error);
    res.status(500).json({ message: 'Internal server error' });
  } finally {
    client.close();
  }
}
