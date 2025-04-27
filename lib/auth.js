import { getCookie } from 'cookies-next';
import { verify } from 'jsonwebtoken';

export async function getSession(req, res) {
  const token = getCookie('token', { req, res });

  if (!token) {
    return null;
  }

  try {
    const decoded = verify(token, process.env.JWT_SECRET);
    return decoded;
  } catch (error) {
    console.error('Session verification error:', error);
    return null;
  }
}
