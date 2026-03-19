import path from "path";
import { createServer } from "http";
import env from "dotenv";
import { initializeLogger, logger } from "@tm/logger";
import { initMongoDBConnection } from "./core/db/connect_db";
import { app } from "./app";
import { connectRabbitMQ } from "./config/rabbitmq";
import { consumeTaskEvents } from "./events/consumers/task.events.consumer";
import { initSocketServer } from "./api/v1/sockets";

env.config({ path: path.join(__dirname, "../.env") });



function validateENVS(envList: string[]) {
	const requiredEnv = new Set(["PORT", ...envList]);
	requiredEnv.forEach((env) => {
		if (!process.env[env]) {
			throw new Error(`ENV: ( ${env} ) Must Be Provided`);
		}
	});
}

const serviceName = process.env.SERVICE_NAME || "unknown-service";
(async () => {
	try {
		initializeLogger(serviceName);

		validateENVS([
			"MONGODB_URI",
			"MONGODB_URI",
			"NODE_ENV",
			"JWT_KEY",
		]);

		const server = createServer(app);
		initSocketServer(server);

		await initMongoDBConnection();
		await connectRabbitMQ();
		await consumeTaskEvents();

		const port = +(process.env.PORT ?? "0") || 4000;
		server.listen(port, () => {
			logger?.info(
				`${serviceName.toUpperCase()} Service Started Successfully On Port ${port}`
			);
			logger?.info(
				`application is up and running on http://localhost:${port}`
			);
		});
	} catch (err) {
		console.error(err);

		try {

			logger.error(err);
		} catch {
		}

		process.exit(1);
	}
})();
