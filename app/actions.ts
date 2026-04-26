'use server';

import { supabase } from '@/lib/supabase';
import { contactSchema } from '@/lib/contactSchema';

export async function submitContactForm(data: FormData) {
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
