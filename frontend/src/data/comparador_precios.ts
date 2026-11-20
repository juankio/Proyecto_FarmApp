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

export const COMPARATIVA_MEDICAMENTOS: Record<string, InfoComparativa> = {
  Acetaminofén: {
    medicamentoNombre: 'Acetaminofén 500 mg',
    requiereReceta: false,
    categoria: 'Analgésico / Antipirético',
    descripcionUso: 'Alivio eficaz de dolor leve a moderado y control de fiebre. De venta libre.',
    mejorPrecio: 3200,
    precioPromedio: 4200,
    ofertas: [
      {
        drogueriaId: 7,
        drogueriaNombre: 'Droguería La Esquina - Montecarlo',
        barrio: 'Montecarlo',
        precio: 3200,
        disponible: true,
        telefono: '(608) 684-2100',
        whatsapp: '573142220707',
        direccion: 'Calle 12 Sur # 22-04',
      },
      {
        drogueriaId: 4,
        drogueriaNombre: 'Droguería San Jorge - Porfía',
        barrio: 'Porfía',
        precio: 3500,
        disponible: true,
        telefono: '(608) 683-9012',
        whatsapp: '573158880404',
        direccion: 'Carrera 43 # 52-10',
      },
      {
        drogueriaId: 3,
        drogueriaNombre: 'Droguería La Economía - Esperanza',
        barrio: 'La Esperanza',
        precio: 3900,
        disponible: true,
        telefono: '(608) 668-1234',
        whatsapp: '573136660303',
        direccion: 'Calle 15 # 38-40',
      },
      {
        drogueriaId: 1,
        drogueriaNombre: 'Drogas La Rebaja - Centro Principal',
        barrio: 'Centro',
        precio: 4500,
        disponible: true,
        telefono: '(608) 662-3400',
        whatsapp: '573105550101',
        direccion: 'Calle 38 # 31-20',
      },
      {
        drogueriaId: 2,
        drogueriaNombre: 'Cruz Verde - Sede Barzal Salud',
        barrio: 'El Barzal',
        precio: 4800,
        disponible: true,
        telefono: '(608) 670-8800',
        whatsapp: '573124440202',
        direccion: 'Cra. 40 # 33B-15',
      },
    ],
  },
  Ibuprofeno: {
    medicamentoNombre: 'Ibuprofeno 400 mg',
    requiereReceta: false,
    categoria: 'Antiinflamatorio (AINE)',
    descripcionUso: 'Alivia dolor muscular, inflamación y dolores menstruales o articulares.',
    mejorPrecio: 4500,
    precioPromedio: 5800,
    ofertas: [
      {
        drogueriaId: 8,
        drogueriaNombre: 'Droguería Comunitaria Catumare',
        barrio: 'Catumare',
        precio: 4500,
        disponible: true,
        telefono: '(608) 682-1199',
        whatsapp: '573173330808',
        direccion: 'Mz 14 Casa 2',
      },
      {
        drogueriaId: 5,
        drogueriaNombre: 'Farmacenter La 40 - Siete de Agosto',
        barrio: 'Siete de Agosto',
        precio: 5200,
        disponible: true,
        telefono: '(608) 671-5544',
        whatsapp: '573117770505',
        direccion: 'Av. 40 # 26C-10',
      },
      {
        drogueriaId: 1,
        drogueriaNombre: 'Drogas La Rebaja - Centro Principal',
        barrio: 'Centro',
        precio: 6000,
        disponible: true,
        telefono: '(608) 662-3400',
        whatsapp: '573105550101',
        direccion: 'Calle 38 # 31-20',
      },
    ],
  },
  Amoxicilina: {
    medicamentoNombre: 'Amoxicilina 500 mg',
    requiereReceta: true,
    categoria: 'Antibiótico Betalactámico',
    descripcionUso: 'Tratamiento de infecciones bacterianas. Requiere fórmula médica vigente.',
    mejorPrecio: 9800,
    precioPromedio: 12500,
    ofertas: [
      {
        drogueriaId: 9,
        drogueriaNombre: 'Droguería Multidrogas - San Benito',
        barrio: 'San Benito',
        precio: 9800,
        disponible: true,
        telefono: '(608) 664-5080',
        whatsapp: '573184440909',
        direccion: 'Calle 35 # 24-18',
      },
      {
        drogueriaId: 2,
        drogueriaNombre: 'Cruz Verde - Sede Barzal Salud',
        barrio: 'El Barzal',
        precio: 11500,
        disponible: true,
        telefono: '(608) 670-8800',
        whatsapp: '573124440202',
        direccion: 'Cra. 40 # 33B-15',
      },
      {
        drogueriaId: 1,
        drogueriaNombre: 'Drogas La Rebaja - Centro Principal',
        barrio: 'Centro',
        precio: 13200,
        disponible: true,
        telefono: '(608) 662-3400',
        whatsapp: '573105550101',
        direccion: 'Calle 38 # 31-20',
      },
    ],
  },
  Loratadina: {
    medicamentoNombre: 'Loratadina 10 mg',
    requiereReceta: false,
    categoria: 'Antihistamínico',
    descripcionUso: 'Alivia rinitis alérgica, estornudos y picazón ocular o cutánea.',
    mejorPrecio: 3800,
    precioPromedio: 4900,
    ofertas: [
      {
        drogueriaId: 7,
        drogueriaNombre: 'Droguería La Esquina - Montecarlo',
        barrio: 'Montecarlo',
        precio: 3800,
        disponible: true,
        telefono: '(608) 684-2100',
        whatsapp: '573142220707',
        direccion: 'Calle 12 Sur # 22-04',
      },
      {
        drogueriaId: 3,
        drogueriaNombre: 'Droguería La Economía - Esperanza',
        barrio: 'La Esperanza',
        precio: 4200,
        disponible: true,
        telefono: '(608) 668-1234',
        whatsapp: '573136660303',
        direccion: 'Calle 15 # 38-40',
      },
      {
        drogueriaId: 6,
        drogueriaNombre: 'Droguerías Pasteur - CC Viva',
        barrio: 'Siete de Agosto',
        precio: 5500,
        disponible: true,
        telefono: '(608) 681-3322',
        whatsapp: '573209990606',
        direccion: 'Cra. 40 # 26C-10',
      },
    ],
  },
  Metformina: {
    medicamentoNombre: 'Metformina 850 mg',
    requiereReceta: true,
    categoria: 'Antidiabético Oral',
    descripcionUso: 'Control glicémico en diabetes tipo 2. Uso estricto bajo prescripción médica.',
    mejorPrecio: 8200,
    precioPromedio: 10400,
    ofertas: [
      {
        drogueriaId: 4,
        drogueriaNombre: 'Droguería San Jorge - Porfía',
        barrio: 'Porfía',
        precio: 8200,
        disponible: true,
        telefono: '(608) 683-9012',
        whatsapp: '573158880404',
        direccion: 'Carrera 43 # 52-10',
      },
      {
        drogueriaId: 2,
        drogueriaNombre: 'Cruz Verde - Sede Barzal Salud',
        barrio: 'El Barzal',
        precio: 9900,
        disponible: true,
        telefono: '(608) 670-8800',
        whatsapp: '573124440202',
        direccion: 'Cra. 40 # 33B-15',
      },
    ],
  },
  Omeprazol: {
    medicamentoNombre: 'Omeprazol 20 mg',
    requiereReceta: false,
    categoria: 'Inhibidor de Bomba de Protones',
    descripcionUso: 'Tratamiento de reflujo gastroesofágico, acidez y gastritis.',
    mejorPrecio: 5000,
    precioPromedio: 6800,
    ofertas: [
      {
        drogueriaId: 10,
        drogueriaNombre: 'Droguería Los Fundadores',
        barrio: 'Los Fundadores',
        precio: 5000,
        disponible: true,
        telefono: '(608) 667-4321',
        whatsapp: '573161111010',
        direccion: 'Cra. 23 # 12-40',
      },
      {
        drogueriaId: 5,
        drogueriaNombre: 'Farmacenter La 40 - Siete de Agosto',
        barrio: 'Siete de Agosto',
        precio: 6500,
        disponible: true,
        telefono: '(608) 671-5544',
        whatsapp: '573117770505',
        direccion: 'Av. 40 # 26C-10',
      },
    ],
  },
  Salbutamol: {
    medicamentoNombre: 'Salbutamol Inhalador 100 mcg',
    requiereReceta: true,
    categoria: 'Broncodilatador',
    descripcionUso: 'Alivio rápido de broncoespasmo en asma o EPOC. Requiere fórmula médica.',
    mejorPrecio: 14500,
    precioPromedio: 18200,
    ofertas: [
      {
        drogueriaId: 3,
        drogueriaNombre: 'Droguería La Economía - Esperanza',
        barrio: 'La Esperanza',
        precio: 14500,
        disponible: true,
        telefono: '(608) 668-1234',
        whatsapp: '573136660303',
        direccion: 'Calle 15 # 38-40',
      },
      {
        drogueriaId: 1,
        drogueriaNombre: 'Drogas La Rebaja - Centro Principal',
        barrio: 'Centro',
        precio: 16900,
        disponible: true,
        telefono: '(608) 662-3400',
        whatsapp: '573105550101',
        direccion: 'Calle 38 # 31-20',
      },
    ],
  },
};

export function obtenerComparativa(nombre: string): InfoComparativa {
  // Búsqueda aproximada por coincidencia de nombre
  const key = Object.keys(COMPARATIVA_MEDICAMENTOS).find((k) =>
    nombre.toLowerCase().includes(k.toLowerCase()) || k.toLowerCase().includes(nombre.toLowerCase()),
  );

  if (key && COMPARATIVA_MEDICAMENTOS[key]) {
    return COMPARATIVA_MEDICAMENTOS[key];
  }

  // Generador dinámico coherente para medicamentos sin ficha específica
  return {
    medicamentoNombre: nombre,
    requiereReceta: false,
    categoria: 'Uso terapéutico general',
    descripcionUso: 'Consulta disponibilidad en droguerías de Villavicencio.',
    mejorPrecio: 4500,
    precioPromedio: 5800,
    ofertas: [
      {
        drogueriaId: 7,
        drogueriaNombre: 'Droguería La Esquina - Montecarlo',
        barrio: 'Montecarlo',
        precio: 4500,
        disponible: true,
        telefono: '(608) 684-2100',
        whatsapp: '573142220707',
        direccion: 'Calle 12 Sur # 22-04',
      },
      {
        drogueriaId: 1,
        drogueriaNombre: 'Drogas La Rebaja - Centro Principal',
        barrio: 'Centro',
        precio: 5800,
        disponible: true,
        telefono: '(608) 662-3400',
        whatsapp: '573105550101',
        direccion: 'Calle 38 # 31-20',
      },
    ],
  };
}
