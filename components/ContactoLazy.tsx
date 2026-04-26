'use client';

import dynamic from 'next/dynamic';

const Contacto = dynamic(() => import('@/components/Contacto'), { ssr: false });

export default function ContactoLazy() {
  return <Contacto />;
}
