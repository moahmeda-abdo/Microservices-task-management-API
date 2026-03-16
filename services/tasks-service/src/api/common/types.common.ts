import { ObjectId as ObjId } from "mongoose";
import { NextFunction, Request, Response } from "express";

export type Object_id = ObjId & {
	equals: (value: string | ObjId) => boolean;
	toHexString: () => string;
};
export type Object_id_or_string = Object_id | string;
export type System_language = "ar" | "en";

export type MultiLanguageField = Record<System_language, string>;
export interface RequestWithCurrentUser extends Request {
	currentUser?: {
		auth_id: string;
		email: string;
		role: string;
	};
}
export type Middleware = (
	req: RequestWithCurrentUser,
	res: Response,
	next?: NextFunction
) => any;
