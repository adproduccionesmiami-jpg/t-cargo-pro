'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

export default function Buscador() {
  const [trips, setTrips] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    dateStart: '',
    dateEnd: '',
    month: '',
    today: false
  });
  const router = useRouter();

  const fetchFilteredTrips = async () => {
    setLoading(true);
    let query = supabase.from('trips').select('*').order('trip_date', { ascending: false });

    if (filters.today) {
      const today = new Date().toISOString().split('T')[0];
      query = query.eq('trip_date', today);
    } else if (filters.month) {
      const [year, month] = filters.month.split('-');
      const firstDay = `${year}-${month}-01`;
      const lastDay = new Date(parseInt(year), parseInt(month), 0).toISOString().split('T')[0];
      query = query.gte('trip_date', firstDay).lte('trip_date', lastDay);
    } else if (filters.dateStart && filters.dateEnd) {
      query = query.gte('trip_date', filters.dateStart).lte('trip_date', filters.dateEnd);
    }

    const { data, error } = await query;
    if (!error && data) setTrips(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchFilteredTrips();
  }, [filters]);

  const formatCUP = (num: number) => (num || 0).toLocaleString('es-ES', { minimumFractionDigits: 1, maximumFractionDigits: 1 });

  return (
    <div className="flex bg-[#0B1120] text-gray-200 min-h-screen font-sans">
      {/* Sidebar (Consistent) */}
      <aside className="w-72 bg-[#060a13] border-r border-slate-800/80 flex flex-col justify-between p-8 shrink-0 sticky top-0 h-screen">
        <div>
          <h1 className="text-3xl font-extrabold mb-10 text-white tracking-tight">
            T-Cargo<span className="text-[#FF8C00]">Pro</span>
          </h1>
          <nav className="space-y-4">
            <button onClick={() => router.push('/')} className="w-full flex items-center px-4 py-3 text-gray-400 font-semibold rounded-2xl hover:text-white hover:bg-slate-800 transition-colors">
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="9" rx="1"/><rect x="14" y="3" width="7" height="5" rx="1"/><rect x="14" y="12" width="7" height="9" rx="1"/><rect x="3" y="16" width="7" height="5" rx="1"/></svg> Visión Ejecutiva
            </button>
            <button className="w-full flex items-center px-4 py-3 bg-gradient-to-r from-[#FF8C00] to-[#f97316] text-white font-bold rounded-2xl shadow-lg shadow-orange-500/20">
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg> Buscador
            </button>
          </nav>
        </div>
        
        <button 
          onClick={async () => { await supabase.auth.signOut(); router.push('/login'); }}
          className="w-full flex items-center justify-center bg-red-600/10 border border-red-600/20 hover:bg-red-600/20 text-red-500 font-bold py-3 px-4 rounded-2xl transition shadow-lg shadow-red-500/5 mt-auto"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
          Cerrar Sesión
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10 overflow-y-auto">
        <header className="mb-12">
          <h1 className="text-4xl font-black text-white tracking-tighter">Buscador Operativo</h1>
          <p className="text-gray-400 mt-2 font-medium tracking-tight">Filtros Avanzados | T-Cargo Sociedad 1</p>
        </header>

        {/* Filtros */}
        <div className="bg-[#1e293b]/60 backdrop-blur-xl p-8 rounded-[24px] border border-slate-700/50 shadow-xl mb-12 flex flex-wrap gap-6 items-end">
          <div className="flex-1 min-w-[200px]">
            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3">Filtrar por Mes</p>
            <input 
              type="month" 
              className="w-full bg-[#0B1120] border border-slate-700/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#FF8C00] transition-colors"
              onChange={(e) => setFilters({ ...filters, month: e.target.value, today: false })}
            />
          </div>
          
          <div className="flex-1 min-w-[300px] flex gap-3">
            <div className="flex-1 text-center">
              <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3">Desde</p>
              <input 
                type="date" 
                className="w-full bg-[#0B1120] border border-slate-700/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#FF8C00] transition-colors"
                onChange={(e) => setFilters({ ...filters, dateStart: e.target.value, month: '', today: false })}
              />
            </div>
            <div className="flex-1 text-center">
              <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3">Hasta</p>
              <input 
                type="date" 
                className="w-full bg-[#0B1120] border border-slate-700/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#FF8C00] transition-colors"
                onChange={(e) => setFilters({ ...filters, dateEnd: e.target.value, month: '', today: false })}
              />
            </div>
          </div>

          <button 
            onClick={() => setFilters({ ...filters, today: true, month: '', dateStart: '', dateEnd: '' })}
            className={`px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${filters.today ? 'bg-[#FF8C00] text-white shadow-lg' : 'bg-slate-800 text-gray-400 hover:text-white'}`}
          >
            Hoy
          </button>
        </div>

        {/* Resultados */}
        <div className="bg-[#1e293b]/40 backdrop-blur-xl rounded-[24px] border border-slate-700/50 shadow-2xl overflow-hidden p-8">
          <div className="overflow-x-auto">
            <table className="w-full text-left whitespace-nowrap">
              <thead className="text-gray-500 text-[11px] uppercase tracking-[0.2em] font-black">
                <tr>
                  <th className="px-6 py-4 border-b border-slate-700/50">Fecha</th>
                  <th className="px-6 py-4 border-b border-slate-700/50">Ruta</th>
                  <th className="px-6 py-4 border-b border-slate-700/50 text-right">Monto Bruto</th>
                  <th className="px-6 py-4 border-b border-slate-700/50 text-right text-blue-400">Utilidad Neta</th>
                  <th className="px-6 py-4 border-b border-slate-700/50 text-center">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/40">
                {trips.length === 0 && !loading && (
                  <tr>
                    <td colSpan={5} className="px-6 py-16 text-center text-gray-500 font-medium">No se encontraron viajes con estos filtros.</td>
                  </tr>
                )}
                {trips.map((trip) => (
                  <tr 
                    key={trip.id} 
                    onClick={() => router.push(`/viaje/${trip.id}`)}
                    className="hover:bg-slate-700/40 cursor-pointer transition-all group"
                  >
                    <td className="px-6 py-5">
                      <div className="text-[#FF8C00] font-black text-lg tracking-tighter">{trip.trip_date}</div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{trip.origin} → {trip.destination}</div>
                    </td>
                    <td className="px-6 py-5 text-right font-black text-gray-300">
                      {formatCUP(trip.amount_bruto_cup)}
                    </td>
                    <td className="px-6 py-5 text-right font-black text-blue-400 text-lg">
                      {formatCUP(trip.net_profit_cup)}
                    </td>
                    <td className="px-6 py-5 text-center">
                      <span className="px-4 py-1.5 text-[10px] font-black rounded-full border border-green-500/20 bg-green-500/10 text-green-400 uppercase tracking-widest">Completado</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
