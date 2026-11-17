export type Medicamento = {
  id: number;
  nombre: string;
  laboratorio: string;
  presentacion: string;
  concentracion: string | null;
  descripcion: string | null;
  imagen_url: string | null;
  creado_en: string;
  actualizado_en: string;
};

export type Encuesta = {
  id: number;
  usuario_id: number | null;
  nombre: string | null;
  email: string | null;
  calificacion: number;
  comentario: string;
  recomendaria: number;
  creado_en: string;
};

export type Contacto = {
  id: number;
  nombre: string;
  email: string;
  asunto: string;
  mensaje: string;
  leido: number;
  creado_en: string;
};

export type Paginado<T> = { items: T[]; total: number };
