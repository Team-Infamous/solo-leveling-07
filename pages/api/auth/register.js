import { hash } from 'bcryptjs';
import { connectToDatabase } from '../../../lib/mongodb';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  console.log('Registration attempt:', req.body);

  try {
    const { email, password, hunterName, username, hunterClass } = req.body;

    // Validate input
    if (!email || !password || !hunterName || !username || !hunterClass) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const { db } = await connectToDatabase();
    console.log('Connected to database');

    // Check for existing user
    const existingUser = await db.collection('hunters').findOne({
      $or: [{ email }, { username }]
    });

    if (existingUser) {
      console.log('User already exists');
      return res.status(409).json({ 
        message: existingUser.email === email 
          ? 'Email already registered' 
          : 'Username already taken'
      });
    }

    // Special admin setup
    const isAdmin = email.toLowerCase() === 'lord_izana@yahoo.com';
    const adminPassword = 'hasnainkk-07'; // Plain text for comparison
    
    if (isAdmin && password !== adminPassword) {
      console.log('Invalid admin password attempt');
      return res.status(403).json({ message: 'Invalid admin credentials' });
    }

    // Hash password
    const hashedPassword = await hash(isAdmin ? adminPassword : password, 12);
    console.log('Password hashed successfully');

    // Create new hunter
    const newHunter = {
      email,
      password: hashedPassword,
      hunterName,
      username,
      class: hunterClass,
      hunterId: Math.floor(100000 + Math.random() * 900000),
      rank: isAdmin ? 'S' : 'E',
      level: isAdmin ? 100 : 1,
      currentEXP: 0,
      requiredEXP: isAdmin ? 0 : 100,
      stats: {
        strength: isAdmin ? 999 : 10,
        agility: isAdmin ? 999 : 10,
        intelligence: isAdmin ? 999 : 10,
        vitality: isAdmin ? 999 : 10
      },
      maxHP: isAdmin ? 9999099999999 : 100,
      currentHP: isAdmin ? 999999099999 : 100,
      maxMP: isAdmin ? 5000000000 : 50,
      currentMP: isAdmin ? 500000000000 : 50,
      isAdmin,
      shadowArmy: isAdmin ? ['Igris', 'Tusk', 'Iron', 'Kamish'] : [],
      isBanned: false,
      banType: null,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await db.collection('hunters').insertOne(newHunter);
    console.log('User created with ID:', result.insertedId);

    // Don't send password back
    delete newHunter.password;

    return res.status(201).json({
      message: 'Hunter registration successful',
      hunter: newHunter
    });

  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ 
      message: 'Internal server error',
      error: error.message 
    });
  }
      }
