import { emitToUser } from "./socket-emitter";
import { NotificationDocument } from "@models/notification/interfaces/notification_document.interface";

export interface NotificationRealtimePayload {
    id: string;
    userId: string;
    type: string;
    title: string;
    message: string;
    is_read: boolean;
    metadata?: Record<string, any>;
    createdAt: Date | string;
}

function toNotificationRealtimePayload(
    notification: NotificationDocument
): NotificationRealtimePayload {
    return {
        id: notification.id,
        userId: notification.user_id,
        type: notification.type,
        title: notification.title,
        message: notification.message,
        is_read: notification.is_read,
        metadata: notification.metadata,
        createdAt: notification.createdAt,
    };
}

export function emitNotificationCreated(notification: NotificationDocument) {
    const payload = toNotificationRealtimePayload(notification);
    emitToUser(payload.userId, "notification.created", payload);
}
