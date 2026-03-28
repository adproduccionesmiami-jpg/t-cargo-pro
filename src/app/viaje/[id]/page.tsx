'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useRouter, useParams } from 'next/navigation';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

export default function DetalleViaje() {
  const router = useRouter();
  const params = useParams();
  const [trip, setTrip] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTripDetail() {
      if (!params.id) return;
      
      const { data, error } = await supabase
        .from('trips')
        .select('*, vehicles(plate)')
        .eq('id', params.id)
        .single();
      
      if (!error && data) {
        setTrip(data);
      }
      setLoading(false);
    }
    loadTripDetail();
  }, [params.id]);

  if (loading) return (
    <div className="min-h-screen bg-[#0B1120] flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FF8C00]"></div>
    </div>
  );

  if (!trip) return (
    <div className="min-h-screen bg-[#0B1120] flex flex-col items-center justify-center">
      <h1 className="text-white text-2xl font-bold mb-4">Viaje no encontrado</h1>
      <button onClick={() => router.push('/')} className="text-[#FF8C00] hover:underline">Volver al Dashboard</button>
    </div>
  );

  const formatCUP = (val: number) => 
    new Intl.NumberFormat('es-CU', { style: 'currency', currency: 'CUP', minimumFractionDigits: 1, maximumFractionDigits: 1 }).format(val);

  const handleUpdateDiesel = async (field: string, value: string) => {
    const numValue = parseFloat(value);
    if (isNaN(numValue)) return;

    setLoading(true);
    const { error } = await supabase
      .from('trips')
      .update({ [field]: numValue })
      .eq('id', params.id);

    if (!error) {
      // Recargar datos para ver el cálculo del trigger
      const { data } = await supabase
        .from('trips')
        .select('*, vehicles(plate)')
        .eq('id', params.id)
        .single();
      if (data) setTrip(data);
    }
    setLoading(false);
  };

  return (
    <div className="bg-[#0B1120] text-gray-200 min-h-screen p-8 lg:p-12 font-sans overflow-x-hidden selection:bg-green-500/30">
      <div className="max-w-[1600px] mx-auto">
        
        {/* Superior: Navegación y Header Crítico */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-12 gap-6">
          <div className="flex items-center gap-6">
            <button 
              onClick={() => router.push('/')} 
              className="group flex items-center bg-slate-800/40 border border-slate-700 hover:border-slate-500 p-3 rounded-xl transition-all shadow-lg"
              title="Volver"
            >
              <svg className="w-6 h-6 text-gray-400 group-hover:text-white group-hover:-translate-x-1 transition-all" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
            </button>
            
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-3xl lg:text-4xl font-semibold text-white tracking-tight">Detalle de viaje</h1>
              </div>
              <div className="flex items-center gap-2">
                <p className="text-[#FF8C00] font-black tracking-[0.2em] text-xs uppercase">{trip.vehicles?.plate}</p>
                <span className="w-1 h-1 bg-slate-700 rounded-full"></span>
                <p className="text-gray-500 font-bold tracking-widest text-[10px] uppercase">{trip.trip_date}</p>
              </div>
            </div>
          </div>

          <div className="flex gap-4 lg:gap-8 bg-slate-800/20 p-6 rounded-2xl border border-slate-700/50 backdrop-blur-xl">
            <div className="text-right border-r border-slate-700/50 pr-8">
              <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-1">Ingreso Bruto</p>
              <p className="text-3xl font-black text-white">{formatCUP(trip.amount_bruto_cup)}</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-green-500 font-black uppercase tracking-widest mb-1">Utilidad Neta</p>
              <p className="text-3xl font-black text-green-500">{formatCUP(trip.net_profit_cup)}</p>
            </div>
          </div>
        </div>

        {/* Desktop Grid: 4 Columnas Industriales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Bloque 1: Ruta y Odómetro */}
          <div className="bg-[#1e293b]/40 border border-slate-700/50 p-8 rounded-[24px] shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full -mr-12 -mt-12 blur-2xl group-hover:bg-blue-500/10 transition-colors"></div>
            <h3 className="text-xs font-black text-gray-500 uppercase tracking-[0.2em] mb-8 border-b border-slate-700/50 pb-4">Logística de Ruta</h3>
            
            <div className="space-y-8">
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1">
                  <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Origen</p>
                  <p className="text-lg font-black text-white leading-tight break-words">{trip.origin}</p>
                </div>
                <div className="w-px h-8 bg-slate-700/50 hidden lg:block self-center"></div>
                <div className="text-right flex-1">
                  <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Destino</p>
                  <p className="text-lg font-black text-white leading-tight break-words">{trip.destination}</p>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-700/30">
                <div className="flex justify-between mb-4">
                  <span className="text-xs text-gray-400 font-bold uppercase tracking-wide">Millas Inicio</span>
                  <span className="text-xs text-white font-black">{Number(trip.mileage_start).toFixed(1)}</span>
                </div>
                <div className="flex justify-between mb-4">
                  <span className="text-xs text-gray-400 font-bold uppercase tracking-wide">Millas Fin</span>
                  <span className="text-xs text-white font-black">{Number(trip.mileage_end).toFixed(1)}</span>
                </div>
                <div className="flex justify-between pt-4 border-t border-slate-700/30">
                  <span className="text-xs text-gray-300 font-bold">KMs Totales</span>
                  <span className="text-lg font-black text-[#FF8C00] tracking-tighter">
                    {Number(trip.km_total).toLocaleString('es-CU', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Bloque 2: Combustible (OPERATIVO) */}
          <div className="bg-[#1e293b]/40 border border-slate-700/50 p-8 rounded-[24px] shadow-2xl relative overflow-hidden group">
            <h3 className="text-xs font-black text-[#FF8C00] uppercase tracking-[0.2em] mb-8 border-b border-[#FF8C00]/20 pb-4">Módulo Diesel</h3>
            
            <div className="space-y-6">
              <div className="p-4 bg-slate-800/20 rounded-xl border border-slate-700/30">
                <p className="text-[9px] text-gray-600 font-normal uppercase tracking-[0.25em] mb-2">Consumo</p>
                <p className="text-3xl font-medium text-white tracking-tight">
                  {Number(trip.fuel_liters).toFixed(1)} <span className="text-xs text-gray-600 font-light">LTS</span>
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-[9px] text-gray-600 font-normal uppercase tracking-[0.1em] mb-1.5 ml-1">Precio Diésel (USD)</label>
                  <input 
                    type="number" 
                    step="0.01"
                    defaultValue={trip.fuel_price_usd}
                    onBlur={(e) => handleUpdateDiesel('fuel_price_usd', e.target.value)}
                    className="w-full bg-[#0f172a] border border-slate-700 rounded-xl px-4 py-2.5 text-sm font-medium text-white focus:outline-none focus:border-[#FF8C00] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[9px] text-gray-600 font-normal uppercase tracking-[0.1em] mb-1.5 ml-1">Tasa de Cambio (CUP)</label>
                  <input 
                    type="number" 
                    step="1"
                    defaultValue={trip.exchange_rate}
                    onBlur={(e) => handleUpdateDiesel('exchange_rate', e.target.value)}
                    className="w-full bg-[#0f172a] border border-slate-700 rounded-xl px-4 py-2.5 text-sm font-black text-white focus:outline-none focus:border-[#FF8C00] transition-colors"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-700/30">
                <p className="text-[10px] text-gray-500 font-bold uppercase mb-1">Costo Combustible</p>
                <p className="text-xl font-bold text-[#FF8C00] tracking-tight">-{formatCUP(trip.fuel_cost_cup)}</p>
              </div>
            </div>
          </div>

          {/* Bloque 3: Liquidación General */}
          <div className="bg-[#1e293b]/40 border border-slate-700/50 p-8 rounded-[24px] shadow-2xl relative overflow-hidden group">
            <h3 className="text-xs font-black text-white uppercase tracking-[0.2em] mb-8 border-b border-slate-700/50 pb-4">Liquidación Final</h3>
            
            <div className="space-y-6">
              <div className="flex justify-between items-center group/item p-2 hover:bg-slate-800/30 rounded-lg transition-all">
                <span className="text-[11px] text-gray-400 font-semibold uppercase">Monto Bruto</span>
                <span className="text-sm font-black text-white">{formatCUP(trip.amount_bruto_cup)}</span>
              </div>
              
              <div className="flex justify-between items-center group/item p-2 hover:bg-slate-800/20 rounded-lg transition-all">
                <span className="text-[10px] text-gray-600 font-normal uppercase tracking-[0.2em]">Broker (5%)</span>
                <span className="text-sm font-medium text-[#FF8C00]/60">-{formatCUP(trip.broker_fee_cup)}</span>
              </div>

              <div className="flex justify-between items-center group/item p-2 hover:bg-slate-800/20 rounded-lg transition-all">
                <span className="text-[10px] text-gray-600 font-normal uppercase tracking-[0.2em]">Chofer (5%)</span>
                <span className="text-sm font-medium text-[#FF8C00]/60">-{formatCUP(trip.driver_fee_cup)}</span>
              </div>

              <div className="mt-8 pt-8 border-t border-slate-700/30">
                <div className="bg-blue-600/5 p-4 rounded-xl border border-blue-500/10">
                  <p className="text-[9px] text-blue-500/60 font-medium uppercase tracking-[0.25em] mb-1 text-center">Neto Restante</p>
                  <p className="text-2xl font-medium text-blue-400/90 text-center tracking-tight">
                    {formatCUP(trip.net_profit_cup)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Bloque 4: Reparto Socios (ESTILO ÉXITO) */}
          <div className="bg-gradient-to-br from-green-500/10 to-[#1e293b]/40 border border-green-500/30 p-8 rounded-[24px] shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4">
              <div className="animate-pulse w-2 h-2 bg-green-500 rounded-full"></div>
            </div>
            <h3 className="text-xs font-black text-green-500 uppercase tracking-[0.2em] mb-8 border-b border-green-500/20 pb-4">Reparto de Utilidades</h3>
            
            <div className="space-y-8">
              <div className="p-6 bg-[#0f172a]/40 border border-slate-700/30 rounded-2xl shadow-xl transition-all">
                <p className="text-[9px] text-gray-600 font-normal uppercase tracking-[0.3em] mb-2">Socio A</p>
                <p className="text-2xl lg:text-3xl font-medium text-white tracking-tight">
                  {formatCUP(trip.socio_a_cup)}
                </p>
                <div className="mt-4 h-[2px] w-full bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full w-1/2 bg-blue-500/40"></div>
                </div>
              </div>

              <div className="p-6 bg-[#0f172a]/40 border border-slate-700/30 rounded-2xl shadow-xl transition-all">
                <p className="text-[9px] text-gray-600 font-normal uppercase tracking-[0.3em] mb-2">Socio B</p>
                <p className="text-2xl lg:text-3xl font-medium text-white tracking-tight">
                  {formatCUP(trip.socio_b_cup)}
                </p>
                <div className="mt-4 h-[2px] w-full bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full w-1/2 bg-blue-500/40"></div>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Bloque 5 (Extra): Notas e Incidencias */}
        <div className="mt-8 bg-[#1e293b]/10 border border-slate-700/30 p-8 rounded-[24px] shadow-2xl relative overflow-hidden group">
          <h3 className="text-[9px] text-gray-600 font-normal uppercase tracking-[0.3em] mb-6 border-b border-slate-700/30 pb-4">Notas e Incidencias Operativas</h3>
          <textarea 
            defaultValue={trip.notes}
            onBlur={(e) => handleUpdateDiesel('notes', e.target.value)}
            placeholder="Escribe observaciones, incidencias o detalles del viaje aquí..."
            className="w-full bg-transparent border border-slate-700/20 rounded-2xl p-6 text-sm text-gray-400 focus:outline-none focus:border-[#FF8C00]/50 transition-colors min-h-[120px] resize-y font-normal leading-relaxed"
          ></textarea>
        </div>

      </div>
    </div>
  );
}
