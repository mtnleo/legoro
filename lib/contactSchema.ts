import { z } from 'zod';
import { SERVICES } from './data';

export const COMPANY_OPTIONS = ['Empresa / Industria', 'PyME', 'Particular'] as const;
export const SERVICE_ID_LIST = [...SERVICES.map(s => s.id), 'otro'];

export const contactSchema = z.object({
  full_name: z
    .string()
    .min(2, 'Ingresá tu nombre completo (mín. 2 caracteres)')
    .max(100, 'El nombre es demasiado largo')
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜàèìòùâêîôûäëïöüçÇ\s'.-]+$/, 'Solo se permiten letras y espacios'),
  company: z.enum(COMPANY_OPTIONS, {
    error: 'Seleccioná una opción',
  }),
  phone_number: z
    .string()
    .min(1, 'El teléfono es requerido')
    .regex(/^\+?[\d\s\-(). ]{7,20}$/, 'Ingresá un número de teléfono válido'),
  service_type: z
    .string()
    .refine(v => SERVICE_ID_LIST.includes(v), { message: 'Seleccioná un servicio' }),
  description: z.string().max(2000, 'El mensaje no puede superar 2000 caracteres').optional(),
});

export type ContactFormValues = z.infer<typeof contactSchema>;
