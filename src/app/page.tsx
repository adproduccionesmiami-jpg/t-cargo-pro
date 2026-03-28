'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

export default function Tablero() {
  const [trips, setTrips] = useState<any[]>([]);
  const [filter, setFilter] = useState<'hoy' | 'mes' | 'historico'>('historico');
  const router = useRouter();

  useEffect(() => {
    fetchTrips(filter);

    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'trips' },
        () => fetchTrips(filter)
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [filter]);

  const fetchTrips = async (currentFilter: string) => {
    let query = supabase
      .from('trips')
      .select(`*`)
      .order('trip_date', { ascending: false })
      .order('created_at', { ascending: false });

    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const todayStr = `${yyyy}-${mm}-${dd}`;

    if (currentFilter === 'hoy') {
      query = query.eq('trip_date', todayStr);
    } else if (currentFilter === 'mes') {
      const firstDay = `${yyyy}-${mm}-01`;
      const lastDay = new Date(yyyy, today.getMonth() + 1, 0).toISOString().split('T')[0];
      query = query.gte('trip_date', firstDay).lte('trip_date', lastDay);
    }

    const { data, error } = await query;
    if (!error && data) setTrips(data);
  };

  const handleUpdate = async (id: string, field: string, value: string | number) => {
    const numericValue = Number(value);
    const { error } = await supabase.from('trips').update({ [field]: numericValue }).eq('id', id);
    if (error) console.error("Error al actualizar: ", error);
  };

  const totalBruto = trips.reduce((acc, trip) => acc + (Number(trip.amount_bruto_cup) || 0), 0);
  const totalNeto = trips.reduce((acc, trip) => acc + (Number(trip.net_profit_cup) || 0), 0);
  const totalSocioA = trips.reduce((acc, trip) => acc + (Number(trip.socio_a_cup) || 0), 0);
  const totalSocioB = trips.reduce((acc, trip) => acc + (Number(trip.socio_b_cup) || 0), 0);

  const formatCUP = (num: number) => (num || 0).toLocaleString('es-ES');

  return (
    <div className="flex bg-[#0B1120] text-gray-200 min-h-screen font-sans selection:bg-[#FF8C00] selection:text-white">
      {/* Navegación Lateral */}
      <aside className="w-72 bg-[#060a13] border-r border-slate-800/80 flex flex-col justify-between p-8 shrink-0 sticky top-0 h-screen">
        <div>
          <h1 className="text-3xl font-extrabold mb-10 text-white tracking-tight">
            T-Cargo<span className="text-[#FF8C00]">Pro</span>
          </h1>
          <nav className="space-y-4">
            <button onClick={() => router.push('/')} className="w-full flex items-center px-4 py-3 bg-gradient-to-r from-[#FF8200] to-[#f97316] text-white font-medium rounded-2xl shadow-lg shadow-orange-500/10 transition-all opacity-90">
              <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="9" rx="1"/><rect x="14" y="3" width="7" height="5" rx="1"/><rect x="14" y="12" width="7" height="9" rx="1"/><rect x="3" y="16" width="7" height="5" rx="1"/></svg> Visión Ejecutiva
            </button>
            <button onClick={() => router.push('/buscador')} className="w-full flex items-center px-4 py-3 text-gray-500 font-normal rounded-2xl hover:text-white hover:bg-slate-800 transition-colors uppercase tracking-[0.15em] text-[10px]">
              <svg className="w-4 h-4 mr-3 opacity-50" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg> Buscador
            </button>
            <button className="w-full flex items-center px-4 py-3 text-gray-500 font-normal rounded-2xl hover:text-white hover:bg-slate-800 transition-colors uppercase tracking-[0.15em] text-[10px]">
              <svg className="w-4 h-4 mr-3 opacity-50" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M5 18H3c-.6 0-1-.4-1-1V7c0-.6.4-1 1-1h10c.6 0 1 .4 1 1v11"/><path d="M14 9h4l4 4v5h-3"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/></svg> Historial
            </button>
          </nav>
        </div>
        
        <button 
          onClick={async () => { await supabase.auth.signOut(); router.push('/login'); }}
          className="w-full flex items-center justify-center bg-red-600/5 border border-red-600/10 hover:bg-red-600/10 text-red-500/70 font-normal py-3 px-4 rounded-2xl transition tracking-widest text-[9px] uppercase mt-auto"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
          Cerrar Sesión
        </button>
      </aside>

      {/* Contenedor Principal */}
      <main className="flex-1 p-10 overflow-y-auto w-full">
        <header className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl font-black text-white tracking-tighter">Visión Ejecutiva</h1>
            <p className="text-gray-500 mt-2 font-normal tracking-wide text-sm">T-Cargo | Sociedad 1 • Gestión Auditada 2026</p>
          </div>
          <button 
            onClick={() => router.push('/nuevo-viaje')}
            className="bg-gradient-to-r from-[#FF8C00] to-[#ea580c] hover:from-[#e67e00] hover:to-[#c2410c] text-white px-8 py-3 rounded-xl font-medium text-sm uppercase tracking-[0.15em] shadow-lg shadow-orange-500/10 transition transform hover:-translate-y-1"
          >
            Nuevo Viaje
          </button>
        </header>

        {/* Indicadores Financieros */}
        <div className="grid grid-cols-4 gap-6 mb-12">
          <div className="bg-[#1e293b]/40 backdrop-blur-xl p-8 rounded-[24px] border border-slate-700/30 shadow-xl relative overflow-hidden flex flex-col items-center">
            <p className="text-[10px] font-normal text-gray-500 uppercase tracking-[0.2em] mb-3">Ingreso Bruto</p>
            <p className="text-3xl font-medium text-white tracking-tight flex items-baseline">
              <span className="text-lg font-light text-slate-500/40 mr-2">$</span>
              {formatCUP(totalBruto)}
            </p>
          </div>
          <div className="bg-[#1e293b]/40 backdrop-blur-xl p-8 rounded-[24px] border border-slate-700/30 border-t-2 border-t-green-500/30 shadow-xl relative overflow-hidden flex flex-col items-center">
            <p className="text-[10px] font-normal text-gray-500 uppercase tracking-[0.2em] mb-3">Utilidad Neta</p>
            <p className="text-3xl font-medium text-green-500/90 tracking-tight flex items-baseline">
              <span className="text-lg font-light text-green-900/40 mr-2">$</span>
              {formatCUP(totalNeto)}
            </p>
          </div>
          <div className="bg-[#1e293b]/40 backdrop-blur-xl p-8 rounded-[24px] border border-slate-700/30 shadow-xl relative overflow-hidden flex flex-col items-center">
            <p className="text-[10px] font-normal text-gray-500 uppercase tracking-[0.2em] mb-3">Socio A (50%)</p>
            <p className="text-3xl font-medium text-white tracking-tight flex items-baseline">
              <span className="text-lg font-light text-slate-500/40 mr-2">$</span>
              {formatCUP(totalSocioA)}
            </p>
          </div>
          <div className="bg-[#1e293b]/40 backdrop-blur-xl p-8 rounded-[24px] border border-slate-700/30 shadow-xl relative overflow-hidden flex flex-col items-center">
            <p className="text-[10px] font-normal text-gray-500 uppercase tracking-[0.2em] mb-3">Socio B (50%)</p>
            <p className="text-3xl font-medium text-white tracking-tight flex items-baseline">
              <span className="text-lg font-light text-slate-500/40 mr-2">$</span>
              {formatCUP(totalSocioB)}
            </p>
          </div>
        </div>

        {/* Tabla Operativa */}
        <div className="bg-[#1e293b]/20 backdrop-blur-xl rounded-[24px] border border-slate-700/30 shadow-2xl overflow-hidden p-8">
          <div className="pb-8 flex justify-between items-center border-b border-slate-700/30 mb-6">
            <h3 className="text-xl font-medium text-white uppercase tracking-tight">Historial de Viajes</h3>
            <div className="flex bg-[#0B1120]/40 p-1.5 rounded-xl border border-slate-700/30">
              <button onClick={() => setFilter('hoy')} className={`px-5 py-2 text-xs font-medium rounded-lg transition-all ${filter === 'hoy' ? 'bg-[#FF8C00] text-white shadow-md' : 'text-gray-500 hover:text-white'}`}>Hoy</button>
              <button onClick={() => setFilter('mes')} className={`px-5 py-2 text-xs font-medium rounded-lg transition-all ${filter === 'mes' ? 'bg-[#FF8C00] text-white shadow-md' : 'text-gray-500 hover:text-white'}`}>Mes</button>
              <button onClick={() => setFilter('historico')} className={`px-5 py-2 text-xs font-medium rounded-lg transition-all ${filter === 'historico' ? 'bg-[#FF8C00] text-white shadow-md' : 'text-gray-500 hover:text-white'}`}>Historico</button>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left whitespace-nowrap">
              <thead className="text-gray-600 text-[10px] uppercase tracking-[0.25em] font-normal">
                <tr>
                  <th className="px-6 py-4 border-b border-slate-700/30">Fecha</th>
                  <th className="px-6 py-4 border-b border-slate-700/30 text-right font-normal">Recorrido (Miles)</th>
                  <th className="px-6 py-4 border-b border-slate-700/30 text-right font-normal">Monto Bruto</th>
                  <th className="px-6 py-4 border-b border-slate-700/30 text-right font-normal">Tasa (CUP)</th>
                  <th className="px-6 py-4 border-b border-slate-700/30 text-right font-normal text-blue-400 opacity-80">Utilidad Neta</th>
                  <th className="px-6 py-4 border-b border-slate-700/30 text-center font-normal">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/40">
                {trips.map((trip) => (
                  <tr 
                    key={trip.id} 
                    onClick={() => router.push(`/viaje/${trip.id}`)}
                    className="hover:bg-slate-700/20 cursor-pointer transition-all group"
                  >
                    <td className="px-6 py-5">
                      <div className="text-[#FF8C00] font-medium text-lg tracking-tight">{trip.trip_date}</div>
                      <div className="text-[10px] text-gray-500 mt-1 font-normal uppercase tracking-widest opacity-80">{trip.origin} → {trip.destination}</div>
                    </td>
                    <td className="px-6 py-5 text-right font-medium text-gray-400">
                      <div className="text-white text-sm tracking-tight">{trip.mileage_start} → {trip.mileage_end}</div>
                      <div className="text-[9px] text-gray-600 mt-1 uppercase font-light opacity-60">({trip.km_total} KM)</div>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="text-gray-200 font-medium text-lg tracking-tight">
                        {formatCUP(trip.amount_bruto_cup)}
                      </div>
                    </td>
                    <td className="px-6 py-5 text-right font-medium text-gray-400 tracking-tight">
                      {trip.exchange_rate}
                    </td>
                    <td className="px-6 py-5 text-right font-medium text-blue-400/90 text-lg tracking-tight">
                      {formatCUP(trip.net_profit_cup)}
                    </td>
                    <td className="px-6 py-5 text-center">
                      <span className="px-4 py-1.5 text-[9px] font-normal rounded-full border border-green-500/10 bg-green-500/5 text-green-400/80 uppercase tracking-[0.2em]">
                        {trip.status || 'Completado'}
                      </span>
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
