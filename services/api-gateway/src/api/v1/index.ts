
import { authRoutes } from "@routes/auth.routes";
import { HealthRoutes } from "@routes/health/health.route";
import { tasksRoutes } from "@routes/tasks.routes";
import { usersRoutes } from "@routes/users.routes";
import { Router } from "express";

const router = Router();

router.use(HealthRoutes);
router.use(usersRoutes);
router.use(authRoutes);
router.use(tasksRoutes);

export { router as GatewayProxyRouter };
