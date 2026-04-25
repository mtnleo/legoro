'use client';

import { ChevronRight, Clock, Layout, Sun, Shield, Thermometer } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect } from 'react';

const QUICK_SERVICES = [
  { label: 'Instalaciones', sub: 'Tableros e iluminación.', icon: <Layout className="w-6 h-6" /> },
  { label: 'Energía Solar', sub: 'ON/OFF-GRID y Híbridos.', icon: <Sun className="w-6 h-6" /> },
  { label: 'Seguridad', sub: 'Puesta a tierra AEA.', icon: <Shield className="w-6 h-6" /> },
  { label: 'Termografía', sub: 'Detección de fallas.', icon: <Thermometer className="w-6 h-6" /> },
];

function scrollToContact() {
  document.querySelector('#contacto')?.scrollIntoView({ behavior: 'smooth' });
}

export default function Hero() {
  const [showMobileCta, setShowMobileCta] = useState(false);

  useEffect(() => {
    const handleScroll = () => setShowMobileCta(window.scrollY > 400);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <section
        id="hero"
        className="relative pt-32 pb-20 md:pt-60 md:pb-32 overflow-hidden border-b border-white/5"
      >
        {/* Background */}
        <div className="absolute inset-0 z-0">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: "url('/City_Background.png')" }}
          />
          <div className="absolute inset-0 bg-industrial-base/60 backdrop-blur-sm" />
          <div className="absolute inset-0 bg-linear-to-b from-industrial-base/20 via-transparent to-industrial-base" />
        </div>

        <div className="container mx-auto px-6 md:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row gap-12 md:gap-16 items-center">
            {/* Text column */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="lg:w-3/5 text-center lg:text-left"
            >
              <div className="flex flex-wrap justify-center lg:justify-start gap-2 md:gap-3 text-[9px] md:text-[10px] uppercase font-black text-industrial-accent tracking-[0.2em] md:tracking-[0.25em] mb-6 md:mb-8">
                <span className="bg-white/5 px-2 py-1 rounded border border-white/10 uppercase">Habilitados para firmar</span>
                <span className="bg-white/5 px-2 py-1 rounded border border-white/10 uppercase">Mar del Plata</span>
                <span className="bg-white/5 px-2 py-1 rounded border border-white/10 uppercase">Seguridad Eléctrica</span>
              </div>

              <h1 className="text-[clamp(3.36rem,7.2vw,6rem)] font-jakarta font-extrabold text-white leading-[1.1] tracking-[-0.02em] mb-6 md:mb-10 uppercase italic">
                El futuro{' '}
                <span
                  className="text-industrial-accent"
                  style={{ textShadow: '0 0 20px rgba(176, 190, 197, 0.5), 0 0 40px rgba(176, 190, 197, 0.2)' }}
                >
                  eléctrico,
                </span>{' '}
                <br />
                hoy en tu proyecto.
              </h1>

              <p className="text-[clamp(1rem,2vw,1.25rem)] font-jakarta font-normal text-white/80 mb-10 md:mb-14 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Mediciones, instalaciones y energía solar. Soluciones técnicas certificadas para cada escala.
              </p>

              <div className="flex flex-col sm:flex-row justify-center lg:justify-start items-center gap-6 md:gap-8">
                <button
                  onClick={scrollToContact}
                  className="w-full sm:w-auto bg-industrial-accent text-industrial-base px-10 md:px-14 py-4 md:py-6 rounded-2xl font-black text-lg md:text-xl btn-hover-effect shadow-[0_20px_50px_rgba(176,184,195,0.2)] flex items-center justify-center gap-3 group"
                >
                  PRESUPUESTÁ
                  <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                </button>
                <div className="flex items-center gap-3 opacity-60">
                  <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-industrial-accent" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest italic">Respuesta en 24hs</span>
                </div>
              </div>
            </motion.div>

            {/* Quick service cards */}
            <div className="lg:w-[45%] w-[85%] mx-auto lg:mx-0 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {QUICK_SERVICES.map((item, i) => (
                <div
                  key={i}
                  className="bg-industrial-surface/80 backdrop-blur-sm p-6 rounded-3xl border border-white/5 hover:border-industrial-accent/40 transition-all group"
                >
                  <div className="text-industrial-accent mb-4 group-hover:scale-110 transition-transform origin-left">
                    {item.icon}
                  </div>
                  <h3 className="font-black text-xs md:text-sm uppercase mb-1">{item.label}</h3>
                  <p className="text-[10px] opacity-50 leading-tight">{item.sub}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Mobile sticky CTA */}
      <AnimatePresence>
        {showMobileCta && (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-60 w-[90%]"
          >
            <button
              onClick={scrollToContact}
              className="flex w-full bg-industrial-accent text-industrial-base text-center py-5 rounded-2xl font-black shadow-2xl border-2 border-white/10 items-center justify-center gap-2 active:scale-95 transition-transform"
            >
              PRESUPUESTÁ AHORA
              <ChevronRight className="w-6 h-6" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
