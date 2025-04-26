// pages/api/auth/login.js
import { connectToDatabase } from '../../../lib/db';
import { verifyPassword } from '../../../lib/auth';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { email, password } = req.body;
  const { client, db } = await connectToDatabase();

  try {
    const hunter = await db.collection('hunters').findOne({ email });

    if (!hunter) {
      return res.status(404).json({ message: 'Hunter not found' });
    }

    // Special owner verification
    if (email === process.env.OWNER_EMAIL) {
      const isValid = await verifyPassword(password, hunter.password);
      if (!isValid) {
        return res.status(403).json({ message: 'Invalid owner credentials' });
      }

      return res.status(200).json({
        isOwner: true,
        isAdmin: true,
        hunter: {
          email: hunter.email,
          hunterName: hunter.hunterName,
          shadowArmy: hunter.shadowArmy || []
        }
      });
    }

    // Normal hunter login
    const isValid = await verifyPassword(password, hunter.password);
    if (!isValid) {
      return res.status(403).json({ message: 'Invalid credentials' });
    }

    res.status(200).json({
      isOwner: false,
      hunter: {
        email: hunter.email,
        hunterName: hunter.hunterName,
        rank: hunter.rank
      }
    });
  } catch (error) {
    console.error('[LOGIN ERROR]', error);
    res.status(500).json({ message: 'Server error' });
  } finally {
    client.close();
  }
}
