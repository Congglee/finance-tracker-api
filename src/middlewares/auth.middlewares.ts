import { checkSchema, type ParamSchema } from 'express-validator'
import prisma from '~/client'
import { AUTH_MESSAGES } from '~/constants/messages'
import authService from '~/services/auth.services'
import { hashPassword } from '~/utils/crypto'
import { validate } from '~/utils/validation'

export const nameSchema: ParamSchema = {
  notEmpty: { errorMessage: AUTH_MESSAGES.NAME_IS_REQUIRED },
  isString: { errorMessage: AUTH_MESSAGES.NAME_MUST_BE_STRING },
  trim: true,
  isLength: {
    options: { min: 1, max: 256 },
    errorMessage: AUTH_MESSAGES.NAME_LENGTH_MUST_BE_BETWEEN_1_AND_256
  }
}

export const passwordSchema: ParamSchema = {
  notEmpty: { errorMessage: AUTH_MESSAGES.PASSWORD_IS_REQUIRED },
  isString: { errorMessage: AUTH_MESSAGES.PASSWORD_MUST_BE_STRING },
  isLength: {
    options: { min: 6, max: 100 },
    errorMessage: AUTH_MESSAGES.PASSWORD_LENGTH_MUST_BE_BETWEEN_6_AND_100
  },
  isStrongPassword: {
    options: {
      minLength: 6,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1
    },
    errorMessage: AUTH_MESSAGES.PASSWORD_MUST_BE_STRONG
  }
}

export const confirmPasswordSchema: ParamSchema = {
  notEmpty: { errorMessage: AUTH_MESSAGES.CONFIRM_PASSWORD_IS_REQUIRED },
  isString: { errorMessage: AUTH_MESSAGES.CONFIRM_PASSWORD_MUST_BE_STRING },
  isLength: {
    options: { min: 6, max: 100 },
    errorMessage: AUTH_MESSAGES.CONFIRM_PASSWORD_LENGTH_MUST_BE_BETWEEN_6_AND_100
  },
  isStrongPassword: {
    options: { minLength: 6, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1 },
    errorMessage: AUTH_MESSAGES.CONFIRM_PASSWORD_MUST_BE_STRONG
  },
  custom: {
    options: (value, { req }) => {
      if (value !== req.body.password) {
        throw new Error(AUTH_MESSAGES.CONFIRM_PASSWORD_MUST_BE_THE_SAME_AS_PASSWORD)
      }
      return true
    }
  }
}

export const registerValidator = validate(
  checkSchema(
    {
      name: nameSchema,
      email: {
        isEmail: { errorMessage: AUTH_MESSAGES.EMAIL_IS_INVALID },
        trim: true,
        custom: {
          options: async (value) => {
            const isExistEmail = await authService.checkEmailExist(value)

            if (isExistEmail) {
              throw new Error(AUTH_MESSAGES.EMAIL_ALREADY_EXISTS)
            }

            return true
          }
        }
      },
      password: passwordSchema,
      confirm_password: confirmPasswordSchema
    },
    ['body']
  )
)

export const loginValidator = validate(
  checkSchema(
    {
      email: {
        isEmail: { errorMessage: AUTH_MESSAGES.EMAIL_IS_INVALID },
        trim: true,
        custom: {
          options: async (value, { req }) => {
            const user = await prisma.user.findUnique({
              where: {
                email: value,
                password: hashPassword(req.body.password)
              }
            })

            if (user === null) {
              throw new Error(AUTH_MESSAGES.EMAIL_OR_PASSWORD_IS_INCORRECT)
            }

            req.user = user
            return true
          }
        }
      },
      password: {
        notEmpty: { errorMessage: AUTH_MESSAGES.PASSWORD_IS_REQUIRED },
        isString: { errorMessage: AUTH_MESSAGES.PASSWORD_MUST_BE_STRING },
        isLength: {
          options: { min: 6, max: 100 },
          errorMessage: AUTH_MESSAGES.PASSWORD_LENGTH_MUST_BE_BETWEEN_6_AND_100
        },
        isStrongPassword: {
          options: {
            minLength: 6,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1
          },
          errorMessage: AUTH_MESSAGES.PASSWORD_MUST_BE_STRONG
        }
      }
    },
    ['body']
  )
)
