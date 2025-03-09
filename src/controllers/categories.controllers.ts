import { ParamsDictionary } from 'express-serve-static-core'
import { Request, Response } from 'express'
import { BulkDeleteCategoriesReqBody, CreateCategoryReqBody, UpdateCategoryReqBody } from '~/types/categories.types'
import { TokenPayload } from '~/types/auth.types'
import { CATEGORIES_MESSAGES } from '~/constants/messages'
import categoriesService from '~/services/categories.services'
import { Pagination } from '~/types/common.types'

export const createCategoryController = async (
  req: Request<ParamsDictionary, any, CreateCategoryReqBody>,
  res: Response
) => {
  const { user_id } = req.decoded_authorization as TokenPayload
  const result = await categoriesService.createCategory(user_id, req.body)

  return res.json({ message: CATEGORIES_MESSAGES.CREATE_CATEGORY_SUCCESS, result })
}

export const getCategoriesController = async (req: Request<ParamsDictionary, any, any, Pagination>, res: Response) => {
  const { user_id } = req.decoded_authorization as TokenPayload
  const limit = Number(req.query.limit)
  const page = Number(req.query.page)

  const result = await categoriesService.getCategories({ user_id, limit, page })

  return res.json({
    message: CATEGORIES_MESSAGES.GET_CATEGORIES_SUCCESS,
    result: {
      categories: result.categories,
      limit,
      page,
      total_page: Math.ceil(result.total / limit)
    }
  })
}

export const getCategoryController = async (req: Request, res: Response) => {
  const result = { ...req.category }

  return res.json({
    message: CATEGORIES_MESSAGES.GET_CATEGORY_SUCCESS,
    result
  })
}

export const updateCategoryController = async (
  req: Request<ParamsDictionary, any, UpdateCategoryReqBody>,
  res: Response
) => {
  const { category_id } = req.params
  const { user_id } = req.decoded_authorization as TokenPayload
  const result = await categoriesService.updateCategory(category_id, user_id, req.body)

  return res.json({ message: CATEGORIES_MESSAGES.UPDATE_CATEGORY_SUCCESS, result })
}

export const deleteCategoryController = async (req: Request, res: Response) => {
  const { category_id } = req.params
  const { user_id } = req.decoded_authorization as TokenPayload
  await categoriesService.deleteCategory(category_id, user_id)

  return res.json({ message: CATEGORIES_MESSAGES.DELETE_CATEGORY_SUCCESS })
}

export const bulkDeleteCategoriesController = async (
  req: Request<ParamsDictionary, any, BulkDeleteCategoriesReqBody>,
  res: Response
) => {
  const { category_ids } = req.body
  const { user_id } = req.decoded_authorization as TokenPayload
  await categoriesService.bulkDeleteCategories(category_ids, user_id)

  return res.json({ message: CATEGORIES_MESSAGES.BULK_DELETE_CATEGORY_SUCCESS })
}
