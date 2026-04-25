import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="py-12 border-t border-white/5 opacity-50 text-[10px] uppercase font-black tracking-widest leading-loose">
      <div className="container mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-8">
        <div>© 2026 LEGORO • MAR DEL PLATA, ARGENTINA</div>
        <div className="flex gap-10">
          <span className="hover:text-industrial-accent cursor-pointer transition-colors">POLÍTICA DE PRIVACIDAD</span>
          <span className="hover:text-industrial-accent cursor-pointer transition-colors">TÉRMINOS TÉCNICOS</span>
        </div>
        <div className="flex items-center gap-4">
          <Image
            src="/LEGORO LOGO NO Background .png"
            alt="LEGORO Logo"
            width={80}
            height={32}
            className="h-8 w-auto opacity-40 grayscale hover:grayscale-0 hover:opacity-100 transition-all object-contain"
          />
        </div>
      </div>
    </footer>
  );
}
