export type CaptchaSize = 'normal' | 'compact';

// hCaptcha offers fixed layouts, not an arbitrarily stretchable iframe.
export function watchCaptchaSize(
  container: HTMLElement,
  onSize: (size: CaptchaSize) => void,
  Observer: typeof ResizeObserver = ResizeObserver,
): () => void {
  let currentSize: CaptchaSize | null = null;
  const measure = () => {
    const nextSize = container.getBoundingClientRect().width >= 304 ? 'normal' : 'compact';
    if (nextSize === currentSize) return;
    currentSize = nextSize;
    onSize(nextSize);
  };
  measure();
  const observer = new Observer(measure);
  observer.observe(container);
  return () => observer.disconnect();
}
