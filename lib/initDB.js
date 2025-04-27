import { hash } from 'bcryptjs';
import { MongoClient } from 'mongodb';

export async function initializeAdmin() {
  const uri = process.env.MONGODB_URI;
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    const db = client.db('solo_leveling');
    
    // Check if admin already exists
    const existingAdmin = await db.collection('hunters').findOne({
      email: 'lord_izana@yahoo.com'
    });
    
    if (existingAdmin) {
      console.log('Admin account already exists');
      return;
    }
    
    // Create admin account
    const hashedPassword = await hash('hasnainkk-07', 12);
    
    const admin = {
      email: 'lord_izana@yahoo.com',
      password: hashedPassword,
      hunterName: 'Sung Jinwoo',
      username: 'shadow_monarch',
      class: 'Shadow Monarch',
      hunterId: 777777,
      rank: 'S',
      level: 100,
      currentEXP: 0,
      requiredEXP: 0,
      stats: { strength: 99999999999999999, agility: 9999999999, intelligence: 999999999999, vitality: 999999999999 },
      maxHP: 99999999999999,
      currentHP: 99999999999999,
      maxMP: 5000000000000,
      currentMP: 50000000000,
      isAdmin: true,
      shadowArmy: ['Igris', 'Tusk', 'Iron', 'Kamish'],
      isBanned: false,
      banType: null,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    await db.collection('hunters').insertOne(admin);
    console.log('Admin account created successfully');
  } catch (error) {
    console.error('Initialization error:', error);
  } finally {
    await client.close();
  }
              }
