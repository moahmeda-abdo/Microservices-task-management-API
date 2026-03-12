import { Middleware } from "@common/types.common";
import { BadRequestError } from "@core/errors";
import { JOIValidateRequest } from "@core/middleware/validation";
import { JWT, Password } from "@core/services";
import { Auth } from "@models/auth/auth.model";
import { Router } from "express";
import { LoginAuthValidationSchema } from "./validation/login_auth.validation";

const router = Router()

const LoginController: Middleware = async (req, res) => {
    const { email, password } = req.body;

    const user = await Auth.findOne({ email });

    if (!user) {
        throw new BadRequestError('Invalid email or password')
    }

    const isPasswordValid = Password.compare(password, user.password);

    if (!isPasswordValid) {
        throw new BadRequestError('Invalid email or password')
    }
    const token = JWT.sign({ auth_id: user._id, email: user.email, role: user.role });

    res.status(200).json({ data: { ...user.toObject(), password: undefined, token } })
}

router.post('/login',
    JOIValidateRequest(LoginAuthValidationSchema),
    LoginController
)

export { router as LoginRoute }