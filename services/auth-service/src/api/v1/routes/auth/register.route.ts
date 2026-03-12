import { Middleware } from "@common/types.common";
import { BadRequestError } from "@core/errors";
import { JOIValidateRequest } from "@core/middleware/validation";
import { JWT, Password } from "@core/services";
import { Auth } from "@models/auth/auth.model";
import { Router } from "express";
import { RegisterAuthValidationSchema } from "./validation/register_auth.validation";


const router = Router()


const RegisterController: Middleware = async (req, res) => {
    const { name, phone, email, password, role } = req.body;
    console.log("1")
    const isUserExist = await Auth.exists({ email });
    console.log("2")
    
    if (isUserExist) {
        throw new BadRequestError('User with this email already exists')
    }
    console.log("3")
    const hashedPassword = Password.hash(password);
    console.log("4")
    
    const user = await Auth.create({ email, password: hashedPassword, role });
    console.log("5")
    
    const token = JWT.sign({ auth_id: user._id, email: user.email, role: user.role });
    console.log("6")

    res.status(201).json({ data: { ...user.toObject(), password: undefined, token } })
}

router.post('/register',
    JOIValidateRequest(RegisterAuthValidationSchema),
    RegisterController
)

export { router as RegisterRoute }