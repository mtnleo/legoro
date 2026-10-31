import type { CaptchaSize } from './captchaLayout.ts';

type CaptchaCallbacks = {
  onVerify: (token: string) => void;
  onExpire: () => void;
  onError: () => void;
};

// Own the exact callbacks handed to each provider instance, including its deadline.
export function createCaptchaLifecycle(callbacks: CaptchaCallbacks) {
  let generation = 0;
  let timeout: ReturnType<typeof setTimeout> | undefined;
  const invalidate = () => {
    generation++;
    clearTimeout(timeout);
    timeout = undefined;
  };
  return {
    start(size: CaptchaSize) {
      const replacing = generation > 0;
      invalidate();
      const currentGeneration = generation;
      const guard = <Args extends unknown[]>(callback: (...args: Args) => void) =>
        (...args: Args) => {
          if (generation === currentGeneration) callback(...args);
        };
      if (replacing) callbacks.onExpire();
      const onError = guard(callbacks.onError);
      timeout = setTimeout(onError, 12_000);
      return {
        key: currentGeneration,
        size,
        onVerify: guard(callbacks.onVerify),
        onExpire: guard(callbacks.onExpire),
        onChalExpired: guard(callbacks.onExpire),
        onError,
        onLoad: guard(() => { clearTimeout(timeout); timeout = undefined; }),
      };
    },
    dispose: invalidate,
  };
}

export type CaptchaRegistration = ReturnType<ReturnType<typeof createCaptchaLifecycle>['start']>;
