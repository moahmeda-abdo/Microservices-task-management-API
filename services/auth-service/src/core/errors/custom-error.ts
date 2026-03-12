import { FORMATTED_ERROR } from "./interfaces/formatted_error";

export abstract class CustomError extends Error {
  abstract statusCode: number;
  abstract serial: string;
  constructor(message?: string) {
    super(message)
    Object.setPrototypeOf(this, CustomError.prototype)
  }

  abstract serialize(): FORMATTED_ERROR[]
}