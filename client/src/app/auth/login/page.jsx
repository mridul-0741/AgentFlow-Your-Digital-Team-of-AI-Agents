'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import Image from 'next/image';
import logo from '../../../../public/logo.png';
import heroImage from '../../../../public/team.png';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      router.push('/home');
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#060816] text-white">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at top right, rgba(94, 120, 255, 0.16), transparent 22%),' +
            'radial-gradient(circle at 20% 20%, rgba(56, 189, 248, 0.12), transparent 24%),' +
            'linear-gradient(180deg, rgba(6, 8, 18, 0.96), rgba(6, 8, 18, 0.96))',
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.08) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
          backgroundPosition: '0 0, 12px 12px',
        }}
      />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl items-center px-6 py-12">
        <div className="grid w-full gap-10 lg:grid-cols-[1.05fr_0.95fr] items-center">
          <div className="space-y-10">
            <div className="flex items-center gap-3 rounded-3xl border border-white/10 bg-white/5 px-4 py-3 shadow-[0_24px_80px_-48px_rgba(99,102,241,0.9)] backdrop-blur-xl">
              <Image src={logo} alt="AgentFlow Logo" className="h-10 w-10 rounded-2xl bg-white/5 p-2" />
              <div>
                <p className="text-sm font-medium text-slate-200">AgentFlow</p>
                <p className="text-xs text-slate-500">AI team orchestration platform</p>
              </div>
            </div>

            <div className="space-y-5">
              <p className="inline-flex rounded-full border border-indigo-500/20 bg-indigo-500/10 px-3 py-1 text-sm font-medium text-indigo-200">
                Secure login experience
              </p>
              <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                Log in to your AI operations workspace
              </h1>
              <p className="max-w-xl text-base leading-8 text-slate-300">
                Access your private AgentFlow dashboard, manage tasks, and keep your orchestration team working together.
              </p>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-slate-950/80 p-8 shadow-[0_40px_120px_-60px_rgba(0,0,0,0.75)] backdrop-blur-xl">
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="rounded-3xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-200">
                    {error}
                  </div>
                )}

                <div className="space-y-3">
                  <label htmlFor="email" className="block text-sm font-medium text-slate-200">
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="you@example.com"
                    className="w-full rounded-2xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-white placeholder:text-slate-500 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>

                <div className="space-y-3">
                  <label htmlFor="password" className="block text-sm font-medium text-slate-200">
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    className="w-full rounded-2xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-white placeholder:text-slate-500 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full items-center justify-center rounded-2xl bg-gradient-to-r from-indigo-600 to-cyan-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-cyan-500/20 transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? 'Signing in...' : 'Sign In'}
                </button>
              </form>

              <div className="mt-6 flex items-center justify-between text-sm text-slate-500">
                <p>New to AgentFlow?</p>
                <Link href="/auth/register" className="text-indigo-300 hover:text-white">
                  Create Account
                </Link>
              </div>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-[0_40px_120px_-60px_rgba(56,189,248,0.18)] backdrop-blur-xl">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(99,102,241,0.24),transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(56,189,248,0.18),transparent_30%)]" />
            <div className="relative flex h-full flex-col justify-between gap-6">
              <div className="space-y-4">
                <span className="inline-flex rounded-full bg-slate-950/70 px-4 py-1.5 text-sm font-medium text-cyan-100">
                  Designed for agent-led teams
                </span>
                <h2 className="text-3xl font-semibold text-white">Bring your home page energy to login</h2>
                <p className="max-w-lg text-slate-300">
                  A refreshed login experience aligned with your AgentFlow brand, complete with illustration and polished page styling.
                </p>
              </div>

              <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950/90 p-4 shadow-[0_20px_60px_-30px_rgba(0,0,0,0.55)]">
                <Image
                  src={heroImage}
                  alt="AgentFlow team illustration"
                  className="h-[320px] w-full object-cover"
                  priority
                />
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-4 text-sm text-slate-300">
                  <p className="font-semibold text-white">Enterprise-ready</p>
                  <p className="mt-2 text-slate-400">Secure access with JWT authentication.</p>
                </div>
                <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-4 text-sm text-slate-300">
                  <p className="font-semibold text-white">Agent workflow</p>
                  <p className="mt-2 text-slate-400">Keep your orchestration team in one dashboard.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
