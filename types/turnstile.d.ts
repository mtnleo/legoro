interface TurnstileOptions {
  sitekey: string;
  theme?: 'light' | 'dark' | 'auto';
  callback?: (token: string) => void;
  'expired-callback'?: () => void;
  'error-callback'?: (code: string) => void;
}

interface Turnstile {
  render(container: HTMLElement, options: TurnstileOptions): string;
  reset(widgetId?: string): void;
  remove(widgetId?: string): void;
}

interface Window {
  turnstile?: Turnstile;
}
