import path from "path";
import { createServer } from "http";
import { Socket } from "net";
import env from "dotenv";
import { initializeLogger, logger } from "@tm/logger";
import { app } from "./app";
import { notificationsSocketProxy } from "@routes/notifications.socket.routes";

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
			"NODE_ENV",
			"AUTH_SERVICE_URL",
			"USERS_SERVICE_URL",
			"TASKS_SERVICE_URL",
			"NOTIFICATIONS_SERVICE_URL",
		]);

		const server = createServer(app);
		const port = +(process.env.PORT ?? "0") || 4000;

		server.on("upgrade", (req, socket, head) => {
			if (req.url?.startsWith("/api/v1/notifications/socket.io")) {
				logger?.info(
					`proxying websocket upgrade for notifications path ${req.url}`
				);
				notificationsSocketProxy.upgrade(req, socket as Socket, head);
				return;
			}

			logger?.warn(`unhandled websocket upgrade path ${req.url}`);
			socket.destroy();
		});

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
