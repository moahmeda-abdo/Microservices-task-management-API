
import { HealthRoutes } from "@routes/health/health.route";
import { TasksRoutes } from "@routes/tasks";
import { Router } from "express";

const router = Router();

router.use(HealthRoutes);
router.use("/tasks", TasksRoutes);

export { router as API_V1_ROUTES };
