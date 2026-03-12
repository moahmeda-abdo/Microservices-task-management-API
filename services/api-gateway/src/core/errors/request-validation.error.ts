import { CustomError } from "./custom-error";
import { FORMATTED_ERROR } from "./interfaces/formatted_error";

export class RequestValidationError extends CustomError {
	serial: string = "REQUEST_VALIDATION";
	statusCode: number = 400;

	constructor(
		public errors: { message: string; field: string; path: string }[]
	) {
		super();
		Object.setPrototypeOf(this, RequestValidationError.prototype);
	}

	serialize(): FORMATTED_ERROR[] {
		return this.errors.map((err) => ({
			message: err.message,
			field: err.field,
			path: err.path,
			serial: this.serial,
		}));
	}
}
