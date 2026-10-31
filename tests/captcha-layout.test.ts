import test from 'node:test';
import assert from 'node:assert/strict';
import { watchCaptchaSize } from '../lib/captchaLayout.ts';

test('selects normal for a real container of at least 304px and compact below it', () => {
  for (const [width, expected] of [[304, 'normal'], [312, 'normal'], [342, 'normal'], [303, 'compact'], [240, 'compact']] as const) {
    const sizes: string[] = [];
    class Observer { observe() {} disconnect() {} }
    watchCaptchaSize({ getBoundingClientRect: () => ({ width }) } as HTMLElement, size => sizes.push(size), Observer as unknown as typeof ResizeObserver);
    assert.deepEqual(sizes, [expected]);
  }
});

test('only changes widget layout on a size boundary, preserving tokens on ordinary resizes', () => {
  let width = 342;
  let resize = () => {};
  let disconnected = false;
  class Observer {
    constructor(callback: () => void) { resize = callback; }
    observe() {}
    disconnect() { disconnected = true; }
  }
  const sizes: string[] = [];
  const stop = watchCaptchaSize(
    { getBoundingClientRect: () => ({ width }) } as HTMLElement,
    size => sizes.push(size), Observer as unknown as typeof ResizeObserver,
  );
  for (const nextWidth of [320, 304, 303, 280, 360, 400]) { width = nextWidth; resize(); }
  assert.deepEqual(sizes, ['normal', 'compact', 'normal']);
  stop();
  assert.equal(disconnected, true);
});
