import amqp, { Channel, ChannelModel } from "amqplib";

let connection: ChannelModel | null = null;
let channel: Channel | null = null;

const RABBITMQ_URL = process.env.RABBITMQ_URL || "amqp://localhost:5672";
const AUTH_EXCHANGE = process.env.RABBITMQ_EXCHANGE || "auth.exchange";

export async function connectRabbitMQ(): Promise<Channel> {
    if (channel) return channel;

    connection = await amqp.connect(RABBITMQ_URL);
    console.log("✅ RabbitMQ connection established");

    channel = await connection.createChannel();
    console.log("✅ RabbitMQ channel created");

    await channel.assertExchange(AUTH_EXCHANGE, "topic", {
        durable: true,
    });

    console.log(`📡 Exchange '${AUTH_EXCHANGE}' ready`);

    connection.on("error", (err) => {
        console.error("❌ RabbitMQ connection error:", err);
    });

    connection.on("close", () => {
        console.error("⚠️ RabbitMQ connection closed");
        connection = null;
        channel = null;
    });

    channel.on("error", (err) => {
        console.error("❌ RabbitMQ channel error:", err);
    });

    return channel;
}


export function getRabbitChannel(): Channel {
    if (!channel) {
        throw new Error("RabbitMQ channel is not initialized");
    }

    return channel;
}

export async function closeRabbitMQ(): Promise<void> {
    if (channel) {
        await channel.close();
        channel = null;
    }

    if (connection) {
        await connection.close();
        connection = null;
    }
}