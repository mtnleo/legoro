import { CheckCircle2, Cpu, Layout, Zap } from 'lucide-react';

const FEATURES = [
  {
    title: 'Ingenieros habilitados para firmar proyectos',
    desc: 'Ingenieros con firma autorizada para certificaciones.',
    icon: <CheckCircle2 className="w-6 h-6 text-industrial-accent" />,
  },
  {
    title: 'Tecnología',
    desc: 'Equipamiento de diagnóstico calibrado anualmente.',
    icon: <Cpu className="w-6 h-6 text-industrial-accent" />,
  },
  {
    title: 'A Medida',
    desc: 'Analizamos cada proyecto desde cero para ahorrar costos.',
    icon: <Layout className="w-6 h-6 text-industrial-accent" />,
  },
  {
    title: 'Rapidez',
    desc: 'Despacho de personal técnico en tiempo récord.',
    icon: <Zap className="w-6 h-6 text-industrial-accent" />,
  },
];

export default function PorQueElegirnos() {
  return (
    <section id="elegirnos" className="py-24 md:py-32 bg-industrial-base relative z-10">
      <div className="container mx-auto px-6 md:px-12">
        <div className="mb-16">
          <h2 className="text-3xl md:text-5xl font-black mb-4 tracking-tighter font-display uppercase italic">
            Por qué elegirnos
          </h2>
          <p className="text-white/60 text-lg font-jakarta font-normal">
            Experiencia técnica real, compromiso con cada proyecto.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {FEATURES.map((item, idx) => (
            <div
              key={idx}
              className="relative overflow-hidden p-8 rounded-3xl border border-industrial-accent/15 bg-white/5 hover:border-industrial-accent/40 transition-all duration-300 hover:-translate-y-1 group"
            >
              <div className="absolute right-4 bottom-4 text-[8rem] font-black opacity-[0.06] select-none pointer-events-none font-display leading-none">
                0{idx + 1}
              </div>

              <div className="relative z-10">
                <div className="w-14 h-14 rounded-full bg-industrial-accent/15 flex items-center justify-center mb-6 text-industrial-accent">
                  {item.icon}
                </div>
                <h3 className="font-jakarta font-bold text-[1.1rem] text-white mb-2">{item.title}</h3>
                <p className="font-jakarta font-normal text-white/70 leading-relaxed text-sm md:text-base">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
