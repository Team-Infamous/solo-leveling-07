import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Head>
        <title>Solo Leveling Arise | Become the Ultimate Hunter</title>
        <meta name="description" content="A powerful Solo Leveling inspired hunter game" />
      </Head>

      <main className="container mx-auto px-4 py-16">
        <div className="flex flex-col items-center justify-center min-h-[80vh]">
          {/* Character Image - Make sure path is correct */}
          <div className="relative w-64 h-80 mb-10">
            <Image 
              src="/images/characters/jinwoo/normal.png"  // Removed /public
              alt="Sung Jinwoo" 
              fill
              style={{ objectFit: 'contain' }}
              className="animate-[pulse_3s_infinite]"
              priority
            />
          </div>
          
          {/* Title with custom font (add font to your CSS) */}
          <h1 className="text-6xl font-bold mb-6 text-yellow-500 font-mono tracking-wider">
            SOLO LEVELING ARISE
          </h1>
          
          {/* Subtitle */}
          <p className="text-xl mb-16 text-center max-w-2xl text-gray-300">
            Enter the world of hunters and monsters. Will you survive the dungeons or perish like the weak?
          </p>
          
          {/* Buttons with proper spacing */}
          <div className="flex gap-10">
            <Link 
              href="/register" 
              className="bg-red-700 hover:bg-red-600 text-white font-bold py-4 px-10 rounded-lg text-xl transition-all duration-300 hover:scale-110 shadow-lg shadow-red-900/50"
            >
              REGISTER
            </Link>
            <Link 
              href="/login" 
              className="bg-blue-700 hover:bg-blue-600 text-white font-bold py-4 px-10 rounded-lg text-xl transition-all duration-300 hover:scale-110 shadow-lg shadow-blue-900/50"
            >
              LOGIN
            </Link>
          </div>
        </div>
      </main>

      {/* Add this to your global CSS */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@700&display=swap');
        .font-mono {
          font-family: 'Orbitron', monospace;
        }
      `}</style>
    </div>
  );
}
