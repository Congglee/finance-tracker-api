import { checkSchema, ParamSchema } from 'express-validator'
import { CATEGORIES_MESSAGES } from '~/constants/messages'
import { validate } from '~/utils/validation'
import { validate as uuidValidate } from 'uuid'
import { ErrorWithStatus } from '~/types/errors.types'
import HTTP_STATUS from '~/constants/httpStatus'
import prisma from '~/client'
import { Request } from 'express'
import { TokenPayload } from '~/types/auth.types'
import { isEmpty } from 'lodash'

const categoryNameSchema: ParamSchema = {
  notEmpty: { errorMessage: CATEGORIES_MESSAGES.CATEGORY_NAME_IS_REQUIRED },
  isString: { errorMessage: CATEGORIES_MESSAGES.CATEGORY_NAME_MUST_BE_STRING },
  trim: true,
  isLength: {
    options: { min: 1, max: 256 },
    errorMessage: CATEGORIES_MESSAGES.CATEGORY_NAME_MUST_BE_BETWEEN_1_AND_256
  }
}

const categoryIconSchema: ParamSchema = {
  optional: true,
  isString: { errorMessage: CATEGORIES_MESSAGES.CATEGORY_ICON_MUST_BE_STRING },
  trim: true
}

export const createCategoryValidator = validate(
  checkSchema(
    {
      name: categoryNameSchema,
      icon: categoryIconSchema
    },
    ['body']
  )
)

export const categoryIdValidator = validate(
  checkSchema(
    {
      category_id: {
        custom: {
          options: async (value, { req }) => {
            if (!uuidValidate(value)) {
              throw new ErrorWithStatus({
                status: HTTP_STATUS.BAD_REQUEST,
                message: CATEGORIES_MESSAGES.INVALID_CATEGORY_ID
              })
            }

            const { user_id } = (req as Request).decoded_authorization as TokenPayload

            const category = await prisma.category.findUnique({
              where: { id: value, userId: user_id }
            })

            if (!category) {
              throw new ErrorWithStatus({
                status: HTTP_STATUS.NOT_FOUND,
                message: CATEGORIES_MESSAGES.CATEGORY_NOT_FOUND
              })
            }

            ;(req as Request).category = category

            return true
          }
        }
      }
    },
    ['params', 'body']
  )
)

export const updateCategoryValidator = validate(
  checkSchema(
    {
      name: { ...categoryNameSchema, optional: true, notEmpty: undefined },
      icon: categoryIconSchema
    },
    ['body']
  )
)

export const bulkDeleteCategoriesValidator = validate(
  checkSchema(
    {
      category_ids: {
        isArray: {
          errorMessage: CATEGORIES_MESSAGES.CATEGORY_IDS_MUST_BE_ARRAY
        },
        custom: {
          options: async (value, { req }) => {
            if (isEmpty(value)) {
              throw new ErrorWithStatus({
                status: HTTP_STATUS.BAD_REQUEST,
                message: CATEGORIES_MESSAGES.CATEGORY_IDS_CANNOT_BE_EMPTY
              })
            }

            const isAllValidUuids = value.every((id: string) => uuidValidate(id))

            if (!isAllValidUuids) {
              throw new ErrorWithStatus({
                status: HTTP_STATUS.BAD_REQUEST,
                message: CATEGORIES_MESSAGES.INVALID_CATEGORY_ID
              })
            }

            const { user_id } = (req as Request).decoded_authorization as TokenPayload

            // Use `count` instead of `findMany` to improve performance and reduce data transfer
            const categories = await prisma.category.count({
              where: { id: { in: value }, userId: user_id }
            })

            if (categories !== value.length) {
              throw new ErrorWithStatus({
                status: HTTP_STATUS.NOT_FOUND,
                message: CATEGORIES_MESSAGES.CATEGORY_NOT_FOUND
              })
            }

            return true
          }
        }
      }
    },
    ['body']
  )
)
