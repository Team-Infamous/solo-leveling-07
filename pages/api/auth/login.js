import { connectToDatabase } from '../../../lib/db';
import { verifyPassword } from '../../../lib/auth';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { email, password } = req.body;

  if (!email || !email.includes('@') || !password) {
    return res.status(422).json({ message: 'Invalid input' });
  }

  const { client, db } = await connectToDatabase();

  try {
    const hunter = await db.collection('hunters').findOne({ email });

    if (!hunter) {
      return res.status(404).json({ message: 'Hunter not found' });
    }

    const isValid = await verifyPassword(password, hunter.password);

    if (!isValid) {
      return res.status(422).json({ message: 'Invalid credentials' });
    }

    // Create session (you'll need to implement NextAuth)
    // For now just return success
    res.status(200).json({ 
      message: 'Login successful',
      hunter: {
        email: hunter.email,
        hunterName: hunter.hunterName,
        username: hunter.username
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  } finally {
    client.close();
  }
}
