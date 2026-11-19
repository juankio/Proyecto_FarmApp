export type Post = { titulo: string; extracto: string; imagen: string; categoria: string };

export const posts: Post[] = [
  {
    titulo: 'Bienvenido a nuestro apartado de Blog',
    extracto: 'Aquí te estaremos actualizando nuestros últimos avances.',
    imagen: 'https://res.cloudinary.com/dc4vyurnu/image/upload/v1731731666/pingui_uan4qb.gif',
    categoria: 'Actualidad',
  },
  {
    titulo: 'Cenacap',
    extracto:
      'Hemos agregado un apartado para CENACAP. Más información en la sección de Feria Empresarial.',
    imagen: 'https://res.cloudinary.com/dc4vyurnu/image/upload/v1731731665/Pildoras_sts8mi.gif',
    categoria: 'Novedades',
  },
  {
    titulo: 'Últimos avances',
    extracto:
      'También hemos trabajado arduamente para mejorar este proyecto, con mucha paciencia, felicidad y armonía.',
    imagen: 'https://res.cloudinary.com/dc4vyurnu/image/upload/v1731731664/medicina_tz4d0o.gif',
    categoria: 'Proyecto',
  },
];
