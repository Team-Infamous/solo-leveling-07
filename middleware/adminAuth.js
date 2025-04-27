import { getToken } from 'next-auth/jwt';

export const adminAuth = async (req, res, next) => {
  const token = await getToken({ req });
  
  if (!token || !token.isAdmin) {
    return res.status(403).json({ 
      message: 'Shadow Monarch privileges required' 
    });
  }
  
  next();
};
