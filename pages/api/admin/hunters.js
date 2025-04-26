import { getSession } from 'next-auth/react';
import { connectToDatabase } from '../../../lib/db';

export default async function handler(req, res) {
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

  const { client, db } = await connectToDatabase();

  try {
    const hunters = await db.collection('hunters')
      .find({}, { projection: { password: 0 } })
      .sort({ level: -1 })
      .toArray();

    res.status(200).json(hunters);
  } catch (error) {
    console.error('Error fetching hunters:', error);
    res.status(500).json({ message: 'Internal server error' });
  } finally {
    client.close();
  }
}
