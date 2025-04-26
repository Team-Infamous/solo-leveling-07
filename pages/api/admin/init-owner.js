// pages/api/admin/init-owner.js
import { connectToDatabase } from '../../../lib/db';
import { hashPassword } from '../../../lib/auth';

export default async function handler(req, res) {
  // 1. Verify secret token
  if (req.headers['x-init-secret'] !== process.env.OWNER_INIT_SECRET) {
    return res.status(403).json({ message: 'Forbidden' });
  }

  // 2. Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { client, db } = await connectToDatabase();

  try {
    // 3. Hash password securely
    const hashedPassword = await hashPassword(process.env.OWNER_PASSWORD);

    // 4. Owner account data
    const ownerData = {
      email: process.env.OWNER_EMAIL,
      password: hashedPassword,
      hunterName: "Sung Jinwoo",
      username: "shadow_monarch",
      hunterClass: "Shadow Monarch",
      rank: "S",
      level: 100,
      isOwner: true,
      isAdmin: true,
      shadowArmy: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // 5. Upsert owner account
    await db.collection('hunters').updateOne(
      { email: process.env.OWNER_EMAIL },
      { $set: ownerData },
      { upsert: true }
    );

    res.status(200).json({ 
      success: true,
      message: 'Owner account initialized',
      email: process.env.OWNER_EMAIL
    });
  } catch (error) {
    console.error('[OWNER INIT ERROR]', error);
    res.status(500).json({ 
      success: false,
      message: 'Initialization failed' 
    });
  } finally {
    client.close();
  }
}
