import { initializeAdmin } from '../../lib/initDB';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    await initializeAdmin();
    res.status(200).json({ message: 'Initialization complete' });
  } catch (error) {
    console.error('Initialization error:', error);
    res.status(500).json({ message: 'Initialization failed' });
  }
}
