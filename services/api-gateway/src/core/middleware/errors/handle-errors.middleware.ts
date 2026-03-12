import { FORMATTED_ERROR } from '../../errors/interfaces/formatted_error';
import { NextFunction, Request, Response } from "express";
import { CustomError } from '../../errors/custom-error';
import { initializeLogger, logger } from "@tm/logger";




export const HandleErrors = (err: Error, req: Request, res: Response, next: NextFunction) => {
  let errors: FORMATTED_ERROR[] = [];
  let status: number;

  if (process.env.NODE_ENV !== "production") console.log(err)

  logger.error(err)
  if (err instanceof CustomError) {
    errors = err.serialize()
    status = err.statusCode
  } else {
    errors.push({
      message: err.toString()
    })
    status = 500
  }

  res.status(status).json({ errors })
}