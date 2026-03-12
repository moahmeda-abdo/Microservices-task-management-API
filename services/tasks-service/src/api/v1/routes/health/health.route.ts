import { Router } from "express";

const router = Router();

router.get("/health", (_, res) => {
  res.status(200).json({
    success: true,
    service: process.env.SERVICE_NAME,
    status: "ok",
    timestamp: new Date().toISOString(),
  });
});

export { router as HealthRoutes };
