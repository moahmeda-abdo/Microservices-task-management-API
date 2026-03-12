import { Router } from 'express';
import { RegisterRoute } from './register.route';
import { LoginRoute } from './login.route';

const router = Router();

router.use(RegisterRoute)
router.use(LoginRoute)

export {router as AuthsRoutes}