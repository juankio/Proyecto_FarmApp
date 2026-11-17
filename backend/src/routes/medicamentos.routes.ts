import { Router } from 'express';
import * as controller from '../controllers/medicamentos.controller';
import { authenticate, requireAdmin } from '../middlewares/authenticate';
import { validate } from '../middlewares/validate';
import {
  createMedicamentoSchema,
  idParamSchema,
  listMedicamentosSchema,
  updateMedicamentoSchema,
} from '../schemas/medicamento.schema';

export const medicamentosRouter = Router();

medicamentosRouter.get('/', validate({ query: listMedicamentosSchema }), controller.list);
medicamentosRouter.get('/:id', validate({ params: idParamSchema }), controller.getById);
medicamentosRouter.post('/', authenticate, requireAdmin, validate({ body: createMedicamentoSchema }), controller.create);
medicamentosRouter.put('/:id', authenticate, requireAdmin, validate({ params: idParamSchema, body: updateMedicamentoSchema }), controller.update);
medicamentosRouter.delete('/:id', authenticate, requireAdmin, validate({ params: idParamSchema }), controller.remove);
