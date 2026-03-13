import { Router } from 'express';
import { RegisterRoute } from './register.route';
import { LoginRoute } from './login.route';
import { MeRoute } from './me.route';

const router = Router();

router.use(MeRoute)
router.use(RegisterRoute)
router.use(LoginRoute)

export {router as AuthsRoutes}