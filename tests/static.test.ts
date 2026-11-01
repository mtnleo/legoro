import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

test('homepage contains contact anchor, heading and form before JavaScript', () => {
  const html = readFileSync(new URL('../dist/index.html', import.meta.url), 'utf8');
  assert.match(html, /id="contacto"/);
  assert.match(html, /Consultanos/);
  assert.match(html, /<form[^>]*aria-label="Formulario de contacto"/);
  for (const field of ['full_name', 'company', 'phone_number', 'service_type', 'description']) {
    assert.match(html, new RegExp(`name="${field}"`));
  }
  assert.doesNotMatch(html, /client:only|\/_next\//);
});

test('static homepage preserves anchors, seven services, team and local responsive images', async () => {
  const { SERVICES, TEAM } = await import('../lib/data.ts');
  const html = readFileSync(new URL('../dist/index.html', import.meta.url), 'utf8');
  for (const id of ['hero', 'servicios', 'elegirnos', 'equipo', 'contacto']) assert.ok(html.includes(`id="${id}"`), id);
  assert.equal(SERVICES.length, 7);
  assert.equal(TEAM.length, 3);
  for (const service of SERVICES) assert.ok(html.includes(service.title) && html.includes(service.description), service.title);
  for (const member of TEAM) assert.ok(html.includes(`LinkedIn de ${member.name}`) && html.includes(member.role), member.name);
  for (const asset of ['legoro-logo-400.avif', 'legoro-logo-400.webp']) assert.ok(html.includes(asset), asset);
});

test('opening preserves the original city photograph without decorative cards or portrait triptych', () => {
  const html = readFileSync(new URL('../dist/index.html', import.meta.url), 'utf8');
  const hero = html.match(/<section\b[^>]*id="hero"[^>]*>([\s\S]*?)<\/section>/)?.[1];
  assert.ok(hero);
  assert.ok(hero.includes('Eficiencia energética y seguridad eléctrica para tu proyecto.'));
  assert.ok(hero.includes('Diseñamos, dirigimos y ejecutamos instalaciones eléctricas, sistemas de energía y automatización. Trabajamos desde Mar del Plata en proyectos de la ciudad y otras localidades.'));
  for (const image of ['City_Background-sm.avif', 'City_Background-sm.webp', 'City_Background.avif', 'City_Background.webp']) assert.ok(hero.includes(image));
  assert.match(hero, /fetchpriority="high"/);
  assert.doesNotMatch(hero, /Retrato de|hero-team|QUICK_SERVICES/);
  assert.match(hero, /href="#contacto"/);
  assert.doesNotMatch(hero, /backdrop-blur|text-shadow|Habilitados para firmar/);
  for (const id of ['menu-open', 'mobile-menu']) assert.ok(html.includes(`id="${id}"`));
  assert.match(html, /aria-label="Navegación principal"/);
  const layout = readFileSync(new URL('../src/layouts/Layout.astro', import.meta.url), 'utf8');
  assert.equal((layout.match(/@fontsource-variable\//g) ?? []).length, 2);
});

test('services are grouped without dropping or duplicating any catalog entry', async () => {
  const { SERVICES } = await import('../lib/data.ts');
  const html = readFileSync(new URL('../dist/index.html', import.meta.url), 'utf8');
  const services = html.match(/<section\b[^>]*id="servicios"[^>]*>([\s\S]*?)<\/section>/)?.[1];
  assert.ok(services);
  assert.equal((services.match(/data-service-id=/g) ?? []).length, 7);
  assert.deepEqual([...services.matchAll(/data-service-id="([^"]+)"/g)].map((match) => match[1]).sort(), SERVICES.map(({ id }) => id).sort());
  for (const service of SERVICES) assert.ok(services.includes(service.title) && services.includes(service.description));

  const approach = html.match(/<section\b[^>]*id="elegirnos"[^>]*>([\s\S]*?)<\/section>/)?.[1];
  assert.ok(approach);
  assert.match(approach, /Mar del Plata/);
  assert.match(approach, /href="tel:\+5492235768622"/);
  assert.match(approach, /href="#equipo"/);
  assert.match(approach, /href="#contacto"/);
  assert.doesNotMatch(approach, /tiempo récord|calibrado anualmente|firma autorizada|<svg|0[1-4]/);
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
    ['Matías Rocca', 'Ingeniero Electromecánico'],
    ['Leandro González', 'Ingeniero Electromecánico'],
  ]);
  const team = html.match(/<section\b[^>]*id="equipo"[^>]*>([\s\S]*?)<\/section>/)?.[1];
  assert.ok(team);
  assert.doesNotMatch(team, /Técnico Electromecánico|Capital Intelectual|Equipo de Expertos/);
  assert.equal((team.match(/Ingeniero Electromecánico/g) ?? []).length, 3);
  for (const detail of [
    'Somos ingenieros electromecánicos de la Universidad Nacional de Mar del Plata.',
    'Trabajamos principalmente en Mar del Plata y acompañamos proyectos en otras localidades de la región.',
    'diseño y desarrollo de instalaciones eléctricas de baja tensión',
    'distribución de energía y diseño de tableros eléctricos industriales',
    'planificación de obras eléctricas en empresas multinacionales',
    'coordinación y dirección de equipos',
    'ejecución de obras eléctricas llave en mano',
  ]) assert.ok(team.includes(detail), detail);
  assert.equal((team.match(/<h3\b/g) ?? []).length, 3);
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

test('confirmed seven services are the only form options and UI copy avoids unsupported claims', async () => {
  const { SERVICES } = await import('../lib/data.ts');
  const { DEFAULT_SERVICE_ID } = await import('../lib/contactSchema.ts');
  const html = readFileSync(new URL('../dist/index.html', import.meta.url), 'utf8');
  const select = html.match(/<select\b[^>]*name="service_type"[^>]*>([\s\S]*?)<\/select>/)?.[1];
  assert.ok(select);
  assert.deepEqual([...select.matchAll(/<option\b[^>]*value="([^"]+)"/g)].map((match) => match[1]), [...SERVICES.map(({ id }) => id), 'otro']);
  assert.match(select, new RegExp(`<option[^>]*value="${DEFAULT_SERVICE_ID}"[^>]*selected`));
  assert.doesNotMatch(html, /24hs|24h|24 horas|a medida|habilitados para firmar|calibrado anualmente|tiempo récord|3 ingenieros|Capital Intelectual|Equipo de Expertos/i);
});

test('team cards keep each portrait, full name, role and LinkedIn together with an accessible heading', async () => {
  const { TEAM } = await import('../lib/data.ts');
  const html = readFileSync(new URL('../dist/index.html', import.meta.url), 'utf8');
  const team = html.match(/<section\b[^>]*id="equipo"[^>]*>([\s\S]*?)<\/section>/)?.[1];
  assert.ok(team);
  const cards = [...team.matchAll(/<article\b[^>]*data-team-member="([^"]+)"[^>]*>[\s\S]*?<\/article>/g)];
  assert.equal(cards.length, TEAM.length);
  for (const [index, member] of TEAM.entries()) {
    const card = cards[index][0];
    assert.equal(cards[index][1], member.name);
    assert.ok(card.includes(`aria-labelledby="member-${index}"`));
    assert.match(card, new RegExp(`<h3[^>]*id="member-${index}"[^>]*>${member.name}<\\/h3>`));
    assert.ok(card.includes(`alt="Retrato de ${member.name}"`) && card.includes(member.role));
    assert.ok(card.includes(`href="${member.linkedin}"`) && card.includes('LinkedIn'));
  }
});

test('contact heading keeps the exact natural word and disables intraword wrapping', () => {
  const html = readFileSync(new URL('../dist/index.html', import.meta.url), 'utf8');
  const heading = html.match(/<h2\b[^>]*id="contacto-heading"[^>]*>([\s\S]*?)<\/h2>/);
  assert.ok(heading);
  assert.equal(heading[1].trim(), 'Consultanos');
  assert.doesNotMatch(heading[0], /uppercase|italic|<wbr|<br|\u00ad/);
  const component = readFileSync(new URL('../src/components/Contacto.astro', import.meta.url), 'utf8');
  assert.match(component, /white-space: nowrap/);
  assert.match(component, /overflow-wrap: normal/);
  assert.match(component, /word-break: normal/);
  assert.match(component, /hyphens: none/);
});

test('compact footer preserves real brand and valid links without any map code', () => {
  const html = readFileSync(new URL('../dist/index.html', import.meta.url), 'utf8');
  const footer = html.match(/<footer\b[^>]*>([\s\S]*?)<\/footer>/)?.[1];
  assert.ok(footer);
  assert.ok(footer.includes(`© ${new Date().getFullYear()} LEGORO`));
  assert.match(footer, /footer-logo/);
  assert.match(footer, /aria-label="Enlaces del pie de página"/);
  for (const id of ['hero', 'servicios', 'elegirnos', 'equipo', 'contacto']) {
    assert.ok(footer.includes(`href="#${id}"`));
    assert.ok(html.includes(`id="${id}"`));
  }
  assert.match(footer, /href="\/privacidad\/"/);
  assert.doesNotMatch(footer, /<iframe|<template|Google Maps|footer-city-map|En esta página/);
  const source = readFileSync(new URL('../src/components/Footer.astro', import.meta.url), 'utf8');
  assert.doesNotMatch(source, /<script>|maps\.google|google\.com\/maps|mapURL|footer-location/);
  const privacy = readFileSync(new URL('../dist/privacidad/index.html', import.meta.url), 'utf8');
  assert.doesNotMatch(privacy, /Mapa de Google|Google Maps solo se carga/);
});
