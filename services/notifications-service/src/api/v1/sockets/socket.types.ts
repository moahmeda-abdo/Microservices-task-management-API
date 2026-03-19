import { Socket } from "socket.io";

export interface SocketUserPayload {
    userId: string;
    email?: string;
    role?: string;
}

export interface AuthenticatedSocket extends Socket {
    user?: SocketUserPayload;
}