import { NextFunction, Request, Response } from 'express'
import { USERS_MESSAGES } from '~/constants/messages'
import usersService from '~/services/users.services'
import { TokenPayload } from '~/types/auth.types'
import { ParamsDictionary } from 'express-serve-static-core'
import { ChangePasswordReqBody, UpdateMeReqBody } from '~/types/users.types'

export const getMeController = async (req: Request, res: Response) => {
  const { user_id } = req.decoded_authorization as TokenPayload
  const user = await usersService.getMe(user_id)

  return res.json({ message: USERS_MESSAGES.GET_ME_SUCCESS, result: user })
}

export const updateMeController = async (
  req: Request<ParamsDictionary, any, UpdateMeReqBody>,
  res: Response,
  next: NextFunction
) => {
  const { user_id } = req.decoded_authorization as TokenPayload
  const { body } = req

  const user = await usersService.updateMe(user_id, body)

  return res.json({ message: USERS_MESSAGES.UPDATE_ME_SUCCESS, result: user })
}

export const changePasswordController = async (
  req: Request<ParamsDictionary, any, ChangePasswordReqBody>,
  res: Response,
  next: NextFunction
) => {
  const { user_id } = req.decoded_authorization as TokenPayload
  const { password } = req.body

  const result = await usersService.changePassword(user_id, password)

  return res.json(result)
}
