import cors from 'cors';
import express from 'express';
import path from 'node:path';
import { env } from './config/env';
import { errorHandler } from './middlewares/errorHandler';
import { apiRouter } from './routes';
import { sendFail } from './utils/apiResponse';

const app = express();

app.disable('x-powered-by');
app.use(cors({ origin: env.CORS_ORIGIN }));
app.use(express.json());

app.use('/api', apiRouter);

const frontendRoot = path.resolve(import.meta.dir, '../../src');
app.use(express.static(frontendRoot));

app.use((_req, res) => sendFail(res, 404, 'NO_ENCONTRADO', 'Ruta no encontrada'));
app.use(errorHandler);

app.listen(env.PORT, () => {
  console.log(`[farmapp] API y frontend en http://localhost:${env.PORT}`);
});
