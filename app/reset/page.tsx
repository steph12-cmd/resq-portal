'use client';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!token) setError('Invalid reset link. Please request a new one.');
  }, [token]);

  const handleReset = async () => {
    setError('');
    if (!password || !confirmPassword) {
      setError('Please fill in both fields');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword: password }),
      });
      const data = await res.json();
      if (data.success) {
        setSuccess(true);
      } else {
        setError(data.error || 'Reset failed. Please try again.');
      }
    } catch (error) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="text-center">
        <div className="text-6xl mb-6">✅</div>
        <h2 className="text-2xl font-black text-white mb-3">Password Reset!</h2>
        <p className="text-white/40 text-sm mb-8 leading-relaxed">
          Your password has been successfully updated.<br />
          Go back to the Siren app and login with your new password.
        </p>
        <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6">
          <p className="text-white/30 text-sm">
            Open the <span className="text-white font-semibold">Siren app</span> on your phone and login with your phone number and new password.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-black text-white mb-2">Create new password</h2>
      <p className="text-white/40 text-sm mb-8">
        Choose a strong password for your Siren account
      </p>

      {error && (
        <div className="bg-[#cc0000]/10 border border-[#cc0000]/30 rounded-xl px-4 py-3 mb-6">
          <p className="text-[#cc0000] text-sm">{error}</p>
        </div>
      )}

      <div className="flex flex-col gap-5">
        <div>
          <label className="text-white/40 text-xs font-semibold mb-2 block uppercase tracking-widest">
            New Password
          </label>
          <div className="flex bg-white/[0.04] border border-white/[0.08] rounded-xl overflow-hidden focus-within:border-[#cc0000]/50">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Min. 8 characters"
              className="flex-1 px-4 py-4 text-white placeholder-white/20 bg-transparent focus:outline-none text-sm"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="px-4 text-lg"
            >
              {showPassword ? '🙈' : '👁️'}
            </button>
          </div>
        </div>

        <div>
          <label className="text-white/40 text-xs font-semibold mb-2 block uppercase tracking-widest">
            Confirm New Password
          </label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleReset()}
            placeholder="Type password again"
            className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-4 text-white placeholder-white/20 focus:outline-none focus:border-[#cc0000]/50 text-sm"
          />
        </div>

        <button
          onClick={handleReset}
          disabled={loading || !token}
          className="w-full bg-[#cc0000] text-white py-4 rounded-xl font-semibold hover:bg-[#aa0000] transition disabled:opacity-50"
        >
          {loading ? 'Resetting...' : 'Reset Password'}
        </button>
      </div>
    </div>
  );
}

export default function ResetPage() {
  return (
    <main className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center px-6">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-[#cc0000] rounded-full opacity-[0.06] blur-[120px]" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="flex items-center gap-3 mb-10">
          <Link href="/" className="flex items-center gap-3">
            <img src="/icon.png" alt="Siren" className="w-8 h-8 rounded-xl" />
            <span className="font-bold text-lg tracking-wider">Siren</span>
          </Link>
        </div>

        <Suspense fallback={
          <div className="text-white/30 text-sm text-center">Loading...</div>
        }>
          <ResetPasswordForm />
        </Suspense>
      </div>
    </main>
  );
}