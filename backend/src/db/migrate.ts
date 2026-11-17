import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { db } from '../config/database';

const dir = path.join(import.meta.dir, 'migrations');

db.exec(`CREATE TABLE IF NOT EXISTS schema_migrations (
  nombre TEXT PRIMARY KEY,
  aplicada_en TEXT NOT NULL DEFAULT (datetime('now'))
)`);

const aplicadas = new Set(db.query<{ nombre: string }, []>('SELECT nombre FROM schema_migrations').all().map((f) => f.nombre));
const archivos = readdirSync(dir).filter((f) => f.endsWith('.sql')).sort();

for (const archivo of archivos) {
  if (aplicadas.has(archivo)) continue;
  const sql = readFileSync(path.join(dir, archivo), 'utf8');
  db.transaction(() => {
    db.exec(sql);
    db.prepare('INSERT INTO schema_migrations (nombre) VALUES (?)').run(archivo);
  })();
  console.log(`[migrate] aplicada ${archivo}`);
}

console.log(`[migrate] ok (${archivos.length} archivos, ${archivos.length - aplicadas.size} nuevos)`);
