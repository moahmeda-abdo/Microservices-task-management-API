import { CustomError } from "./custom-error";
import { FORMATTED_ERROR } from "./interfaces/formatted_error";

export class NotFoundError extends CustomError {
  serial: string = "NOT_FOUND";
  statusCode: number = 404;

  constructor(message: string = "Not Found", serial: string = "NOT_FOUND") {
    super(message);
    this.serial = serial;
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }

  serialize(): FORMATTED_ERROR[] {
    return [
      {
        message: this.message,
        serial: this.serial,
      },
    ];
  }
}
