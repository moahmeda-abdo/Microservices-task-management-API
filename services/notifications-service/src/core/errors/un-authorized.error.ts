import { CustomError } from "./custom-error";
import { FORMATTED_ERROR } from "./interfaces/formatted_error";

export class UnAuthorizedError extends CustomError {
	serial: string = "UN_AUTHORIZED";
	statusCode: number = 403;

	constructor(
		message: string = "Un Authorized Request",
		serial: string = "UN_AUTHORIZED"
	) {
		super(message);
		this.serial = serial;
		Object.setPrototypeOf(this, UnAuthorizedError.prototype);
	}
	serialize(): FORMATTED_ERROR[] {
		return [{ message: this.message, serial: this.serial }];
	}
}
