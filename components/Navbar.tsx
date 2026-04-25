'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Menu, X, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const NAV_ITEMS = [
  { name: 'SERVICIOS', href: '#servicios' },
  { name: 'ELEGIRNOS', href: '#elegirnos' },
  { name: 'EQUIPO', href: '#equipo' },
  { name: 'CONTACTO', href: '#contacto' },
];

function scrollTo(href: string) {
  const el = document.querySelector(href);
  el?.scrollIntoView({ behavior: 'smooth' });
}

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 flex items-center ${
        isScrolled ? 'h-20 glass py-2' : 'h-28 bg-transparent py-4'
      }`}
    >
      <nav className="w-full px-6 md:px-8 flex items-center justify-between gap-4">
        {/* Logo */}
        <div className="flex items-center flex-1">
          <Image
            src="/LEGORO LOGO NO Background .png"
            alt="LEGORO Logo"
            width={200}
            height={80}
            className={`transition-all duration-300 object-contain ${
              isScrolled ? 'h-10 md:h-12 w-auto' : 'h-14 md:h-20 w-auto'
            }`}
            priority
          />
        </div>

        {/* Desktop pill nav */}
        <div className="hidden md:flex items-center justify-center shrink-0">
          <div className="bg-white/5 border border-white/10 rounded-full px-6 py-2.5 backdrop-blur-md">
            <div className="flex items-center gap-8 text-xs font-black uppercase tracking-[0.25em] opacity-80">
              {NAV_ITEMS.map((item) => (
                <button
                  key={item.href}
                  onClick={() => scrollTo(item.href)}
                  className="hover:text-industrial-accent hover:tracking-wide transition-all duration-300"
                >
                  {item.name.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Desktop CTA + Mobile hamburger */}
        <div className="flex-1 flex justify-end items-center">
          <button
            onClick={() => scrollTo('#contacto')}
            className="hidden md:flex bg-industrial-accent text-industrial-base px-8 py-3 rounded-full font-bold text-[10px] uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl shadow-industrial-accent/20"
          >
            Presupuestá
          </button>

          <button
            className="md:hidden p-3 bg-white/5 border border-white/10 rounded-2xl flex-shrink-0"
            onClick={() => { setIsMenuOpen(true); window.dispatchEvent(new CustomEvent('legoro:menustate', { detail: true })); }}
          >
            <Menu className="w-6 h-6 text-industrial-accent" />
          </button>
        </div>
      </nav>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-50 bg-industrial-base/95 backdrop-blur-2xl h-screen flex flex-col p-8"
          >
            <div className="flex justify-between items-center mb-16">
              <Image
                src="/LEGORO LOGO NO Background .png"
                alt="LEGORO Logo"
                width={120}
                height={40}
                className="h-10 w-auto object-contain"
              />
              <button
                onClick={() => { setIsMenuOpen(false); window.dispatchEvent(new CustomEvent('legoro:menustate', { detail: false })); }}
                className="p-3 bg-white/5 border border-white/10 rounded-2xl"
              >
                <X className="w-6 h-6 text-industrial-accent" />
              </button>
            </div>

            <div className="flex flex-col gap-2">
              {NAV_ITEMS.map((item) => (
                <button
                  key={item.href}
                  onClick={() => { scrollTo(item.href); setIsMenuOpen(false); }}
                  className="text-3xl font-black italic tracking-tighter py-6 border-b border-white/5 flex justify-between items-center group transition-all text-left"
                >
                  {item.name}
                  <ChevronRight className="w-6 h-6 text-industrial-accent opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all" />
                </button>
              ))}
            </div>

            <div className="mt-auto">
              <button
                onClick={() => { scrollTo('#contacto'); setIsMenuOpen(false); }}
                className="block w-full bg-industrial-accent text-industrial-base text-center py-5 text-xl font-black rounded-2xl shadow-2xl shadow-industrial-accent/20 active:scale-[0.98] transition-transform"
              >
                PRESUPUESTÁ AHORA
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
