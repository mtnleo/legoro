import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Servicios from '@/components/Servicios';
import PorQueElegirnos from '@/components/PorQueElegirnos';
import Equipo from '@/components/Equipo';
import Contacto from '@/components/Contacto';
import Footer from '@/components/Footer';

export default function Page() {
  return (
    <div className="min-h-screen bg-industrial-base text-industrial-light selection:bg-industrial-accent selection:text-industrial-base">
      <Navbar />
      <main>
        <Hero />
        <Servicios />
        <PorQueElegirnos />
        <Equipo />
        <Contacto />
      </main>
      <Footer />
    </div>
  );
}
