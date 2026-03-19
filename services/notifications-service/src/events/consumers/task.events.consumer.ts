import { APP_EXCHANGE, getRabbitChannel, RabbitMessage } from "../../config/rabbitmq";
import { Notification } from "@models/notification/notification.model";
import { CreateNotificationData, NotificationDocument, NotificationType } from "@models/notification/interfaces/notification_document.interface";
import { emitNotificationCreated } from "../../api/v1/sockets/notification-realtime.service";

const TASK_EVENTS_QUEUE =
    process.env.TASK_EVENTS_QUEUE || "notifications.task.events.queue";

interface TaskEventPayload {
    event: string;
    service: string;
    occurredAt: string;
    data: {
        id: string;
        title?: string;
        description?: string;
        status?: string;
        priority?: string;
        due_date?: string | null;
        user_id: string;
        createdAt?: string;
        updatedAt?: string;
        deletedAt?: string;
    };
}

async function createNotification(
    data: CreateNotificationData
): Promise<NotificationDocument> {
    const notification = Notification.build(data);
    await notification.save();
    return notification;
}

export async function consumeTaskEvents() {
    const channel = getRabbitChannel();

    await channel.assertQueue(TASK_EVENTS_QUEUE, {
        durable: true,
    });

    await channel.bindQueue(TASK_EVENTS_QUEUE, APP_EXCHANGE, "task.created");
    await channel.bindQueue(TASK_EVENTS_QUEUE, APP_EXCHANGE, "task.updated");
    await channel.bindQueue(TASK_EVENTS_QUEUE, APP_EXCHANGE, "task.deleted");

    console.log(`Queue '${TASK_EVENTS_QUEUE}' bound to task events`);

    await channel.consume(TASK_EVENTS_QUEUE, async (msg: RabbitMessage | null) => {
        if (!msg) return;

        try {
            const content = msg.content.toString();
            const event: TaskEventPayload = JSON.parse(content);

            console.log("Received task event:", event.event);

            switch (event.event) {
                case "task.created": {
                    const notification = await createNotification({
                        user_id: event.data.user_id,
                        type: NotificationType.TASK_CREATED,
                        title: "Task Created",
                        message: `Your task '${event.data.title}' was created successfully.`,
                        metadata: {
                            task_id: event.data.id,
                            task_title: event.data.title,
                            status: event.data.status,
                            priority: event.data.priority,
                            due_date: event.data.due_date ?? null,
                        },
                    });

                    emitNotificationCreated(notification);

                    break;
                }

                case "task.updated": {
                    const notification = await createNotification({
                        user_id: event.data.user_id,
                        type: NotificationType.TASK_UPDATED,
                        title: "Task Updated",
                        message: `Your task '${event.data.title}' was updated.`,
                        metadata: {
                            task_id: event.data.id,
                            task_title: event.data.title,
                            status: event.data.status,
                            priority: event.data.priority,
                            due_date: event.data.due_date ?? null,
                        },
                    });

                    emitNotificationCreated(notification);

                    break;
                }

                case "task.deleted": {
                    const notification = await createNotification({
                        user_id: event.data.user_id,
                        type: NotificationType.TASK_DELETED,
                        title: "Task Deleted",
                        message: `Your task '${event.data.title}' was deleted.`,
                        metadata: {
                            task_id: event.data.id,
                            task_title: event.data.title,
                            deletedAt: event.data.deletedAt ?? new Date().toISOString(),
                        },
                    });

                    emitNotificationCreated(notification);

                    break;
                }

                default:
                    console.log("[notifications-service] unknown event:", event.event);
            }

            channel.ack(msg);
        } catch (error) {
            console.error("Failed to process task event:", error);
            channel.nack(msg, false, false);
        }
    });

    console.log("notifications-service is consuming task events...");
}
