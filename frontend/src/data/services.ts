export type Service = { title: string; description: string; icon: string };

const pill = '<rect x="2.8" y="8" width="18.4" height="8" rx="4" transform="rotate(-35 12 12)"/><path d="M12 5.5v13"/>';
const pin = '<path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="3"/>';
const spark = '<path d="m12 3 2.2 6.8L21 12l-6.8 2.2L12 21l-2.2-6.8L3 12l6.8-2.2L12 3Z"/>';
const mega = '<path d="M3 11v2a2 2 0 0 0 2 2h2l6 4V5L7 9H5a2 2 0 0 0-2 2Z"/><path d="M17 9a4 4 0 0 1 0 6"/>';
const chat = '<path d="M21 12a8 8 0 0 1-8 8H7l-4 3 1-5a8 8 0 1 1 17-6Z"/><path d="M9 12h.01M13 12h.01M17 12h.01"/>';

export const services: Service[] = [
  { title: 'Información sobre Medicamentos', description: 'Encuentra información detallada sobre diferentes medicamentos en un solo lugar.', icon: pill },
  { title: 'Localización de Droguerías', description: 'Ubica las droguerías más cercanas con geolocalización en tiempo real.', icon: pin },
  { title: 'Recomendaciones Personalizadas', description: 'Obtén sugerencias basadas en tus necesidades de salud.', icon: spark },
  { title: 'Publicidad para Droguerías', description: 'Promociona tus productos y servicios con espacios publicitarios.', icon: mega },
  { title: 'Consultas Directas', description: 'Contacta a profesionales de la salud para resolver tus dudas.', icon: chat },
];
