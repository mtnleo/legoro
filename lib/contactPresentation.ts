export type FormStatus = 'idle' | 'submitting' | 'success' | 'error';

export function captchaPresentation(status: FormStatus, error: boolean) {
  return { showWidget: status !== 'success', showError: status !== 'success' && error };
}
