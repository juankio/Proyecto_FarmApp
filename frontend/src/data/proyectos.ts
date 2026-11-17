export type Precio = { etiqueta: string; valor: string; nota?: string };
export type Variante = { nombre: string; texto: string; imagen: string };

export type Proyecto = {
  slug: string;
  numero: number;
  empresa: string;
  empresaImagen: string;
  producto: string;
  logo: string;
  descripcion: string;
  intro: string;
  precios?: Precio[];
  objetivo?: string;
  sirve?: string;
  ingredientes: string[];
  mision: string;
  vision: string;
  variantes?: Variante[];
  galeria: string[];
};

export const proyectos: Proyecto[] = [
  {
    slug: 'codigox',
    numero: 1,
    empresa: 'CódigoX',
    empresaImagen:
      'https://res.cloudinary.com/dc4vyurnu/image/upload/v1731741000/Imagen_de_WhatsApp_2024-11-16_a_las_02.06.56_0994b0f8_nlzjsx.jpg',
    producto: 'FarmApp',
    logo: 'https://res.cloudinary.com/dc4vyurnu/image/upload/v1731731597/farmapp_vwt9jr.png',
    descripcion: 'Soluciones tecnológicas para un mundo digital.',
    intro:
      'Conoce más de nosotros. En este apartado encontrarás nuestra misión, visión y a los creadores de este gran proyecto.',
    mision:
      'Facilitar el acceso seguro y eficiente a medicamentos, proporcionando a los usuarios información completa y actualizada sobre productos farmacéuticos, mientras conectamos a droguerías y farmacias con su mercado objetivo para impulsar sus ventas y mejorar la salud de las comunidades.',
    vision:
      'Convertirnos en la plataforma líder a nivel regional para la búsqueda y adquisición de medicamentos, reconocidos por nuestra confiabilidad, innovación y capacidad para mejorar la experiencia de compra y la salud de millones de personas, al tiempo que apoyamos el crecimiento de las farmacias y droguerías en múltiples países.',
    ingredientes: [],
    galeria: [
      'https://res.cloudinary.com/dc4vyurnu/image/upload/v1731731597/farmapp_vwt9jr.png',
    ],
  },
  {
    slug: 'exfolpiel',
    numero: 2,
    empresa: 'Skin Glow',
    empresaImagen:
      'https://res.cloudinary.com/dc4vyurnu/image/upload/v1731741002/Imagen_de_WhatsApp_2024-11-16_a_las_02.10.39_bf3c7273_l5rqce.jpg',
    producto: 'Exfolpiel',
    logo: 'https://res.cloudinary.com/dc4vyurnu/image/upload/v1731731597/exfolpiel_jlbc6p.png',
    descripcion: 'Cuidado y belleza para tu piel.',
    intro:
      'Descubre más sobre nosotros en esta sección, donde podrás ver nuestro producto, así como nuestra misión y visión. ¡Conoce a los creadores de este increíble proyecto!',
    precios: [
      {
        etiqueta: 'Nuestro precio',
        valor: '$10.000 COP',
        nota: 'Manejamos precios accesibles para ti.',
      },
      {
        etiqueta: 'Nuestra promoción',
        valor: '$16.000 COP',
        nota: 'Lleva 2 productos por un precio especial.',
      },
    ],
    objetivo:
      'Brindar a las personas un producto de cuidado personal innovador, accesible y de alta calidad que mejore su bienestar y confianza, satisfaciendo sus necesidades diarias y construyendo una conexión que impulse el reconocimiento de nuestra marca como su mejor opción para el cuidado personal a nivel nacional e internacional para 2030.',
    sirve:
      'Limpiar y eliminar las impurezas. Las cremas exfoliantes realizan una limpieza profunda y, dependiendo de la zona, purifican el grano que incluye en su composición.',
    ingredientes: [
      'Semillas de amapola',
      'Aceite de coco',
      'Colorante',
      'Glicerina',
      'Esencia',
      'Agua esterilizada',
      'Goma de santana',
      'Aceite de almendras',
    ],
    mision:
      'Nos comprometemos con la calidad de nuestros productos, satisfaciendo las necesidades de nuestros clientes con innovación y precios accesibles.',
    vision:
      'Para 2030, ser reconocidos nacional e internacionalmente por nuestros productos de excelente calidad en cuidado personal.',
    galeria: [
      'https://res.cloudinary.com/dc4vyurnu/image/upload/v1731753428/armscrubapply_mcmzdf.webp',
      'https://res.cloudinary.com/dc4vyurnu/image/upload/v1731753425/mejor-exfoliante-corporal-1050x700_rtojlo.jpg',
      'https://res.cloudinary.com/dc4vyurnu/image/upload/v1732115237/f817221b28743f235b15bc53fa5081cf_eaagvm.jpg',
      'https://res.cloudinary.com/dc4vyurnu/image/upload/v1732115237/fcb3005de5a73a6e2b0ae8285728230f_opxgzs.jpg',
      'https://res.cloudinary.com/dc4vyurnu/image/upload/v1732115237/ccdb7f9c67cb48518ea0377b3c803b17_cmlpf1.jpg',
      'https://res.cloudinary.com/dc4vyurnu/image/upload/v1732115235/9d001951cddbb3ab80bbc251015e0f19_k4gqhv.jpg',
      'https://res.cloudinary.com/dc4vyurnu/image/upload/v1732115235/b68d9ded4620dd53ea08faf95999a60e_li7k64.jpg',
      'https://res.cloudinary.com/dc4vyurnu/image/upload/v1732115235/50026da8a58cf8f82ac91327d9b10e2d_ruthgz.jpg',
      'https://res.cloudinary.com/dc4vyurnu/image/upload/v1732115234/4cf850d9a28d3051bc4492b650446dbb_zqd9th.jpg',
      'https://res.cloudinary.com/dc4vyurnu/image/upload/v1732115234/16bb2d5d059e284bf2ac1d73c921164f_fovagx.jpg',
      'https://res.cloudinary.com/dc4vyurnu/image/upload/v1732115234/87d207c33c82226c61e54680babaea63_wijdmr.jpg',
      'https://res.cloudinary.com/dc4vyurnu/image/upload/v1732115234/6a11664ae9769bae072ba2e5161ade87_n1g628.jpg',
    ],
  },
  {
    slug: 'fenix',
    numero: 3,
    empresa: 'Alkanail',
    empresaImagen:
      'https://res.cloudinary.com/dc4vyurnu/image/upload/v1731741006/IMG-20241116-WA0007_b9ooep.jpg',
    producto: 'Fenix',
    logo: 'https://res.cloudinary.com/dc4vyurnu/image/upload/v1732209492/Logo_fenix_b3wzic.png',
    descripcion: 'Accesorios y productos exclusivos para uñas.',
    intro:
      'En este apartado podrás aprender más sobre nosotros, descubrir nuestro producto, nuestra misión y visión, y también conocer a los creadores de este extraordinario proyecto.',
    objetivo:
      'Promover la salud y el cuidado de las uñas y cutículas. El aceite de ricino y el aceite de oliva ayudan a mantener las cutículas hidratadas, previniendo la sequedad, el agrietamiento o la inflamación. El ajo, por sus propiedades antioxidantes y antimicrobianas, contribuye a fortalecer las uñas y a prevenir su rotura.',
    sirve:
      'Prevenir infecciones: el ajo tiene propiedades antimicrobianas que ayudan a cuidar las cutículas y las uñas cuando la piel está dañada o irritada. Con el uso regular, el humectante mejora la suavidad y apariencia de las cutículas, manteniéndolas más saludables, manejables y con un aspecto más cuidado.',
    ingredientes: [
      'Aceite de ricino',
      'Ajo',
      'Polvo de hornear',
      'Jengibre',
      'Limón',
      'Vitamina E',
    ],
    mision:
      'Somos una empresa multinacional con experiencia y herramientas de óptima tecnología, ofreciendo una excelente calidad en el servicio gracias a la eficacia de nuestros productos elaborados con nuestra fórmula orgánica sin químicos. De esta manera, aportamos al cuidado del medio ambiente.',
    vision:
      'En 5 años seremos una empresa que, con nuestros productos orgánicos, abarcará nuevos mercados, especialmente en Japón, llegando a ser líderes mundiales en cosméticos, reconocidos por la excelencia en calidad, innovación y compromiso en todo el mundo.',
    galeria: [
      'https://res.cloudinary.com/dc4vyurnu/image/upload/v1732210957/561f81ec0c2c550540d48b17be2d24a8_drp0y7.jpg',
      'https://res.cloudinary.com/dc4vyurnu/image/upload/v1732210958/Imagen_de_WhatsApp_2024-11-21_a_las_12.38.46_d58e8889_tgjomm.jpg',
      'https://res.cloudinary.com/dc4vyurnu/image/upload/v1732210958/Imagen_de_WhatsApp_2024-11-21_a_las_12.34.14_f02c5f82_lfkaqa.jpg',
      'https://res.cloudinary.com/dc4vyurnu/image/upload/v1732210958/Imagen_de_WhatsApp_2024-11-21_a_las_12.34.53_02e8fe2b_jy0cck.jpg',
      'https://res.cloudinary.com/dc4vyurnu/image/upload/v1732210958/Imagen_de_WhatsApp_2024-11-21_a_las_12.32.07_dc8a44f4_csczaf.jpg',
      'https://res.cloudinary.com/dc4vyurnu/image/upload/v1732210957/2_xvphmg.jpg',
      'https://res.cloudinary.com/dc4vyurnu/image/upload/v1732214555/fotor-20241121134255_iswqg9.png',
    ],
  },
  {
    slug: 'gummy-vit',
    numero: 4,
    empresa: 'Inversiones D & T',
    empresaImagen:
      'https://res.cloudinary.com/dc4vyurnu/image/upload/v1731741007/IMG-20241116-WA0008_smay2i.jpg',
    producto: 'Gummy Vit',
    logo: 'https://res.cloudinary.com/dc4vyurnu/image/upload/v1731731598/gummyvit_v0ed49.png',
    descripcion: 'Creando oportunidades para todos.',
    intro:
      'En este apartado podrás conocer más acerca de nuestro equipo, ver nuestro producto, nuestra misión y visión, y también a quienes hicieron posible este gran proyecto.',
    objetivo:
      'Formular y promover un producto innovador en forma de gomitas funcionales que actúe de manera integral en el bienestar físico y estético. Está diseñado para combatir los signos visibles del envejecimiento, como la reducción de arrugas y la promoción de una tez más juvenil y saludable. Además, aporta beneficios al cuerpo al fortalecer músculos, huesos y articulaciones.',
    sirve:
      'Estas gomitas están formuladas para combatir los signos del envejecimiento, reducir las arrugas y promover una tez juvenil. También ayudan a los músculos, huesos y articulaciones.',
    ingredientes: ['Limón', 'Naranja', 'Colágeno', 'Escama de pez', 'Gelatina'],
    mision:
      'Somos una empresa multinacional con experiencia y herramientas de óptima tecnología, ofreciendo una excelente calidad en el servicio gracias a la eficacia de nuestros productos elaborados con nuestra fórmula orgánica sin químicos. De esta manera, aportamos al cuidado del medio ambiente.',
    vision:
      'En 5 años seremos una empresa que, con nuestros productos orgánicos, abarcará nuevos mercados, especialmente en Japón, llegando a ser líderes mundiales en cosméticos, reconocidos por la excelencia en calidad, innovación y compromiso en todo el mundo.',
    galeria: [
      'https://res.cloudinary.com/dc4vyurnu/image/upload/v1732216939/ea6eeee477616045928aa96f6ad7f33e_ixdmhl.jpg',
      'https://res.cloudinary.com/dc4vyurnu/image/upload/v1732216941/7a05425dd3bf8581f58315fc00823959_tkl5tl.jpg',
      'https://res.cloudinary.com/dc4vyurnu/image/upload/v1732216940/1e11552885d925d4981fd4941a647a83_w1wpbl.jpg',
      'https://res.cloudinary.com/dc4vyurnu/image/upload/v1732216942/46ed3a1e202f8c854bff998e2dcbabad_mo3fin.jpg',
      'https://res.cloudinary.com/dc4vyurnu/image/upload/v1732216940/c5c56c9d12483223f230674d2ab508ae_sebxvv.jpg',
      'https://res.cloudinary.com/dc4vyurnu/image/upload/v1732222730/18_yypaew.webp',
    ],
  },
  {
    slug: 'nails-grow',
    numero: 5,
    empresa: 'VYG Naturals',
    empresaImagen:
      'https://res.cloudinary.com/dc4vyurnu/image/upload/v1731740999/Imagen_de_WhatsApp_2024-11-16_a_las_02.04.41_8441a983_ggwqqy.jpg',
    producto: 'Nails Grow',
    logo: 'https://res.cloudinary.com/dc4vyurnu/image/upload/v1731731598/nails-grow_vtosu0.png',
    descripcion: 'Conecta con la naturaleza en cada producto.',
    intro:
      'Explora esta sección para saber más sobre nosotros. Aquí te mostramos nuestro producto, la misión y visión que nos guía y, por supuesto, a los creadores de este magnífico proyecto.',
    precios: [
      {
        etiqueta: 'Demostración',
        valor: 'Gratis',
        nota: 'Ofrecemos demostraciones de nuestro producto de uñas para que compruebes sus beneficios.',
      },
      {
        etiqueta: 'Precio',
        valor: '$5.000 COP',
        nota: 'Calidad y accesibilidad sin comprometer tu bolsillo.',
      },
      {
        etiqueta: '¡Promoción!',
        valor: '2X $8.000 COP',
        nota: 'Por tiempo limitado, lleva más por menos.',
      },
    ],
    objetivo:
      'Estimular el crecimiento saludable de las uñas, haciéndolas más fuertes y evitando que se partan fácilmente. A través de ingredientes naturales como el aceite de coco, canela en polvo, ajo en polvo, romero y vitamina E, se busca acelerar el crecimiento de las uñas mientras se fortalece su estructura.',
    sirve:
      'Estimular el crecimiento de las uñas y fortalecerlas, ayudando a que sean menos frágiles y se partan con menos frecuencia. Su fórmula natural nutre las uñas en profundidad, promoviendo un crecimiento más rápido y saludable, y mejora la dureza de las uñas quebradizas o débiles.',
    ingredientes: ['Aceite de coco', 'Ajo en polvo', 'Romero en polvo', 'Vitamina E'],
    mision:
      'Ser una empresa comprometida con nuestros clientes en el campo de los productos naturales, brindando los mejores productos y herramientas con innovación y calidad.',
    vision:
      'Ser la empresa colombiana con mayor desarrollo y participación en productos de belleza y cuidado personal, proporcionando los mejores servicios de calidad e innovación al alcance del consumidor, marcando tendencias y moda. En un plazo de 6 años, consolidarnos como líderes en el mercado, con un crecimiento sostenido y una expansión que nos permita llegar a nuevos públicos.',
    galeria: [
      'https://res.cloudinary.com/dc4vyurnu/image/upload/v1731731600/nails-1_llkg51.jpg',
      'https://res.cloudinary.com/dc4vyurnu/image/upload/v1731731600/nails-4_uhyxyb.jpg',
      'https://res.cloudinary.com/dc4vyurnu/image/upload/v1731731600/nails-5_csneat.jpg',
      'https://res.cloudinary.com/dc4vyurnu/image/upload/v1732225800/nails-5_ok8ic8.png',
      'https://res.cloudinary.com/dc4vyurnu/image/upload/v1732225790/nails-4_hmpxt9.png',
      'https://res.cloudinary.com/dc4vyurnu/image/upload/v1732225788/nails-3_ns8fqq.png',
      'https://res.cloudinary.com/dc4vyurnu/image/upload/v1732225787/nails-2_ltasbz.jpg',
      'https://res.cloudinary.com/dc4vyurnu/image/upload/v1732225786/nails-1_ilryko.jpg',
      'https://res.cloudinary.com/dc4vyurnu/image/upload/v1732225793/prod_jvhmvk.png',
    ],
  },
  {
    slug: 'tentaciones-de-afrodita',
    numero: 6,
    empresa: 'Erosfera',
    empresaImagen:
      'https://res.cloudinary.com/dc4vyurnu/image/upload/v1731741005/IMG-20241116-WA0006_aeztwm.jpg',
    producto: 'Tentaciones de Afrodita',
    logo: 'https://res.cloudinary.com/dc4vyurnu/image/upload/v1732229299/Imagen_de_WhatsApp_2024-11-21_a_las_17.44.56_2dc139bb-fotor-20241121174816_fdya0n.png',
    descripcion: 'Bienestar y equilibrio para tu cuerpo y mente.',
    intro:
      'Explora esta sección para saber más sobre nosotros. Aquí te mostramos nuestro producto, la misión y visión que nos guía y, por supuesto, a los creadores de este magnífico proyecto.',
    objetivo:
      'Mejorar la función sexual masculina y femenina de manera natural y segura, aumentando el deseo y la conexión emocional y física entre parejas.',
    sirve:
      'Sirve para quienes buscan una forma innovadora y deliciosa de consumir un potenciador natural, diseñado para hombres y mujeres que buscan mejorar su experiencia íntima.',
    ingredientes: [
      'Huevos',
      'Harina de trigo',
      'Polvo de hornear',
      'Azúcar',
      'Sal',
      'Mantequilla',
      'Esencia de vainilla',
      'Leche',
      'Maca',
      'Cereza',
      'Agua',
      'Masmelos',
      'Azúcar pulverizada',
      'Papel de arroz',
    ],
    mision:
      'Ser una empresa comprometida con nuestros clientes en el campo de los productos naturales, brindando los mejores productos y herramientas con innovación y calidad.',
    vision:
      'Ser la empresa colombiana con mayor desarrollo y participación en productos de belleza y cuidado personal, proporcionando los mejores servicios de calidad e innovación al alcance del consumidor, marcando tendencias y moda. En un plazo de 6 años, consolidarnos como líderes en el mercado, con un crecimiento sostenido y una expansión que nos permita llegar a nuevos públicos.',
    galeria: [
      'https://res.cloudinary.com/dc4vyurnu/image/upload/v1732229138/Imagen_de_WhatsApp_2024-11-21_a_las_16.51.19_5b41c3e3_m5tswv.jpg',
      'https://res.cloudinary.com/dc4vyurnu/image/upload/v1732229140/Imagen_de_WhatsApp_2024-11-21_a_las_16.51.20_8c167251_oqkcvb.jpg',
      'https://res.cloudinary.com/dc4vyurnu/image/upload/v1732229142/Imagen_de_WhatsApp_2024-11-21_a_las_16.51.20_e12f235b_bieyze.jpg',
      'https://res.cloudinary.com/dc4vyurnu/image/upload/v1732229137/Imagen_de_WhatsApp_2024-11-21_a_las_16.05.49_70c55d0f_xemo80.jpg',
      'https://res.cloudinary.com/dc4vyurnu/image/upload/v1732229135/Imagen_de_WhatsApp_2024-11-21_a_las_16.05.49_4e87b64b_bqupot.jpg',
      'https://res.cloudinary.com/dc4vyurnu/image/upload/v1732229851/prod1_fzqvve.png',
      'https://res.cloudinary.com/dc4vyurnu/image/upload/v1732229852/prod2_jitglk.png',
    ],
  },
  {
    slug: 'selene',
    numero: 7,
    empresa: 'Divine MSLA',
    empresaImagen:
      'https://res.cloudinary.com/dc4vyurnu/image/upload/v1731741003/IMG-20241114-WA0062_ego3kk.jpg',
    producto: 'Selene',
    logo: 'https://res.cloudinary.com/dc4vyurnu/image/upload/v1731731602/selene_pp40oh.png',
    descripcion: 'Inspiración divina para cada momento.',
    intro:
      'En esta sección te ofrecemos más información sobre nosotros, nuestro producto, la misión y visión de la empresa, y también a los creadores detrás de este excelente proyecto.',
    objetivo:
      'Ayudarte a tener un cabello saludable, fuerte y hermoso con productos diseñados especialmente para ti. Usamos ingredientes de alta calidad y tecnología avanzada para ofrecerte soluciones personalizadas que cuiden tu cabello y refuercen tu confianza.',
    sirve:
      'Descubre el secreto para un cabello suave, hidratado y sin frizz. Nuestro tratamiento capilar es la solución perfecta para domar los mechones rebeldes, añadiendo brillo y suavidad.',
    variantes: [
      {
        nombre: 'Crespo',
        texto:
          'Selene Tratamiento Capilar hidrata intensamente el cabello crespo, controlando el volumen y definiendo tus rizos. Logra suavidad y elasticidad en cada aplicación.',
        imagen:
          'https://res.cloudinary.com/dc4vyurnu/image/upload/v1731731599/divine-2_nhddxd.jpg',
      },
      {
        nombre: 'Liso',
        texto:
          'Con Selene Tratamiento Capilar, tu cabello liso estará más suave y brillante que nunca. Elimina el frizz y disfruta de un look sedoso y saludable en cada uso.',
        imagen:
          'https://res.cloudinary.com/dc4vyurnu/image/upload/v1731731599/divine-1-1_d9gdlz.webp',
      },
      {
        nombre: 'Ondulado',
        texto:
          'Define tus ondas con Selene Tratamiento Capilar. Hidrata, controla el frizz y deja tu cabello ondulado con un brillo natural y movimiento perfecto.',
        imagen:
          'https://res.cloudinary.com/dc4vyurnu/image/upload/v1731731599/divine-3_r6vsz6.jpg',
      },
    ],
    ingredientes: [
      'Aceite de argán: hace que el cabello esté suave y brillante.',
      'Embrión de pato: restaurador capilar que nutre, fortalece y previene la caída del cabello.',
      'Gusano de seda: aumenta la elasticidad, suavidad y fuerza.',
      'Ácido hialurónico: aporta hidratación y la sella para mantenerla por más tiempo.',
      'Vitamina E: fomenta la buena circulación y evita la caída del cabello.',
      'Histidina: penetra el cabello para purificar y eliminar impurezas de los radicales libres.',
      'Aceite de cannabis: estimula las células de los folículos pilosos evitando su caída.',
    ],
    mision:
      'En Divine nos comprometemos a proporcionar soluciones de cuidado capilar efectivas y personalizadas, utilizando ingredientes de alta calidad y tecnologías innovadoras para ayudar a nuestros clientes a lograr un cabello saludable, fuerte y hermoso, mejorando así su autoestima y calidad de vida.',
    vision:
      'En cinco años, ser la marca líder en el mercado del cuidado del cabello, reconocida nacionalmente por nuestros productos innovadores, sostenibles y efectivos que inspiran confianza y belleza auténtica en nuestros clientes.',
    galeria: [
      'https://res.cloudinary.com/dc4vyurnu/image/upload/v1732143050/ad82c6a1a90e27bd4c6977725c31b88e_cq7zw2.jpg',
      'https://res.cloudinary.com/dc4vyurnu/image/upload/v1732143049/96946860159fec4847485b49c73b3fcf_zpa7nl.jpg',
      'https://res.cloudinary.com/dc4vyurnu/image/upload/v1732143050/cd649347598fd6f2ea0b26c9c2e120b9_w7zpcu.jpg',
      'https://res.cloudinary.com/dc4vyurnu/image/upload/v1732143051/92a612e31de56bd2e05619f834796c65_qxbeqh.jpg',
      'https://res.cloudinary.com/dc4vyurnu/image/upload/v1732143052/d59979e409882b0443d73f37f291082d_bwggy7.jpg',
      'https://res.cloudinary.com/dc4vyurnu/image/upload/v1732143048/5a8ecd6206a7ad9b2b6bdda893d27bb0_vmxmgo.jpg',
      'https://res.cloudinary.com/dc4vyurnu/image/upload/v1732143048/59bef1316d57291b61cdff9e1d6f3bf9_zg5jhi.jpg',
      'https://res.cloudinary.com/dc4vyurnu/image/upload/v1732143047/4bb9baaed05a302fb59e854ec65be385_qv7mar.jpg',
      'https://res.cloudinary.com/dc4vyurnu/image/upload/v1732143046/47b232c1b72298bddd7ab3dbe5c3757c_tpclxf.jpg',
      'https://res.cloudinary.com/dc4vyurnu/image/upload/v1732143046/11902a4a35e663eb6309f8dbda725fb3_l5gsj1.jpg',
      'https://res.cloudinary.com/dc4vyurnu/image/upload/v1732142427/Divine2_ly5ifm.png',
      'https://res.cloudinary.com/dc4vyurnu/image/upload/v1732142426/Divine1_kg5ydd.png',
      'https://res.cloudinary.com/dc4vyurnu/image/upload/v1732142426/Divine3_aeoala.png',
    ],
  },
];

export function buscarProyecto(slug: string): Proyecto | undefined {
  return proyectos.find((p) => p.slug === slug);
}
