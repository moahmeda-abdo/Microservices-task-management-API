import { Server as HttpServer } from "http";
import { Server } from "socket.io";
import { socketAuthMiddleware } from "./socket-auth.middleware";
import { AuthenticatedSocket } from "./socket.types";

let io: Server | null = null;

export function initSocketServer(server: HttpServer): Server {
    io = new Server(server, {
        cors: {
            origin: (origin, callback) => {
                if (!origin) return callback(null, true);

                const allowedOrigins = (process.env.SOCKET_CORS_ORIGINS || "")
                    .split(",")
                    .map((item) => item.trim())
                    .filter(Boolean);

                if (
                    origin.startsWith("http://localhost:") ||
                    allowedOrigins.includes(origin)
                ) {
                    return callback(null, true);
                }

                return callback(new Error("Origin not allowed"));
            },
            credentials: true,
        },
        transports: ["websocket", "polling"],
    });

    io.use(socketAuthMiddleware);

    io.on("connection", (socket: AuthenticatedSocket) => {
        const userId = socket.user?.userId;

        if (!userId) {
            socket.disconnect(true);
            return;
        }

        const userRoom = `user:${userId}`;
        socket.join(userRoom);

        console.log(`[socket] connected socketId=${socket.id} userId=${userId}`);
        console.log(`[socket] joined room=${userRoom}`);

        socket.on("notifications.read_all", () => {
            console.log(`[socket] notifications.read_all userId=${userId}`);
        });

        socket.on("disconnect", (reason) => {
            console.log(
                `[socket] disconnected socketId=${socket.id} userId=${userId} reason=${reason}`
            );
        });
    });

    return io;
}

export function getIO(): Server {
    if (!io) {
        throw new Error("Socket.IO server is not initialized");
    }

    return io;
}