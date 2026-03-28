'use client';

import { useState, useEffect, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

interface Message {
  id: string;
  type: 'bot' | 'user';
  text: string;
  field?: string;
  component?: React.ReactNode;
}

export default function ChatRegistration() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [formData, setFormData] = useState<any>({
    plate_id: '',
    trip_date: new Date().toISOString().split('T')[0],
    origin: '',
    destination: '',
    mileage_start: '',
    mileage_end: '',
    fuel_price_usd: '',
    exchange_rate: '',
    amount_bruto_cup: '',
    notes: '',
    status: 'Completado'
  });
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const steps = [
    {
      field: 'plate_id',
      question: '¡Hola! Vamos a registrar un nuevo viaje. Primero, selecciona la unidad (Chapa):',
      type: 'select'
    },
    {
      field: 'trip_date',
      question: '¿Cuál es la fecha del viaje?',
      type: 'date'
    },
    {
      field: 'origin',
      question: '¿Desde dónde salió el viaje? (Origen)',
      type: 'text'
    },
    {
      field: 'destination',
      question: '¿Hacia dónde se dirige? (Destino)',
      type: 'text'
    },
    {
      field: 'mileage_start',
      question: 'Indícame las Millas Iniciales:',
      type: 'number'
    },
    {
      field: 'mileage_end',
      question: 'Ahora, las Millas Finales:',
      type: 'number'
    },
    {
      field: 'fuel_price_usd',
      question: '¿Cuál es el precio del Diesel en USD (por litro)?',
      type: 'number'
    },
    {
      field: 'exchange_rate',
      question: '¿Cuál es la Tasa de Cambio actual (CUP)?',
      type: 'number'
    },
    {
      field: 'amount_bruto_cup',
      question: 'Finalmente, ingresa el Monto Bruto Facturado en CUP:',
      type: 'number'
    },
    {
      field: 'notes',
      question: '¿Deseas agregar alguna nota o incidencia sobre este viaje?',
      type: 'text'
    }
  ];

  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    async function loadVehicles() {
      const { data } = await supabase.from('vehicles').select('*');
      if (data) setVehicles(data);
    }
    loadVehicles();
    
    // Iniciar conversación
    addBotMessage(steps[0].question);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const addBotMessage = (text: string) => {
    setIsTyping(true);
    setTimeout(() => {
      const newMessage: Message = {
        id: Math.random().toString(36).substring(7),
        type: 'bot',
        text
      };
      setMessages(prev => [...prev, newMessage]);
      setIsTyping(false);
    }, 800);
  };

  const addUserMessage = (text: string) => {
    const newMessage: Message = {
      id: Math.random().toString(36).substring(7),
      type: 'user',
      text
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const handleNextStep = (value: string) => {
    const step = steps[currentStep];
    const newFormData = { ...formData, [step.field]: value };
    setFormData(newFormData);

    // Mostrar respuesta del usuario
    let displayValue = value;
    if (step.field === 'plate_id') {
      const vehicle = vehicles.find(v => v.id === value);
      displayValue = vehicle ? vehicle.plate : value;
    }
    
    // Si es una nota y está vacío o es un placeholder
    const finalDisplayValue = (step.field === 'notes' && (!value || value.toLowerCase() === 'no')) ? 'Sin notas' : displayValue;
    addUserMessage(finalDisplayValue);

    const nextStepIdx = currentStep + 1;
    if (nextStepIdx < steps.length) {
      setCurrentStep(nextStepIdx);
      addBotMessage(steps[nextStepIdx].question);
    } else {
      setIsFinished(true);
      showSummary(newFormData);
    }
  };

  const showSummary = (data: any) => {
    addBotMessage('Perfecto. Aquí tienes un resumen del viaje para confirmar:');
    
    const vehicle = vehicles.find(v => v.id === data.plate_id);
    
    setTimeout(() => {
      const summaryMessage: Message = {
        id: 'summary',
        type: 'bot',
        text: 'resumen del viaje',
        component: (
          <div className="bg-[#1e293b] p-4 rounded-2xl border border-slate-700 mt-2 space-y-2 text-sm w-full max-w-[280px]">
            <div className="flex justify-between border-b border-slate-700 pb-1">
              <span className="text-gray-400">Chapa:</span>
              <span className="text-[#FF8C00]">{vehicle?.plate}</span>
            </div>
            <div className="flex justify-between border-b border-slate-700 pb-1">
              <span className="text-gray-400">Fecha:</span>
              <span className="text-[#FF8C00]">{data.trip_date}</span>
            </div>
            <div className="flex justify-between border-b border-slate-700 pb-1">
              <span className="text-gray-400">Ruta:</span>
              <span className="text-[#FF8C00] text-right">{data.origin} → {data.destination}</span>
            </div>
            <div className="flex justify-between border-b border-slate-700 pb-1">
              <span className="text-gray-400">Millas:</span>
              <span className="text-[#FF8C00]">{data.mileage_start} - {data.mileage_end}</span>
            </div>
            <div className="flex justify-between border-b border-slate-700 pb-1">
              <span className="text-gray-400">Diesel:</span>
              <span className="text-[#FF8C00]">${data.fuel_price_usd}</span>
            </div>
            <div className="flex justify-between border-b border-slate-700 pb-1">
              <span className="text-gray-400">Tasa:</span>
              <span className="text-[#FF8C00]">{data.exchange_rate} CUP</span>
            </div>
            <div className="flex justify-between border-b border-slate-700 pb-1">
              <span className="text-gray-400 font-light">Bruto:</span>
              <span className="text-[#FF8C00] font-bold">{data.amount_bruto_cup} CUP</span>
            </div>
            <div className="flex flex-col pt-1">
              <span className="text-gray-400 text-[10px] uppercase font-light">Notas:</span>
              <span className="text-[#FF8C00] text-xs mt-0.5">{data.notes || 'Ninguna'}</span>
            </div>
            
            <button 
              onClick={() => submitTrip(data)}
              className="w-full mt-4 bg-[#FF8C00] text-white font-bold py-3 rounded-xl shadow-lg hover:bg-orange-600 transition-all active:scale-95"
            >
              Confirmar y Guardar ✅
            </button>
            <button 
              onClick={() => {
                setMessages([]);
                setCurrentStep(0);
                setIsFinished(false);
                addBotMessage(steps[0].question);
              }}
              className="w-full mt-2 text-gray-400 text-xs hover:text-white transition-all underline underline-offset-4"
            >
              Corregir Datos
            </button>
          </div>
        )
      };
      setMessages(prev => [...prev, summaryMessage]);
    }, 1500);
  };

  const submitTrip = async (data: any) => {
    const payload = {
      ...data,
      mileage_start: Number(data.mileage_start),
      mileage_end: Number(data.mileage_end),
      fuel_price_usd: Number(data.fuel_price_usd),
      exchange_rate: Number(data.exchange_rate),
      amount_bruto_cup: Number(data.amount_bruto_cup),
    };

    const { error } = await supabase.from('trips').insert([payload]);
    
    if (!error) {
      addBotMessage('¡Viaje registrado con éxito! ✅');
      setTimeout(() => {
        router.push('/');
      }, 2000);
    } else {
      addBotMessage('Error al guardar en la BD: ' + error.message);
    }
  };

  const renderInput = () => {
    if (isFinished) return null;

    const step = steps[currentStep];

    if (step.field === 'plate_id') {
      return (
        <div className="flex flex-wrap gap-2 p-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
          {vehicles.map(v => (
            <button
              key={v.id}
              onClick={() => handleNextStep(v.id)}
              className="bg-[#1e293b] border border-slate-700 text-white px-4 py-2 rounded-full hover:border-[#FF8C00] transition-colors"
            >
              {v.plate}
            </button>
          ))}
        </div>
      );
    }

    if (step.type === 'date') {
      return (
        <div className="p-4 flex gap-2 animate-in fade-in slide-in-from-bottom-2 duration-500">
          <input
            type="date"
            value={inputValue || formData.trip_date}
            onChange={(e) => setInputValue(e.target.value)}
            className="flex-1 bg-[#1e293b] border border-slate-700 p-3 rounded-xl text-white outline-none focus:border-[#FF8C00]"
          />
          <button
            onClick={() => { handleNextStep(inputValue || formData.trip_date); setInputValue(''); }}
            className="bg-[#FF8C00] p-3 rounded-xl text-white"
          >
            <SendIcon />
          </button>
        </div>
      );
    }

    return (
      <div className="p-4 flex gap-2 animate-in fade-in slide-in-from-bottom-2 duration-500">
        <input
          type={step.type}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && inputValue && (handleNextStep(inputValue), setInputValue(''))}
          placeholder="Escribe aquí..."
          className="flex-1 bg-[#1e293b] border border-slate-700 p-3 rounded-xl text-white outline-none focus:border-[#FF8C00]"
          autoFocus
        />
        <button
          onClick={() => { if (inputValue) { handleNextStep(inputValue); setInputValue(''); } }}
          className="bg-[#FF8C00] p-3 rounded-xl text-white disabled:opacity-50"
          disabled={!inputValue}
        >
          <SendIcon />
        </button>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full max-w-lg mx-auto bg-[#0B1120] shadow-2xl overflow-hidden rounded-3xl border border-slate-800 relative">
      {/* Header Estilo WhatsApp */}
      <div className="bg-[#1e293b] p-4 flex items-center gap-3 border-b border-slate-800 shadow-md">
        <div className="w-10 h-10 bg-[#FF8C00] rounded-full flex items-center justify-center font-black text-white">A</div>
        <div>
          <div className="text-white font-light leading-none">Asistente</div>
        </div>
      </div>

      {/* Area de Mensajes */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-[400px] scrollbar-hide">
        {messages.map((m) => (
          <div key={m.id} className={`flex ${m.type === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-1 duration-300`}>
            <div className={`max-w-[85%] rounded-[20px] p-3 text-sm font-light ${
              m.type === 'user' 
                ? 'bg-slate-800 text-gray-300 rounded-tr-none border border-slate-700' 
                : 'bg-[#1e293b] text-white border border-slate-700 rounded-tl-none tracking-tight'
            }`}>
              {m.text}
              {m.component}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-[#1e293b] p-3 rounded-[20px] rounded-tl-none border border-slate-700">
              <div className="flex gap-1">
                <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce"></div>
                <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce delay-75"></div>
                <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce delay-150"></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-[#0B1120] border-t border-slate-800 pb-2">
        {renderInput()}
      </div>
    </div>
  );
}

function SendIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
    </svg>
  );
}
