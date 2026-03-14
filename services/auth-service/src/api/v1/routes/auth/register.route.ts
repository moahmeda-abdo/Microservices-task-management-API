import { Middleware } from "@common/types.common";
import { BadRequestError } from "@core/errors";
import { JOIValidateRequest } from "@core/middleware/validation";
import { JWT, Password } from "@core/services";
import { Auth } from "@models/auth/auth.model";
import { Router } from "express";
import { RegisterAuthValidationSchema } from "./validation/register_auth.validation";
import { publishUserRegistered } from "../../../../events/auth.publisher";


const router = Router()


const RegisterController: Middleware = async (req, res) => {
    const { first_name, last_name, email, password, role } = req.body;

    const isUserExist = await Auth.exists({ email });


    if (isUserExist) {
        throw new BadRequestError('User with this email already exists')
    }

    const hashedPassword = Password.hash(password);


    const user = await Auth.create({ email, password: hashedPassword, role });

    await publishUserRegistered({
        user_id: user._id.toString(),
        email: user.email,
        role: user.role,
        first_name: first_name,
        last_name: last_name,
        created_at: user.created_at.toISOString(),
    })

    const token = JWT.sign({ auth_id: user._id, email: user.email, role: user.role });

    res.status(201).json({ data: { ...user.toObject(), password: undefined, token } })
}

router.post(
    '/register',
    JOIValidateRequest(RegisterAuthValidationSchema),
    RegisterController
)

export { router as RegisterRoute }