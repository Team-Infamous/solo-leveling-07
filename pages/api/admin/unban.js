import { connectToDatabase } from '../../../lib/db';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  // Verify admin
  const authResponse = await fetch('http://localhost:3000/api/admin/verify', {
    headers: {
      'Cookie': req.headers.cookie,
    },
  });

  const authData = await authResponse.json();

  if (!authResponse.ok || authData.email !== 'lord_izana@yahoo.com') {
    return res.status(403).json({ message: 'Unauthorized' });
  }

  const { hunterId } = req.body;

  if (!hunterId) {
    return res.status(422).json({ message: 'Missing hunter ID' });
  }

  const client = await connectToDatabase();
  const db = client.db();

  try {
    const result = await db.collection('hunters').updateOne(
      { _id: hunterId },
      { 
        $set: { 
          isBanned: false,
          isDead: false,
          banReason: '',
          updatedAt: new Date(),
        } 
      }
    );

    if (result.modifiedCount === 0) {
      client.close();
      return res.status(404).json({ message: 'Hunter not found' });
    }

    client.close();
    return res.status(200).json({ message: 'Hunter unbanned successfully' });
  } catch (error) {
    client.close();
    console.error('Error unbanning hunter:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
