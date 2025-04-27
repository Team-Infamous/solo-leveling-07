import { hash } from 'bcryptjs';
import { connectToDatabase } from '../../../lib/mongodb';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { email, password, hunterName, username, hunterClass } = req.body;

  // Validate input
  if (!email || !password || !hunterName || !username || !hunterClass) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const { db } = await connectToDatabase();

    // Check for existing user
    const existingUser = await db.collection('hunters').findOne({
      $or: [{ email }, { username }]
    });

    if (existingUser) {
      return res.status(409).json({ 
        message: existingUser.email === email 
          ? 'Email already registered' 
          : 'Username already taken'
      });
    }

    // Hash password
    const hashedPassword = await hash(password, 12);
    
    // Create new hunter
    const newHunter = {
      email,
      password: hashedPassword,
      hunterName,
      username,
      class: hunterClass,
      hunterId: Math.floor(100000 + Math.random() * 900000),
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
      isAdmin: false,
      shadowArmy: [],
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
    res.status(500).json({ 
      message: 'Internal server error',
      error: error.message 
    });
  }
        }
