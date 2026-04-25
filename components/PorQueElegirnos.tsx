import { CheckCircle2, Zap } from 'lucide-react';

const FEATURES = [
  {
    title: 'Habilitados',
    desc: 'Ingenieros con firma autorizada para proyectos y certificaciones técnicas.',
  },
  {
    title: 'Tecnología',
    desc: 'Equipamiento de diagnóstico calibrado anualmente.',
  },
  {
    title: 'A Medida',
    desc: 'Analizamos cada proyecto desde cero para ahorrar costos.',
  },
  {
    title: 'Rapidez',
    desc: 'Despacho de personal técnico en tiempo récord.',
  },
];

export default function PorQueElegirnos() {
  return (
    <section id="elegirnos" className="py-24 md:py-32 bg-industrial-base relative z-10">
      <div className="container mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div>
            <h2 className="text-3xl md:text-5xl font-black mb-12 tracking-tighter font-display uppercase italic">
              ¿Por qué LEGORO?
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {FEATURES.map((item, idx) => (
                <div key={idx} className="space-y-3">
                  <div className="w-8 h-8 rounded bg-industrial-accent/10 flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-industrial-accent" />
                  </div>
                  <h4 className="font-black text-sm uppercase tracking-wider">{item.title}</h4>
                  <p className="text-[11px] text-gray-500 leading-relaxed font-medium">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="aspect-square glass rounded-[60px] flex items-center justify-center p-20">
              <div className="text-center relative">
                <Zap className="w-32 h-32 text-industrial-accent mx-auto mb-4 opacity-20 absolute -top-16 -left-16" />
                <span className="text-9xl font-black tracking-tighter opacity-10">LR</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
