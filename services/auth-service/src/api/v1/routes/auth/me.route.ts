import { Middleware } from "@common/types.common";
import { UnAuthorizedError } from "@core/errors";
import { RequireAuth } from "@core/middleware/auth/auth-required.middleware";
import { Auth } from "@models/auth/auth.model";
import { Router } from "express";

const router = Router();

const MeRouter: Middleware = async (req, res) => {

    if (!req.currentUser?.auth_id) {
        throw new UnAuthorizedError("User is not authorized");
    }

    const user = await Auth.findById(req.currentUser.auth_id).select("-password");

    if (!user || !user.is_active) {
        throw new UnAuthorizedError("User is not authorized");
    }

    return {
        id: user._id,
        email: user.email,
        role: user.role,
        is_active: user.is_active,
        user_id: user.user_id || null,
        created_at: user.created_at,
        updated_at: user.updated_at,
    };
}

router.get('/me', RequireAuth, MeRouter)

export { router as MeRoute }