
import { authRoutes } from "@routes/auth.routes";
import { HealthRoutes } from "@routes/health/health.route";
import { notificationsSocketRoutes } from "@routes/notifications.socket.routes";
import { notificationsRoutes } from "@routes/notifications.routes";
import { tasksRoutes } from "@routes/tasks.routes";
import { usersRoutes } from "@routes/users.routes";
import { Router } from "express";

const router = Router();

router.use(HealthRoutes);
router.use(usersRoutes);
router.use(authRoutes);
router.use(notificationsSocketRoutes);
router.use(notificationsRoutes);
router.use(tasksRoutes);

export { router as GatewayProxyRouter };
