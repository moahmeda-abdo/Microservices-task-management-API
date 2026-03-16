import { Router } from "express";
import { MeRoute } from "./get_user_data.route";

const router = Router();

router.use(MeRoute)

export { router as UsersRoute }