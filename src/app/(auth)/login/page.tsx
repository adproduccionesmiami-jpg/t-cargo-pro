'use client';

import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

export default function LoginPro() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError('Credenciales inválidas. Acceso denegado a la Sociedad.');
      setLoading(false);
    } else {
      router.push('/');
    }
  };

  return (
    <div className="flex bg-[#0B1120] text-gray-200 min-h-screen font-sans selection:bg-[#FF8C00] selection:text-white items-center justify-center relative overflow-hidden">
      
      {/* Fondo Premium 'La Rastra' con Overlay */}
      <div className="absolute inset-0 z-0">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40 scale-105"
          style={{ backgroundImage: "url('/assets/rastra-bg.png')" }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#0B1120] via-transparent to-[#0B1120]"></div>
        <div className="absolute inset-0 bg-[#0B1120]/60 backdrop-blur-[2px]"></div>
      </div>

      <div className="w-full max-w-md relative z-10 px-4">
        
        {/* Cabecera Corporativa */}
        <div className="text-center mb-8">
          <h1 className="text-6xl font-black text-white tracking-tighter mb-0">
            T-Cargo<span className="text-[#FF8C00]">Pro</span>
          </h1>
        </div>

        {/* Panel Login Glassmorphism */}
        <div className="bg-[#1e293b]/50 backdrop-blur-3xl p-10 rounded-[32px] border border-white/5 shadow-2xl relative overflow-hidden">
          
          <div className="absolute -top-3 right-8 px-3 py-1 bg-slate-900/80 border border-white/10 rounded-full flex items-center shadow-2xl">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse appearance-none"></div>
          </div>

          <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">Iniciar sesión</h2>
          <p className="text-gray-400 text-sm mb-10 font-normal">Ingresa tus credenciales para continuar.</p>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-3">
                Correo electrónico
              </label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
                className="w-full bg-[#0B1120]/80 border border-slate-700/50 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-[#FF8C00] transition-all font-light placeholder-slate-700 text-sm" 
                placeholder="socio@t-cargo.pro" 
              />
            </div>
            
            <div>
              <div className="flex justify-between items-end mb-3">
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">
                  Contraseña
                </label>
              </div>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
                className="w-full bg-[#0B1120]/80 border border-slate-700/50 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-[#FF8C00] transition-all font-light placeholder-slate-700 tracking-[0.3em] text-sm" 
                placeholder="••••••••" 
              />
            </div>

            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-xs font-medium flex items-center animate-in fade-in slide-in-from-top-2">
                <svg className="w-4 h-4 mr-3 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M12 8v4"/><path d="M12 16h.01"/></svg> {error}
              </div>
            )}

            <button 
              type="submit" 
              disabled={loading}
              className="w-full h-[64px] bg-gradient-to-r from-[#FF8C00] to-[#ea580c] hover:shadow-[0_0_30px_-5px_rgba(255,140,0,0.4)] text-white font-bold text-sm uppercase tracking-[0.2em] rounded-2xl transition shadow-xl mt-6 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed">
              {loading ? 'Autenticando...' : 'Iniciar Sesión'}
            </button>
          </form>
        </div>

        {/* Footer info */}
        <p className="text-center text-[9px] font-bold text-gray-600/60 mt-12 uppercase tracking-[0.3em]">
           Acceso limitado
        </p>

      </div>
    </div>
  );
}
