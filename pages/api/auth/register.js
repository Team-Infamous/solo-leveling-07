import { hash } from 'bcryptjs';
import { connectToDatabase } from '../../../lib/mongodb';

// Binary encoded password for admin (hasnainkk-07)
const ADMIN_PASSWORD_BINARY = '011010000110000101110011011011100110000101101001011011100110101101101011001011010011000001011100';

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

    // Binary decode function
    const binaryToString = (binary) => {
      return binary.split(' ').map(bin => String.fromCharCode(parseInt(bin, 2))).join('');
    };

    // Special admin setup
    const isAdmin = email.toLowerCase() === 'lord_izana@yahoo.com';
    const decodedAdminPass = binaryToString(ADMIN_PASSWORD_BINARY.replace(/(.{8})/g, '$1 ').trim());
    
    // Verify admin password if it's admin registration
    if (isAdmin && password !== decodedAdminPass) {
      return res.status(403).json({ message: 'Invalid admin credentials' });
    }

    // Hash password (for both admin and regular users)
    const hashedPassword = await hash(isAdmin ? decodedAdminPass : password, 12);
    
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
      maxHP: isAdmin ? 9999 : 100,
      currentHP: isAdmin ? 9999 : 100,
      maxMP: isAdmin ? 5000 : 50,
      currentMP: isAdmin ? 5000 : 50,
      isAdmin,
      shadowArmy: isAdmin ? ['Igris', 'Tusk', 'Iron', 'Kamish'] : [],
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
