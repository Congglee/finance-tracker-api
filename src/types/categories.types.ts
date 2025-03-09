export interface CreateCategoryReqBody {
  name: string
  icon?: string
}

export type UpdateCategoryReqBody = Partial<CreateCategoryReqBody>

export interface BulkDeleteCategoriesReqBody {
  category_ids: string[]
}
