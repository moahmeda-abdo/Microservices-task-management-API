import { Middleware } from "@common/types.common";
import { UnAuthorizedError } from "@core/errors";
import { RequireAuth } from "@core/middleware/auth/auth-required.middleware";

import { User } from "@models/user/user.model";
import { Router } from "express";

const router = Router();

const MeRouter: Middleware = async (req, res) => {

    if (!req.currentUser?.auth_id) {
        throw new UnAuthorizedError("User is not authorized");
    }

    const user = await User.findOne({ user_id: req.currentUser.auth_id }).select("-password");

    if (!user) {
        throw new UnAuthorizedError("User is not authorized");
    }

    return res.json({
        user: {
            id: user._id,
            email: user.email,
            name: user.first_name + " " + user.last_name,
            role: user.role,
            created_at: user.created_at,
            updated_at: user.updated_at
        }
    }
    );
}

router.get('/me', RequireAuth, MeRouter)

export { router as MeRoute }