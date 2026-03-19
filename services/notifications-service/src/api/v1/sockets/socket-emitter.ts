import { getIO } from "./index";

export function getUserRoom(userId: string): string {
    return `user:${userId}`;
}

export function emitToUser<T = unknown>(
    userId: string,
    eventName: string,
    payload: T
) {
    const io = getIO();
    io.to(getUserRoom(userId)).emit(eventName, payload);
}