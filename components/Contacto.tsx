'use client';

import { useState } from 'react';
import { Phone, MapPin, ChevronRight, CheckCircle2, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';
import { SERVICES } from '@/lib/data';

type FormStatus = 'idle' | 'submitting' | 'success';

export default function Contacto() {
  const [formStatus, setFormStatus] = useState<FormStatus>('idle');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormStatus('submitting');
    setTimeout(() => {
      setFormStatus('success');
      (e.target as HTMLFormElement).reset();
    }, 1500);
  };

  return (
    <section id="contacto" className="py-24 md:py-32 bg-[#EEF1F3]">
      <div className="container mx-auto px-6 md:px-8">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row rounded-[24px] overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.25)] border border-[#B0BEC5]/30">

          {/* Left panel */}
          <div className="lg:w-1/2 bg-[#0A1628] p-10 md:p-20 flex flex-col justify-between text-center lg:text-left relative">
            <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

            <div className="relative z-10 w-full flex flex-col items-center lg:items-start">
              <h2 className="font-jakarta font-black italic uppercase text-[#EEF1F3] text-[clamp(2.2rem,8vw,4.5rem)] leading-none mb-6 text-center lg:text-left w-full break-words">
                Empecemos
              </h2>
              <p className="font-jakarta font-normal text-[#EEF1F3]/60 text-base max-w-md text-center lg:text-left w-full">
                Envianos tu consulta y recibí un presupuesto técnico detallado en menos de 24hs.
              </p>
            </div>

            <div className="space-y-4 mt-12 md:mt-20 flex flex-col items-center lg:items-start relative z-10 w-full">
              <div className="flex items-center gap-4 bg-[#EEF1F3]/[0.06] border border-[#EEF1F3]/15 rounded-full px-5 py-3 text-[#EEF1F3] text-sm font-bold tracking-wider">
                <Phone className="w-5 h-5 text-[#B0BEC5]" />
                +54 223 000 0000
              </div>
              <div className="flex items-center gap-4 bg-[#EEF1F3]/[0.06] border border-[#EEF1F3]/15 rounded-full px-5 py-3 text-[#EEF1F3] text-sm font-bold tracking-wider">
                <MapPin className="w-5 h-5 text-[#B0BEC5]" />
                Mar del Plata, Argentina
              </div>
            </div>
          </div>

          {/* Right panel — form */}
          <div className="lg:w-1/2 p-8 md:p-20 bg-[#EEF1F3]">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="text-[10px] uppercase tracking-[0.15em] text-[#0A1628]/50 font-bold mb-2 block">
                  Nombre Completo
                </label>
                <input
                  type="text"
                  required
                  className="w-full bg-white border border-[#0A1628]/10 rounded-[14px] p-4 text-[#0A1628] font-medium placeholder:text-[#0A1628]/25 outline-none focus:border-[#B0BEC5] focus:ring-[3px] focus:ring-[#B0BEC5]/20 transition-all duration-200"
                  placeholder="Ej: Juan Pérez"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-[10px] uppercase tracking-[0.15em] text-[#0A1628]/50 font-bold mb-2 block">
                    Empresa / Rol
                  </label>
                  <div className="relative">
                    <select
                      required
                      className="w-full bg-white border border-[#0A1628]/10 rounded-[14px] p-4 text-[#0A1628] font-medium outline-none focus:border-[#B0BEC5] focus:ring-[3px] focus:ring-[#B0BEC5]/20 appearance-none transition-all duration-200"
                    >
                      <option>Empresa / Industria</option>
                      <option>PyME</option>
                      <option>Particular</option>
                    </select>
                    <ChevronRight className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#0A1628]/50 rotate-90 pointer-events-none" />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-[0.15em] text-[#0A1628]/50 font-bold mb-2 block">
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    required
                    className="w-full bg-white border border-[#0A1628]/10 rounded-[14px] p-4 text-[#0A1628] font-medium placeholder:text-[#0A1628]/25 outline-none focus:border-[#B0BEC5] focus:ring-[3px] focus:ring-[#B0BEC5]/20 transition-all duration-200"
                    placeholder="+54 9 ..."
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase tracking-[0.15em] text-[#0A1628]/50 font-bold mb-2 block">
                  Servicio de interés
                </label>
                <div className="relative">
                  <select
                    required
                    className="w-full bg-white border border-[#0A1628]/10 rounded-[14px] p-4 text-[#0A1628] font-medium outline-none focus:border-[#B0BEC5] focus:ring-[3px] focus:ring-[#B0BEC5]/20 appearance-none transition-all duration-200"
                  >
                    {SERVICES.map((s) => (
                      <option key={s.id} value={s.id}>{s.title}</option>
                    ))}
                    <option value="otro">Otro / Consulta General</option>
                  </select>
                  <ChevronRight className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#0A1628]/50 rotate-90 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase tracking-[0.15em] text-[#0A1628]/50 font-bold mb-2 block">
                  Mensaje
                </label>
                <textarea
                  rows={4}
                  className="w-full bg-white border border-[#0A1628]/10 rounded-[14px] p-4 text-[#0A1628] font-medium placeholder:text-[#0A1628]/25 outline-none focus:border-[#B0BEC5] focus:ring-[3px] focus:ring-[#B0BEC5]/20 transition-all duration-200 resize-none"
                  placeholder="Describí brevemente tu necesidad técnica..."
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={formStatus === 'submitting' || formStatus === 'success'}
                className={`w-full p-6 rounded-[14px] font-black uppercase tracking-[0.05em] transition-all duration-300 flex items-center justify-center gap-3 ${
                  formStatus === 'success'
                    ? 'bg-[#1a3d2b] text-white'
                    : 'bg-[#0A1628] text-[#EEF1F3] hover:bg-[#B0BEC5] hover:text-[#0A1628] hover:shadow-[0_8px_30px_rgba(10,22,40,0.2)]'
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
