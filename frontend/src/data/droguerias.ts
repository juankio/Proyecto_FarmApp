import { comunaDe } from './comunas';

export type Drogueria = {
  id: number;
  nombre: string;
  cadena: string;
  direccion: string;
  barrio: string;
  ciudad: string;
  telefono: string;
  whatsapp: string;
  horario: string;
  es24h: boolean;
  domicilio: boolean;
  lat: number;
  lng: number;
  afiliada: boolean;
  destacada?: boolean;
  placeId: string;
  rating?: number;
  resenas?: number;
  conFoto: boolean;
  comuna: number;
};

export const VILLAVICENCIO_COORDS = { lat: 4.135, lng: -73.630, zoom: 13 };

export const VILLAVICENCIO_BOUNDS: [[number, number], [number, number]] = [
  [4.055, -73.675],
  [4.175, -73.578],
];

export const BARRIOS_VILLAVICENCIO = [
  'Todos los barrios', 'Centro', 'El Barzal', 'Siete de Agosto', 'La Esperanza',
  'Los Fundadores', 'Rosa Blanca', 'Doce de Octubre', 'El Jordán', 'El Popular',
  'Cantarrana', 'San Benito', 'Morichal', 'Santa Helena', 'Kirpas', 'La Reliquia',
  'Montecarlo', 'Catumare', 'Porfía', 'La Madrid', 'La Grama', 'El Caudal', 'Vanguardia',
] as const;

export type CadenaInfo = {
  nombre: string; slug: string; color: string; colorDark: string; colorLight: string;
  bgGradient: string; textColor: string; sigla: string; icono: string;
  tipo: 'cadena' | 'independiente'; descripcion: string;
};

export const CADENAS_CONFIG: Record<string, CadenaInfo> = {
  'La Rebaja': { nombre: 'Drogas La Rebaja', slug: 'rebaja', color: '#dc2626', colorDark: '#991b1b', colorLight: 'rgba(239, 68, 68, 0.15)', bgGradient: 'linear-gradient(135deg, #ef4444, #b91c1c)', textColor: '#ffffff', sigla: 'LR', icono: '<span class="pin-txt-lr">LR</span>', tipo: 'cadena', descripcion: 'Red cooperativa Copservir' },
  'Cruz Verde': { nombre: 'Cruz Verde', slug: 'cruzverde', color: '#059669', colorDark: '#065f46', colorLight: 'rgba(16, 185, 129, 0.15)', bgGradient: 'linear-gradient(135deg, #10b981, #047857)', textColor: '#ffffff', sigla: '+', icono: '<svg viewBox="0 0 24 24" width="16" height="16" fill="#ffffff"><path d="M9 3h6v6h6v6h-6v6H9v-6H3V9h6V3z"/></svg>', tipo: 'cadena', descripcion: 'Cadena nacional' },
  Copifam: { nombre: 'Droguerías Copifam', slug: 'copifam', color: '#2563eb', colorDark: '#1e3a8a', colorLight: 'rgba(37, 99, 235, 0.15)', bgGradient: 'linear-gradient(135deg, #3b82f6, #1d4ed8)', textColor: '#ffffff', sigla: 'CF', icono: '<span class="pin-txt-brand">CF</span>', tipo: 'cadena', descripcion: 'Cadena con presencia en barrios' },
  Farmacenter: { nombre: 'Farmacenter', slug: 'farmacenter', color: '#0284c7', colorDark: '#0369a1', colorLight: 'rgba(2, 132, 199, 0.15)', bgGradient: 'linear-gradient(135deg, #0284c7, #075985)', textColor: '#ffffff', sigla: 'FC', icono: '<span class="pin-txt-brand">FC</span>', tipo: 'cadena', descripcion: 'Red de farmacias comunitarias' },
  'La Economía': { nombre: 'Droguerías La Economía', slug: 'economia', color: '#ea580c', colorDark: '#9a3412', colorLight: 'rgba(234, 88, 12, 0.15)', bgGradient: 'linear-gradient(135deg, #f97316, #c2410c)', textColor: '#ffffff', sigla: '%', icono: '<span class="pin-txt-brand">%</span>', tipo: 'cadena', descripcion: 'Genéricos y descuentos' },
  Cafam: { nombre: 'Droguerías Cafam', slug: 'cafam', color: '#dc2626', colorDark: '#7f1d1d', colorLight: 'rgba(225, 29, 72, 0.15)', bgGradient: 'linear-gradient(135deg, #e11d48, #9f1239)', textColor: '#ffffff', sigla: 'CAF', icono: '<span class="pin-txt-brand">CAF</span>', tipo: 'cadena', descripcion: 'Caja de compensación' },
  Pasteur: { nombre: 'Droguerías Pasteur', slug: 'pasteur', color: '#334155', colorDark: '#0f172a', colorLight: 'rgba(51, 65, 85, 0.15)', bgGradient: 'linear-gradient(135deg, #334155, #0f172a)', textColor: '#ffffff', sigla: 'P', icono: '<span class="pin-txt-brand">P</span>', tipo: 'cadena', descripcion: 'Cadena tradicional' },
  Colsubsidio: { nombre: 'Droguerías Colsubsidio', slug: 'colsubsidio', color: '#0284c7', colorDark: '#0c4a6e', colorLight: 'rgba(2, 132, 199, 0.15)', bgGradient: 'linear-gradient(135deg, #0284c7, #b91c1c)', textColor: '#ffffff', sigla: 'COL', icono: '<span class="pin-txt-brand">COL</span>', tipo: 'cadena', descripcion: 'Dispensación ambulatoria' },
  Audifarma: { nombre: 'Audifarma', slug: 'audifarma', color: '#0f766e', colorDark: '#134e4a', colorLight: 'rgba(15, 118, 110, 0.15)', bgGradient: 'linear-gradient(135deg, #14b8a6, #0f766e)', textColor: '#ffffff', sigla: 'AUD', icono: '<span class="pin-txt-brand">AUD</span>', tipo: 'cadena', descripcion: 'Dispensación institucional' },
  'Droguería Alemana': { nombre: 'Droguería Alemana', slug: 'alemana', color: '#d97706', colorDark: '#78350f', colorLight: 'rgba(217, 119, 6, 0.15)', bgGradient: 'linear-gradient(135deg, #334155, #b45309)', textColor: '#ffffff', sigla: 'ALE', icono: '<span class="pin-txt-brand">ALE</span>', tipo: 'cadena', descripcion: 'Fórmulas magistrales' },
  Independiente: { nombre: 'Droguerías de Barrio', slug: 'independiente', color: '#7c3aed', colorDark: '#5b21b6', colorLight: 'rgba(124, 58, 237, 0.15)', bgGradient: 'linear-gradient(135deg, #8b5cf6, #6d28d9)', textColor: '#ffffff', sigla: 'BOT', icono: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#ffffff" stroke-width="2.2"><path d="M4 11h16a1 1 0 0 1 1 1.1c-.8 5.4-5 8.9-9 8.9s-8.2-3.5-9-8.9A1 1 0 0 1 4 11z"/><path d="M15 4l-4 6"/></svg>', tipo: 'independiente', descripcion: 'Boticarios de barrio' },
};

export const LISTA_CADENAS_FILTRO = [
  'Todas las marcas', 'Drogas La Rebaja', 'Droguerías de Barrio (Independientes)',
  'Cruz Verde', 'Copifam', 'Farmacenter', 'La Economía', 'Cafam', 'Audifarma', 'Colsubsidio',
] as const;

export function obtenerCadenaInfo(cadena: string): CadenaInfo {
  return CADENAS_CONFIG[cadena] || CADENAS_CONFIG['Independiente'];
}

// [placeId, nombre, dirección, lat, lng, rating, reseñas, conFoto]
// Fuente: Google Places API (New), filtrado por límites urbanos de Villavicencio.
type Fila = [string, string, string, number, number, number, number, number];

const FILAS: Fila[] = [
  ['ChIJgUAh3ugtPo4Ra7S9QxR2LBw','Droguerias Santa Maria - Centro','Transversal 29 #38105 a Villajulia',4.1529984,-73.6344745,5,352,1],
  ['ChIJoSVixAsuPo4RWHLMtOXljVQ','Agropunto La Finca','Cl 26 C #36a-07',4.1393516,-73.6355555,4.5,237,1],
  ['ChIJrVR95twvPo4RVBLShOX3t7g','Santa Maria - Amarilo 24 horas','Carrera 36 Sur #6-22 Via Amarillo',4.1093376,-73.6326754,4.9,223,1],
  ['ChIJDVvL4JYtPo4RbbdO6c2_TP4','Santa Maria - Santa Helena','Cra. 14 #39-28, Santa Helena',4.1498179,-73.6132629,4.9,194,1],
  ['ChIJU3oJgwguPo4RD8FxQlqMX3U','Santa Maria - Buque','Cra. 43b #21-1, Buque',4.1385583,-73.6416672,4.9,189,1],
  ['ChIJ8Zb1pOItPo4RckDq1Ga4p3U','Pharmacy Santa Maria Barzal N°2','Barzal Alto, Cl 32 #31-13 Local 108',4.1417948,-73.6408549,4.8,163,1],
  ['ChIJQ3F-wfwtPo4R9W8GKLYAjd4','Santa Maria - Hospital 24 horas','Barzal Alto, Cra. 42 #35-06',4.1448156,-73.6430507,4.7,140,1],
  ['ChIJkQ29luItPo4RI8oBpCaqBVY','Servimedicos','Cl 32 #40-40a',4.1422375,-73.640307,2.8,137,1],
  ['ChIJHUlrnuMtPo4R9S-PQUGDvzE','Droguería Cruz Verde','Cra. 38 #33b-93',4.1452337,-73.6388072,3.2,132,1],
  ['ChIJD25w38svPo4RNYsiInW2o9Q','Cruz Verde','Cra. 38 #26 B - 51',4.1402569,-73.6372778,3.7,115,1],
  ['ChIJIYh_PAAvPo4R8DjrrGqwwEo','Farmatodo','Cl. 15 #45-36',4.1375382,-73.6468982,4.5,84,1],
  ['ChIJp7MGDg8uPo4R4ZsDMVUsXOU','Farmatodo','El Duquel, Cl. 15 #40-01',4.134227,-73.6400979,4.3,81,1],
  ['ChIJhQXx8_0vPo4ROGy0AnL0hrU','Audifarma 7 de agosto','Cl. 26b #38-64',4.1397046,-73.637593,3,80,1],
  ['ChIJz-hFm9stPo4RxXLZlzZ2uJ0','Droguería Merka Drogas','Cra. 20c #26c-1',4.1480288,-73.6234492,4.8,48,1],
  ['ChIJmUtPjnsuPo4RJvuI2gMz_so','Droguería Estero','Cra. 12 #15-14',4.1340871,-73.6129991,3.9,44,1],
  ['ChIJJ7DUwiAsPo4RbaB1md_lXag','Drogueria Patria Olimpico','Cra. 16 #25-02',4.1406163,-73.6171519,4.8,41,1],
  ['ChIJsWjiflguPo4R35NsnCWYdro','Droguería Farmaweb Chorillano','Cra. 22 #11-55',4.1133805,-73.6069507,4.6,38,1],
  ['ChIJO5TDy-MtPo4Rw3yaG9Ajv6Q','Droguería Colsubsidio','Cl. 33 #36-50 Loc 105, Barzal',4.1444568,-73.6368087,3.3,36,1],
  ['ChIJpyLO-K8tPo4RnsVH9eqXnnM','Droguería del Dr Simi','Cra. 31 #39-21, Centro',4.1526972,-73.6376864,5,33,1],
  ['ChIJh4Grj08tPo4RDf3OyKAyxQ0','Drogueria Patria Barzal','Cl. 33a #38-09',4.1440509,-73.6386226,4.8,30,1],
  ['ChIJ87O_lXIuPo4RiwHxWDZyflI','Patria Multifamiliares los Centauros','Carrera 36 #4-08',4.1111226,-73.6315449,4.9,27,1],
  ['ChIJg8fVHogvPo4RK1jypQ78koQ','Servicio Farmacéutico Colsubsidio 7 Agosto','Cra. 38 #26c-1',4.1406203,-73.6374934,2.5,26,1],
  ['ChIJ0cnxAeYtPo4Rbk2pau6leWA','Drogueria Patria Centro','Cra. 30 #36-94',4.1512198,-73.6355287,4.8,24,1],
  ['ChIJ5wcrBTAvPo4RlxcGgbtsCkw','Drogueria Patria Terminal','Cra. 5 este #15-49',4.1299392,-73.5997195,5,24,1],
  ['ChIJJ7djAaIvPo4RliZXiU6P-_c','Sikuany SAS, 7 de agosto','Cl. 26b #38-76',4.1395539,-73.6377773,2.1,24,1],
  ['ChIJrbeeVBQuPo4RD_0A1XP7UQs','Droguería Jimmy','Cra. 39 #7B-4, La Esperanza',4.123996,-73.6333756,4.7,23,1],
  ['ChIJeXawOgAtPo4RBXc0yjFQkrk','Farmacia Sikuany Barzal','Cl. 33a #39-47',4.1435196,-73.6399509,2.2,20,1],
  ['ChIJkw62HLUvPo4RxPut-8Si7fg','Drogueria Patria Estero','Cra. 12 #16b-04',4.1352884,-73.6129246,4.7,19,1],
  ['ChIJoQzXJBUuPo4R4lsCc_UtzbQ','Drogueria Rosa Blanca','Cra. 33 #6C-23',4.1233176,-73.63099,3.6,18,1],
  ['ChIJFcV-lw4uPo4RBgBqkgFFpTM','Droguería Colsubsidio','Cra. 39 #29C-15, Llano Centro',4.1348782,-73.636949,3.7,16,1],
  ['ChIJjeZD_REtPo4Re4ezlHKdkD0','Cruz verde','Villavicencio',4.1465773,-73.6390842,3.8,15,1],
  ['ChIJC7PQzIEtPo4RSPyQIxdA24w','Patria La Grama - Caudal','Gta. La Grama #45-56',4.1590676,-73.6389127,4.7,15,1],
  ['ChIJn_ulDgAvPo4RdJTsu2peoEQ','Audifarma Llanocentro','Av. 40 #15-67 Local 8',4.1344445,-73.6371606,1.8,15,1],
  ['ChIJZwjIYeQtPo4RZ9tV2QTlWao','Rebate Plus # 1 Barzal Alto','Cl. 35 #35-58',4.1472472,-73.6387853,4.1,13,1],
  ['ChIJSW-BdeMtPo4R8-oBMtF76o8','Droguería Alemana','Cra. 38 #33b-49',4.1451239,-73.6390124,4.3,11,1],
  ['ChIJDSDEpYYtPo4R8AU1u5lWGsI','Droguería Providencia','Av. del Llano #37a-47, Santa Inés',4.1511913,-73.628581,4.9,11,1],
  ['ChIJVefAGQ8uPo4RHVLhP5CDKdc','Droguería Alemana','Cl. 15 #40a-26',4.1349904,-73.6395318,4,11,1],
  ['ChIJ_56Sk9AtPo4RLRZo9awK9Vs','Patria Jy 3','Cl. 35 #16A-84',4.147297,-73.6171297,2.5,11,1],
  ['ChIJ9bOoWu8tPo4RPtWKm4PQaT4','La Rebaja Plus No. 2 Los Centauros','Cra. 31 #37-94',4.1516695,-73.6367109,4.3,10,1],
  ['ChIJ0wygGW8vPo4RRlCdGbmNQYU','Droguería Cuidar Con Calidez','Cra. 44a #14d1',4.132477,-73.6331465,4.3,10,1],
  ['ChIJ2X2TuaotPo4RS_HCWYJd03s','Droguería y Minimarket Farmandy','Cl. 36a #19-37',4.1496915,-73.6211856,3.9,8,1],
  ['ChIJhU3VKu8tPo4RS6l3-j6SSa0','La Rebaja Plus No. 9 Supersia','Cra. 30 #39-02',4.1534041,-73.6359661,4.3,7,1],
  ['ChIJI9tiiHguPo4R-o8tWlCpag4','Drogueria Nacional','Cl. 25 #13b-03',4.1401095,-73.615181,5,7,1],
  ['ChIJ8-qph-QtPo4R0BPPiTCNKak','Droguería Alemana','Cl. 35 #36-55',4.146373,-73.6392046,4.8,6,1],
  ['ChIJsUmPegAtPo4RYQPIyt45sw4','Cruz Verde Droguería','Cra. 30 #37-92',4.1519776,-73.6354577,4.2,6,1],
  ['ChIJYRDKoeMtPo4RNfvahh51fwQ','Rebaja No. 7 Barzal','Cl. 33b #37-66',4.1449707,-73.6386729,4.5,6,1],
  ['ChIJyR8m7-ItPo4RAhdK-aIM2qo','Droguería Alemana','Cra. 40 #05 No. 33',4.1434096,-73.6384164,4.2,6,1],
  ['ChIJn8zvyMotPo4RyiwcxXmatcc','Cruz Verde Unicentro','Av. 40 #26 C-10 Local 1-09',4.1422266,-73.6339124,2.8,6,1],
  ['ChIJtzPqUXsuPo4RVgyO8Z0rjNs','Farmacenter San Andrés G','Cra. 12 #8-11',4.131412,-73.613058,4.3,6,1],
  ['ChIJ_yfnFKgxPo4R7TiLjwlr0UI','Drogueria farmavital CJ','Calle 54 A 35-66, Ciudad Jardín',4.082547,-73.6651486,4.2,6,1],
  ['ChIJS_P8wQgxPo4RfmrJyr_s8jg','Droguerias + Salud','Cl. 53 Sur #35-04, Porfía',4.0833505,-73.6646084,4.3,6,1],
  ['ChIJv8nBHAAvPo4R2q_gjObn5h0','Cruz Verde','Cl. 4 #13-24',4.1285645,-73.6141456,4,6,1],
  ['ChIJr6YlYeMtPo4R8fDvEQx7rMI','Farma Vida','Cra. 36 #36-37, Barzal',4.147628,-73.6396228,5,5,1],
  ['ChIJvwGRVJ0tPo4RjxiRdDHa1hM','Droguería Alemana','Cra. 44c #33B-128',4.1441194,-73.6436744,4.8,5,1],
  ['ChIJgXP34WUuPo4RvI7jYwPBGMA','Farmysalud No. 2 Viscaya','Cra. 20 #47',4.1261353,-73.6171565,3.4,5,1],
  ['ChIJP76EDX0uPo4RqvoNGkvBH-s','Droguería Farmysalud H Y S','Cl. 15 #640',4.132797,-73.6082254,2.6,5,1],
  ['ChIJ4_v0RH8uPo4R6ONGFSiLlro','Drogueria Piedemonte Llanero','Cl. 25 #10A-75',4.1399299,-73.6114091,4.2,5,1],
  ['ChIJlQJ_O-QtPo4Rm1BZVvmYL4M','Droguería Pharmalife Centro','Cra 33 #34A-37, Barzal bajo',4.1476463,-73.6367034,5,4,1],
  ['ChIJY2OdeeUtPo4RBL7OVslVIdI','Drogas La Economía','Cra. 38 #33-74, Centro',4.1507206,-73.6392165,2,4,1],
  ['ChIJ8fDabN0tPo4RwWgsl8uqgXU','Drogueria San Carlos','Cra. 23 #35-1',4.1493158,-73.6287159,4.3,4,1],
  ['ChIJtwnE3XkuPo4R-8sVjkjy1Jk','Droguería Farmysalud H y S','Cl. 18 #152',4.1372474,-73.6180738,4.8,4,1],
  ['ChIJgcXkD88tPo4R9dbfoaQZCmk','Sikuany red de servicios farmacéuticos','Cl. 33a #38-41',4.1438962,-73.6389466,4.3,4,1],
  ['ChIJweS1aOMtPo4RqmkKWginQhk','Super Tienda de la Diabetes','Cra. 39 #34-38, Barzal Alto',4.145554,-73.6400287,4.5,4,1],
  ['ChIJmb6LyCYvPo4RfwCJC5dSjRU','Droguerías Meta','Cra. 44',4.1392917,-73.6432239,5,3,1],
  ['ChIJWRlFYQAvPo4RhXrsMVM3qIs','Pharma Express plus','Cra. 35 A #5a-91',4.1107403,-73.6326205,4.7,3,1],
  ['ChIJozTfmVwvPo4RirrimS2Q5UE','Droguería Colsubsidio','CC Viva, Cl. 7 #45-18',4.1261324,-73.6372087,3,3,1],
  ['ChIJQ6zOfeUtPo4RpQHqIHxc2mU','Dicimed S.A.S.','Cra. 33a #38-26, Centro',4.150921,-73.6392893,5,3,1],
  ['ChIJQ2EjKVkvPo4RcMexWvxDhpQ','Droguería San Pedro RC','Cl. 18 #12c-03',4.1368121,-73.6141466,5,3,1],
  ['ChIJj5crWPovPo4R7lF86uw4Wt4','La Rebaja Plus No. 6 La Esperanza','Cra. 39 #8B-06',4.1251955,-73.6328756,3.3,3,1],
  ['ChIJ2fokGPMxPo4RiciRggkufCI','Droguería Antigua San Jorge Porfía','CR 43 #53-16 Sur',4.082605,-73.66914,4.3,3,1],
  ['ChIJ3Zp8CgAvPo4R85tGOrlYuJw','Cafam Villavicencio - Cra 38','Cra. 38',4.140518,-73.637466,4.7,3,1],
  ['ChIJcyULi_ItPo4R6IiRAkym3uI','Farmacenter Santa María','Cl. 44 #35A-05',4.1588938,-73.6432145,5,2,1],
  ['ChIJ4-7cMOktPo4RsSTnPa5Rjo8','Droguería Lizarazo','Tv. 29 #39-14, Emporio',4.154116,-73.635015,5,2,1],
  ['ChIJh-c0jp0vPo4RnVSgH77x_ug','Drogueria Multillano','Cra. 39 #26c-05',4.1400073,-73.6381762,5,2,1],
  ['ChIJEVi9Lp0vPo4RLp2T7j5SIF4','Colsubsidio entrega medicamentos','Cl 26 C #37-47',4.1404085,-73.6366635,3,2,1],
  ['ChIJi4Dz2XkuPo4RsZNSP24lax4','llanofarma Drogueria','Cl. 19 #16-08',4.1376427,-73.6179577,4,2,1],
  ['ChIJT1WVs30uPo4RSlhCX8KRFKk','Drogeria Villa Johana','Cra. 8 #15c-2',4.1340563,-73.6088482,4.5,2,1],
  ['ChIJD80se3AuPo4RmnS-bdsDlCY','Drogas Mafer','Calle 12 #17-04, Nueva Floresta',4.1329476,-73.6190494,5,2,1],
  ['ChIJed7GiNEvPo4Rad98d32OivY','Cruz Verde','Cra. 43 #26C-19',4.1394722,-73.6410488,3,2,1],
  ['ChIJYYLwt-gtPo4RBs5qDDGZCmc','Cafam','Cl. 37b #29-83',4.1522658,-73.6352477,4,2,0],
  ['ChIJ__T4dgAvPo4R_y735rl0ReM','Farmacia Cafam','Cl 26 C #37-23',4.1404628,-73.6368413,3,2,1],
  ['ChIJNdfd03wuPo4R5JuHCVWWUCQ','Drogueria Todofarma AC','Cl. 8 #9-23',4.1310177,-73.609927,3,2,1],
  ['ChIJ-cqTcRYtPo4RZuQ9TFHewU4','Droguería la economía N°13','Cra. 38 #33-74, Centro',4.1507221,-73.6392072,1,1,1],
  ['ChIJA1oYiOQtPo4Rpo2kNlXgPzY','Droguería Alemana','Cl. 35 #36-25',4.1467939,-73.6389297,5,1,1],
  ['ChIJOY6gcfUtPo4RPBkX3Xi9JbU','Drogas La Economia 8','Cl. 35 #36-13',4.1468881,-73.6388634,1,1,1],
  ['ChIJyb_qbO8tPo4RNUGxhuqK3eQ','Copifam','Cl. 39 #31-74',4.1522597,-73.6380733,5,1,0],
  ['ChIJ9ZWStegtPo4Rpiz1Q2a40lg','La Rebaja Plus No. 5 Marandúa','Cl. 38 #30-17',4.1522986,-73.6357504,5,1,1],
  ['ChIJu1DVOwAtPo4RGJ1uCkqjGwc','Farmacia Sikuany-Famisanar','Cl. 33a #38-41',4.1438965,-73.638943,5,1,1],
  ['ChIJs0_MuOMtPo4RS995BxY36gE','Drogueria Hc+','Calle 33A #36-48, Barzal',4.1446394,-73.6375563,5,1,1],
  ['ChIJbe70xQktPo4RZS8boXmrC64','Distrimedicos julian','Cra. 30 #39-37',4.1534097,-73.6363095,4,1,1],
  ['ChIJQzT7NOAtPo4R3YbBjO1VKc4','La Rebaja Plus No. 4 Nuevo Maizaro','Cra. 33, Cl. 26b #33-11',4.1423981,-73.6329262,5,1,1],
  ['ChIJ7SuheBstPo4RmiArkKu_0h0','Drogueria Disana-R','Cra. 31 #44-09, El Triunfo',4.1581452,-73.6395324,4,1,1],
  ['ChIJbXMil_QtPo4RKCBnKOgJugI','Drogueria FarmaZapata','Cra. 41 #45-10, Panorama',4.1596619,-73.6486427,5,1,1],
  ['ChIJSTqvqXIuPo4RUB_Ey3vaIEY','la rebaja plus','Cl. 15, La Esperanza Etapa 7',4.1312686,-73.629517,1,1,1],
  ['ChIJqS3JgxQuPo4R5ZUFwW-K0QY','Droguerías farmacenter','Cra. 39 #9B-06, La Esperanza',4.1261414,-73.6325564,5,1,0],
  ['ChIJCyLmRQAtPo4RG_oza0OpUNA','PHARMA EXPRESS PLUS 02','Cra 36 #6-82',4.1107393,-73.6326274,5,1,1],
  ['ChIJJe-CR1nIuPo4R1484uX-cCOA','Farma Droguería Beltrán','Cra. 36 #17-2',4.1335516,-73.62964,4,1,1],
  ['ChIJmxkl390vPo4RQV5IvCl1IvI','RJB Pharma','Siete de Agosto',4.1399521,-73.6381367,3,1,1],
  ['ChIJiSTNSXkuPo4Rtj-iLGGSGvA','Drogueria Luisalud','Cra. 12 #18-07, Villa Ortiz',4.1369529,-73.612961,5,1,1],
  ['ChIJWd8QewAvPo4R8Oocyy_LACU','Droguerías Sami','Cra. 12c #26a-14, El Popular',4.1393421,-73.614298,5,1,1],
  ['ChIJ97Kzsl0tPo4Ruvt3lzehwR0','Drogueria Farma Mia 2','Villavicencio',4.1448283,-73.6118726,5,1,1],
  ['ChIJGaju8aEtPo4Ri-IEggVKWYs','DROGUERIA SERVICOLOMBIA','Calle 31 #14-05',4.1441359,-73.6146389,4,1,1],
  ['ChIJuaRFKgAtPo4RUEvgCY0eviM','Droguería Distrimet Plus','Cra. 5B #35A-26',4.1454285,-73.6059551,5,1,1],
  ['ChIJmTmo3nUtPo4RmP6zZpmlWJQ','DROGUERIA DE LOS LLANOS G&L','Cra. 17 #31a-41',4.1456799,-73.6175099,5,1,1],
  ['ChIJK49dcBMuPo4R_JWPC1kuCps','Nacional de Drogueria','Cl. 10b Sur #37-06, Esperanza',4.1270656,-73.6324337,4,1,1],
  ['ChIJa0KvvhEuPo4Rt_NRkMBi2Gk','Todofarma','Cra. 43 #11-02, Esperanza',4.1298909,-73.6377449,5,1,0],
  ['ChIJ-f0kpjgvPo4Rf5CtmcjHlHU','MEDICAL SALUD JP','Cl. 8c, La Esperanza 6ta Etapa',4.129637,-73.623047,5,1,1],
  ['ChIJcdbXqqExPo4RL9DB0p0fgHo','Droguería y Minimarket Farmallanos','Cra. 43 #55 Sur-28, Porfía',4.0708117,-73.6695452,1,1,1],
  ['ChIJmfyCwhYwPo4RgVNUrcl91ug','DROGUERIA NOVAFARMA DYG','Cra. 43, Porfía',4.0791125,-73.6692198,5,1,1],
  ['ChIJCxT0wc6bP44RJrv3MDCjsQc','Cruz Verde Primavera','Cl. 15 #40-01',4.1343241,-73.6401622,3,1,1],
  ['ChIJkdzvNgAvPo4RfYzEMVRr5pc','Cruz Verde Bilbao','Cra. 35 A #5-20 Sur',4.1107651,-73.631511,5,1,1],
  ['ChIJSeaL4ggvPo4R6pQFNLIZG7Q','Farmacenter San Andrés G2','Cra. 19 #12-57',4.1338459,-73.6218482,5,1,1],
  ['ChIJr5L1wSowPo4RkGOZQ51YSRA','Farmacenter JC Guatape II','Calle 28 Sur #37-43',4.1011241,-73.6554455,1,1,1],
  ['ChIJrZ9yKu8tPo4RQkSeT9zv6Cg','Drogueria La Economia','Cra. 30 #38-2',4.1534577,-73.6360292,4,1,0],
  ['ChIJf34-u8wtPo4Rn-0OQr17rz0','Drogas La Economia','Cra. 29 #68 #37',4.1533728,-73.6351174,2,1,0],
  ['ChIJu_VqyRYuPo4RXeUYHd85NN4','Cafam','Cl. 7A #45-185',4.1261349,-73.6376791,5,1,0],
  ['ChIJ16paSu8tPo4RcIJj51LbowU','Nueva Droguería De Los Llanos','Cra. 32 #37-09',4.152227,-73.6362565,4.5,2,0],
  ['ChIJTb3v6OUtPo4RyKBKsAPoivI','Drogueria El Estero','Calle 36 #31A-18, Centro',4.1500734,-73.6368281,5,2,0],
  ['ChIJ_yk68GUtPo4RchfOqrgfE2c','Cruz Verde','Cl. 46 #31-14',4.1596102,-73.6392205,0,0,1],
  ['ChIJB6Q3Y9ctPo4R7te03ZtbR7c','Droguería Colsubsidio','Cra. 30 #39-33',4.1534029,-73.636314,0,0,1],
  ['ChIJeU1JfeMtPo4R31--En2mJPE','Copifam','Cra. 38 #35-08, Barzal',4.1468512,-73.6388817,0,0,0],
  ['ChIJG9VLoewtPo4RiMoTuOBbNPw','Farmacenter Don Jota','DG 48 #25-11, Triangulo',4.1599797,-73.636277,0,0,0],
  ['ChIJg9S9Ju8tPo4R8MRLajeT-l8','La Economía','Cra. 30a #39, Centro',4.1534002,-73.6369033,0,0,0],
  ['ChIJmyz4z-EtPo4RRL7ISaNPG2A','Cafam Unicentro','Av. 40 #33-00, C.C. Unicentro',4.1418358,-73.6337415,0,0,0],
];

function cadenaDe(nombre: string): string {
  const n = nombre.toLowerCase();
  if (n.includes('rebaja') || n.includes('rebate')) return 'La Rebaja';
  if (n.includes('cruz verde')) return 'Cruz Verde';
  if (n.includes('farmacenter')) return 'Farmacenter';
  if (n.includes('econom')) return 'La Economía';
  if (n.includes('cafam')) return 'Cafam';
  if (n.includes('audifarma')) return 'Audifarma';
  if (n.includes('copifam')) return 'Copifam';
  if (n.includes('colsubsidio')) return 'Colsubsidio';
  if (n.includes('alemana')) return 'Droguería Alemana';
  if (n.includes('pasteur')) return 'Pasteur';
  return 'Independiente';
}

function barrioDe(direccion: string): string {
  const d = direccion.toLowerCase();
  const mapa: [string, string][] = [
    ['barzal', 'El Barzal'], ['esperanza', 'La Esperanza'], ['porfia', 'Porfía'],
    ['siete de agosto', 'Siete de Agosto'], ['maizaro', 'Siete de Agosto'],
    ['centauros', 'Centro'], ['la grama', 'La Grama'], ['caudal', 'El Caudal'],
    ['santa helena', 'Santa Helena'], ['buque', 'Porfía'], ['rosa blanca', 'Rosa Blanca'],
    ['villajulia', 'Centro'], ['emporio', 'Centro'], ['popular', 'El Popular'],
  ];
  for (const [clave, barrio] of mapa) if (d.includes(clave)) return barrio;
  return 'Centro';
}

export const drogueriasVillavicencio: Drogueria[] = FILAS.map((f, i) => ({
  id: i + 1,
  placeId: f[0],
  nombre: f[1],
  direccion: f[2],
  lat: f[3],
  lng: f[4],
  rating: f[5] || undefined,
  resenas: f[6] || undefined,
  conFoto: f[7] === 1,
  comuna: comunaDe(barrioDe(f[2]), f[2], f[3], f[4]),
  cadena: cadenaDe(f[1]),
  barrio: barrioDe(f[2]),
  ciudad: 'Villavicencio',
  telefono: '',
  whatsapp: '',
  horario: 'Consultar horario',
  es24h: f[1].toLowerCase().includes('24 horas'),
  domicilio: false,
  afiliada: false,
  destacada: f[6] >= 20,
}));

export function calificacionDrogueria(id: number): string {
  const d = drogueriasVillavicencio.find((x) => x.id === id);
  return d?.rating != null ? d.rating.toFixed(1) : '—';
}

export function resenasDrogueria(id: number): number {
  const d = drogueriasVillavicencio.find((x) => x.id === id);
  return d?.resenas ?? 0;
}
