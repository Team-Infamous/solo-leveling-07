import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import AdminPanel from '../components/AdminPanel';

export default function AdminPage() {
  const [hunters, setHunters] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchHunters = async () => {
      try {
        const res = await fetch('/api/admin/hunters');
        const data = await res.json();
        
        if (!res.ok) throw new Error(data.message);
        if (!data.isAdmin) router.push('/dashboard');
        
        setHunters(data.hunters);
      } catch (err) {
        console.error(err);
        router.push('/login');
      }
    };
    
    fetchHunters();
  }, []);

  return (
    <div className="admin-container">
      <h1 className="shadow-monarch-title">Shadow Monarch Control Panel</h1>
      <AdminPanel hunters={hunters} />
    </div>
  );
}
