import test from 'node:test';
import assert from 'node:assert/strict';
import { captchaPresentation } from '../lib/contactPresentation.ts';

test('confirmed success never requests another security verification, even after a provider error', () => {
  assert.deepEqual(captchaPresentation('success', true), { showWidget: false, showError: false });
  assert.deepEqual(captchaPresentation('success', false), { showWidget: false, showError: false });
});

test('failed or unverified submissions retain the challenge and retry warning', () => {
  for (const status of ['idle', 'error'] as const) {
    assert.deepEqual(captchaPresentation(status, true), { showWidget: true, showError: true });
    assert.deepEqual(captchaPresentation(status, false), { showWidget: true, showError: false });
  }
  assert.deepEqual(captchaPresentation('submitting', true), { showWidget: true, showError: true });
});
