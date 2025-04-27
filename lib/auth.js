import { hash, compare } from 'bcryptjs';

// Hash a password
export async function hashPassword(password) {
  return await hash(password, 12);
}

// Compare password with hash
export async function verifyPassword(password, hashedPassword) {
  return await compare(password, hashedPassword);
}

// Generate JWT token
export function generateToken(payload, secret, expiresIn = '7d') {
  return sign(payload, secret, { expiresIn });
}

// Get session from token
export async function getSession(req, res) {
  const token = getCookie('token', { req, res });
  if (!token) return null;

  try {
    return verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return null;
  }
}
