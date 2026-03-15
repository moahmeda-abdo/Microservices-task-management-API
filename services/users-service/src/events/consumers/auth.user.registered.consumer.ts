import { BadRequestError } from "@core/errors";
import { AUTH_EXCHANGE, connectRabbitMQ } from "../../config/rabbitmq";
import { UserRegisteredEvent } from "../user-registered.event";
import { User } from "@models/user/user.model";

const ROUTING_KEY = "auth.user.registered";
const QUEUE_NAME = "users.auth.user.registered";
async function execute(payload: UserRegisteredEvent) {
    const {
        user_id,
        email,
        role,
        first_name,
        last_name,
        created_at,
    } = payload;

    if (!user_id || !email || !role || !first_name || !last_name) {
        throw new BadRequestError("Invalid user.registered event payload");
    }

    const existingUser = await User.findOne({
        $or: [{ user_id }, { email }],
    });

    if (existingUser) {
        console.log(
            `ℹ️ User already exists for event. user_id=${user_id}, email=${email}`
        );
        return existingUser;
    }

    const user = await User.create({
        user_id,
        email,
        role,
        first_name,
        last_name,
        created_at: created_at ? new Date(created_at) : undefined,
    });

    console.log(`✅ User profile created from event. user_id=${user_id}`);

    return user;
}
export async function consumeUserRegisteredEvent(): Promise<void> {
    const channel = await connectRabbitMQ();

    await channel.assertQueue(QUEUE_NAME, {
        durable: true,
    });

    await channel.bindQueue(QUEUE_NAME, AUTH_EXCHANGE, ROUTING_KEY);

    await channel.prefetch(1);

    console.log(
        `👂 Waiting for events on queue='${QUEUE_NAME}' routingKey='${ROUTING_KEY}'`
    );

    channel.consume(
        QUEUE_NAME,
        async (message) => {
            if (!message) return;

            try {
                const raw = message.content.toString();
                console.log(`📩 Received event: ${raw}`);

                const payload = JSON.parse(raw) as UserRegisteredEvent;

                await execute(payload);

                channel.ack(message);
                console.log("✅ Event acknowledged");
            } catch (error) {
                console.error("❌ Failed to process auth.user.registered event:", error);

                channel.nack(message, false, false);
            }
        },
        {
            noAck: false,
        }
    );
}
