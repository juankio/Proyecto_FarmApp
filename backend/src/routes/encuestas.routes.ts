import { Router } from 'express';
import * as controller from '../controllers/encuestas.controller';
import { authenticate, requireAdmin } from '../middlewares/authenticate';
import { validate } from '../middlewares/validate';
import { paginationSchema } from '../schemas/contacto.schema';
import { createEncuestaSchema } from '../schemas/encuesta.schema';

export const encuestasRouter = Router();

encuestasRouter.post('/', validate({ body: createEncuestaSchema }), controller.create);
encuestasRouter.get('/', authenticate, requireAdmin, validate({ query: paginationSchema }), controller.list);
