import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const readBuilt = (path: string) => readFileSync(new URL(`../dist/${path}`, import.meta.url), 'utf8');

test('sitemap lists exactly the two production indexable canonical URLs', () => {
  const xml = readBuilt('sitemap.xml');
  assert.match(xml, /<urlset xmlns="http:\/\/www\.sitemaps\.org\/schemas\/sitemap\/0\.9">/);
  assert.deepEqual([...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]), [
    'https://legoro.pages.dev/',
    'https://legoro.pages.dev/privacidad/',
  ]);
  assert.doesNotMatch(xml, /lastmod|changefreq|priority|404|google09|localhost|127\.0\.0\.1/);
});

test('robots permits crawling and points to the absolute production sitemap', () => {
  assert.equal(readBuilt('robots.txt'), 'User-agent: *\nAllow: /\n\nSitemap: https://legoro.pages.dev/sitemap.xml\n');
});

test('indexable pages use production canonicals while 404 is not indexable', () => {
  for (const [path, canonical] of [
    ['index.html', 'https://legoro.pages.dev/'],
    ['privacidad/index.html', 'https://legoro.pages.dev/privacidad/'],
  ]) {
    const html = readBuilt(path);
    assert.equal((html.match(/rel="canonical"/g) ?? []).length, 1);
    assert.ok(html.includes(`rel="canonical" href="${canonical}"`));
    assert.doesNotMatch(html, /<meta[^>]+(?:noindex|nofollow)/i);
  }
  const missing = readBuilt('404.html');
  assert.doesNotMatch(missing, /rel="canonical"/);
  assert.match(missing, /<meta name="robots" content="noindex"/);
});

test('Google verification file stays byte-for-byte unchanged in the build', () => {
  assert.equal(readBuilt('google09c20390fc216e0b.html'), 'google-site-verification: google09c20390fc216e0b.html');
});
