import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import InfinitySymbol from '../assets/InfinitySymbol.jsx';
import { Lock, Mail, ArrowRight, AlertCircle } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectUrl = searchParams.get('redirect') || '/movies';

  const { login, loginAsDemo } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please provide both email and password.');
      return;
    }

    setLoading(true);
    const result = await login(email, password);
    setLoading(false);

    if (result.success) {
      navigate(redirectUrl);
    } else {
      setError(result.error || 'Invalid credentials');
    }
  };

  const handleDemoFill = async () => {
    setEmail('demo@cinema.com');
    setPassword('Demo@123');
    setLoading(true);
    const result = await loginAsDemo();
    setLoading(false);
    if (result.success) {
      navigate(redirectUrl);
    }
  };

  return (
    <div className="min-h-screen bg-[#09090e] flex items-center justify-center px-4 py-24 font-sans-clean">
      <div className="w-full max-w-sm rounded-2xl p-8 bg-[#12111a] border border-white/10 shadow-xl">
        <div className="text-center mb-8">
          <InfinitySymbol className="w-6 h-6 mx-auto mb-3 text-indigo-400" />
          <h1 className="font-display font-bold text-xl text-white">
            Member Sign In
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Access your reserved passes and booking history
          </p>
        </div>

        {error && (
          <div className="mb-5 p-3 rounded-lg bg-red-950/20 border border-red-500/30 flex items-center gap-2 text-xs text-red-300">
            <AlertCircle className="w-3.5 h-3.5 text-red-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-9 pr-3 py-2 rounded-lg bg-[#09090e] border border-white/10 focus:border-indigo-400 text-xs text-slate-100 placeholder-slate-600 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2 rounded-lg bg-[#09090e] border border-white/10 focus:border-indigo-400 text-xs text-slate-100 placeholder-slate-600 focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 rounded-lg text-xs font-semibold uppercase tracking-wider text-white bg-indigo-600 hover:bg-indigo-500 transition-colors flex items-center justify-center gap-2 mt-6"
          >
            {loading ? (
              <span>Signing in...</span>
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </form>

        {/* Quiet reviewer demo account shortcut */}
        <div className="mt-6 pt-4 border-t border-white/10 text-center">
          <button
            type="button"
            onClick={handleDemoFill}
            className="text-xs text-slate-400 hover:text-indigo-400 transition-colors"
          >
            Sign in with demo account (<span className="text-slate-300">demo@cinema.com</span>)
          </button>
        </div>

        <div className="mt-4 text-center text-xs text-slate-500">
          <span>Need an account? </span>
          <Link
            to={`/signup?redirect=${encodeURIComponent(redirectUrl)}`}
            className="text-indigo-400 hover:text-indigo-300 font-medium"
          >
            Join Membership
          </Link>
        </div>
      </div>
    </div>
  );
}
