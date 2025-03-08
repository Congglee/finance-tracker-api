import { UserVerifyStatus } from '@prisma/client'
import { NextFunction, Request, Response } from 'express'
import { checkSchema, ParamSchema } from 'express-validator'
import prisma from '~/client'
import HTTP_STATUS from '~/constants/httpStatus'
import { AUTH_MESSAGES, USERS_MESSAGES } from '~/constants/messages'
import { confirmPasswordSchema, nameSchema, passwordSchema } from '~/middlewares/auth.middlewares'
import { TokenPayload } from '~/types/auth.types'
import { ErrorWithStatus } from '~/types/errors.types'
import { hashPassword } from '~/utils/crypto'
import { validate } from '~/utils/validation'

export const imageSchema: ParamSchema = {
  optional: true,
  isString: { errorMessage: USERS_MESSAGES.IMAGE_URL_MUST_BE_STRING },
  trim: true,
  isLength: {
    options: { min: 1, max: 400 },
    errorMessage: USERS_MESSAGES.IMAGE_URL_LENGTH
  }
}

export const verifiedUserValidator = (req: Request, res: Response, next: NextFunction) => {
  const { verify } = req.decoded_authorization as TokenPayload

  if (verify !== UserVerifyStatus.Verified) {
    next(
      new ErrorWithStatus({
        message: USERS_MESSAGES.USER_NOT_VERIFIED,
        status: HTTP_STATUS.FORBIDDEN
      })
    )
  }

  next()
}

export const updateMeValidator = validate(
  checkSchema(
    {
      name: { ...nameSchema, optional: true, notEmpty: undefined },
      avatar: imageSchema
    },
    ['body']
  )
)

export const changePasswordValidator = validate(
  checkSchema(
    {
      old_password: {
        ...passwordSchema,
        custom: {
          options: async (value: string, { req }) => {
            const { user_id } = (req as Request).decoded_authorization as TokenPayload
            const user = await prisma.user.findUnique({ where: { id: user_id } })

            if (!user) {
              throw new ErrorWithStatus({
                message: AUTH_MESSAGES.USER_NOT_FOUND,
                status: HTTP_STATUS.NOT_FOUND
              })
            }

            const { password } = user
            const isMatch = hashPassword(value) === password

            if (!isMatch) {
              throw new ErrorWithStatus({
                message: USERS_MESSAGES.OLD_PASSWORD_NOT_MATCH,
                status: HTTP_STATUS.UNAUTHORIZED
              })
            }
          }
        }
      },
      password: passwordSchema,
      confirm_password: confirmPasswordSchema
    },
    ['body']
  )
)
