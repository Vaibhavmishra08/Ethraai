import { useState } from 'react';
import { Users, Lock, LogIn, UserPlus, CheckCircle2, Sparkles } from 'lucide-react';

const demoAccounts = [
  { label: 'Admin demo', email: 'admin@task.local', password: 'admin123' },
  { label: 'Member demo', email: 'member@task.local', password: 'member123' },
];

export function SetupProfile({ onLogin, onRegister, onResetPassword }) {
  const [mode, setMode] = useState('login');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [name, setName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [resetEmail, setResetEmail] = useState('');
  const [resetPassword, setResetPassword] = useState('');
  const [resetConfirm, setResetConfirm] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const resetError = () => {
    setError('');
    setSuccess('');
  };

  const autofillDemo = ({ email, password }) => {
    setMode('login');
    setLoginEmail(email);
    setLoginPassword(password);
    resetError();
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    resetError();
    setSubmitting(true);

    try {
      await onLogin({ email: loginEmail.trim(), password: loginPassword });
    } catch (err) {
      setError(err.message || 'Login failed.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    resetError();
    setSubmitting(true);

    try {
      if (!name.trim()) {
        throw new Error('Please enter your name.');
      }
      await onRegister({ name: name.trim(), email: registerEmail.trim(), password: registerPassword });
    } catch (err) {
      setError(err.message || 'Registration failed.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = async (e) => {
    e.preventDefault();
    resetError();
    setSubmitting(true);

    try {
      if (resetPassword !== resetConfirm) {
        throw new Error('Passwords do not match.');
      }
      await onResetPassword({ email: resetEmail.trim(), password: resetPassword });
      setSuccess('Password reset successful. You can now sign in.');
      setMode('login');
      setLoginEmail(resetEmail.trim());
      setLoginPassword('');
    } catch (err) {
      setError(err.message || 'Password reset failed.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4">
      <div className="grid gap-8 w-full max-w-5xl lg:grid-cols-[1.2fr_0.9fr]">
        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl p-10 sm:p-12 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-4 mb-8">
            <div className="rounded-3xl bg-blue-600 p-4 text-white">
              <CheckCircle2 size={28} />
            </div>
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-blue-600 dark:text-blue-400 font-semibold mb-2">TaskSync</p>
              <h1 className="text-3xl font-bold">Welcome back</h1>
              <p className="mt-3 text-slate-500 dark:text-slate-400 max-w-xl">
                Access your workspace with local credentials, reset a password instantly, or jump in with a demo account.
              </p>
            </div>
          </div>

          <div className="flex gap-2 mb-7 overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950">
            <button
              type="button"
              onClick={() => { setMode('login'); resetError(); }}
              className={`flex-1 py-3 text-sm font-semibold transition ${mode === 'login' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-inner' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'}`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => { setMode('register'); resetError(); }}
              className={`flex-1 py-3 text-sm font-semibold transition ${mode === 'register' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-inner' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'}`}
            >
              Register
            </button>
            <button
              type="button"
              onClick={() => { setMode('reset'); resetError(); }}
              className={`flex-1 py-3 text-sm font-semibold transition ${mode === 'reset' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-inner' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'}`}
            >
              Reset Password
            </button>
          </div>

          {(error || success) && (
            <div className={`mb-6 rounded-2xl border p-4 text-sm ${error ? 'bg-red-50 border-red-200 text-red-700 dark:bg-red-950/50 dark:border-red-800 dark:text-red-300' : 'bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-900/50 dark:border-emerald-700 dark:text-emerald-200'}`}>
              {error || success}
            </div>
          )}

          {mode === 'login' && (
            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <div className="flex items-center gap-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-4 py-2">
                  <Users className="text-slate-400" size={18} />
                  <input
                    type="email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full bg-transparent text-slate-900 dark:text-slate-100 outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Password</label>
                <div className="flex items-center gap-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-4 py-2">
                  <Lock className="text-slate-400" size={18} />
                  <input
                    type="password"
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full bg-transparent text-slate-900 dark:text-slate-100 outline-none"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-2xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? 'Signing in...' : 'Sign In'}
              </button>
              <p className="text-sm text-slate-500 dark:text-slate-400 text-center">
                New here?{' '}
                <button type="button" onClick={() => setMode('register')} className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">
                  Create an account
                </button>
              </p>
              <p className="text-center text-sm text-slate-400">
                <button type="button" onClick={() => { setMode('reset'); resetError(); }} className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">
                  Forgot password?
                </button>
              </p>
            </form>
          )}

          {mode === 'register' && (
            <form onSubmit={handleRegister} className="space-y-5">
              <div>
                <label className="block text-sm font-medium mb-2">Full Name</label>
                <div className="flex items-center gap-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-4 py-2">
                  <Users className="text-slate-400" size={18} />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Jane Doe"
                    className="w-full bg-transparent text-slate-900 dark:text-slate-100 outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <div className="flex items-center gap-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-4 py-2">
                  <Users className="text-slate-400" size={18} />
                  <input
                    type="email"
                    required
                    value={registerEmail}
                    onChange={(e) => setRegisterEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full bg-transparent text-slate-900 dark:text-slate-100 outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Password</label>
                <div className="flex items-center gap-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-4 py-2">
                  <Lock className="text-slate-400" size={18} />
                  <input
                    type="password"
                    required
                    value={registerPassword}
                    onChange={(e) => setRegisterPassword(e.target.value)}
                    placeholder="Choose a strong password"
                    className="w-full bg-transparent text-slate-900 dark:text-slate-100 outline-none"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-2xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? 'Creating account...' : 'Register account'}
              </button>
              <p className="text-sm text-slate-500 dark:text-slate-400 text-center">
                Already have an account?{' '}
                <button type="button" onClick={() => setMode('login')} className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">
                  Sign in instead
                </button>
              </p>
            </form>
          )}

          {mode === 'reset' && (
            <form onSubmit={handleReset} className="space-y-5">
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <div className="flex items-center gap-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-4 py-2">
                  <Users className="text-slate-400" size={18} />
                  <input
                    type="email"
                    required
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full bg-transparent text-slate-900 dark:text-slate-100 outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">New password</label>
                <div className="flex items-center gap-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-4 py-2">
                  <Lock className="text-slate-400" size={18} />
                  <input
                    type="password"
                    required
                    value={resetPassword}
                    onChange={(e) => setResetPassword(e.target.value)}
                    placeholder="New password"
                    className="w-full bg-transparent text-slate-900 dark:text-slate-100 outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Confirm password</label>
                <div className="flex items-center gap-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-4 py-2">
                  <Lock className="text-slate-400" size={18} />
                  <input
                    type="password"
                    required
                    value={resetConfirm}
                    onChange={(e) => setResetConfirm(e.target.value)}
                    placeholder="Confirm new password"
                    className="w-full bg-transparent text-slate-900 dark:text-slate-100 outline-none"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-2xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? 'Resetting password...' : 'Reset password'}
              </button>
            </form>
          )}
        </div>

        <aside className="space-y-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-950/95 p-8 text-slate-200 shadow-xl">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-sky-500 to-cyan-500 p-6 text-white shadow-lg">
            <div className="absolute inset-0 opacity-30 bg-white blur-2xl animate-pulse"></div>
            <div className="relative">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-white/15 p-3 text-blue-50">
                  <Sparkles size={20} />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-sky-200 font-semibold">Onboarding</p>
                  <h2 className="mt-3 text-2xl font-semibold">Launch fast with TaskSync</h2>
                </div>
              </div>
              <p className="mt-4 text-sm text-slate-100/90 leading-6">
                Create projects, assign tasks, and track progress instantly with a playful browser-first onboarding experience.
              </p>
              <div className="mt-6 space-y-4">
                <div className="rounded-3xl bg-white/10 p-4 backdrop-blur transition hover:bg-white/20">
                  <p className="text-sm font-semibold">Project board ready</p>
                  <p className="text-xs text-slate-200/80">Start your first project in seconds.</p>
                </div>
                <div className="rounded-3xl bg-white/10 p-4 backdrop-blur transition hover:bg-white/20">
                  <p className="text-sm font-semibold">Collaborate easily</p>
                  <p className="text-xs text-slate-200/80">Add members and assign tasks quickly.</p>
                </div>
              </div>
            </div>
          </div>
          <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-5 text-sm text-slate-400">
            <p className="font-semibold text-slate-100 mb-3">Demo accounts</p>
            <div className="space-y-3">
              {demoAccounts.map((account) => (
                <button
                  key={account.email}
                  type="button"
                  onClick={() => autofillDemo(account)}
                  className="w-full rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3 text-left text-sm transition hover:border-blue-400 hover:bg-slate-900"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="font-semibold text-white">{account.label}</p>
                      <p className="text-slate-500">{account.email}</p>
                    </div>
                    <span className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-300">Autofill</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
          <div className="rounded-3xl bg-slate-900/90 p-4 text-sm text-slate-400">
            <p className="font-semibold text-slate-100">Local first</p>
            <p className="mt-2 leading-6">
              All account data is stored locally in your browser for fast testing. Passwords are not encrypted, so use this only for demo purposes.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
