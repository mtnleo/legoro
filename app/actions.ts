'use server';

import { supabase } from '@/lib/supabase';

export async function submitContactForm(data: FormData) {
  const payload = {
    full_name:    data.get('full_name'),
    company:      data.get('company'),
    phone_number: data.get('phone_number'),
    service_type: data.get('service_type'),
    description:  data.get('description') || "",
  };

  console.log('[contact_leads] INSERT →', payload);

  const { error } = await supabase.from('contact_leads').insert(payload);

  if (error) {
    console.error('[contact_leads] Supabase error →', error);
    return { success: false, error: error.message };
  }

  console.log('[contact_leads] INSERT OK');
  return { success: true };
}
