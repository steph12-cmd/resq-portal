'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { db } from '../lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Please enter your email and password');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const q = query(
        collection(db, 'organisations'),
        where('email', '==', email),
        where('password', '==', password),
        where('status', '==', 'approved')
      );
      const snap = await getDocs(q);
      if (snap.empty) {
        setError('Invalid credentials or organisation not yet approved');
        return;
      }
      const org = { id: snap.docs[0].id, ...snap.docs[0].data() };
      localStorage.setItem('sirenOrg', JSON.stringify(org));
      router.push('/dashboard');
    } catch (error) {
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center px-6">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-[#cc0000] rounded-full opacity-[0.06] blur-[120px]" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="flex flex-col items-center mb-10">
          <img src="/icon.png" alt="Siren" className="w-14 h-14 rounded-2xl mb-4" />
          <h1 className="text-3xl font-black text-white mb-2">Welcome back</h1>
          <p className="text-white/30 text-sm">Login to your Siren organisation portal</p>
        </div>

        {error && (
          <div className="bg-[#cc0000]/10 border border-[#cc0000]/30 rounded-xl px-4 py-3 mb-6">
            <p className="text-[#cc0000] text-sm">{error}</p>
          </div>
        )}

        <div className="flex flex-col gap-5">
          <div>
            <label className="text-white/40 text-xs font-semibold mb-2 block uppercase tracking-widest">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. info@lagosfire.gov.ng"
              className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-4 text-white placeholder-white/20 focus:outline-none focus:border-[#cc0000]/50 text-sm"
            />
          </div>

          <div>
            <label className="text-white/40 text-xs font-semibold mb-2 block uppercase tracking-widest">Password</label>
            <div className="flex bg-white/[0.04] border border-white/[0.08] rounded-xl overflow-hidden focus-within:border-[#cc0000]/50">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="flex-1 px-4 py-4 text-white placeholder-white/20 bg-transparent focus:outline-none text-sm"
              />
              <button onClick={() => setShowPassword(!showPassword)} className="px-4 text-lg">
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full bg-[#cc0000] text-white py-4 rounded-xl font-semibold hover:bg-[#aa0000] transition disabled:opacity-50"
          >
            {loading ? 'Logging in...' : 'Login to Portal'}
          </button>

          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-white/[0.06]" />
            <span className="text-white/20 text-xs">or</span>
            <div className="flex-1 h-px bg-white/[0.06]" />
          </div>

          <Link href="/register" className="w-full border border-white/[0.08] text-white/40 text-center py-4 rounded-xl text-sm hover:bg-white/[0.04] transition">
            Register your organisation
          </Link>
        </div>

        <p className="text-white/20 text-xs text-center mt-8">
          Are you a responder?{' '}
          <span className="text-[#cc0000]">Download the Siren app</span>
        </p>
      </div>
    </main>
  );
}