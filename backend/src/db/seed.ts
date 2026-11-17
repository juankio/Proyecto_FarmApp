import { db } from '../config/database';
import { env } from '../config/env';
import { hashPassword } from '../utils/password';

type Medicamento = {
  nombre: string;
  laboratorio: string;
  presentacion: string;
  concentracion: string;
  descripcion: string;
};

const medicamentos: Medicamento[] = [
  { nombre: 'Acetaminofén', laboratorio: 'Genérico', presentacion: 'Tableta', concentracion: '500 mg', descripcion: 'Analgésico y antipirético para aliviar dolor leve a moderado y fiebre.' },
  { nombre: 'Ibuprofeno', laboratorio: 'Genérico', presentacion: 'Tableta', concentracion: '400 mg', descripcion: 'Antiinflamatorio no esteroideo para dolor, inflamación y fiebre.' },
  { nombre: 'Amoxicilina', laboratorio: 'Genérico', presentacion: 'Cápsula', concentracion: '500 mg', descripcion: 'Antibiótico de amplio espectro. Requiere prescripción médica.' },
  { nombre: 'Loratadina', laboratorio: 'Genérico', presentacion: 'Tableta', concentracion: '10 mg', descripcion: 'Antihistamínico para el alivio de síntomas de alergia.' },
  { nombre: 'Metformina', laboratorio: 'Genérico', presentacion: 'Tableta', concentracion: '850 mg', descripcion: 'Antidiabético oral para el control de glucosa en sangre.' },
  { nombre: 'Omeprazol', laboratorio: 'Genérico', presentacion: 'Cápsula', concentracion: '20 mg', descripcion: 'Inhibidor de bomba de protones para el ácido gástrico.' },
  { nombre: 'Atorvastatina', laboratorio: 'Genérico', presentacion: 'Tableta', concentracion: '20 mg', descripcion: 'Estatina para el control de colesterol.' },
  { nombre: 'Enalapril', laboratorio: 'Genérico', presentacion: 'Tableta', concentracion: '10 mg', descripcion: 'Inhibidor de ECA para el control de la presión arterial.' },
  { nombre: 'Salbutamol', laboratorio: 'Genérico', presentacion: 'Inhalador', concentracion: '100 mcg', descripcion: 'Broncodilatador de acción corta para el asma.' },
  { nombre: 'Paracetamol infantil', laboratorio: 'Genérico', presentacion: 'Suspensión', concentracion: '250 mg/5 mL', descripcion: 'Antipirético pediátrico en suspensión oral.' },
  { nombre: 'Cetirizina', laboratorio: 'Genérico', presentacion: 'Tableta', concentracion: '10 mg', descripcion: 'Antihistamínico para rinitis alérgica y urticaria.' },
  { nombre: 'Ácido fólico', laboratorio: 'Genérico', presentacion: 'Tableta', concentracion: '5 mg', descripcion: 'Suplemento vitamínico indicado en embarazo y déficit.' },
];

const admin = db.query<{ id: number }, [string]>('SELECT id FROM usuarios WHERE email = ?').get(env.ADMIN_SEED_EMAIL);
if (!admin) {
  db.prepare(`INSERT INTO usuarios (nombres, apellidos, email, password_hash, rol)
              VALUES (?, ?, ?, ?, 'admin')`)
    .run('Admin', 'FarmApp', env.ADMIN_SEED_EMAIL, await hashPassword(env.ADMIN_SEED_PASSWORD));
  console.log('[seed] admin creado');
} else {
  console.log('[seed] admin ya existe');
}

const insert = db.prepare(`INSERT INTO medicamentos (nombre, laboratorio, presentacion, concentracion, descripcion)
                           VALUES (?, ?, ?, ?, ?) ON CONFLICT(nombre) DO NOTHING`);
for (const m of medicamentos) {
  insert.run(m.nombre, m.laboratorio, m.presentacion, m.concentracion, m.descripcion);
}
console.log(`[seed] ${medicamentos.length} medicamentos procesados`);
