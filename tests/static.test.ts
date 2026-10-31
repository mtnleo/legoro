import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

test('homepage contains contact anchor, heading and form before JavaScript', () => {
  const html = readFileSync(new URL('../dist/index.html', import.meta.url), 'utf8');
  assert.match(html, /id="contacto"/);
  assert.match(html, /Empecemos/);
  assert.match(html, /<form[^>]*aria-label="Formulario de contacto"/);
  for (const field of ['full_name', 'company', 'phone_number', 'service_type', 'description']) {
    assert.match(html, new RegExp(`name="${field}"`));
  }
  assert.doesNotMatch(html, /client:only|\/_next\//);
});

test('static homepage preserves anchors, nine services, team and local responsive images', async () => {
  const { SERVICES, TEAM } = await import('../lib/data.ts');
  const html = readFileSync(new URL('../dist/index.html', import.meta.url), 'utf8');
  for (const id of ['hero', 'servicios', 'elegirnos', 'equipo', 'contacto']) assert.ok(html.includes(`id="${id}"`), id);
  assert.equal(SERVICES.length, 9);
  assert.equal(TEAM.length, 3);
  for (const service of SERVICES) assert.ok(html.includes(service.title) && html.includes(service.description), service.title);
  for (const member of TEAM) assert.ok(html.includes(`LinkedIn de ${member.name}`) && html.includes(member.role), member.name);
  for (const asset of ['City_Background-sm.avif', 'City_Background-sm.webp', 'City_Background.avif', 'legoro-logo-400.avif']) assert.ok(html.includes(asset), asset);
});

test('privacy content remains exact and an explicit non-SPA 404 is emitted', () => {
  const privacy = readFileSync(new URL('../dist/privacidad/index.html', import.meta.url), 'utf8');
  for (const text of [
    'Política de privacidad',
    'En LEGORO usamos el nombre, empresa o rol, teléfono, servicio de interés y mensaje opcional que envías en el formulario para atender y responder tu consulta.',
    'Web3Forms procesa el envío y nos entrega la consulta por correo electrónico. Según la configuración de LEGORO, conserva los envíos durante 7 días. Ese plazo no incluye las copias recibidas por correo electrónico.',
    'Usamos hCaptcha para prevenir el spam. Estos proveedores pueden procesar datos fuera de tu país según sus políticas de privacidad:',
    'Para solicitar acceso, corrección o eliminación de tus datos, o dejar de recibir respuestas a tu consulta, escribe a',
    'mailto:ezequielleonardiing@gmail.com',
  ]) assert.ok(privacy.includes(text), text);
  const missing = readFileSync(new URL('../dist/404.html', import.meta.url), 'utf8');
  assert.match(missing, /404/);
  assert.doesNotMatch(missing, /Formulario de contacto/);
  const pkg = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'));
  for (const name of Object.keys({ ...pkg.dependencies, ...pkg.devDependencies })) assert.doesNotMatch(name, /^(next|@opennextjs\/|@astrojs\/cloudflare)/);
});

test('contact form fails closed before hydration and cannot natively GET personal data', () => {
  const html = readFileSync(new URL('../dist/index.html', import.meta.url), 'utf8');
  const form = html.match(/<form\b([^>]*)aria-label="Formulario de contacto"([^>]*)>([\s\S]*?)<\/form>/);
  assert.ok(form, 'contact form exists in static output');
  assert.match(form[1] + form[2], /method="post"/i);
  const body = form[3];
  const fieldset = body.match(/<fieldset\b([^>]*)>([\s\S]*?)<\/fieldset>/);
  assert.ok(fieldset);
  assert.match(fieldset[1], /\bdisabled(?:="")?(?:\s|$)/);
  for (const field of ['full_name', 'company', 'phone_number', 'service_type', 'description']) {
    assert.ok(fieldset[2].includes(`name="${field}"`), `${field} is protected by the disabled fieldset`);
  }
  const submit = body.match(/<button\b[^>]*type="submit"[^>]*>/);
  assert.ok(submit);
  assert.match(submit[0], /\bdisabled(?:="")?(?:\s|>)/);
  assert.doesNotMatch(body, /formmethod="get"/i);
  assert.match(body, /Preparando el formulario/);
  assert.match(body, /<noscript>[\s\S]*mailto:ezequielleonardiing@gmail\.com[\s\S]*<\/noscript>/);
});
