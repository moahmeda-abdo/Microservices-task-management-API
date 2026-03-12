import { CustomError } from "./custom-error";
import { FORMATTED_ERROR } from "./interfaces/formatted_error";

export class UnAuthenticatedError extends CustomError {
  serial: string = 'UN_AUTHENTICATED';
  statusCode: number = 401;
  
  constructor(message: string = 'Un Authenticated Request', serial: string = 'UN_AUTHENTICATED') {
    super(message)
    this.serial = serial;
    Object.setPrototypeOf(this, UnAuthenticatedError.prototype)
  }

  serialize(): FORMATTED_ERROR[] {
    return [{message: this.message, serial: this.serial}]
  }
  
} 