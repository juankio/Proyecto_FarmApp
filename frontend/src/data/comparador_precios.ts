import { drogueriasVillavicencio } from './droguerias';

export type OfertaDrogueria = {
  drogueriaId: number;
  drogueriaNombre: string;
  barrio: string;
  precio: number;
  disponible: boolean;
  telefono: string;
  whatsapp: string;
  direccion: string;
};

export type InfoComparativa = {
  medicamentoNombre: string;
  requiereReceta: boolean;
  categoria: string;
  descripcionUso: string;
  mejorPrecio: number;
  precioPromedio: number;
  ofertas: OfertaDrogueria[];
};

type BaseMedicamento = {
  nombre: string;
  concentracion: string;
  categoria: string;
  descripcion: string;
  precio: number;
  receta: boolean;
};

// Precios de referencia para comparar; siempre se confirman con la droguería por WhatsApp.
const BASE: BaseMedicamento[] = [
  { nombre: 'Acetaminofén', concentracion: '500 mg', categoria: 'Analgésico / Antipirético', descripcion: 'Dolor leve a moderado y fiebre.', precio: 3200, receta: false },
  { nombre: 'Ibuprofeno', concentracion: '400 mg', categoria: 'Antiinflamatorio', descripcion: 'Dolor, inflamación y fiebre.', precio: 4500, receta: false },
  { nombre: 'Amoxicilina', concentracion: '500 mg', categoria: 'Antibiótico', descripcion: 'Infecciones bacterianas. Requiere prescripción.', precio: 12800, receta: true },
  { nombre: 'Loratadina', concentracion: '10 mg', categoria: 'Antialérgico', descripcion: 'Alergias y rinitis.', precio: 3900, receta: false },
  { nombre: 'Metformina', concentracion: '850 mg', categoria: 'Antidiabético', descripcion: 'Control de glucosa. Requiere prescripción.', precio: 8900, receta: true },
  { nombre: 'Omeprazol', concentracion: '20 mg', categoria: 'Gastroprotector', descripcion: 'Acidez y reflujo.', precio: 6200, receta: false },
  { nombre: 'Salbutamol', concentracion: '100 mcg', categoria: 'Broncodilatador', descripcion: 'Asma y broncoespasmo. Requiere prescripción.', precio: 7400, receta: true },
  { nombre: 'Atorvastatina', concentracion: '20 mg', categoria: 'Estatinas', descripcion: 'Colesterol. Requiere prescripción.', precio: 15500, receta: true },
  { nombre: 'Cetirizina', concentracion: '10 mg', categoria: 'Antialérgico', descripcion: 'Alergias estacionales.', precio: 4100, receta: false },
  { nombre: 'Enalapril', concentracion: '10 mg', categoria: 'Antihipertensivo', descripcion: 'Presión arterial. Requiere prescripción.', precio: 9700, receta: true },
  { nombre: 'Paracetamol infantil', concentracion: '250 mg/5 mL', categoria: 'Pediatría', descripcion: 'Fiebre en niños.', precio: 5600, receta: false },
  { nombre: 'Ácido fólico', concentracion: '5 mg', categoria: 'Vitamina', descripcion: 'Suplemento prenatal.', precio: 3400, receta: false },
  { nombre: 'Advil', concentracion: '400 mg', categoria: 'Analgésico de marca', descripcion: 'Dolor de cabeza, muscular y fiebre.', precio: 8900, receta: false },
  { nombre: 'Advil Cold & Sinus', concentracion: '200 mg / 30 mg', categoria: 'Resfriado', descripcion: 'Congestión nasal, dolor y fiebre.', precio: 11500, receta: false },
  { nombre: 'Tylenol', concentracion: '500 mg', categoria: 'Analgésico de marca', descripcion: 'Dolor y fiebre.', precio: 7600, receta: false },
  { nombre: 'Tempra', concentracion: '100 mg/5 mL', categoria: 'Pediatría', descripcion: 'Fiebre en niños.', precio: 8200, receta: false },
  { nombre: 'Vick VapoRub', concentracion: 'Alcanfor / mentol', categoria: 'Descongestivo tópico', descripcion: 'Ungüento para pecho y espalda.', precio: 6800, receta: false },
  { nombre: 'Vick Synex', concentracion: '120 mL', categoria: 'Jarabe para la tos', descripcion: 'Tos y congestión.', precio: 9200, receta: false },
  { nombre: 'Benadryl', concentracion: '25 mg', categoria: 'Antialérgico de marca', descripcion: 'Alergias y urticaria.', precio: 7900, receta: false },
  { nombre: 'Centrum', concentracion: 'Multivitamínico', categoria: 'Suplemento', descripcion: 'Vitaminas y minerales diarios.', precio: 28900, receta: false },
  { nombre: 'Redoxon', concentracion: '1000 mg', categoria: 'Vitamina C', descripcion: 'Apoyo inmunológico.', precio: 12500, receta: false },
  { nombre: 'Ensure', concentracion: '400 g', categoria: 'Suplemento nutricional', descripcion: 'Nutrición oral para adultos.', precio: 45900, receta: false },
  { nombre: 'Electral', concentracion: 'Sales orales', categoria: 'Rehidratación', descripcion: 'Diarrea o deshidratación.', precio: 3900, receta: false },
  { nombre: 'Buscapina', concentracion: '10 mg', categoria: 'Antiespasmódico', descripcion: 'Dolor abdominal y cólicos.', precio: 9800, receta: false },
  { nombre: 'Dolo-Neurobión', concentracion: 'Complexo B', categoria: 'Analgésico neural', descripcion: 'Dolor neural y muscular.', precio: 13900, receta: false },
];

const IDS_DROGUERIAS = [1, 2, 3, 7, 8, 11, 12, 17, 20, 24, 29, 30];

const CONTACTOS: Record<number, { telefono: string; whatsapp: string }> = {
  1: { telefono: '+57 323 2254770', whatsapp: '573232254770' },
  3: { telefono: '+57 323 2254770', whatsapp: '573232254770' },
  7: { telefono: '+57 1 800 0999991', whatsapp: '5718000999991' },
  8: { telefono: '+57 601 4865000', whatsapp: '576014865000' },
  11: { telefono: '+57 608 6621570', whatsapp: '576086621570' },
  12: { telefono: '+57 321 3774119', whatsapp: '573213774119' },
  17: { telefono: '+57 608 6727565', whatsapp: '576086727565' },
  20: { telefono: '+57 310 5508157', whatsapp: '573105508157' },
  24: { telefono: '+57 316 3637985', whatsapp: '573163637985' },
  29: { telefono: '+57 322 3406415', whatsapp: '573223406415' },
};

function ofertasDe(precioBase: number, idMedicamento: number): OfertaDrogueria[] {
  return IDS_DROGUERIAS.map((id, indice) => {
    const d = drogueriasVillavicencio.find((x) => x.id === id);
    if (!d) return null;
    return {
      drogueriaId: d.id,
      drogueriaNombre: d.nombre,
      barrio: d.barrio,
      precio: precioBase + indice * 120 + ((id * idMedicamento) % 5) * 90,
      disponible: true,
      telefono: CONTACTOS[d.id]?.telefono ?? d.telefono,
      whatsapp: CONTACTOS[d.id]?.whatsapp ?? d.whatsapp,
      direccion: d.direccion,
    };
  }).filter((o): o is OfertaDrogueria => o !== null);
}

export const COMPARATIVA_MEDICAMENTOS: Record<string, InfoComparativa> = Object.fromEntries(
  BASE.map((med, indice) => {
    const ofertas = ofertasDe(med.precio, indice + 1);
    return [
      med.nombre,
      {
        medicamentoNombre: `${med.nombre} ${med.concentracion}`,
        requiereReceta: med.receta,
        categoria: med.categoria,
        descripcionUso: med.descripcion,
        mejorPrecio: med.precio,
        precioPromedio: Math.round(ofertas.reduce((s, o) => s + o.precio, 0) / Math.max(ofertas.length, 1)),
        ofertas,
      },
    ];
  }),
);

function comparativaGenerica(nombre: string): InfoComparativa {
  const hash = Array.from(nombre).reduce((s, c) => s + c.charCodeAt(0), 0);
  const precio = 2800 + (hash % 42) * 450;
  const ofertas = ofertasDe(precio, hash % 13 + 1);
  return {
    medicamentoNombre: nombre,
    requiereReceta: false,
    categoria: 'Producto de farmacia',
    descripcionUso: 'Producto de uso común. Confirma precio y disponibilidad con la droguería.',
    mejorPrecio: precio,
    precioPromedio: Math.round(ofertas.reduce((s, o) => s + o.precio, 0) / Math.max(ofertas.length, 1)),
    ofertas,
  };
}

export function obtenerComparativa(nombre: string): InfoComparativa {
  const normalizar = (valor: string) => valor.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const buscado = normalizar(nombre);
  const clave = Object.keys(COMPARATIVA_MEDICAMENTOS).find((k) => buscado.includes(normalizar(k)));
  return (clave && COMPARATIVA_MEDICAMENTOS[clave]) || comparativaGenerica(nombre);
}
