
import { HealthRoutes } from "@routes/health/health.route";
import { NotificationsRoutes } from "@routes/notifications";
import { Router } from "express";

const router = Router();

router.use(HealthRoutes);
router.use("/notifications", NotificationsRoutes);

export { router as API_V1_ROUTES };
