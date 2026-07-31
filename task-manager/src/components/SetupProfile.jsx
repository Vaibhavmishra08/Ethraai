import { useState } from 'react';
import { Users, Lock, CheckCircle2, Sparkles, Shield, Rocket } from 'lucide-react';

const demoAccounts = [
  { label: 'Admin Access', email: 'admin@task.local', password: 'admin123', role: 'Admin', icon: Shield },
  { label: 'Member Access', email: 'member@task.local', password: 'member123', role: 'Member', icon: Users },
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
      if (!name.trim()) throw new Error('Please enter your name.');
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
      if (resetPassword !== resetConfirm) throw new Error('Passwords do not match.');
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
    <div className="min-h-screen bg-slate-950 flex font-sans overflow-hidden text-slate-100">
      
      {/* Left Pane - Dynamic Branding */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 p-12 relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 border-r border-slate-800/50">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none mix-blend-screen animate-pulse-slow"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[100px] pointer-events-none mix-blend-screen"></div>
        
        <div className="relative z-10 flex items-center gap-3">
          <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-3 rounded-2xl text-white shadow-xl shadow-blue-500/20">
            <CheckCircle2 size={32} />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">TaskSync</h1>
        </div>

        <div className="relative z-10 max-w-md mt-20">
          <Badge color="blue" className="mb-6 inline-flex border border-blue-500/30 bg-blue-500/10 text-blue-300 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-widest backdrop-blur-md">Enterprise Ready</Badge>
          <h2 className="text-5xl font-bold leading-tight mb-6">Manage tasks <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">with elegance.</span></h2>
          <p className="text-slate-400 text-lg leading-relaxed">
            Experience a seamless workflow with strict role-based access controls. Admins manage the big picture, while members focus on getting things done.
          </p>
        </div>

        <div className="relative z-10 mt-auto">
          <div className="glass-card p-6 rounded-2xl border border-slate-700/50 bg-slate-800/30">
            <p className="font-medium text-slate-200 mb-4 flex items-center gap-2"><Rocket size={18} className="text-purple-400"/> Quick Access Demos</p>
            <div className="grid grid-cols-2 gap-4">
              {demoAccounts.map((account) => {
                const Icon = account.icon;
                return (
                  <button
                    key={account.email}
                    onClick={() => autofillDemo(account)}
                    className="flex flex-col items-start gap-2 p-4 rounded-xl border border-slate-700/50 bg-slate-900/50 hover:bg-slate-800 transition-all hover:border-blue-500/50 text-left group"
                  >
                    <div className={`p-2 rounded-lg ${account.role === 'Admin' ? 'bg-purple-500/20 text-purple-400' : 'bg-blue-500/20 text-blue-400'} group-hover:scale-110 transition-transform`}>
                      <Icon size={20} />
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-slate-200">{account.label}</p>
                      <p className="text-xs text-slate-500">{account.email}</p>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Right Pane - Auth Forms */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative bg-slate-950">
        <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-900/10 via-slate-950 to-slate-950 pointer-events-none"></div>
        
        <div className="w-full max-w-md relative z-10 animate-slide-up">
          <div className="mb-10 text-center lg:text-left">
            <h2 className="text-3xl font-bold mb-2">Welcome Back</h2>
            <p className="text-slate-400">Please enter your details to continue.</p>
          </div>

          <div className="flex gap-1 mb-8 overflow-hidden rounded-xl bg-slate-900/50 p-1 border border-slate-800/80 backdrop-blur-md">
            {['login', 'register', 'reset'].map((m) => (
              <button
                key={m}
                onClick={() => { setMode(m); resetError(); }}
                className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 capitalize ${mode === m ? 'bg-slate-800 text-white shadow-md border border-slate-700/50' : 'text-slate-500 hover:text-slate-300'}`}
              >
                {m === 'reset' ? 'Recover' : m}
              </button>
            ))}
          </div>

          {(error || success) && (
            <div className={`mb-6 rounded-xl border p-4 text-sm backdrop-blur-md animate-fade-in ${error ? 'bg-red-950/30 border-red-900/50 text-red-300' : 'bg-emerald-950/30 border-emerald-900/50 text-emerald-300'}`}>
              {error || success}
            </div>
          )}

          <div className="glass-card p-8 rounded-3xl border border-slate-800/80 bg-slate-900/40 shadow-2xl">
            {mode === 'login' && (
              <form onSubmit={handleLogin} className="space-y-5 animate-fade-in">
                <div>
                  <label className="block text-sm font-medium mb-2 text-slate-300">Email Address</label>
                  <div className="flex items-center gap-3 rounded-xl bg-slate-950/50 border border-slate-800 px-4 py-3.5 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500/50 transition-all">
                    <Users className="text-slate-500" size={18} />
                    <input type="email" required value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} placeholder="name@company.com" className="w-full bg-transparent outline-none placeholder-slate-600 text-slate-100" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-slate-300">Password</label>
                  <div className="flex items-center gap-3 rounded-xl bg-slate-950/50 border border-slate-800 px-4 py-3.5 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500/50 transition-all">
                    <Lock className="text-slate-500" size={18} />
                    <input type="password" required value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} placeholder="••••••••" className="w-full bg-transparent outline-none placeholder-slate-600 text-slate-100" />
                  </div>
                </div>
                <button type="submit" disabled={submitting} className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 px-5 py-4 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition-all hover:shadow-blue-500/40 disabled:opacity-50 mt-4">
                  {submitting ? 'Authenticating...' : 'Sign In'}
                </button>
              </form>
            )}

            {mode === 'register' && (
              <form onSubmit={handleRegister} className="space-y-5 animate-fade-in">
                <div>
                  <label className="block text-sm font-medium mb-2 text-slate-300">Full Name</label>
                  <div className="flex items-center gap-3 rounded-xl bg-slate-950/50 border border-slate-800 px-4 py-3.5 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500/50 transition-all">
                    <Sparkles className="text-slate-500" size={18} />
                    <input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Jane Doe" className="w-full bg-transparent outline-none placeholder-slate-600 text-slate-100" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-slate-300">Email Address</label>
                  <div className="flex items-center gap-3 rounded-xl bg-slate-950/50 border border-slate-800 px-4 py-3.5 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500/50 transition-all">
                    <Users className="text-slate-500" size={18} />
                    <input type="email" required value={registerEmail} onChange={(e) => setRegisterEmail(e.target.value)} placeholder="name@company.com" className="w-full bg-transparent outline-none placeholder-slate-600 text-slate-100" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-slate-300">Password</label>
                  <div className="flex items-center gap-3 rounded-xl bg-slate-950/50 border border-slate-800 px-4 py-3.5 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500/50 transition-all">
                    <Lock className="text-slate-500" size={18} />
                    <input type="password" required value={registerPassword} onChange={(e) => setRegisterPassword(e.target.value)} placeholder="Create a password" className="w-full bg-transparent outline-none placeholder-slate-600 text-slate-100" />
                  </div>
                </div>
                <button type="submit" disabled={submitting} className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 px-5 py-4 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition-all hover:shadow-blue-500/40 disabled:opacity-50 mt-4">
                  {submitting ? 'Creating...' : 'Create Account'}
                </button>
              </form>
            )}

            {mode === 'reset' && (
              <form onSubmit={handleReset} className="space-y-5 animate-fade-in">
                <div>
                  <label className="block text-sm font-medium mb-2 text-slate-300">Email Address</label>
                  <div className="flex items-center gap-3 rounded-xl bg-slate-950/50 border border-slate-800 px-4 py-3.5 focus-within:border-purple-500 focus-within:ring-1 focus-within:ring-purple-500/50 transition-all">
                    <Users className="text-slate-500" size={18} />
                    <input type="email" required value={resetEmail} onChange={(e) => setResetEmail(e.target.value)} placeholder="name@company.com" className="w-full bg-transparent outline-none placeholder-slate-600 text-slate-100" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-slate-300">New Password</label>
                  <div className="flex items-center gap-3 rounded-xl bg-slate-950/50 border border-slate-800 px-4 py-3.5 focus-within:border-purple-500 focus-within:ring-1 focus-within:ring-purple-500/50 transition-all">
                    <Lock className="text-slate-500" size={18} />
                    <input type="password" required value={resetPassword} onChange={(e) => setResetPassword(e.target.value)} placeholder="••••••••" className="w-full bg-transparent outline-none placeholder-slate-600 text-slate-100" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-slate-300">Confirm Password</label>
                  <div className="flex items-center gap-3 rounded-xl bg-slate-950/50 border border-slate-800 px-4 py-3.5 focus-within:border-purple-500 focus-within:ring-1 focus-within:ring-purple-500/50 transition-all">
                    <Lock className="text-slate-500" size={18} />
                    <input type="password" required value={resetConfirm} onChange={(e) => setResetConfirm(e.target.value)} placeholder="••••••••" className="w-full bg-transparent outline-none placeholder-slate-600 text-slate-100" />
                  </div>
                </div>
                <button type="submit" disabled={submitting} className="w-full rounded-xl bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 px-5 py-4 text-sm font-semibold text-white shadow-lg shadow-purple-500/25 transition-all hover:shadow-purple-500/40 disabled:opacity-50 mt-4">
                  {submitting ? 'Resetting...' : 'Reset Password'}
                </button>
              </form>
            )}
          </div>
          
          <p className="text-center text-xs text-slate-600 mt-8">
            © 2026 TaskSync Inc. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}

// Temporary Badge component inline to avoid import issues if it changed
function Badge({ children, color, className }) {
  return <span className={className}>{children}</span>;
}

