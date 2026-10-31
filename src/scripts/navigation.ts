export {};
const header = document.querySelector<HTMLElement>('#site-header')!;
const menu = document.querySelector<HTMLElement>('#mobile-menu')!;
const opener = document.querySelector<HTMLButtonElement>('#menu-open')!;
let menuOpen = false;
let previousOverflow = '';
function closeMenu(restoreFocus = true) {
  menuOpen = false;
  menu.hidden = true;
  opener.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = previousOverflow;
  if (restoreFocus) opener.focus();
}
opener.addEventListener('click', () => {
  previousOverflow = document.body.style.overflow;
  menuOpen = true;
  menu.hidden = false;
  document.body.style.overflow = 'hidden';
  opener.setAttribute('aria-expanded', 'true');
  menu.querySelector<HTMLButtonElement>('button')?.focus();
});
menu.querySelectorAll<HTMLElement>('[data-menu-close]').forEach(control => {
  control.addEventListener('click', () => {
    const isLink = control instanceof HTMLAnchorElement;
    closeMenu(!isLink);
    if (isLink) {
      const target = document.querySelector<HTMLElement>(control.hash);
      if (target) { target.tabIndex = -1; target.focus({ preventScroll: true }); }
    }
  });
});
menu.addEventListener('keydown', event => {
  if (event.key === 'Escape') { event.preventDefault(); closeMenu(); }
  if (event.key !== 'Tab') return;
  const focusable = Array.from(menu.querySelectorAll<HTMLElement>('button, a[href]'));
  const first = focusable[0], last = focusable.at(-1);
  if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
  else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
});
const desktop = window.matchMedia('(min-width: 768px)');
desktop.addEventListener('change', () => { if (desktop.matches && menuOpen) closeMenu(); });
function onScroll() {
  const scrolled = window.scrollY > 20;
  header.classList.toggle('is-scrolled', scrolled);
  header.classList.toggle('glass', scrolled);
}
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();
