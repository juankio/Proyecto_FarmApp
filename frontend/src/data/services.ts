export type Service = { title: string; description: string; icon: string };

export const services: Service[] = [
  { title: 'Comparador de Precios', description: 'Compara precios en tiempo real entre droguerías de Villavicencio y ahorra en cada compra.', icon: 'pill' },
  { title: 'Droguerías Cercanas', description: 'Ubica farmacias de turno 24 horas y droguerías con entrega a domicilio en tu barrio.', icon: 'pin' },
  { title: 'Alertas de Receta Médica', description: 'Identifica con claridad qué medicamentos requieren prescripción médica obligatoria y cuáles son de venta libre.', icon: 'spark' },
  { title: 'Afiliación para Droguerías', description: 'Plataforma para que farmacias de Villavicencio publiquen su stock, destaquen sus ofertas y aumenten sus ventas.', icon: 'mega' },
  { title: 'Pedidos Directos por WhatsApp', description: 'Conecta al instante con el WhatsApp de la droguería seleccionada para pedir tu domicilio.', icon: 'chat' },
];
