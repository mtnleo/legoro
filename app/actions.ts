'use server';

import { supabase } from '@/lib/supabase';
import { contactSchema } from '@/lib/contactSchema';

async function verifyTurnstile(token: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) {
    console.error('[turnstile] TURNSTILE_SECRET_KEY no configurada');
    return false;
  }
  try {
    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ secret, response: token }).toString(),
    });
    const json = await res.json() as { success: boolean };
    return json.success === true;
  } catch (err) {
    console.error('[turnstile] Error verificando →', err);
    return false;
  }
}

export async function submitContactForm(data: FormData) {
  const token = data.get('cf_turnstile_response');
  if (!token || typeof token !== 'string') {
    return { success: false, error: 'Verificación de seguridad requerida.' };
  }
  if (!(await verifyTurnstile(token))) {
    console.error('[contact_leads] Turnstile verification failed');
    return { success: false, error: 'Verificación de seguridad fallida. Intentá de nuevo.' };
  }

  const raw = {
    full_name:    data.get('full_name'),
    company:      data.get('company'),
    phone_number: data.get('phone_number'),
    service_type: data.get('service_type'),
    description:  data.get('description') || undefined,
  };

  const parsed = contactSchema.safeParse(raw);
  if (!parsed.success) {
    console.error('[contact_leads] Validation error →', parsed.error.issues);
    return { success: false, error: 'Datos inválidos. Por favor, revisá el formulario.' };
  }

  const payload = { ...parsed.data, description: parsed.data.description ?? '' };
  console.log('[contact_leads] INSERT →', payload);

  const { error } = await supabase.from('contact_leads').insert(payload);

  if (error) {
    console.error('[contact_leads] Supabase error →', error);
    return { success: false, error: error.message };
  }

  console.log('[contact_leads] INSERT OK');
  return { success: true };
}
