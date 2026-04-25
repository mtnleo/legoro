export interface Service {
  id: string;
  title: string;
  description: string;
  iconName: string;
}

export interface TeamMember {
  name: string;
  role: string;
  linkedin: string;
}

export const SERVICES: Service[] = [
  {
    id: 'puesta-tierra',
    title: 'Medición de puesta a tierra',
    description: 'Verificación técnica normativa para garantizar la seguridad de las instalaciones.',
    iconName: 'Zap',
  },
  {
    id: 'masas',
    title: 'Continuidad de las masas',
    description: 'Ensayos de seguridad eléctrica según reglamentación vigente AEA.',
    iconName: 'Cpu',
  },
  {
    id: 'diferenciales',
    title: 'Prueba de interruptores diferenciales',
    description: 'Diagnóstico preciso del tiempo y corriente de disparo de protecciones.',
    iconName: 'Shield',
  },
  {
    id: 'termografia',
    title: 'Relevamiento termográfico',
    description: 'Detección temprana de puntos calientes en tableros eléctricos sin interrupción.',
    iconName: 'Thermometer',
  },
  {
    id: 'diseño',
    title: 'Diseño de instalaciones',
    description: 'Proyectos eléctricos residenciales, comerciales e industriales a medida.',
    iconName: 'Layout',
  },
  {
    id: 'factor-potencia',
    title: 'Corrección de factor de potencia',
    description: 'Optimización del consumo y eliminación de multas por energía reactiva.',
    iconName: 'Zap',
  },
  {
    id: 'on-grid',
    title: 'Sistemas Fotovoltaicos ON-GRID',
    description: 'Ahorro energético inyectando excedentes a la red pública.',
    iconName: 'Sun',
  },
  {
    id: 'off-grid',
    title: 'Sistemas Fotovoltaicos OFF-GRID',
    description: 'Independencia energética total para zonas sin red eléctrica.',
    iconName: 'Battery',
  },
  {
    id: 'hibridos',
    title: 'Sistemas solares híbridos',
    description: 'Lo mejor de ambos mundos: ahorro con red y respaldo con baterías.',
    iconName: 'Sun',
  },
];

export const TEAM: TeamMember[] = [
  {
    name: 'Ezequiel Leonardi',
    role: 'Ingeniero Electromecánico',
    linkedin: '#',
  },
  {
    name: 'Matías Rocca',
    role: 'Ingeniero Electromecánico',
    linkedin: '#',
  },
  {
    name: 'Juan Pedro González',
    role: 'Ingeniero Electromecánico',
    linkedin: '#',
  },
];
