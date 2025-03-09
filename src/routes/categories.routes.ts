import { Router } from 'express'
import {
  bulkDeleteCategoriesController,
  createCategoryController,
  deleteCategoryController,
  getCategoriesController,
  getCategoryController,
  updateCategoryController
} from '~/controllers/categories.controllers'
import { accessTokenValidator } from '~/middlewares/auth.middlewares'
import {
  bulkDeleteCategoriesValidator,
  categoryIdValidator,
  createCategoryValidator,
  updateCategoryValidator
} from '~/middlewares/categories.middlewares'
import { filterMiddleware, paginationValidator } from '~/middlewares/common.middlewares'
import { verifiedUserValidator } from '~/middlewares/users.middlewares'
import { UpdateCategoryReqBody } from '~/types/categories.types'
import { wrapRequestHandler } from '~/utils/handlers'

const categoriesRouter = Router()

categoriesRouter.post(
  '/',
  accessTokenValidator,
  verifiedUserValidator,
  createCategoryValidator,
  wrapRequestHandler(createCategoryController)
)

categoriesRouter.get(
  '/',
  paginationValidator,
  accessTokenValidator,
  verifiedUserValidator,
  wrapRequestHandler(getCategoriesController)
)

categoriesRouter.get(
  '/:category_id',
  accessTokenValidator,
  verifiedUserValidator,
  categoryIdValidator,
  wrapRequestHandler(getCategoryController)
)

categoriesRouter.put(
  '/:category_id',
  accessTokenValidator,
  verifiedUserValidator,
  categoryIdValidator,
  updateCategoryValidator,
  filterMiddleware<UpdateCategoryReqBody>(['name', 'icon']),
  wrapRequestHandler(updateCategoryController)
)

categoriesRouter.delete(
  '/:category_id',
  accessTokenValidator,
  verifiedUserValidator,
  categoryIdValidator,
  wrapRequestHandler(deleteCategoryController)
)

categoriesRouter.post(
  '/bulk-delete',
  accessTokenValidator,
  verifiedUserValidator,
  bulkDeleteCategoriesValidator,
  wrapRequestHandler(bulkDeleteCategoriesController)
)

export default categoriesRouter
