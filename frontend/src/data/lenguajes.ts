export const lenguajes = {
  titulo: 'Lenguajes de programación',
  intro: [
    'Como el código máquina y el ensamblador son denominados lenguajes de bajo nivel. Estos lenguajes se caracterizan por ofrecer al programador control total sobre el hardware en el que se ejecuta, permitiendo conseguir el máximo de la velocidad y capacidades del ordenador.',
    'Por su parte, el lenguaje de bajo nivel se caracteriza por incluir muchos detalles bajo el capó. Esto significa que el código escrito en un lenguaje de bajo nivel es mucho más rápido y eficiente que el código escrito en un lenguaje de alto nivel. Los ejemplos principales son Assembly.',
  ],
  ventajas: [
    'Los lenguajes de bajo nivel se caracterizan por utilizar una codificación sencilla y adaptable.',
    'Las instrucciones son directas y de fácil conversión.',
    'Programando en un lenguaje de bajo nivel se consigue una gran velocidad y rendimiento.',
    'Interactúan directamente con el hardware sin necesidad de utilizar compiladores ni intérpretes adicionales.',
  ],
  clasificacion: [
    {
      titulo: 'Código binario',
      texto:
        'Se trata del lenguaje más básico de cualquier máquina o dispositivo electrónico. Consiste en utilizar solo dos números para representar todas las instrucciones y funciones que puede realizar la máquina: el 1 que representa "todo" y el 0 que es lo contrario, "nada". El código binario representa en unos y ceros los estados físicos de una máquina, ya que en electricidad y electrónica el cero quiere decir que no pasa corriente y el uno que sí circula.',
    },
    {
      titulo: 'Lenguaje máquina',
      texto:
        'Este lenguaje de programación de bajo nivel utiliza unos y ceros para dar instrucciones a las máquinas, aunque también admite el uso de valores hexadecimales. Está compuesto por una serie de instrucciones para indicarle a una máquina qué debe hacer y cuándo debe realizarlo. Para programar en lenguaje máquina es necesario poseer un profundo conocimiento de la arquitectura física del ordenador. Con este tipo de lenguaje un programador puede sacar el máximo partido a todos los recursos disponibles.',
    },
    {
      titulo: 'Ensamblador',
      texto:
        'El ensamblador es el lenguaje de bajo nivel más sencillo de utilizar, ya que surge ante la gran dificultad que supone programar en código binario o máquina. En ensamblador se pueden expresar las instrucciones directas a la máquina en un lenguaje más natural y sencillo para el programador, y que puede ser comprendido por la propia máquina. Existen diferentes tipos según el escenario o máquina en el que se utiliza: ensamblador cruzado, residente, macroensambladores, de fase y microensambladores.',
    },
  ],
  altoNivel: [
    {
      nombre: 'C++',
      texto:
        'Lenguaje de alto nivel con control cercano al hardware, usado en sistemas, videojuegos y aplicaciones de alto rendimiento.',
      color: '#00599c',
    },
    {
      nombre: 'Python',
      texto:
        'Lenguaje legible y versátil, popular en ciencia de datos, inteligencia artificial y automatización.',
      color: '#3776ab',
    },
    {
      nombre: 'C#',
      texto:
        'Lenguaje moderno de Microsoft para aplicaciones de escritorio, web, videojuegos y servicios en la nube.',
      color: '#68217a',
    },
    {
      nombre: 'Java',
      texto:
        'Lenguaje orientado a objetos y multiplataforma, muy usado en aplicaciones empresariales y Android.',
      color: '#e76f00',
    },
  ],
};
