import { getSession } from 'next-auth/react';

export default async function handler(req, res) {
  const session = await getSession({ req });

  if (!session) {
    return res.status(401).json({ message: 'Not authenticated' });
  }

  // Only lord_izana@yahoo.com is admin
  if (session.user.email !== 'lord_izana@yahoo.com') {
    return res.status(403).json({ message: 'Not authorized' });
  }

  res.status(200).json({ 
    isAdmin: true,
    email: session.user.email 
  });
}
