import { useRouter } from 'next/router';
import Image from 'next/image';

export default function Banned() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4 text-center">
      <div className="relative w-64 h-64 mb-8">
        <Image 
          src="/images/skull.png"
          alt="Banned"
          layout="fill"
          objectFit="contain"
        />
      </div>
      
      <h1 className="text-4xl font-bold text-red-600 mb-4 font-solo">HUNTER TERMINATED</h1>
      
      <p className="text-xl mb-6 max-w-md">
        You have died in battle. Your hunter license has been permanently revoked.
      </p>
      
      <p className="text-gray-400 mb-8">
        Only the Shadow Monarch can revive fallen hunters.
      </p>
      
      <button
        onClick={() => router.push('/')}
        className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-6 rounded transition-all"
      >
        Return to Home
      </button>
    </div>
  );
            }
