import amqp, { Channel, ChannelModel, ConsumeMessage } from "amqplib";

let connection: ChannelModel | null = null;
let channel: Channel | null = null;

const RABBITMQ_URL =
    process.env.RABBITMQ_URL || "amqp://rabbitmq:5672";

const APP_EXCHANGE =
    process.env.RABBITMQ_EXCHANGE || "app.exchange";

function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}


export async function connectRabbitMQ(
    retries = 10,
    delay = 5000
): Promise<Channel> {
    if (channel) return channel;

    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            connection = await amqp.connect(RABBITMQ_URL);
            console.log(
                ` Connected to RabbitMQ: ${RABBITMQ_URL}`
            );

            connection.on("error", (err) => {
                console.error(" RabbitMQ connection error:", err);
            });

            connection.on("close", () => {
                console.error(" RabbitMQ connection closed");
                connection = null;
                channel = null;
            });

            connection.on("blocked", (reason) => {
                console.warn(" RabbitMQ connection blocked:", reason);
            });

            connection.on("unblocked", () => {
                console.log("RabbitMQ connection unblocked");
            });

            channel = await connection.createChannel();
            console.log(" RabbitMQ channel created");

            channel.on("error", (err) => {
                console.error(" RabbitMQ channel error:", err);
            });

            await channel.assertExchange(APP_EXCHANGE, "topic", {
                durable: true,
            });

            console.log(` Exchange '${APP_EXCHANGE}' asserted`);

            return channel;
        } catch (error) {
            console.error(
                ` RabbitMQ connect attempt ${attempt}/${retries} failed:`,
                error
            );

            if (attempt === retries) throw error;

            await sleep(delay);
        }
    }

    throw new Error("Failed to connect to RabbitMQ");
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


export type RabbitMessage = ConsumeMessage;


export { APP_EXCHANGE };