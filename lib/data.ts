export interface Service {
  id: string;
  title: string;
  description: string;
}

export interface TeamMember {
  name: string;
  role: string;
  linkedin: string;
}

export const SERVICES: Service[] = [
  {
    id: 'instalaciones-electricas',
    title: 'Instalaciones eléctricas',
    description: 'Diseño, dirección y ejecución de instalaciones eléctricas residenciales, comerciales e industriales.',
  },
  {
    id: 'auditoria-energetica',
    title: 'Auditoría energética',
    description: 'Gestión de consumos, optimización energética y análisis de facturación eléctrica.',
  },
  {
    id: 'energias-renovables',
    title: 'Energías renovables',
    description: 'Diseño e implementación de sistemas fotovoltaicos.',
  },
  {
    id: 'continuidad-servicio',
    title: 'Continuidad de servicio',
    description: 'Diseño e instalación de sistemas de respaldo para cargas críticas.',
  },
  {
    id: 'mantenimiento-preventivo',
    title: 'Mantenimiento preventivo',
    description: 'Relevamiento de instalaciones industriales y comerciales para la detección temprana de fallas.',
  },
  {
    id: 'automatizacion-control',
    title: 'Automatización y control',
    description: 'Programación de PLC y desarrollo de automatismos industriales.',
  },
  {
    id: 'consultoria-electrica',
    title: 'Consultoría eléctrica',
    description: 'Asesoramiento técnico para evaluar instalaciones, analizar alternativas y orientar decisiones sobre proyectos eléctricos.',
  },
];

export const TEAM: TeamMember[] = [
  {
    name: 'Ezequiel Leonardi',
    role: 'Ingeniero Electromecánico',
    linkedin: 'https://www.linkedin.com/in/ezequiel-leonardi/',
  },
  {
    name: 'Matías Rocca',
    role: 'Ingeniero Electromecánico',
    linkedin: 'https://www.linkedin.com/in/matias-rocca-a89465266/',
  },
  {
    name: 'Leandro González',
    role: 'Ingeniero Electromecánico',
    linkedin: 'https://www.linkedin.com/in/leandro-gonzalez-753327274/',
  },
];
