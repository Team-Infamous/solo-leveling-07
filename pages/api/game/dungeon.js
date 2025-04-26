import { connectToDatabase } from '../../../lib/db';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const client = await connectToDatabase();
  const db = client.db();

  try {
    // Get hunter data
    const hunter = await db.collection('hunters').findOne({ 
      _id: req.body.hunterId,
      isBanned: { $ne: true },
      isDead: { $ne: true },
    });

    if (!hunter) {
      client.close();
      return res.status(404).json({ message: 'Hunter not found or banned/dead' });
    }

    // Dungeon logic
    const successRate = 0.7; // 70% chance of success
    const isSuccess = Math.random() < successRate;
    const goldEarned = Math.floor(Math.random() * 100) + 50;
    const expEarned = Math.floor(Math.random() * 20) + 10;

    if (isSuccess) {
      // Update hunter on success
      await db.collection('hunters').updateOne(
        { _id: hunter._id },
        { 
          $inc: { 
            gold: goldEarned,
            level: expEarned >= 100 ? 1 : 0,
          },
          $set: {
            updatedAt: new Date(),
          }
        }
      );

      client.close();
      return res.status(200).json({ 
        message: 'Dungeon cleared successfully!',
        reward: {
          gold: goldEarned,
          exp: expEarned,
          levelUp: expEarned >= 100,
        }
      });
    } else {
      // 10% chance of death
      const isDead = Math.random() < 0.1;
      
      if (isDead) {
        await db.collection('hunters').updateOne(
          { _id: hunter._id },
          { 
            $set: { 
              isDead: true,
              banReason: 'Died in dungeon',
              updatedAt: new Date(),
            } 
          }
        );

        client.close();
        return res.status(200).json({ 
          message: 'You died in the dungeon! Your account has been permanently banned.',
          dead: true,
        });
      } else {
        // Just failed, no reward
        client.close();
        return res.status(200).json({ 
          message: 'Dungeon attempt failed, but you survived.',
          reward: null,
        });
      }
    }
  } catch (error) {
    client.close();
    console.error('Error processing dungeon:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
