import { Router } from 'express';
import * as controller from '../controllers/contactos.controller';
import { authenticate, requireAdmin } from '../middlewares/authenticate';
import { validate } from '../middlewares/validate';
import { createContactoSchema, paginationSchema } from '../schemas/contacto.schema';

export const contactosRouter = Router();

contactosRouter.post('/', validate({ body: createContactoSchema }), controller.create);
contactosRouter.get('/', authenticate, requireAdmin, validate({ query: paginationSchema }), controller.list);
