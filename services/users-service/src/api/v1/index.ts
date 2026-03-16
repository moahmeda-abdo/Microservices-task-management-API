
import { HealthRoutes } from "@routes/health/health.route";
import { UsersRoute } from "@routes/users";
import { Router } from "express";

const router = Router();

router.use(HealthRoutes);
router.use(UsersRoute);

export { router as API_V1_ROUTES };
