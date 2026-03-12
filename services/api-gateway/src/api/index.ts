import { Router } from "express";
import { GatewayProxyRouter } from "./v1";

const router = Router();

router.use("/api/v1", GatewayProxyRouter);

export { router as API_Router };
