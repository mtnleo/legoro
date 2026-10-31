import test from 'node:test';
import assert from 'node:assert/strict';
import { contactSchema } from '../lib/contactSchema.ts';

const valid = {
  full_name: 'María Pérez', company: 'Particular', phone_number: '+54 9 223 555-0100',
  service_type: 'instalaciones-electricas', description: '',
};

test('rejects whitespace and punctuation-only names and phones without enough digits', () => {
  for (const full_name of ['  ', '---', "''"]) {
    assert.equal(contactSchema.safeParse({ ...valid, full_name }).success, false);
  }
  for (const phone_number of ['       ', '-------', '12---34', '+1234567890123456']) {
    assert.equal(contactSchema.safeParse({ ...valid, phone_number }).success, false);
  }
});

test('normalizes names and international phone formatting without an ASCII-only name restriction', () => {
  for (const full_name of ['  Jose\u0301   O’Neill ', '李 明', 'Олена Петренко', 'محمد علي']) {
    const result = contactSchema.parse({ ...valid, full_name, phone_number: ' +44 (20) 7946-0958 ' });
    assert.equal(result.full_name, full_name.normalize('NFC').trim().replace(/\s+/gu, ' '));
    assert.equal(result.phone_number, '+442079460958');
  }
});

test('sends normalized business fields, public key, hCaptcha response and honeypot directly to Web3Forms', async () => {
  const { submitContact } = await import('../lib/submitContact.ts');
  const result = await submitContact(valid, 'solved-token', false, async (url, options) => {
    assert.equal(url, 'https://api.web3forms.com/submit');
    assert.equal(options?.method, 'POST');
    const body = JSON.parse(options?.body as string);
    assert.deepEqual(body, {
      ...valid, phone_number: '+5492235550100',
      access_key: 'ec60268a-2550-4dbe-90ff-9725eff7d6af',
      subject: 'Nueva consulta | LEGORO', from_name: 'LEGORO',
      'h-captcha-response': 'solved-token', botcheck: '',
    });
    return Response.json({ success: true });
  });
  assert.deepEqual(result, { success: true });
});

test('blocks invalid fields, absent/expired hCaptcha and honeypot before any request', async () => {
  const { submitContact } = await import('../lib/submitContact.ts');
  let calls = 0;
  const transport: typeof fetch = async () => { calls++; return Response.json({ success: true }); };
  assert.deepEqual(await submitContact({ ...valid, full_name: '  ' }, 'token', false, transport), { success: false, reason: 'validation' });
  for (const token of [null, '', '  ']) {
    assert.deepEqual(await submitContact(valid, token, false, transport), { success: false, reason: 'captcha' });
  }
  assert.deepEqual(await submitContact(valid, 'token', true, transport), { success: false, reason: 'spam' });
  assert.equal(calls, 0);
});

test('requires both HTTP success and a strictly true provider success result', async () => {
  const { submitContact } = await import('../lib/submitContact.ts');
  for (const response of [
    Response.json({ success: true }, { status: 429 }),
    Response.json({ success: false }), Response.json({ success: 'true' }),
    Response.json({}), Response.json(null), new Response('unavailable', { status: 503 }),
  ]) {
    assert.deepEqual(await submitContact(valid, 'token', false, async () => response), { success: false, reason: 'delivery' });
  }
});

test('contains network/timeout failures without clearing entered values, allowing a retry', async () => {
  const { submitContact } = await import('../lib/submitContact.ts');
  const values = { ...valid };
  for (const error of [new TypeError('network unavailable'), new DOMException('timeout', 'TimeoutError')]) {
    assert.deepEqual(await submitContact(values, 'token', false, async () => { throw error; }), { success: false, reason: 'delivery' });
    assert.deepEqual(values, valid);
  }
  assert.deepEqual(await submitContact(values, 'new-token', false, async (_url, options) => {
    assert.ok(options?.signal instanceof AbortSignal, 'requests must have a timeout signal');
    return Response.json({ success: true });
  }), { success: true });
});

test('aborts a stalled request after 15 seconds and resolves a retryable outcome', async context => {
  context.mock.timers.enable({ apis: ['setTimeout'] });
  const { submitContact } = await import('../lib/submitContact.ts');
  const pending = submitContact(valid, 'token', false, async (_url, options) => {
    return new Promise<Response>((_resolve, reject) => {
      options?.signal?.addEventListener('abort', () => reject(new DOMException('aborted', 'AbortError')), { once: true });
    });
  });
  context.mock.timers.tick(15_000);
  assert.deepEqual(await pending, { success: false, reason: 'delivery' });
});

test('confirmed services and the default stay aligned with the form schema', async () => {
  const { SERVICES } = await import('../lib/data.ts');
  const { SERVICE_ID_LIST, DEFAULT_SERVICE_ID } = await import('../lib/contactSchema.ts');
  assert.equal(DEFAULT_SERVICE_ID, 'instalaciones-electricas');
  assert.deepEqual(SERVICE_ID_LIST, [...SERVICES.map(({ id }) => id), 'otro']);
  for (const service_type of SERVICE_ID_LIST) assert.equal(contactSchema.safeParse({ ...valid, service_type }).success, true, service_type);
  for (const service_type of ['puesta-tierra', 'masas', 'on-grid', 'not-a-service']) assert.equal(contactSchema.safeParse({ ...valid, service_type }).success, false, service_type);
});
