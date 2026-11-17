export type Pregunta = { pregunta: string; respuesta: string };
export type GrupoFaq = { titulo: string; preguntas: Pregunta[] };

export const faq: GrupoFaq[] = [
  {
    titulo: 'Funcionalidades de la app',
    preguntas: [
      {
        pregunta: '¿Qué es FarmApp y cómo funciona?',
        respuesta:
          'FarmApp es una aplicación diseñada para ofrecer información básica sobre medicamentos y ayudar a los usuarios a encontrar las droguerías más cercanas. A través de su buscador, puedes consultar un vademécum de medicamentos y recibir recomendaciones sobre qué producto puede ser adecuado para ti. Además, te mostramos un mapa interactivo con las droguerías cercanas, para que puedas adquirir tus productos de manera más fácil.',
      },
      {
        pregunta: '¿Puedo obtener una receta médica a través de FarmApp?',
        respuesta:
          'No, FarmApp no ofrece recetas médicas. Nuestro objetivo es proporcionar información básica sobre medicamentos y droguerías. Te recomendamos siempre consultar a un médico para obtener un diagnóstico y una receta adecuada.',
      },
      {
        pregunta: '¿Cómo encuentro las droguerías más cercanas a mí?',
        respuesta:
          'FarmApp utiliza tu ubicación para mostrarte un mapa con las droguerías más cercanas. Solo necesitas activar los servicios de localización en tu dispositivo y acceder a la sección de "Droguerías cercanas" dentro de la app para ver las opciones disponibles.',
      },
      {
        pregunta: '¿FarmApp vende medicamentos directamente?',
        respuesta:
          'No, FarmApp no vende medicamentos directamente. La app solo recomienda droguerías cercanas donde puedes adquirir los productos. Nuestro objetivo es facilitar el proceso de encontrar medicamentos y droguerías en tu área.',
      },
      {
        pregunta: '¿Es seguro seguir las recomendaciones de medicamentos que ofrece la app?',
        respuesta:
          'La información que ofrece FarmApp está basada en fuentes confiables como un vademécum de medicamentos, pero no sustituye el consejo de un médico. Siempre debes consultar a un profesional de la salud antes de tomar cualquier medicamento o seguir nuestras recomendaciones.',
      },
    ],
  },
  {
    titulo: 'Detalles y características específicas',
    preguntas: [
      {
        pregunta: '¿Cómo se actualiza la información sobre medicamentos en FarmApp?',
        respuesta:
          'La base de datos de medicamentos en FarmApp se actualiza periódicamente a través de fuentes confiables y de actualizaciones proporcionadas por profesionales de la salud y farmacéuticos. Esto nos permite mantener información precisa y actualizada para nuestros usuarios.',
      },
      {
        pregunta: '¿Qué tipo de publicidad puedo ver en FarmApp?',
        respuesta:
          'La publicidad en FarmApp está relacionada con servicios y productos farmacéuticos. Droguerías locales pueden anunciarse en la app, y los espacios publicitarios están diseñados para no interferir con la experiencia del usuario, sino para ofrecer opciones relevantes de compra.',
      },
      {
        pregunta: '¿Es FarmApp gratuita o tiene costos ocultos?',
        respuesta:
          'FarmApp es completamente gratuita para los usuarios. Puedes acceder a todas las funcionalidades sin ningún costo. Sin embargo, algunos servicios adicionales, como la visualización de ofertas exclusivas de ciertas droguerías, podrían estar disponibles a través de un modelo premium en el futuro.',
      },
      {
        pregunta: '¿Cómo contacto a las droguerías que aparecen en la app?',
        respuesta:
          'En la sección de "Droguerías cercanas", cada droguería que aparece tiene un perfil con su dirección, número de teléfono, y en algunos casos, un enlace directo a su sitio web o un botón para llamarlas directamente desde la app.',
      },
      {
        pregunta: '¿FarmApp ofrece información sobre medicamentos genéricos?',
        respuesta:
          'Sí, FarmApp incluye información tanto sobre medicamentos de marca como sobre medicamentos genéricos. Nuestro objetivo es proporcionarte todas las opciones disponibles para que tomes una decisión informada a la hora de comprar medicamentos.',
      },
    ],
  },
];
