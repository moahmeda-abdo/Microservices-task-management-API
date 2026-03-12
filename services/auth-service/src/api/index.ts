import { Router } from "express";
import { API_V1_ROUTES } from "./v1";

const router = Router();

router.use("/api/v1", API_V1_ROUTES);



export { router as API_Router };
