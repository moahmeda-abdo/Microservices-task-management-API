import { ExtendedError } from "socket.io/dist/namespace";
import { AuthenticatedSocket, SocketUserPayload } from "./socket.types";
import jwt from "jsonwebtoken";

interface JwtPayload {
    userId?: string;
    id?: string;
    email?: string;
    role?: string;
}

export function socketAuthMiddleware(
    socket: AuthenticatedSocket,
    next: (err?: ExtendedError) => void
) {
    try {
        const authToken = socket.handshake.auth?.token as string | undefined;
        const authorizationHeader = socket.handshake.headers.authorization;

        let token: string | undefined = authToken;

        if (!token && authorizationHeader?.startsWith("Bearer ")) {
            token = authorizationHeader.replace("Bearer ", "").trim();
        }

        if (!token) {
            return next(new Error("Unauthorized: token missing"));
        }

        const jwtKey = process.env.JWT_KEY || process.env.JWT_SECRET;

        if (!jwtKey) {
            return next(new Error("Unauthorized: JWT key is not configured"));
        }

        const decoded = jwt.verify(token, jwtKey) as JwtPayload;

        const userId = decoded.userId || decoded.id;

        if (!userId) {
            return next(new Error("Unauthorized: invalid token payload"));
        }

        const user: SocketUserPayload = {
            userId,
            email: decoded.email,
            role: decoded.role,
        };

        socket.user = user;

        next();
    } catch (error) {
        return next(new Error("Unauthorized: invalid token"));
    }
}
