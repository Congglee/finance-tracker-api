import { ParamsDictionary } from 'express-serve-static-core'
import { NextFunction, Request, Response } from 'express'
import authService from '~/services/auth.services'
import { LoginReqBody, LogoutReqBody, RegisterReqBody } from '~/types/auth.types'
import { User, UserVerifyStatus } from '@prisma/client'
import { AUTH_MESSAGES } from '~/constants/messages'

export const registerController = async (
  req: Request<ParamsDictionary, any, RegisterReqBody>,
  res: Response,
  next: NextFunction
) => {
  const result = await authService.register(req.body)
  return res.json(result)
}

export const loginController = async (req: Request<ParamsDictionary, any, LoginReqBody>, res: Response) => {
  const user = req.user as User
  const user_id = user.id
  const result = await authService.login({ user_id, verify: user.verify as UserVerifyStatus })

  return res.json({ message: AUTH_MESSAGES.LOGIN_SUCCESS, result })
}

export const logoutController = async (req: Request<ParamsDictionary, any, LogoutReqBody>, res: Response) => {
  const { refresh_token } = req.body
  const result = await authService.logout(refresh_token)

  return res.json(result)
}
