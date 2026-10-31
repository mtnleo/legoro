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

test('team LinkedIn links match the supplied profiles in static HTML', async () => {
  const { TEAM } = await import('../lib/data.ts');
  const html = readFileSync(new URL('../dist/index.html', import.meta.url), 'utf8');
  const profiles = [
    ['Ezequiel Leonardi', 'https://www.linkedin.com/in/ezequiel-leonardi/'],
    ['Matías Rocca', 'https://www.linkedin.com/in/matias-rocca-a89465266/'],
    ['Leandro González', 'https://www.linkedin.com/in/leandro-gonzalez-753327274/'],
  ];
  for (const [name, url] of profiles) {
    assert.equal(TEAM.find((member) => member.name === name)?.linkedin, url, name);
    const link = [...html.matchAll(/<a\b[^>]*>/g)].map(([tag]) => tag)
      .find((tag) => tag.includes(`aria-label="LinkedIn de ${name}"`));
    assert.ok(link, name);
    assert.ok(link.includes(`href="${url}"`), name);
  }
});

test('team roles and actionable contact details match the confirmed content', async () => {
  const { TEAM } = await import('../lib/data.ts');
  const html = readFileSync(new URL('../dist/index.html', import.meta.url), 'utf8');
  assert.deepEqual(TEAM.map(({ name, role }) => [name, role]), [
    ['Ezequiel Leonardi', 'Ingeniero Electromecánico'],
    ['Matías Rocca', 'Técnico Electromecánico'],
    ['Leandro González', 'Técnico Electromecánico'],
  ]);
  const team = html.match(/<section\b[^>]*id="equipo"[^>]*>([\s\S]*?)<\/section>/)?.[1];
  assert.ok(team);
  assert.equal((team.match(/Técnico Electromecánico/g) ?? []).length, 2);
  assert.equal((team.match(/Ingeniero Electromecánico/g) ?? []).length, 1);
  const contact = html.match(/<section\b[^>]*id="contacto"[^>]*>([\s\S]*?)<\/section>/)?.[1];
  assert.ok(contact);
  assert.match(contact, /<a\b[^>]*href="tel:\+5492235768622"[^>]*>[\s\S]*?\+54 9 2235 76-8622[\s\S]*?<\/a>/);
  assert.match(contact, /<a\b[^>]*href="mailto:ezequielleonardiing@gmail\.com"[^>]*>[\s\S]*?ezequielleonardiing@gmail\.com[\s\S]*?<\/a>/);
  assert.doesNotMatch(html, /\+54 223 000 0000/);
});

test('team portraits are local optimized responsive images with accessible names', () => {
  const html = readFileSync(new URL('../dist/index.html', import.meta.url), 'utf8');
  const team = html.match(/<section\b[^>]*id="equipo"[^>]*>([\s\S]*?)<\/section>/)?.[1];
  assert.ok(team);
  const images = [...team.matchAll(/<img\b[^>]*>/g)].map(([tag]) => tag);
  assert.equal(images.length, 3);
  for (const [index, [name, filename]] of [
    ['Ezequiel Leonardi', 'ezequiel-leonardi'],
    ['Matías Rocca', 'matias-rocca'],
    ['Leandro González', 'leandro-gonzalez'],
  ].entries()) {
    const image = images[index];
    assert.ok(image.includes(`alt="Retrato de ${name}"`));
    assert.match(image, new RegExp(`src="/_astro/${filename}[^" ]*\\.webp"`));
    assert.match(image, /width="800"/);
    assert.match(image, /height="\d+"/);
    assert.match(image, /loading="lazy"/);
    assert.match(image, /decoding="async"/);
    assert.match(image, /srcset="[^"]+320w[^"]+1200w"/);
    assert.match(image, /sizes="[^"]+"/);
    assert.match(image, /object-cover object-top/);
  }
});

test('branded fixed WhatsApp contact replaces only the fixed quote CTA', () => {
  const html = readFileSync(new URL('../dist/index.html', import.meta.url), 'utf8');
  assert.doesNotMatch(html, /id="mobile-cta"/);
  const whatsapp = html.match(/<a\b[^>]*id="whatsapp-contact"[^>]*>[\s\S]*?<\/a>/)?.[0];
  assert.ok(whatsapp);
  const href = whatsapp.match(/href="([^"]+)"/)?.[1];
  assert.ok(href);
  const url = new URL(href);
  assert.equal(url.origin + url.pathname, 'https://wa.me/5492235768622');
  assert.equal(url.searchParams.get('text'), 'Hola, entré por la web de LEGORO y quisiera consultar sobre…');
  assert.deepEqual([...url.searchParams.keys()], ['text']);
  assert.ok(href.includes('?text=Hola%2C%20entr%C3%A9'), 'message is URI encoded');
  assert.match(whatsapp, /aria-label="Contactar a LEGORO por WhatsApp"/);
  assert.match(whatsapp, /fixed[^"<>]*bg-industrial-accent/);
  assert.match(whatsapp, /focus-visible:outline/);
  assert.match(whatsapp, /<svg[^>]*viewBox="0 0 24 24"[^>]*aria-hidden="true"/);
  const source = readFileSync(new URL('../src/components/WhatsAppButton.astro', import.meta.url), 'utf8');
  assert.match(source, /safe-area-inset-bottom/);
  assert.match(source, /safe-area-inset-right/);
  const navigation = readFileSync(new URL('../src/scripts/navigation.ts', import.meta.url), 'utf8');
  assert.doesNotMatch(navigation, /mobile-cta|updateCta|contactVisible/);
  assert.ok((html.match(/href="#contacto"/g) ?? []).length >= 3, 'normal navigation and hero quote links remain');
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
