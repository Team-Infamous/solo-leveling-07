import { getSession } from '../../../lib/auth';
import { connectToDatabase } from '../../../lib/mongodb';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const session = await getSession(req, res);

  if (!session) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const { db } = await connectToDatabase();

    // Get hunter data
    const hunter = await db.collection('hunters').findOne({ email: session.email });

    if (!hunter) {
      return res.status(404).json({ message: 'Hunter not found' });
    }

    if (hunter.isBanned) {
      return res.status(403).json({ 
        message: hunter.banType === 'PERMANENT' 
          ? 'This account has been permanently banned' 
          : 'This account is currently banned'
      });
    }

    // Check if hunter has enough HP
    if (hunter.currentHP <= 0) {
      return res.status(400).json({ message: 'You are too weak to enter a dungeon. Heal first.' });
    }

    // Generate dungeon difficulty based on hunter level
    const difficulty = Math.min(10, Math.max(1, Math.floor(hunter.level / 10)));
    const dungeonTypes = ['Goblin', 'Orc', 'Demon', 'Dragon', 'Undead'];
    const dungeonType = dungeonTypes[Math.floor(Math.random() * dungeonTypes.length)];

    // Calculate battle outcome
    const successChance = 0.7 + (hunter.level * 0.01);
    const isSuccess = Math.random() < successChance;

    // Calculate rewards or penalties
    let newHP = hunter.currentHP;
    let newEXP = hunter.currentEXP;
    let newGold = hunter.gold || 0;
    let message = '';
    let isDead = false;

    if (isSuccess) {
      const expGain = 10 * difficulty * (1 + Math.random());
      const goldGain = 5 * difficulty * (1 + Math.random());
      
      newEXP = Math.min(hunter.currentEXP + Math.floor(expGain), hunter.requiredEXP);
      newGold += Math.floor(goldGain);
      newHP = Math.max(1, hunter.currentHP - Math.floor(10 * difficulty * Math.random()));
      
      message = `You cleared a ${dungeonType} dungeon (Difficulty: ${difficulty}) and gained ${Math.floor(expGain)} EXP and ${Math.floor(goldGain)} gold!`;
    } else {
      const hpLoss = 30 * difficulty * (1 + Math.random());
      newHP = hunter.currentHP - Math.floor(hpLoss);
      
      if (newHP <= 0) {
        isDead = true;
        message = `You died in a ${dungeonType} dungeon (Difficulty: ${difficulty})!`;
      } else {
        message = `You failed to clear a ${dungeonType} dungeon (Difficulty: ${difficulty}) and lost ${Math.floor(hpLoss)} HP!`;
      }
    }

    // Check for level up
    let levelUp = false;
    let newLevel = hunter.level;
    let newRequiredEXP = hunter.requiredEXP;
    
    if (newEXP >= hunter.requiredEXP) {
      newLevel++;
      newEXP = newEXP - hunter.requiredEXP;
      newRequiredEXP = Math.floor(hunter.requiredEXP * 1.5);
      levelUp = true;
      message += ` Level up! You are now level ${newLevel}!`;
    }

    // Update hunter data
    const updateData = {
      currentHP: newHP,
      currentEXP: newEXP,
      requiredEXP: newRequiredEXP,
      level: newLevel,
      gold: newGold,
      updatedAt: new Date(),
      $push: {
        recentActivity: {
          $each: [message],
          $slice: -5
        }
      }
    };

    // If hunter died, ban them
    if (isDead) {
      updateData.isBanned = true;
      updateData.banType = 'PERMANENT';
      message += ' Your hunter license has been revoked permanently.';
    }

    await db.collection('hunters').updateOne(
      { email: session.email },
      { $set: updateData }
    );

    res.status(200).json({
      success: isSuccess,
      dead: isDead,
      message,
      rewards: {
        exp: isSuccess ? Math.floor(10 * difficulty * (1 + Math.random())) : 0,
        gold: isSuccess ? Math.floor(5 * difficulty * (1 + Math.random())) : 0
      },
      penalties: {
        hpLost: isSuccess ? Math.floor(10 * difficulty * Math.random()) : Math.floor(30 * difficulty * (1 + Math.random()))
      },
      levelUp,
      newLevel,
      newHP,
      isBanned: isDead
    });
  } catch (error) {
    console.error('Dungeon error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }      
}
