import { getSession } from 'next-auth/react';
import { connectToDatabase } from '../../../lib/db';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const session = await getSession({ req });

  if (!session) {
    return res.status(401).json({ message: 'Not authenticated' });
  }

  const { opponentId } = req.body;
  const { client, db } = await connectToDatabase();

  try {
    // Get both hunters' data
    const [hunter, opponent] = await Promise.all([
      db.collection('hunters').findOne({ email: session.user.email }),
      db.collection('hunters').findOne({ _id: opponentId }),
    ]);

    if (!hunter || !opponent) {
      return res.status(404).json({ message: 'Hunter not found' });
    }

    if (hunter.isBanned || hunter.isDead || opponent.isBanned || opponent.isDead) {
      return res.status(400).json({ message: 'Cannot battle with banned/dead hunters' });
    }

    // Simple battle logic (expand this)
    const hunterPower = calculatePower(hunter);
    const opponentPower = calculatePower(opponent);
    const hunterWinChance = hunterPower / (hunterPower + opponentPower);
    const isHunterWinner = Math.random() < hunterWinChance;

    // Battle results
    if (isHunterWinner) {
      const goldEarned = Math.floor(opponent.level * 10);
      const expEarned = Math.floor(opponent.level * 5);

      await db.collection('hunters').updateOne(
        { _id: hunter._id },
        { 
          $inc: { 
            gold: goldEarned,
            level: expEarned >= 100 ? 1 : 0
          },
          $set: { updatedAt: new Date() }
        }
      );

      res.status(200).json({
        message: `You defeated ${opponent.hunterName}!`,
        reward: {
          gold: goldEarned,
          exp: expEarned,
          levelUp: expEarned >= 100
        }
      });
    } else {
      // 5% chance of death in PVP
      const isDead = Math.random() < 0.05;
      
      if (isDead) {
        await db.collection('hunters').updateOne(
          { _id: hunter._id },
          { 
            $set: { 
              isDead: true,
              banReason: `Killed by ${opponent.hunterName} in PVP`,
              updatedAt: new Date()
            } 
          }
        );

        res.status(200).json({
          message: `You were killed by ${opponent.hunterName}! Account permanently banned.`,
          dead: true
        });
      } else {
        res.status(200).json({
          message: `You lost against ${opponent.hunterName}!`,
          reward: null
        });
      }
    }
  } catch (error) {
    console.error('PVP battle error:', error);
    res.status(500).json({ message: 'Internal server error' });
  } finally {
    client.close();
  }
}

function calculatePower(hunter) {
  // Simple power calculation based on level and equipment
  let power = hunter.level * 10;
  
  if (hunter.equipped?.weapon) {
    power += hunter.equipped.weapon.stats * 2;
  }
  
  if (hunter.equipped?.armor) {
    power += hunter.equipped.armor.stats;
  }
  
  return power;
  }
