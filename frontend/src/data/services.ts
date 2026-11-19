export type Service = { title: string; description: string; icon: string };


export const services: Service[] = [
  { title: 'Información sobre Medicamentos', description: 'Encuentra información detallada sobre diferentes medicamentos en un solo lugar.', icon: 'pill' },
  { title: 'Localización de Droguerías', description: 'Ubica las droguerías más cercanas con geolocalización en tiempo real.', icon: 'pin' },
  { title: 'Recomendaciones Personalizadas', description: 'Obtén sugerencias basadas en tus necesidades de salud.', icon: 'spark' },
  { title: 'Publicidad para Droguerías', description: 'Promociona tus productos y servicios con espacios publicitarios.', icon: 'mega' },
  { title: 'Consultas Directas', description: 'Contacta a profesionales de la salud para resolver tus dudas.', icon: 'chat' },
];
