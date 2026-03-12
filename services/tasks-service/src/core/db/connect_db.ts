import mongoose from "mongoose";
import { ServerError } from '../errors/server.error';
import { initializeLogger, logger } from "@tm/logger";

mongoose.set('strictQuery', false)

const URI =
	process.env.NODE_ENV === "production"
		? process.env.MONGODB_URI
		: process.env.MONGODB_URI;
if (!URI) throw new Error("Mongodb URI Is Missing");

const mongoOptions: mongoose.ConnectOptions = {
	autoIndex: true,
	maxPoolSize: 10,
	connectTimeoutMS: 10000,
	socketTimeoutMS: 30000,
};


const connect = async (URI: string) =>
	await mongoose.connect(URI, mongoOptions);
export const initMongoDBConnection = async () => {
	try {
		const db = await connect(URI);

		logger.info("DB Connection Established To: " + URI)
		return db;
	} catch (err) {
		throw new ServerError("DB Connections Failed")
	}
};

