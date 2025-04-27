import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import styles from '../styles/Home.module.css';

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Solo Leveling: Arise - Become the Ultimate Hunter</title>
        <meta name="description" content="Enter the world of Solo Leveling and rise from the weakest to the strongest hunter" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <div className={styles.hero}>
          <Image 
            src="/images/characters/jinwoo/normal.png" 
            alt="Sung Jinwoo" 
            width={400} 
            height={600}
            className={styles.heroImage}
          />
          <div className={styles.heroText}>
            <h1 className={styles.title}>
              SOLO <span className={styles.highlight}>LEVELING</span> ARISE
            </h1>
            <p className={styles.description}>
              From the weakest E-Rank hunter to the Shadow Monarch. Your journey begins now.
            </p>
            <div className={styles.ctaButtons}>
              <Link href="/register" className={styles.ctaPrimary}>
                Register as Hunter
              </Link>
              <Link href="/login" className={styles.ctaSecondary}>
                Hunter Login
              </Link>
            </div>
          </div>
        </div>

        <div className={styles.features}>
          <div className={styles.featureCard}>
            <h3>Dungeon Raids</h3>
            <p>Enter deadly dungeons and battle terrifying monsters</p>
          </div>
          <div className={styles.featureCard}>
            <h3>PvP Battles</h3>
            <p>Challenge other hunters to prove your strength</p>
          </div>
          <div className={styles.featureCard}>
            <h3>Shadow Army</h3>
            <p>Command your own army of shadows (Admin Only)</p>
          </div>
        </div>
      </main>
    </div>
  );
}            
          
