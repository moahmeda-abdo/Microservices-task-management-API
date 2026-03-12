
import { HealthRoutes } from "@routes/health/health.route";
import { Router } from "express";

const router = Router();

router.use(HealthRoutes)

export { router as API_V1_ROUTES };
