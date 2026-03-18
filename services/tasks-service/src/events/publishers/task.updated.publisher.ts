import { getRabbitChannel, APP_EXCHANGE } from "../../config/rabbitmq";
import { TaskSubjects } from "../task.subjects";
import { BaseEventPayload } from "./base-event";
import { TaskDocument } from "@models/task/interfaces/task_document.interface";

interface TaskUpdatedData {
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

export async function publishTaskUpdated(task: Pick<
    TaskDocument,
    "_id" | "title" | "description" | "status" | "priority" | "due_date" | "user_id" | "createdAt" | "updatedAt"
>) {
    const channel = getRabbitChannel();

    const payload: BaseEventPayload<TaskUpdatedData> = {
        event: TaskSubjects.TASK_UPDATED,
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
        TaskSubjects.TASK_UPDATED,
        Buffer.from(JSON.stringify(payload)),
        {
            persistent: true,
            contentType: "application/json",
        }
    );

    console.log(`Event published: ${TaskSubjects.TASK_UPDATED}`, payload);
}
