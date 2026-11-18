export const LOGO_URL =
  'https://res.cloudinary.com/dc4vyurnu/image/upload/v1732289390/logo_farmapp_z0lidf.png';

export const site = {
  nombre: 'FarmApp',
  lema: 'Información farmacéutica al alcance de todos',
  descripcion:
    'Facilitamos el acceso a la información sobre medicamentos para mejorar tu bienestar y experiencia en salud.',
  canva: 'https://farmapp.my.canva.site/presentacion-farmapp',
  redes: {
    facebook: 'https://www.facebook.com/farmapp01',
    instagram: 'https://www.instagram.com/farmapp01',
    whatsapp: 'https://wa.link/a4pomp',
  },
  copyright: 'Proyecto realizado por CódigoX © 2024',
};

export type NavItem = { label: string; to: string };

export const navegacion: NavItem[] = [
  { label: 'Inicio', to: '/' },
  { label: 'Servicios', to: '/servicios' },
  { label: 'Feria', to: '/feria' },
  { label: 'Medicamentos', to: '/medicamentos' },
  { label: 'Blog', to: '/blog' },
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

export const accesos: Acceso[] = [
  {
    nombre: 'Medicamentos',
    imagen:
      'https://res.cloudinary.com/dc4vyurnu/image/upload/v1731731665/magnesium_t4bs8u.gif',
    to: '/medicamentos',
    descripcion: 'Explora nuestro catálogo y resuelve tus dudas.',
  },
  {
    nombre: 'Ubicaciones',
    imagen: 'https://res.cloudinary.com/dc4vyurnu/image/upload/v1731731664/map_n8kyht.gif',
    href: 'https://www.google.com/maps/search/droguerias/@4.1117911,-73.6418469,14z',
    descripcion: 'Encuentra las droguerías más cercanas en el mapa.',
  },
  {
    nombre: 'Farmacias',
    imagen: 'https://res.cloudinary.com/dc4vyurnu/image/upload/v1731731666/pharmacy_dzl5gc.gif',
    href: 'https://www.tiendeo.com.co/Tiendas/villavicencio/farmacias-droguerias-opticas',
    descripcion: 'Compara farmacias y droguerías de tu ciudad.',
  },
  {
    nombre: 'Órdenes médicas',
    imagen: 'https://res.cloudinary.com/dc4vyurnu/image/upload/v1731731667/ordenes_bzoct8.gif',
    to: '/contactos',
    descripcion: 'Resuelve tus dudas sobre órdenes y fórmulas médicas.',
  },
];
