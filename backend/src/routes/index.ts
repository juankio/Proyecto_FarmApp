import { Router } from 'express';
import { sendOk } from '../utils/apiResponse';
import { authRouter } from './auth.routes';
import { contactosRouter } from './contactos.routes';
import { encuestasRouter } from './encuestas.routes';
import { medicamentosRouter } from './medicamentos.routes';

export const apiRouter = Router();

apiRouter.get('/health', (_req, res) => {
  sendOk(res, 200, { status: 'ok', uptime: process.uptime() }, 'Servidor activo');
});

apiRouter.use('/auth', authRouter);
apiRouter.use('/medicamentos', medicamentosRouter);
apiRouter.use('/encuestas', encuestasRouter);
apiRouter.use('/contactos', contactosRouter);
