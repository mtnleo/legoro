import test from 'node:test';
import assert from 'node:assert/strict';
import { createCaptchaLifecycle } from '../lib/captchaLifecycle.ts';

test('superseded provider events cannot replace or expire the current verified token', context => {
  context.mock.timers.enable({ apis: ['setTimeout'] });
  let token: string | null = null;
  let error = false;
  const lifecycle = createCaptchaLifecycle({
    onVerify: value => { token = value; error = false; },
    onExpire: () => { token = null; error = true; },
    onError: () => { token = null; error = true; },
  });
  // Mock provider retains the real event registration passed by the widget.
  const oldProvider = lifecycle.start('normal');
  oldProvider.onVerify('old-token');
  const currentProvider = lifecycle.start('compact');
  assert.equal(token, null, 'layout replacement invalidates the previous token');
  currentProvider.onVerify('current-token');
  for (const callback of [() => oldProvider.onVerify('late-old-token'), oldProvider.onExpire,
    oldProvider.onChalExpired, oldProvider.onError, oldProvider.onLoad]) callback();
  assert.equal(token, 'current-token');
  assert.equal(error, false);
  currentProvider.onLoad();
  context.mock.timers.tick(12_000);
  assert.equal(token, 'current-token');
  currentProvider.onExpire();
  assert.equal(token, null);
  assert.equal(error, true);
  currentProvider.onVerify('replacement-token');
  lifecycle.dispose();
  currentProvider.onVerify('late-after-disposal');
  currentProvider.onError();
  assert.equal(token, 'replacement-token', 'disposed registrations cannot mutate state');
});

test('old load events cannot cancel the current load deadline; old deadlines cannot report errors', context => {
  context.mock.timers.enable({ apis: ['setTimeout'] });
  let errors = 0;
  const lifecycle = createCaptchaLifecycle({ onVerify() {}, onExpire() {}, onError: () => errors++ });
  const oldProvider = lifecycle.start('normal');
  context.mock.timers.tick(6_000);
  const currentProvider = lifecycle.start('compact');
  oldProvider.onLoad();
  context.mock.timers.tick(6_000);
  assert.equal(errors, 0, 'old generation deadline was cancelled');
  context.mock.timers.tick(6_000);
  assert.equal(errors, 1, 'current generation still reports its own load timeout');
  currentProvider.onLoad();
  lifecycle.start('normal');
  lifecycle.dispose();
  context.mock.timers.tick(12_000);
  assert.equal(errors, 1, 'disposal cancels pending deadlines');
});
