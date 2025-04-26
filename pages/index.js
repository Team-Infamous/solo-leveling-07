import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Head>
        <title>Solo Leveling Arise | Become the Ultimate Hunter</title>
        <meta name="description" content="A powerful Solo Leveling inspired hunter game" />
      </Head>

      <main className="container mx-auto px-4 py-16">
        <div className="flex flex-col items-center justify-center">
          <Image 
            src="/public/images/characters/jinwoo/normal.png" 
            alt="Sung Jinwoo" 
            width={300} 
            height={400}
            className="mb-8 animate-pulse"
          />
          
          <h1 className="text-5xl font-bold mb-6 text-yellow-400 font-solo">
            SOLO LEVELING ARISE
          </h1>
          
          <p className="text-xl mb-12 text-center max-w-2xl">
            Enter the world of hunters and monsters. Will you survive the dungeons or perish like the weak?
          </p>
          
          <div className="flex gap-6">
            <Link href="/register" className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-lg text-lg transition-all transform hover:scale-105">
              Register as Hunter
            </Link>
            <Link href="/login" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg text-lg transition-all transform hover:scale-105">
              Hunter Login
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

