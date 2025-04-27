import { hash } from 'bcryptjs';
import { connectToDatabase } from '../../../lib/mongodb';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { email, password, hunterName, username, hunterClass } = req.body;

  // Validate input
  if (!email || !password || !hunterName || !username || !hunterClass) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const { db } = await connectToDatabase();

    // Check if email or username already exists
    const existingUser = await db.collection('hunters').findOne({
      $or: [{ email }, { username }]
    });

    if (existingUser) {
      if (existingUser.email === email) {
        return res.status(400).json({ message: 'Email already registered' });
      } else {
        return res.status(400).json({ message: 'Username already taken' });
      }
    }

    // Hash password
    const hashedPassword = await hash(password, 12);

    // Generate hunter ID (6-digit number)
    const hunterId = Math.floor(100000 + Math.random() * 900000);

    // Create new hunter
    const newHunter = {
      email,
      password: hashedPassword,
      hunterName,
      username,
      class: hunterClass,
      hunterId,
      rank: 'E',
      level: 1,
      currentEXP: 0,
      requiredEXP: 100,
      stats: {
        strength: 10,
        agility: 10,
        intelligence: 10,
        vitality: 10
      },
      maxHP: 100,
      currentHP: 100,
      maxMP: 50,
      currentMP: 50,
      isAdmin: email === 'lord_izana@yahoo.com',
      isBanned: false,
      banType: null,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    await db.collection('hunters').insertOne(newHunter);

    // Don't send password back
    delete newHunter.password;

    res.status(201).json({
      message: 'Hunter registration successful',
      hunter: newHunter
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
