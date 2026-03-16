
import { getRabbitChannel, APP_EXCHANGE } from "../../config/rabbitmq";
import { TaskSubjects } from "../task.subjects";
import { BaseEventPayload } from "./base-event";

interface TaskCreatedData {
    id: string;
    title: string;
    description?: string;
    status: string;
    priority: string;
    due_date?: Date | null;
    user_id: string;
    createdAt: Date;
    updatedAt: Date;
}

export async function publishTaskCreated(task: {
    _id: string;
    title: string;
    description?: string;
    status: string;
    priority: string;
    due_date?: Date | null;
    user_id: string;
    createdAt: Date;
    updatedAt: Date;
}) {
    const channel = getRabbitChannel();

    const payload: BaseEventPayload<TaskCreatedData> = {
        event: TaskSubjects.TASK_CREATED,
        service: "task-service",
        occurredAt: new Date().toISOString(),
        data: {
            id: task._id.toString(),
            title: task.title,
            description: task.description,
            status: task.status,
            priority: task.priority,
            due_date: task.due_date ?? null,
            user_id: task.user_id,
            createdAt: task.createdAt,
            updatedAt: task.updatedAt,
        },
    };

    channel.publish(
        APP_EXCHANGE,
        TaskSubjects.TASK_CREATED,
        Buffer.from(JSON.stringify(payload)),
        {
            persistent: true,
            contentType: "application/json",
        }
    );

    console.log(`Event published: ${TaskSubjects.TASK_CREATED}`, payload);
}