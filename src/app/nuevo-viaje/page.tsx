'use client';

import { useRouter } from 'next/navigation';
import ChatRegistration from '@/features/dashboard/components/ChatRegistration';

export default function NuevoViaje() {
  const router = useRouter();

  return (
    <div className="bg-[#0B1120] text-gray-200 min-h-screen p-4 md:p-10 font-sans selection:bg-[#FF8C00] selection:text-white pb-10 flex flex-col">
      <div className="max-w-xl mx-auto w-full flex-1 flex flex-col">
        
        {/* Header Action */}
        <button 
          onClick={() => router.push('/')} 
          className="mb-6 flex items-center text-gray-400 hover:text-white transition group font-semibold text-xs bg-slate-800/50 px-4 py-2 rounded-full border border-slate-700 w-max"
        >
          <svg className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <polyline points="15 18 9 12 15 6"/>
          </svg> 
          Volver al Panel
        </button>

        <header className="mb-8 pl-4">
          <h1 className="text-3xl font-light text-white tracking-tight leading-tight">
            registro <span className="text-[#FF8C00]">de viaje</span>
          </h1>
        </header>

        {/* Chat Container */}
        <div className="flex-1 flex flex-col h-[75vh]">
          <ChatRegistration />
        </div>
        
      </div>
    </div>
  );
}
