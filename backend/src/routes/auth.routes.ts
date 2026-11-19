import { Router } from 'express';
import * as controller from '../controllers/auth.controller';
import { authenticate } from '../middlewares/authenticate';
import { loginSchema, registerSchema } from '../schemas/auth.schema';
import { validate } from '../middlewares/validate';
import { rateLimit } from '../utils/rateLimit';

export const authRouter = Router();

authRouter.post('/register', validate({ body: registerSchema }), controller.register);
authRouter.post('/login', rateLimit, validate({ body: loginSchema }), controller.login);
authRouter.post('/logout', controller.logout);
authRouter.get('/logout', controller.logout);
authRouter.get('/me', authenticate, controller.me);
