import { contactSchema } from './contactSchema.ts';

// Public form identifier, not an account credential. Recipient is configured by the owner.
const ACCESS_KEY = 'ec60268a-2550-4dbe-90ff-9725eff7d6af';

type SubmissionResult = { success: true } | {
  success: false;
  reason: 'validation' | 'captcha' | 'spam' | 'delivery';
};

export async function submitContact(
  values: unknown,
  captchaToken: string | null,
  botcheck: boolean,
  fetcher: typeof fetch = fetch,
): Promise<SubmissionResult> {
  const parsed = contactSchema.safeParse(values);
  if (!parsed.success) return { success: false, reason: 'validation' };

  if (!captchaToken?.trim()) return { success: false, reason: 'captcha' };
  if (botcheck) return { success: false, reason: 'spam' };

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15_000);
  try {
    const response = await fetcher('https://api.web3forms.com/submit', {
      method: 'POST',
      signal: controller.signal,
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        ...parsed.data,
        access_key: ACCESS_KEY,
        subject: 'Nueva consulta | LEGORO',
        from_name: 'LEGORO',
        'h-captcha-response': captchaToken,
        botcheck: botcheck ? 'on' : '',
      }),
    });
    if (!response.ok) return { success: false, reason: 'delivery' };
    const body: unknown = await response.json().catch(() => null);
    return body !== null && typeof body === 'object' && 'success' in body && body.success === true
      ? { success: true }
      : { success: false, reason: 'delivery' };
  } catch {
    // Never include submitted personal data or raw provider responses in logs.
    return { success: false, reason: 'delivery' };
  } finally {
    clearTimeout(timeout);
  }
}
