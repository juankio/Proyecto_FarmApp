export type ValorInformacion = {
  titulo: string;
  texto: string;
};

export const valores: ValorInformacion[] = [
  { titulo: 'Información confiable', texto: 'Fuentes verificadas y actualizadas sobre medicamentos.' },
  { titulo: 'Cercanía', texto: 'Conectamos personas con droguerías y farmacias de su zona.' },
  { titulo: 'Comunidad', texto: 'Impulsamos emprendimientos locales y el comercio de barrio.' },
];

export const texto =
  'Este proyecto comenzó con una simple idea: crear una solución innovadora que responda a una necesidad real en el mercado. Desde el principio sabíamos que había una oportunidad para mejorar la forma en que las personas acceden a la información y los servicios que realmente importan. Fue esta convicción la que nos motivó a embarcarnos en esta aventura, con el objetivo de marcar una diferencia significativa. La decisión de llevar a cabo este proyecto no fue tomada a la ligera. Después de muchas conversaciones, investigaciones y análisis de mercado, identificamos que había una gran demanda sin satisfacer. Queríamos crear algo que no solo resolviera un problema inmediato, sino que también tuviera un impacto duradero y positivo en las personas y en los negocios involucrados. Así nació la idea que hoy estamos materializando. A lo largo de este proceso hemos dedicado innumerables horas de trabajo y esfuerzo. Ha sido un viaje lleno de desafíos, pero también de grandes aprendizajes. Cada miembro del equipo ha aportado sus habilidades y pasión para hacer de este proyecto una realidad. Sabemos que aún queda mucho por hacer, pero el progreso que hemos logrado hasta ahora es un reflejo del compromiso y la dedicación que hemos puesto en cada etapa del desarrollo. Hemos trabajado arduamente para construir algo que realmente funcione y que sea relevante para los usuarios. Este proyecto no solo es el resultado de una idea, sino del trabajo conjunto, la perseverancia y la voluntad de superar obstáculos. Creemos firmemente que el esfuerzo invertido valdrá la pena y que estamos construyendo algo que tendrá un impacto significativo.';

export const informacionTexto = texto;
export const informacion = { texto, valores };

export default informacion;