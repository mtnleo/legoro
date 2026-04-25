'use client';

import { useState } from 'react';
import { Phone, MapPin, ChevronRight, CheckCircle2, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';
import { SERVICES } from '@/lib/data';

type FormStatus = 'idle' | 'submitting' | 'success';

export default function Contacto() {
  const [formStatus, setFormStatus] = useState<FormStatus>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('submitting');
    setTimeout(() => {
      setFormStatus('success');
      (e.target as HTMLFormElement).reset();
    }, 1500);
  };

  return (
    <section id="contacto" className="py-24 md:py-32 bg-industrial-navy/30">
      <div className="container mx-auto px-6 md:px-8">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row bg-white rounded-[40px] overflow-hidden shadow-2xl">
          {/* Left panel */}
          <div className="lg:w-1/2 bg-industrial-accent p-10 md:p-20 flex flex-col justify-between text-center lg:text-left">
            <div>
              <h2 className="text-industrial-base text-4xl md:text-6xl font-black tracking-tighter mb-8 italic uppercase font-display leading-none">
                ¡Empecemos!
              </h2>
              <p className="text-industrial-base/80 text-lg md:text-xl font-bold leading-tight max-w-md mx-auto lg:mx-0">
                Envianos tu consulta y recibí un presupuesto técnico detallado en menos de 24hs.
              </p>
            </div>
            <div className="space-y-6 mt-12 md:mt-20 flex flex-col items-center lg:items-start">
              <div className="flex items-center gap-4 text-industrial-base font-black uppercase text-xs tracking-wider">
                <div className="w-12 h-12 rounded-full border-2 border-industrial-base/30 flex items-center justify-center">
                  <Phone className="w-5 h-5" />
                </div>
                +54 223 000 0000
              </div>
              <div className="flex items-center gap-4 text-industrial-base font-black uppercase text-xs tracking-wider">
                <div className="w-12 h-12 rounded-full border-2 border-industrial-base/30 flex items-center justify-center">
                  <MapPin className="w-5 h-5" />
                </div>
                Mar del Plata, Argentina
              </div>
            </div>
          </div>

          {/* Right panel — form */}
          <div className="lg:w-1/2 p-8 md:p-20 bg-white">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div>
                <label className="text-[10px] font-black uppercase opacity-40 mb-2 block tracking-widest text-industrial-base font-title">
                  Nombre Completo
                </label>
                <input
                  type="text"
                  required
                  className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-5 text-industrial-base font-bold placeholder:text-gray-300 outline-none focus:ring-2 focus:ring-industrial-accent focus:bg-white transition-all"
                  placeholder="Ej: Juan Pérez"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-[10px] font-black uppercase opacity-40 mb-2 block tracking-widest text-industrial-base font-title">
                    Empresa / Rol
                  </label>
                  <div className="relative">
                    <select
                      required
                      className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-5 text-industrial-base font-bold outline-none focus:ring-2 focus:ring-industrial-accent appearance-none"
                    >
                      <option>Empresa / Industria</option>
                      <option>PyME</option>
                      <option>Particular</option>
                    </select>
                    <ChevronRight className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-industrial-base rotate-90 pointer-events-none" />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase opacity-40 mb-2 block tracking-widest text-industrial-base font-title">
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    required
                    className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-5 text-industrial-base font-bold placeholder:text-gray-300 outline-none focus:ring-2 focus:ring-industrial-accent focus:bg-white transition-all"
                    placeholder="+54 9 ..."
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black uppercase opacity-40 mb-2 block tracking-widest text-industrial-base font-title">
                  Servicio de interés
                </label>
                <div className="relative">
                  <select
                    required
                    className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-5 text-industrial-base font-bold outline-none focus:ring-2 focus:ring-industrial-accent appearance-none transition-all"
                  >
                    {SERVICES.map((s) => (
                      <option key={s.id} value={s.id}>{s.title}</option>
                    ))}
                    <option value="otro">Otro / Consulta General</option>
                  </select>
                  <ChevronRight className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-industrial-base rotate-90 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black uppercase opacity-40 mb-2 block tracking-widest text-industrial-base font-title">
                  Mensaje
                </label>
                <textarea
                  rows={4}
                  className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-5 text-industrial-base font-bold placeholder:text-gray-300 outline-none focus:ring-2 focus:ring-industrial-accent focus:bg-white transition-all resize-none"
                  placeholder="Describí brevemente tu necesidad técnica..."
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={formStatus === 'submitting' || formStatus === 'success'}
                className={`w-full py-6 rounded-2xl font-black text-xl tracking-tighter transition-all flex items-center justify-center gap-3 ${
                  formStatus === 'success'
                    ? 'bg-green-600 text-white'
                    : 'bg-industrial-base text-white hover:bg-industrial-navy shadow-xl active:scale-95 btn-hover-effect'
                }`}
              >
                {formStatus === 'idle' && (
                  <>
                    ENVIAR SOLICITUD
                    <ChevronRight className="w-6 h-6" />
                  </>
                )}
                {formStatus === 'submitting' && <Loader2 className="w-8 h-8 animate-spin" />}
                {formStatus === 'success' && <CheckCircle2 className="w-8 h-8" />}
              </motion.button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
