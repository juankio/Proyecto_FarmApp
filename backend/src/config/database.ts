import { Database } from 'bun:sqlite';
import path from 'node:path';
import { env } from './env';

const backendRoot = path.resolve(import.meta.dir, '../..');
const dbPath = path.isAbsolute(env.DB_PATH) ? env.DB_PATH : path.resolve(backendRoot, env.DB_PATH);

export const db = new Database(dbPath);
db.exec('PRAGMA foreign_keys = ON; PRAGMA journal_mode = WAL;');
