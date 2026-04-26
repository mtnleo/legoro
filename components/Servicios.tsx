import { Zap, Cpu, Shield, Thermometer, Layout, Sun, Battery } from 'lucide-react';
import { SERVICES } from '@/lib/data';

const ICON_MAP: Record<string, React.ReactNode> = {
  Zap:         <Zap         className="w-8 h-8 text-industrial-accent group-hover:text-industrial-base transition-colors" />,
  Cpu:         <Cpu         className="w-8 h-8 text-industrial-accent group-hover:text-industrial-base transition-colors" />,
  Shield:      <Shield      className="w-8 h-8 text-industrial-accent group-hover:text-industrial-base transition-colors" />,
  Thermometer: <Thermometer className="w-8 h-8 text-industrial-accent group-hover:text-industrial-base transition-colors" />,
  Layout:      <Layout      className="w-8 h-8 text-industrial-accent group-hover:text-industrial-base transition-colors" />,
  Sun:         <Sun         className="w-8 h-8 text-industrial-accent group-hover:text-industrial-base transition-colors" />,
  Battery:     <Battery     className="w-8 h-8 text-industrial-accent group-hover:text-industrial-base transition-colors" />,
};

export default function Servicios() {
  return (
    <section
      id="servicios"
      className="py-24 md:py-32 relative bg-industrial-navy shadow-[inset_0_20px_40px_rgba(0,0,0,0.3)]"
    >
      <div className="container-fluid mx-auto px-6 md:px-12 max-w-[1600px]">
        <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
          <div className="max-w-2xl">
            <h2 className="text-sm font-black uppercase text-industrial-accent tracking-[0.4em] mb-4 font-title">
              Nuestra Especialidad
            </h2>
            <h3 className="text-4xl md:text-6xl font-black tracking-tighter leading-none font-display uppercase italic">
              Servicios para una infraestructura resiliente.
            </h3>
          </div>
          <a
            href="#contacto"
            className="text-industrial-accent border-b-2 border-industrial-accent font-bold text-xs uppercase tracking-widest pb-1 hover:opacity-70 transition-opacity"
          >
            Consultar catálogo completo
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {SERVICES.map((service) => (
            <div
              key={service.id}
              className="bg-industrial-surface p-10 rounded-[40px] border border-white/5 hover:bg-industrial-accent group transition-all duration-500"
            >
              <div className="mb-10 transform group-hover:scale-110 duration-500 origin-left">
                {ICON_MAP[service.iconName]}
              </div>
              <h3 className="text-xl font-black mb-4 tracking-tight group-hover:text-industrial-base transition-colors">
                {service.title}
              </h3>
              <p className="text-gray-400 group-hover:text-industrial-base/80 leading-relaxed text-xs transition-colors font-medium">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
