import { UnAuthorizedError } from '../../errors/un-authorized.error';
import { Request, Response, NextFunction } from 'express';
export const AuthRequired = (req: Request, res: Response, next: NextFunction) => {
  // @ts-ignore
  if (!req.user) throw new UnAuthorizedError()
  next()
}