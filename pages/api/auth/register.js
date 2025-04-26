import { hashPassword } from '../../../lib/auth';
import { connectToDatabase } from '../../../lib/db';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { email, password, hunterName, username, hunterClass } = req.body;

  if (!email || !email.includes('@') || !password || password.trim().length < 7) {
    return res.status(422).json({ message: 'Invalid input' });
  }

  if (!hunterName || !username || !hunterClass) {
    return res.status(422).json({ message: 'Hunter details are required' });
  }

  const client = await connectToDatabase();
  const db = client.db();

  const existingUser = await db.collection('hunters').findOne({ email });

  if (existingUser) {
    client.close();
    return res.status(422).json({ message: 'Hunter already exists with this email' });
  }

  const existingUsername = await db.collection('hunters').findOne({ username });

  if (existingUsername) {
    client.close();
    return res.status(422).json({ message: 'Username already taken' });
  }

  const hashedPassword = await hashPassword(password);

  const result = await db.collection('hunters').insertOne({
    email,
    password: hashedPassword,
    hunterName,
    username,
    hunterClass,
    rank: 'E',
    level: 1,
    shadowArmy: [],
    inventory: [],
    gold: 100,
    isBanned: false,
    isDead: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  client.close();

  res.status(201).json({ message: 'Hunter created!', userId: result.insertedId });
}
