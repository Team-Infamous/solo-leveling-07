import { connectToDatabase } from '../../../lib/db';

export default async function handler(req, res) {
  const { client, db } = await connectToDatabase();

  try {
    const items = await db.collection('shop-items').find().toArray();
    res.status(200).json(items);
  } catch (error) {
    console.error('Error fetching shop items:', error);
    res.status(500).json({ message: 'Internal server error' });
  } finally {
    client.close();
  }
}
