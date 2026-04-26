import { ExternalLink, Zap } from 'lucide-react';
import { TEAM } from '@/lib/data';

export default function Equipo() {
  return (
    <section id="equipo" className="py-24 md:py-32 bg-white/2 border-y border-white/5">
      <div className="container mx-auto px-6 md:px-8">
        <div className="text-center mb-20">
          <h4 className="text-xs uppercase font-black tracking-[0.5em] text-industrial-accent mb-4 font-title">
            Capital Intelectual
          </h4>
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter font-display uppercase italic">
            Nuestro Equipo de Expertos
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {TEAM.map((member, idx) => (
            <div
              key={idx}
              className="bg-industrial-surface rounded-4xl overflow-hidden border border-white/5 hover:border-industrial-accent hover:-translate-y-2.5 transition-all duration-300 group flex flex-col items-center"
            >
              <div className="w-full aspect-4/3 bg-industrial-navy/50 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-linear-to-t from-industrial-base to-transparent opacity-60 z-10" />
                <span className="text-6xl font-black opacity-10 group-hover:scale-110 transition-transform duration-700">
                  {member.name.split(' ').map((n) => n[0]).join('')}
                </span>
                <div className="absolute bottom-6 left-6 z-20">
                  <Zap className="w-6 h-6 text-industrial-accent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>

              <div className="p-8 text-center w-full">
                <h4 className="text-xl font-black tracking-tight mb-1">
                  {member.name.split(' ')[0]}
                  <br />
                  {member.name.split(' ').slice(1).join(' ')}
                </h4>
                <p className="text-xs font-bold uppercase tracking-widest text-industrial-accent opacity-70">
                  {member.role}
                </p>
                <div className="mt-6 flex justify-center gap-4">
                  <a
                    aria-label={`LinkedIn de ${member.name}`}
                    href={member.linkedin}
                    className="p-2 bg-white/5 rounded-full hover:bg-industrial-accent hover:text-industrial-base transition-all"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
