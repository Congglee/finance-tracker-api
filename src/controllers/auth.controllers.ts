import { ParamsDictionary } from 'express-serve-static-core'
import { NextFunction, Request, Response } from 'express'
import authService from '~/services/auth.services'
import { RegisterReqBody } from '~/types/auth.types'

export const registerController = async (
  req: Request<ParamsDictionary, any, RegisterReqBody>,
  res: Response,
  next: NextFunction
) => {
  const result = await authService.register(req.body)
  return res.json(result)
}
