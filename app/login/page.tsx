'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  return (
    <main className="min-h-screen bg-[#111111] flex flex-col items-center justify-center px-6">

      <div className="w-full max-w-md">

        <div className="flex flex-col items-center mb-8">
  <img src="/icon.png" alt="ResQ" className="w-16 h-16 rounded-2xl mb-3" />
  <h1 className="text-2xl font-black text-white tracking-wider">ResQ</h1>
  <p className="text-white/30 text-sm">Organisation Portal</p>
</div>

        <h1 className="text-3xl font-bold text-white mb-2">Welcome back 👋</h1>
        <p className="text-[#888] text-sm mb-8">Login to your ResQ organisation portal</p>

        <div className="flex flex-col gap-5">

          <div>
            <label className="text-[#aaa] text-sm font-semibold mb-2 block">Email address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. info@lagosfire.gov.ng"
              className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl px-4 py-4 text-white placeholder-[#444] focus:outline-none focus:border-[#cc0000]"
            />
          </div>

          <div>
            <label className="text-[#aaa] text-sm font-semibold mb-2 block">Password</label>
            <div className="flex bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl overflow-hidden focus-within:border-[#cc0000]">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="flex-1 px-4 py-4 text-white placeholder-[#444] bg-transparent focus:outline-none"
              />
              <button
                onClick={() => setShowPassword(!showPassword)}
                className="px-4 text-lg"
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          <div className="flex justify-end">
            <span className="text-[#cc0000] text-sm cursor-pointer hover:underline">
              Forgot password?
            </span>
          </div>

          <button
            onClick={() => router.push('/dashboard')}
            className="w-full bg-[#cc0000] text-white py-4 rounded-full font-semibold hover:bg-[#aa0000] transition"
          >
            Login to Portal
          </button>

          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-[#2a2a2a]" />
            <span className="text-[#555] text-sm">or</span>
            <div className="flex-1 h-px bg-[#2a2a2a]" />
          </div>

          <Link
            href="/register"
            className="w-full border border-[#cc0000] text-[#cc0000] text-center py-4 rounded-full font-semibold hover:bg-[#cc0000] hover:text-white transition"
          >
            Register your organisation
          </Link>

        </div>

        <p className="text-[#555] text-sm text-center mt-8">
          Are you a responder?{' '}
          <span className="text-[#cc0000] cursor-pointer">Download the ResQ app</span>
        </p>

      </div>
    </main>
  );
}