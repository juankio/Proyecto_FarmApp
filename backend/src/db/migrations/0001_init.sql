PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS usuarios (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  nombres       TEXT NOT NULL,
  apellidos     TEXT NOT NULL,
  email         TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  rol           TEXT NOT NULL DEFAULT 'usuario' CHECK (rol IN ('usuario', 'admin')),
  creado_en     TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS medicamentos (
  id             INTEGER PRIMARY KEY AUTOINCREMENT,
  nombre         TEXT NOT NULL UNIQUE,
  laboratorio    TEXT NOT NULL,
  presentacion   TEXT NOT NULL,
  concentracion  TEXT,
  descripcion    TEXT,
  imagen_url     TEXT,
  creado_en      TEXT NOT NULL DEFAULT (datetime('now')),
  actualizado_en TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS encuestas (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  usuario_id   INTEGER REFERENCES usuarios(id) ON DELETE SET NULL,
  nombre       TEXT,
  email        TEXT,
  calificacion INTEGER NOT NULL CHECK (calificacion BETWEEN 1 AND 5),
  comentario   TEXT NOT NULL,
  recomendaria INTEGER NOT NULL CHECK (recomendaria IN (0, 1)),
  creado_en    TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS contactos (
  id        INTEGER PRIMARY KEY AUTOINCREMENT,
  nombre    TEXT NOT NULL,
  email     TEXT NOT NULL,
  asunto    TEXT NOT NULL,
  mensaje   TEXT NOT NULL,
  leido     INTEGER NOT NULL DEFAULT 0 CHECK (leido IN (0, 1)),
  creado_en TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS schema_migrations (
  nombre      TEXT PRIMARY KEY,
  aplicada_en TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_medicamentos_nombre ON medicamentos(nombre);
CREATE INDEX IF NOT EXISTS idx_encuestas_creado_en ON encuestas(creado_en DESC);
CREATE INDEX IF NOT EXISTS idx_contactos_leido ON contactos(leido, creado_en DESC);
