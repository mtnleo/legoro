
import { useState, useEffect, useCallback, useId, useRef } from 'react';
import { ChevronRight, CheckCircle2, Loader2, XCircle, X, AlertCircle } from 'lucide-react';
import { SERVICES } from '@/lib/data';
import HCaptcha from '@hcaptcha/react-hcaptcha';
import { submitContact } from '@/lib/submitContact';
import { contactSchema, COMPANY_OPTIONS, DEFAULT_SERVICE_ID } from '@/lib/contactSchema';
import { captchaPresentation, type FormStatus } from '@/lib/contactPresentation';
import { watchCaptchaSize } from '@/lib/captchaLayout';
import { createCaptchaLifecycle, type CaptchaRegistration } from '@/lib/captchaLifecycle';

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
  service_type: DEFAULT_SERVICE_ID,
  description: '',
};

const ALL_TOUCHED: Record<FieldName, boolean> = {
  full_name: true,
  company: true,
  phone_number: true,
  service_type: true,
  description: true,
};

// --- hCaptcha widget ---

function CaptchaWidget({ onVerify, onExpire, onError }: {
  onVerify: (token: string) => void;
  onExpire: () => void;
  onError: () => void;
}) {
  const [widget, setWidget] = useState<CaptchaRegistration | null>(null);
  const container = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!container.current) return;
    const lifecycle = createCaptchaLifecycle({ onVerify, onExpire, onError });
    const stopMeasuring = watchCaptchaSize(container.current, size => {
      // start synchronously invalidates old callbacks before React remounts the provider.
      setWidget(lifecycle.start(size));
    });
    return () => { lifecycle.dispose(); stopMeasuring(); };
  }, [onVerify, onExpire, onError]);

  const { key: widgetKey, ...providerProps } = widget ?? {};
  return <div ref={container} className="min-w-0 min-h-[78px]" data-captcha-container>
    {widget && <HCaptcha
      {...providerProps}
      key={widgetKey}
      sitekey="50b2fe65-b00b-4b9e-ad62-3ba471098be2"
      reCaptchaCompat={false}
      languageOverride="es"
    />}
  </div>;
}

// --- Toast ---

function ToastNotification({ toast, onDismiss }: { toast: Toast; onDismiss: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDismiss, 4000);
    return () => clearTimeout(t);
  }, [onDismiss]);

  const isSuccess = toast.type === 'success';

  return (
    <div
      role="alert"
      aria-live="assertive"
      aria-atomic="true"




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
    </div>
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
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  const [formStatus, setFormStatus] = useState<FormStatus>('idle');
  const [toast, setToast] = useState<Toast | null>(null);
  const [values, setValues] = useState<FormValues>(INITIAL_VALUES);
  const [touched, setTouched] = useState<Partial<Record<FieldName, boolean>>>({});
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [captchaError, setCaptchaError] = useState(false);
  const [captchaKey, setCaptchaKey] = useState(0);
  const [botcheck, setBotcheck] = useState(false);
  const submitting = useRef(false);
  const uid = useId();

  const dismissToast = useCallback(() => setToast(null), []);

  const handleCaptchaSuccess = useCallback((token: string) => {
    setCaptchaToken(token);
    setCaptchaError(false);
  }, []);
  const handleCaptchaExpire = useCallback(() => {
    setCaptchaToken(null);
    setCaptchaError(true);
  }, []);
  const handleCaptchaError = useCallback(() => {
    setCaptchaToken(null);
    setCaptchaError(true);
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
  const captcha = captchaPresentation(formStatus, captchaError);

  const visibleError = (name: FieldName) => (touched[name] ? allErrors[name] : undefined);
  const fieldId = (name: FieldName) => `${uid}-${name}`;
  const errorId = (name: FieldName) => `${uid}-${name}-error`;

  const handleChange = (name: FieldName, value: string) =>
    setValues(prev => ({ ...prev, [name]: value }));

  const handleBlur = (name: FieldName) =>
    setTouched(prev => ({ ...prev, [name]: true }));

  const resetCaptcha = () => {
    setCaptchaKey(k => k + 1);
    setCaptchaToken(null);
    setCaptchaError(false);
  };

  const doSubmit = async () => {
    if (!hydrated || submitting.current || formStatus === 'success') return;
    setTouched(ALL_TOUCHED);
    if (!isFormValid) return;
    if (!captchaToken) {
      setCaptchaError(true);
      return;
    }

    submitting.current = true;
    setFormStatus('submitting');
    setToast(null);
    try {
      const result = await submitContact(values, captchaToken, botcheck);
      if (result.success) {
        setFormStatus('success');
        setValues(INITIAL_VALUES);
        setTouched({});
        setBotcheck(false);
        setToast({ type: 'success', message: 'Consulta enviada. Gracias por escribirnos.' });
      } else {
        setFormStatus('error');
        setToast({ type: 'error', message: 'No pudimos confirmar el envío. Tus datos siguen en el formulario.' });
      }
    } catch {
      setFormStatus('error');
      setToast({ type: 'error', message: 'No pudimos confirmar el envío. Intentá de nuevo.' });
    } finally {
      submitting.current = false;
      resetCaptcha();
    }
  };

  const handleSubmit = (e: React.BaseSyntheticEvent) => {
    e.preventDefault();
    void doSubmit();
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
      <>
        {toast && <ToastNotification toast={toast} onDismiss={dismissToast} />}
      </>

              <form
                method="post"
                onSubmit={handleSubmit}
                noValidate
                aria-label="Formulario de contacto"
                className="contents"
                aria-busy={formStatus === 'submitting'}
              >
                <fieldset disabled={!hydrated || formStatus === 'submitting' || formStatus === 'success'} className="space-y-6 order-1 min-w-0">
                  <input type="checkbox" name="botcheck" checked={botcheck}
                    onChange={event => setBotcheck(event.target.checked)}
                    className="hidden" tabIndex={-1} aria-hidden="true" autoComplete="off" />
                  {/* Full name */}
                  <div>
                    <label
                      htmlFor={fieldId('full_name')}
                      className="text-[10px] uppercase tracking-[0.15em] text-[#0A1628]/50 font-bold mb-2 block"
                    >
                      Nombre completo{' '}
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
                        <option value="otro">Otro servicio o consulta general</option>
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
                      placeholder="Contanos qué necesitás resolver."
                    />
                    <FieldError id={errorId('description')} message={visibleError('description')} />
                  </div>
                </fieldset>

                <div className="order-2">
                  {captcha.showWidget && <CaptchaWidget
                    key={captchaKey}
                    onVerify={handleCaptchaSuccess}
                    onExpire={handleCaptchaExpire}
                    onError={handleCaptchaError}
                  />}
                  {captcha.showError && (
                    <div role="alert" className="mt-2 text-xs text-red-600 font-medium">
                      <p>Completá la verificación de seguridad. Si no carga, revisá tu conexión o bloqueador.</p>
                      <button type="button" onClick={resetCaptcha} disabled={formStatus === 'submitting'}
                        className="mt-2 underline">Volver a cargar la verificación</button>
                    </div>
                  )}
                  <p className="mt-3 text-xs text-[#0A1628]/60">
                    Usamos tus datos para responder tu consulta. El envío se procesa mediante Web3Forms y la verificación mediante hCaptcha. Consultá nuestra{' '}
                    <a href="/privacidad" className="underline underline-offset-2">política de privacidad</a>.
                  </p>
                </div>

                <div className="order-3">
                  <button


                    type="submit"
                    disabled={!hydrated || formStatus === 'submitting' || formStatus === 'success'}
                    aria-label={
                      formStatus === 'submitting' ? 'Enviando consulta…' :
                      formStatus === 'success' ? 'Consulta enviada' :
                      formStatus === 'error' ? 'Reintentar envío' : 'Enviar consulta'
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
                        ENVIAR CONSULTA
                        <ChevronRight className="w-6 h-6" aria-hidden="true" />
                      </>
                    )}
                    {formStatus === 'submitting' && (
                      <Loader2 className="w-8 h-8 animate-spin" aria-hidden="true" />
                    )}
                    {formStatus === 'success' && (
                      <><CheckCircle2 className="w-8 h-8" aria-hidden="true" /> CONSULTA ENVIADA</>
                    )}
                    {formStatus === 'error' && (
                      <><XCircle className="w-8 h-8" aria-hidden="true" /> REINTENTAR ENVÍO</>
                    )}
                  </button>
                  <p role="status" aria-live="polite" className="mt-3 text-sm text-[#0A1628]">
                    {!hydrated && 'Preparando el formulario…'}
                    {formStatus === 'submitting' && 'Enviando consulta…'}
                    {formStatus === 'success' && 'Consulta enviada. Gracias por escribirnos.'}
                    {formStatus === 'error' && 'No pudimos confirmar el envío. Tus datos se conservaron. Completá nuevamente la verificación para reintentar.'}
                  </p>
                </div>
                <noscript>
                  <p className="order-4 text-sm text-[#0A1628]">
                    Para usar el formulario, activá JavaScript. También podés escribirnos a{' '}
                    <a href="mailto:ezequielleonardiing@gmail.com" className="break-words underline">ezequielleonardiing@gmail.com</a>.
                  </p>
                </noscript>
              </form>    </>
  );
}
