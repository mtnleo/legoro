'use client';

import { useState, useEffect, useCallback, useId, useRef } from 'react';
import { Phone, MapPin, ChevronRight, CheckCircle2, Loader2, XCircle, X, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { SERVICES } from '@/lib/data';
import { submitContactForm } from '@/app/actions';
import { contactSchema, COMPANY_OPTIONS } from '@/lib/contactSchema';

type FormStatus = 'idle' | 'submitting' | 'success' | 'error';
type FieldName = 'full_name' | 'company' | 'phone_number' | 'service_type' | 'description';

interface FormValues {
  full_name: string;
  company: string;
  phone_number: string;
  service_type: string;
  description: string;
}

interface Toast {
  type: 'success' | 'error';
  message: string;
}

const INITIAL_VALUES: FormValues = {
  full_name: '',
  company: '',
  phone_number: '',
  service_type: SERVICES[0].id,
  description: '',
};

const ALL_TOUCHED: Record<FieldName, boolean> = {
  full_name: true,
  company: true,
  phone_number: true,
  service_type: true,
  description: true,
};

// --- Turnstile widget ---

interface TurnstileWidgetProps {
  siteKey: string;
  onSuccess: (token: string) => void;
  onExpire: () => void;
  onError: () => void;
}

function TurnstileWidget({ siteKey, onSuccess, onExpire, onError }: TurnstileWidgetProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    let widgetId: string | undefined;

    const render = (): boolean => {
      if (!window.turnstile || !containerRef.current || widgetId) return false;
      widgetId = window.turnstile.render(containerRef.current, {
        sitekey: siteKey,
        theme: 'light',
        callback: onSuccess,
        'expired-callback': onExpire,
        'error-callback': onError,
      });
      return true;
    };

    if (render()) {
      return () => { window.turnstile?.remove(widgetId); };
    }

    // Script aún no cargó — hacer polling hasta que esté disponible
    const poll = setInterval(() => { if (render()) clearInterval(poll); }, 100);

    // Si el script está bloqueado (ad-blocker), notificar después de 10s
    const timeout = setTimeout(() => {
      clearInterval(poll);
      if (!widgetId) onError();
    }, 10_000);

    return () => {
      clearInterval(poll);
      clearTimeout(timeout);
      window.turnstile?.remove(widgetId);
    };
  }, [siteKey, onSuccess, onExpire, onError]);

  return <div ref={containerRef} />;
}

// --- Toast ---

function ToastNotification({ toast, onDismiss }: { toast: Toast; onDismiss: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDismiss, 4000);
    return () => clearTimeout(t);
  }, [onDismiss]);

  const isSuccess = toast.type === 'success';

  return (
    <motion.div
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
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
        ? <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0" aria-hidden="true" />
        : <XCircle className="w-5 h-5 text-red-400 shrink-0" aria-hidden="true" />
      }
      <p className="text-sm font-semibold">{toast.message}</p>
      <button
        onClick={onDismiss}
        className="ml-2 opacity-50 hover:opacity-100 transition-opacity"
        aria-label="Cerrar notificación"
      >
        <X className="w-4 h-4" aria-hidden="true" />
      </button>
    </motion.div>
  );
}

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} role="alert" className="mt-1.5 flex items-center gap-1.5 text-xs text-red-600 font-medium">
      <AlertCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
      {message}
    </p>
  );
}

// --- Main component ---

export default function Contacto() {
  const [formStatus, setFormStatus] = useState<FormStatus>('idle');
  const [toast, setToast] = useState<Toast | null>(null);
  const [values, setValues] = useState<FormValues>(INITIAL_VALUES);
  const [touched, setTouched] = useState<Partial<Record<FieldName, boolean>>>({});
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [turnstileError, setTurnstileError] = useState(false);
  const [turnstileKey, setTurnstileKey] = useState(0);
  const uid = useId();

  const dismissToast = useCallback(() => setToast(null), []);

  const handleTurnstileSuccess = useCallback((token: string) => {
    setTurnstileToken(token);
    setTurnstileError(false);
  }, []);
  const handleTurnstileExpire = useCallback(() => setTurnstileToken(null), []);
  const handleTurnstileError = useCallback(() => {
    setTurnstileToken(null);
    setTurnstileError(true);
  }, []);

  const parseResult = contactSchema.safeParse(values);
  const allErrors: Partial<Record<FieldName, string>> = parseResult.success
    ? {}
    : Object.fromEntries(
        parseResult.error.issues
          .filter(issue => issue.path.length > 0)
          .map(issue => [issue.path[0] as FieldName, issue.message])
      );
  const isFormValid = parseResult.success;

  const visibleError = (name: FieldName) => (touched[name] ? allErrors[name] : undefined);
  const fieldId = (name: FieldName) => `${uid}-${name}`;
  const errorId = (name: FieldName) => `${uid}-${name}-error`;

  const handleChange = (name: FieldName, value: string) =>
    setValues(prev => ({ ...prev, [name]: value }));

  const handleBlur = (name: FieldName) =>
    setTouched(prev => ({ ...prev, [name]: true }));

  const resetTurnstile = () => {
    setTurnstileKey(k => k + 1);
    setTurnstileToken(null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    setTouched(ALL_TOUCHED);
    if (!isFormValid) return;

    if (!turnstileToken) {
      setTurnstileError(true);
      return;
    }

    setFormStatus('submitting');
    const formData = new FormData();
    (Object.entries(values) as [string, string][]).forEach(([k, v]) => formData.append(k, v));
    formData.append('cf_turnstile_response', turnstileToken);

    const result = await submitContactForm(formData);
    if (result.success) {
      setFormStatus('success');
      setValues(INITIAL_VALUES);
      setTouched({});
      resetTurnstile();
      setToast({ type: 'success', message: '¡Solicitud enviada! Te contactamos en menos de 24hs.' });
    } else {
      setFormStatus('error');
      resetTurnstile();
      setToast({ type: 'error', message: 'Hubo un error al enviar. Por favor, intentá de nuevo.' });
      setTimeout(() => setFormStatus('idle'), 3000);
    }
  };

  const inputClass = (name: FieldName) => {
    const hasError = !!visibleError(name);
    return `w-full bg-white border rounded-[14px] p-4 text-[#0A1628] font-medium placeholder:text-[#0A1628]/25 outline-none transition-all duration-200 ${
      hasError
        ? 'border-red-400 focus:border-red-500 focus:ring-[3px] focus:ring-red-400/20'
        : 'border-[#0A1628]/10 focus:border-[#B0BEC5] focus:ring-[3px] focus:ring-[#B0BEC5]/20'
    }`;
  };

  return (
    <>
      <AnimatePresence>
        {toast && <ToastNotification toast={toast} onDismiss={dismissToast} />}
      </AnimatePresence>

      <section id="contacto" aria-labelledby="contacto-heading" className="py-24 md:py-32 bg-[#EEF1F3]">
        <div className="container mx-auto px-6 md:px-8">
          <div className="max-w-6xl mx-auto flex flex-col lg:flex-row rounded-3xl overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.25)] border border-[#B0BEC5]/30">

            {/* Left panel */}
            <div className="lg:w-1/2 bg-[#0A1628] p-10 md:p-20 flex flex-col justify-between text-center lg:text-left relative">
              <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-size-[24px_24px] pointer-events-none" aria-hidden="true" />

              <div className="relative z-10 w-full flex flex-col items-center lg:items-start">
                <h2 id="contacto-heading" className="font-jakarta font-black italic uppercase text-[#EEF1F3] text-[clamp(1.5rem,8vw,4.5rem)] leading-none mb-6 text-center lg:text-left w-full whitespace-nowrap">
                  Empecemos
                </h2>
                <p className="font-jakarta font-normal text-[#EEF1F3]/60 text-base max-w-md text-center lg:text-left w-full">
                  Envianos tu consulta y recibí un presupuesto técnico detallado en menos de 24hs.
                </p>
              </div>

              <div className="space-y-4 mt-12 md:mt-20 flex flex-col items-center lg:items-start relative z-10 w-full">
                <div className="flex items-center gap-4 bg-[#EEF1F3]/6 border border-[#EEF1F3]/15 rounded-full px-5 py-3 text-[#EEF1F3] text-sm font-bold tracking-wider">
                  <Phone className="w-5 h-5 text-[#B0BEC5]" aria-hidden="true" />
                  <span>+54 223 000 0000</span>
                </div>
                <div className="flex items-center gap-4 bg-[#EEF1F3]/6 border border-[#EEF1F3]/15 rounded-full px-5 py-3 text-[#EEF1F3] text-sm font-bold tracking-wider">
                  <MapPin className="w-5 h-5 text-[#B0BEC5]" aria-hidden="true" />
                  <span>Mar del Plata, Argentina</span>
                </div>
              </div>
            </div>

            {/* Right panel — form */}
            <div className="lg:w-1/2 p-8 md:p-20 bg-[#EEF1F3]">
              <form
                onSubmit={handleSubmit}
                noValidate
                aria-label="Formulario de contacto"
                className="space-y-6"
              >
                {/* Full name */}
                <div>
                  <label
                    htmlFor={fieldId('full_name')}
                    className="text-[10px] uppercase tracking-[0.15em] text-[#0A1628]/50 font-bold mb-2 block"
                  >
                    Nombre Completo{' '}
                    <span aria-hidden="true" className="text-red-500">*</span>
                  </label>
                  <input
                    id={fieldId('full_name')}
                    type="text"
                    name="full_name"
                    value={values.full_name}
                    onChange={e => handleChange('full_name', e.target.value)}
                    onBlur={() => handleBlur('full_name')}
                    aria-required="true"
                    aria-invalid={!!visibleError('full_name') || undefined}
                    aria-describedby={visibleError('full_name') ? errorId('full_name') : undefined}
                    autoComplete="name"
                    className={inputClass('full_name')}
                    placeholder="Ej: Juan Pérez"
                  />
                  <FieldError id={errorId('full_name')} message={visibleError('full_name')} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Company */}
                  <div>
                    <label
                      htmlFor={fieldId('company')}
                      className="text-[10px] uppercase tracking-[0.15em] text-[#0A1628]/50 font-bold mb-2 block"
                    >
                      Empresa / Rol{' '}
                      <span aria-hidden="true" className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <select
                        id={fieldId('company')}
                        name="company"
                        value={values.company}
                        onChange={e => handleChange('company', e.target.value)}
                        onBlur={() => handleBlur('company')}
                        aria-required="true"
                        aria-invalid={!!visibleError('company') || undefined}
                        aria-describedby={visibleError('company') ? errorId('company') : undefined}
                        className={`${inputClass('company')} appearance-none`}
                      >
                        <option value="" disabled>Seleccioná una opción</option>
                        {COMPANY_OPTIONS.map(opt => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                      <ChevronRight className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#0A1628]/50 rotate-90 pointer-events-none" aria-hidden="true" />
                    </div>
                    <FieldError id={errorId('company')} message={visibleError('company')} />
                  </div>

                  {/* Phone */}
                  <div>
                    <label
                      htmlFor={fieldId('phone_number')}
                      className="text-[10px] uppercase tracking-[0.15em] text-[#0A1628]/50 font-bold mb-2 block"
                    >
                      Teléfono{' '}
                      <span aria-hidden="true" className="text-red-500">*</span>
                    </label>
                    <input
                      id={fieldId('phone_number')}
                      type="tel"
                      name="phone_number"
                      inputMode="tel"
                      value={values.phone_number}
                      onChange={e => handleChange('phone_number', e.target.value)}
                      onBlur={() => handleBlur('phone_number')}
                      aria-required="true"
                      aria-invalid={!!visibleError('phone_number') || undefined}
                      aria-describedby={visibleError('phone_number') ? errorId('phone_number') : undefined}
                      autoComplete="tel"
                      className={inputClass('phone_number')}
                      placeholder="+54 9 ..."
                    />
                    <FieldError id={errorId('phone_number')} message={visibleError('phone_number')} />
                  </div>
                </div>

                {/* Service type */}
                <div>
                  <label
                    htmlFor={fieldId('service_type')}
                    className="text-[10px] uppercase tracking-[0.15em] text-[#0A1628]/50 font-bold mb-2 block"
                  >
                    Servicio de interés{' '}
                    <span aria-hidden="true" className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      id={fieldId('service_type')}
                      name="service_type"
                      value={values.service_type}
                      onChange={e => handleChange('service_type', e.target.value)}
                      onBlur={() => handleBlur('service_type')}
                      aria-required="true"
                      aria-invalid={!!visibleError('service_type') || undefined}
                      aria-describedby={visibleError('service_type') ? errorId('service_type') : undefined}
                      className={`${inputClass('service_type')} appearance-none`}
                    >
                      {SERVICES.map(s => (
                        <option key={s.id} value={s.id}>{s.title}</option>
                      ))}
                      <option value="otro">Otro / Consulta General</option>
                    </select>
                    <ChevronRight className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#0A1628]/50 rotate-90 pointer-events-none" aria-hidden="true" />
                  </div>
                  <FieldError id={errorId('service_type')} message={visibleError('service_type')} />
                </div>

                {/* Description (optional) */}
                <div>
                  <label
                    htmlFor={fieldId('description')}
                    className="text-[10px] uppercase tracking-[0.15em] text-[#0A1628]/50 font-bold mb-2 block"
                  >
                    Mensaje
                  </label>
                  <textarea
                    id={fieldId('description')}
                    name="description"
                    value={values.description}
                    onChange={e => handleChange('description', e.target.value)}
                    onBlur={() => handleBlur('description')}
                    aria-describedby={visibleError('description') ? errorId('description') : undefined}
                    rows={4}
                    className={`${inputClass('description')} resize-none`}
                    placeholder="Describí brevemente tu necesidad técnica..."
                  />
                  <FieldError id={errorId('description')} message={visibleError('description')} />
                </div>

                {/* Turnstile CAPTCHA */}
                <div>
                  <TurnstileWidget
                    key={turnstileKey}
                    siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!}
                    onSuccess={handleTurnstileSuccess}
                    onExpire={handleTurnstileExpire}
                    onError={handleTurnstileError}
                  />
                  {turnstileError && (
                    <p role="alert" className="mt-1.5 flex items-center gap-1.5 text-xs text-red-600 font-medium">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                      Por favor, completá la verificación de seguridad.
                    </p>
                  )}
                </div>

                <motion.button
                  whileHover={{ scale: formStatus === 'submitting' ? 1 : 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={formStatus === 'submitting' || formStatus === 'success'}
                  aria-label={
                    formStatus === 'submitting' ? 'Enviando solicitud…' :
                    formStatus === 'success' ? 'Solicitud enviada correctamente' :
                    'Enviar solicitud de contacto'
                  }
                  className={`w-full p-6 rounded-[14px] font-black uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-3 ${
                    formStatus === 'success'
                      ? 'bg-green-600 text-white cursor-default'
                      : formStatus === 'error'
                      ? 'bg-red-600 text-white'
                      : 'bg-[#0A1628] text-[#EEF1F3] hover:bg-[#B0BEC5] hover:text-[#0A1628] hover:shadow-[0_8px_30px_rgba(10,22,40,0.2)]'
                  }`}
                >
                  {formStatus === 'idle' && (
                    <>
                      ENVIAR SOLICITUD
                      <ChevronRight className="w-6 h-6" aria-hidden="true" />
                    </>
                  )}
                  {formStatus === 'submitting' && (
                    <Loader2 className="w-8 h-8 animate-spin" aria-hidden="true" />
                  )}
                  {formStatus === 'success' && (
                    <><CheckCircle2 className="w-8 h-8" aria-hidden="true" /> SOLICITUD ENVIADA</>
                  )}
                  {formStatus === 'error' && (
                    <><XCircle className="w-8 h-8" aria-hidden="true" /> ERROR — INTENTÁ DE NUEVO</>
                  )}
                </motion.button>
              </form>
            </div>

          </div>
        </div>
      </section>
    </>
  );
}
