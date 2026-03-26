import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, Zap } from 'lucide-react';

interface LoginProps {
  onLogin: () => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [email, setEmail] = useState('toni@vibecoding.lab');
  const [password, setPassword] = useState('password');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      onLogin();
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-forest flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-cream rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-terracotta/10 rounded-full -mr-16 -mt-16 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-forest/5 rounded-full -ml-16 -mb-16 blur-3xl" />

        <div className="relative z-10">
          <div className="flex justify-center mb-8">
            <div className="w-16 h-16 bg-forest rounded-2xl flex items-center justify-center shadow-lg">
              <Zap className="text-terracotta w-8 h-8" />
            </div>
          </div>

          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-forest tracking-tight">Toni's HQ</h1>
            <p className="text-forest/60 mt-2 font-medium">VIBECODING LAB ACCESS</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-forest/40 ml-1">Email Address</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field bg-white" 
                placeholder="name@company.com"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-forest/40 ml-1">Password</label>
              <div className="relative">
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field bg-white pr-12" 
                  placeholder="••••••••"
                  required
                />
                <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-forest/20" />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="btn-primary w-full py-4 text-lg shadow-lg shadow-terracotta/20 flex items-center justify-center space-x-2"
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <span>Initialize Command Centre</span>
              )}
            </button>
          </form>

          <p className="text-center text-xs text-forest/40 mt-8 font-mono">
            SECURE ENCRYPTED CONNECTION • V1.1.0
          </p>
        </div>
      </motion.div>
    </div>
  );
}
