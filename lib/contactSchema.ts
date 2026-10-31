import { z } from 'zod';
import { SERVICES } from './data.ts';

export const COMPANY_OPTIONS = ['Empresa / Industria', 'PyME', 'Particular'] as const;
export const SERVICE_ID_LIST = [...SERVICES.map(s => s.id), 'otro'];

export const contactSchema = z.object({
  full_name: z
    .string()
    .transform(value => value.normalize('NFC').trim().replace(/\s+/gu, ' '))
    .pipe(z.string()
    .min(2, 'Ingresá tu nombre completo (mín. 2 caracteres)')
    .max(100, 'El nombre es demasiado largo')
    .regex(/^[\p{L}\p{M} '.’\-]+$/u, 'Ingresá un nombre válido')
    .refine(value => (value.match(/\p{L}/gu) ?? []).length >= 2, 'Ingresá tu nombre completo')),
  company: z.enum(COMPANY_OPTIONS, {
    error: 'Seleccioná una opción',
  }),
  phone_number: z
    .string()
    .trim()
    .min(1, 'El teléfono es requerido')
    .max(40, 'El teléfono es demasiado largo')
    .regex(/^\+?[0-9\s\-().]+$/, 'Ingresá un número de teléfono válido')
    .refine(value => {
      const digits = value.replace(/\D/g, '');
      return digits.length >= 7 && digits.length <= 15;
    }, 'Ingresá un número de teléfono válido')
    .transform(value => value.replace(/[\s().-]/g, '')),
  service_type: z
    .string()
    .refine(v => SERVICE_ID_LIST.includes(v), { message: 'Seleccioná un servicio' }),
  description: z.string().max(2000, 'El mensaje no puede superar 2000 caracteres').optional(),
});

export type ContactFormValues = z.infer<typeof contactSchema>;
