
import { getRabbitChannel, APP_EXCHANGE } from "../../config/rabbitmq";
import { TaskSubjects } from "../task.subjects";
import { BaseEventPayload } from "./base-event";
import { TaskDocument } from "@models/task/interfaces/task_document.interface";

interface TaskDeletedData {
    id: string;
    user_id: string;
    title: string;
    deletedAt: string;
}

export async function publishTaskDeleted(task: Pick<
    TaskDocument,
    "_id" | "title" | "user_id"
>) {
    const channel = getRabbitChannel();

    const payload: BaseEventPayload<TaskDeletedData> = {
        event: TaskSubjects.TASK_DELETED,
        service: "task-service",
        occurredAt: new Date().toISOString(),
        data: {
            id: task._id.toString(),
            user_id: task.user_id,
            title: task.title,
            deletedAt: new Date().toISOString(),
        },
    };

    channel.publish(
        APP_EXCHANGE,
        TaskSubjects.TASK_DELETED,
        Buffer.from(JSON.stringify(payload)),
        {
            persistent: true,
            contentType: "application/json",
        }
    );

    console.log(`Event published: ${TaskSubjects.TASK_DELETED}`, payload);
}
