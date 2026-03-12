import path from "path";
import env from "dotenv";
import { initializeLogger, logger } from "@tm/logger";
import { initMongoDBConnection } from "./core/db/connect_db";
import { app } from "./app";

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

		await initMongoDBConnection();


		const port = +(process.env.PORT ?? "0") || 4000;
		app.listen(port, () => {
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
