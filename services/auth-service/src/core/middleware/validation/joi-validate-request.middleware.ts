import { RequestValidationError } from "../../errors/request-validation.error";
import { NextFunction, Request, Response } from "express";

import { Schema, ValidationOptions } from "joi";
import { Middleware } from "../../../api/common/types.common";

const options: ValidationOptions = {
	abortEarly: false,
	allowUnknown: true,
	stripUnknown: true,
};
type JOIValidateRequestType = (
	schema: Schema,
	property?: "body" | "query" | "params" | "headers"
) => Middleware;

export const JOIValidateRequest: JOIValidateRequestType =
	(schema, property = "body") =>
	(req, res, next) => {
		let toValidate: Record<string, any> = req[property];

		const error = schema.validate(toValidate, options).error;
		if (error?.details.length ?? 0 > 0) {
			throw new RequestValidationError(
				error?.details.map((err) => ({
					field: err.context?.key ?? "no-name",
					message: err.message,
					path: err.path.join("."),
				})) ?? []
			);
		}
		next!();
	};
