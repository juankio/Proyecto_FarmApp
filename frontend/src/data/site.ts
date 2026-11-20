export const LOGO_URL =
  'https://res.cloudinary.com/dc4vyurnu/image/upload/v1732289390/logo_farmapp_z0lidf.png';

export const site = {
  nombre: 'FarmApp',
  lema: 'Encuentra medicamentos al mejor precio y más cerca de ti en Villavicencio',
  descripcion:
    'Compara precios de medicamentos entre droguerías de Villavicencio, consulta disponibilidad y localiza la farmacia más cercana a tu barrio.',
  canva: 'https://farmapp.my.canva.site/presentacion-farmapp',
  redes: {
    facebook: 'https://www.facebook.com/farmapp01',
    instagram: 'https://www.instagram.com/farmapp01',
    whatsapp: 'https://wa.link/a4pomp',
  },
  copyright: 'FarmApp Villavicencio © 2026',
};

export type NavItem = { label: string; to: string };

export const navegacion: NavItem[] = [
  { label: 'Inicio', to: '/' },
  { label: 'Medicamentos', to: '/medicamentos' },
  { label: 'Droguerías', to: '/ubicaciones' },
  { label: 'Servicios', to: '/servicios' },
  { label: 'Nosotros', to: '/informacion' },
  { label: 'Contacto', to: '/contactos' },
];

export type Acceso = {
  nombre: string;
  imagen: string;
  descripcion: string;
  to?: string;
  href?: string;
};

export type CanalContacto = {
  titulo: string;
  texto: string;
  href: string;
};

export const canalesContacto: CanalContacto[] = [
  { titulo: 'WhatsApp', texto: 'Respuesta rápida en horario laboral.', href: site.redes.whatsapp },
  { titulo: 'Instagram', texto: '@farmapp01', href: site.redes.instagram },
  { titulo: 'Facebook', texto: 'FarmApp', href: site.redes.facebook },
];

export const accesos: Acceso[] = [
  {
    nombre: 'Comparar Medicamentos',
    imagen:
      'https://res.cloudinary.com/dc4vyurnu/image/upload/v1731731665/magnesium_t4bs8u.gif',
    to: '/medicamentos',
    descripcion: 'Compara precios, presentaciones y requisitos de receta médica.',
  },
  {
    nombre: 'Droguerías en Villavicencio',
    imagen: 'https://res.cloudinary.com/dc4vyurnu/image/upload/v1731731664/map_n8kyht.gif',
    to: '/ubicaciones',
    descripcion: 'Encuentra las droguerías más cercanas y abiertas 24h en tu barrio.',
  },
  {
    nombre: 'Afiliación y Servicios',
    imagen: 'https://res.cloudinary.com/dc4vyurnu/image/upload/v1731731666/pharmacy_dzl5gc.gif',
    to: '/servicios',
    descripcion: 'Planes de suscripción y visibilidad para droguerías locales.',
  },
  {
    nombre: 'Atención y Consultas',
    imagen: 'https://res.cloudinary.com/dc4vyurnu/image/upload/v1731731667/ordenes_bzoct8.gif',
    to: '/contactos',
    descripcion: 'Orientación farmacéutica y canales directos de WhatsApp.',
  },
];
