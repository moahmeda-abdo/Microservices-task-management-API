import { getRabbitChannel } from "../config/rabbitmq";
import { UserRegisteredEvent } from "./user-registered.event";
import { AUTH_USER_REGISTERED_ROUTING_KEY } from "./rabbitmq.constants";


const AUTH_EXCHANGE = process.env.RABBITMQ_EXCHANGE || "auth.exchange";
const REGISTERED_ROUTING_KEY =
    process.env.RABBITMQ_REGISTERED_ROUTING_KEY || AUTH_USER_REGISTERED_ROUTING_KEY;

export async function publishUserRegistered(
    payload: UserRegisteredEvent
): Promise<boolean> {
    const channel = getRabbitChannel();
    
    const messageBuffer = Buffer.from(JSON.stringify(payload));
    console.log(`📤 Publishing event to exchange='${AUTH_EXCHANGE}' routingKey='${REGISTERED_ROUTING_KEY}': ${messageBuffer.toString()}`);
    const published = channel.publish(
        AUTH_EXCHANGE,
        REGISTERED_ROUTING_KEY,
        messageBuffer,
        {
            persistent: true,
            contentType: "application/json",
            timestamp: Date.now(),
        }
    );

    return published;
}
