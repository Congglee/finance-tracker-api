import { ParamsDictionary } from 'express-serve-static-core'
import { NextFunction, Request, Response } from 'express'
import authService from '~/services/auth.services'
import {
  ForgotPasswordReqBody,
  LoginReqBody,
  LogoutReqBody,
  RefreshTokenReqBody,
  RegisterReqBody,
  TokenPayload,
  VerifyEmailReqBody
} from '~/types/auth.types'
import { User, UserVerifyStatus } from '@prisma/client'
import { AUTH_MESSAGES } from '~/constants/messages'
import prisma from '~/client'
import HTTP_STATUS from '~/constants/httpStatus'

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

export const refreshTokenController = async (
  req: Request<ParamsDictionary, any, RefreshTokenReqBody>,
  res: Response
) => {
  const { refresh_token } = req.body
  const { user_id, verify, exp } = req.decoded_refresh_token as TokenPayload
  const result = await authService.refreshToken({ user_id, verify, refresh_token, exp })

  return res.json({ message: AUTH_MESSAGES.REFRESH_TOKEN_SUCCESS, result })
}

export const verifyEmailController = async (
  req: Request<ParamsDictionary, any, VerifyEmailReqBody>,
  res: Response,
  next: NextFunction
) => {
  const { user_id } = req.decoded_email_verify_token as TokenPayload
  const user = await prisma.user.findUnique({ where: { id: user_id } })

  if (!user) {
    return res.status(HTTP_STATUS.NOT_FOUND).json({
      message: AUTH_MESSAGES.USER_NOT_FOUND
    })
  }

  if (user.emailVerifyToken === '') {
    return res.json({ message: AUTH_MESSAGES.EMAIL_ALREADY_VERIFIED_BEFORE })
  }

  const result = await authService.verifyEmail(user_id)

  return res.json({ message: AUTH_MESSAGES.EMAIL_VERIFY_SUCCESS, result })
}

export const resendVerifyEmailController = async (req: Request, res: Response, next: NextFunction) => {
  const { user_id } = req.decoded_authorization as TokenPayload
  const user = await prisma.user.findUnique({ where: { id: user_id } })

  if (!user) {
    return res.status(HTTP_STATUS.NOT_FOUND).json({
      message: AUTH_MESSAGES.USER_NOT_FOUND
    })
  }

  if (user.verify === UserVerifyStatus.Verified) {
    return res.json({
      message: AUTH_MESSAGES.EMAIL_ALREADY_VERIFIED_BEFORE
    })
  }
  const result = await authService.resendVerifyEmail(user_id, user.email)

  return res.json(result)
}

export const forgotPasswordController = async (
  req: Request<ParamsDictionary, any, ForgotPasswordReqBody>,
  res: Response,
  next: NextFunction
) => {
  const { id, verify, email } = req.user as User

  const result = await authService.forgotPassword({
    user_id: id,
    verify: verify as UserVerifyStatus,
    email
  })

  return res.json(result)
}
