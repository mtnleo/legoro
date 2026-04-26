'use client';

import { useState, useEffect, useRef } from 'react';
import { Phone, MapPin, ChevronRight, CheckCircle2, Loader2, XCircle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { SERVICES } from '@/lib/data';
import { submitContactForm } from '@/app/actions';

type FormStatus = 'idle' | 'submitting' | 'success' | 'error';

interface Toast {
  type: 'success' | 'error';
  message: string;
}

function ToastNotification({ toast, onDismiss }: { toast: Toast; onDismiss: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onDismiss, 4000);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  const isSuccess = toast.type === 'success';

  return (
    <motion.div
      initial={{ opacity: 0, y: -16, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -16, scale: 0.95 }}
      transition={{ type: 'spring', damping: 20, stiffness: 300 }}
      className={`fixed top-6 right-6 z-100 flex items-center gap-3 px-5 py-4 rounded-2xl shadow-2xl border max-w-sm ${
        isSuccess
          ? 'bg-green-950 border-green-500/30 text-green-100'
          : 'bg-red-950 border-red-500/30 text-red-100'
      }`}
    >
      {isSuccess
        ? <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0" />
        : <XCircle className="w-5 h-5 text-red-400 shrink-0" />
      }
      <p className="text-sm font-semibold">{toast.message}</p>
      <button onClick={onDismiss} className="ml-2 opacity-50 hover:opacity-100 transition-opacity">
        <X className="w-4 h-4" />
      </button>
    </motion.div>
  );
}

export default function Contacto() {
  const [formStatus, setFormStatus] = useState<FormStatus>('idle');
  const [toast, setToast] = useState<Toast | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const dismissToast = () => setToast(null);

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormStatus('submitting');
    const result = await submitContactForm(new FormData(e.currentTarget));
    console.log('[Contacto] server action result →', result);
    if (result.success) {
      setFormStatus('success');
      formRef.current?.reset();
      setToast({ type: 'success', message: '¡Solicitud enviada! Te contactamos en menos de 24hs.' });
    } else {
      console.error('[Contacto] submission failed →', result.error);
      setFormStatus('error');
      setToast({ type: 'error', message: 'Hubo un error al enviar. Por favor, intentá de nuevo.' });
      setTimeout(() => setFormStatus('idle'), 3000);
    }
  };

  return (
    <>
      <AnimatePresence>
        {toast && <ToastNotification toast={toast} onDismiss={dismissToast} />}
      </AnimatePresence>

      <section id="contacto" className="py-24 md:py-32 bg-[#EEF1F3]">
        <div className="container mx-auto px-6 md:px-8">
          <div className="max-w-6xl mx-auto flex flex-col lg:flex-row rounded-3xl overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.25)] border border-[#B0BEC5]/30">

            {/* Left panel */}
            <div className="lg:w-1/2 bg-[#0A1628] p-10 md:p-20 flex flex-col justify-between text-center lg:text-left relative">
              <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-size-[24px_24px] pointer-events-none" />

              <div className="relative z-10 w-full flex flex-col items-center lg:items-start">
                <h2 className="font-jakarta font-black italic uppercase text-[#EEF1F3] text-[clamp(1.5rem,8vw,4.5rem)] leading-none mb-6 text-center lg:text-left w-full whitespace-nowrap">
                  Empecemos
                </h2>
                <p className="font-jakarta font-normal text-[#EEF1F3]/60 text-base max-w-md text-center lg:text-left w-full">
                  Envianos tu consulta y recibí un presupuesto técnico detallado en menos de 24hs.
                </p>
              </div>

              <div className="space-y-4 mt-12 md:mt-20 flex flex-col items-center lg:items-start relative z-10 w-full">
                <div className="flex items-center gap-4 bg-[#EEF1F3]/6 border border-[#EEF1F3]/15 rounded-full px-5 py-3 text-[#EEF1F3] text-sm font-bold tracking-wider">
                  <Phone className="w-5 h-5 text-[#B0BEC5]" />
                  +54 223 000 0000
                </div>
                <div className="flex items-center gap-4 bg-[#EEF1F3]/6 border border-[#EEF1F3]/15 rounded-full px-5 py-3 text-[#EEF1F3] text-sm font-bold tracking-wider">
                  <MapPin className="w-5 h-5 text-[#B0BEC5]" />
                  Mar del Plata, Argentina
                </div>
              </div>
            </div>

            {/* Right panel — form */}
            <div className="lg:w-1/2 p-8 md:p-20 bg-[#EEF1F3]">
              <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="text-[10px] uppercase tracking-[0.15em] text-[#0A1628]/50 font-bold mb-2 block">
                    Nombre Completo
                  </label>
                  <input
                    type="text"
                    name="full_name"
                    required
                    className="w-full bg-white border border-[#0A1628]/10 rounded-[14px] p-4 text-[#0A1628] font-medium placeholder:text-[#0A1628]/25 outline-none focus:border-[#B0BEC5] focus:ring-[3px] focus:ring-[#B0BEC5]/20 transition-all duration-200"
                    placeholder="Ej: Juan Pérez"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="form_company" className="text-[10px] uppercase tracking-[0.15em] text-[#0A1628]/50 font-bold mb-2 block">
                      Empresa / Rol
                    </label>
                    <div className="relative">
                      <select
                        id="form_company"
                        name="company"
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
                      name="phone_number"
                      required
                      className="w-full bg-white border border-[#0A1628]/10 rounded-[14px] p-4 text-[#0A1628] font-medium placeholder:text-[#0A1628]/25 outline-none focus:border-[#B0BEC5] focus:ring-[3px] focus:ring-[#B0BEC5]/20 transition-all duration-200"
                      placeholder="+54 9 ..."
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor='form_service_type' className="text-[10px] uppercase tracking-[0.15em] text-[#0A1628]/50 font-bold mb-2 block">
                    Servicio de interés
                  </label>
                  <div className="relative">
                    <select
                      id="form_service_type"
                      name="service_type"
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
                    name="description"
                    rows={4}
                    className="w-full bg-white border border-[#0A1628]/10 rounded-[14px] p-4 text-[#0A1628] font-medium placeholder:text-[#0A1628]/25 outline-none focus:border-[#B0BEC5] focus:ring-[3px] focus:ring-[#B0BEC5]/20 transition-all duration-200 resize-none"
                    placeholder="Describí brevemente tu necesidad técnica..."
                  />
                </div>

                <motion.button
                  whileHover={{ scale: formStatus === 'submitting' ? 1 : 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={formStatus === 'submitting' || formStatus === 'success'}
                  className={`w-full p-6 rounded-[14px] font-black uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-3 ${
                    formStatus === 'success'
                      ? 'bg-green-600 text-white'
                      : formStatus === 'error'
                      ? 'bg-red-600 text-white'
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
                  {formStatus === 'success' && <><CheckCircle2 className="w-8 h-8" /> SOLICITUD ENVIADA</>}
                  {formStatus === 'error' && <><XCircle className="w-8 h-8" /> ERROR — INTENTÁ DE NUEVO</>}
                </motion.button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
