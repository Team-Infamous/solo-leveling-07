import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import { connectToDatabase } from '../../../lib/mongodb';
import { setCookie } from 'cookies-next';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    const { db } = await connectToDatabase();
    const hunter = await db.collection('hunters').findOne({ email });

    if (!hunter) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Compare passwords
    const passwordMatch = await compare(password, hunter.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check if hunter is banned
    if (hunter.isBanned) {
      return res.status(403).json({ 
        message: hunter.banType === 'PERMANENT' 
          ? 'This account has been permanently banned' 
          : 'This account is currently banned'
      });
    }

    // Create JWT token
    const token = sign(
      { 
        email: hunter.email, 
        hunterId: hunter.hunterId,
        isAdmin: hunter.isAdmin 
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Set HTTP-only cookie
    setCookie('token', token, {
      req,
      res,
      maxAge: 60 * 60 * 24 * 7,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
    });

    // Don't send password back
    delete hunter.password;

    res.status(200).json({
      message: 'Login successful',
      hunter
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
