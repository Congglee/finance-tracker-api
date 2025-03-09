import { Prisma } from '@prisma/client'
import prisma from '~/client'
import { BulkDeleteCategoriesReqBody, CreateCategoryReqBody, UpdateCategoryReqBody } from '~/types/categories.types'

class CategoriesService {
  async createCategory(user_id: string, body: CreateCategoryReqBody) {
    const category = await prisma.category.create({
      data: { ...body, userId: user_id }
    })

    return category
  }

  async getCategories({ user_id, limit, page }: { user_id: string; limit: number; page: number }) {
    const where: Prisma.CategoryWhereInput = { userId: user_id }

    const categories = await prisma.category.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit
    })
    const total = await prisma.category.count({ where })

    return { categories, total }
  }

  async updateCategory(category_id: string, user_id: string, body: UpdateCategoryReqBody) {
    const category = await prisma.category.update({
      where: { id: category_id, userId: user_id },
      data: body
    })

    return category
  }

  async deleteCategory(category_id: string, user_id: string) {
    await prisma.category.delete({
      where: { id: category_id, userId: user_id }
    })
  }

  async bulkDeleteCategories(category_ids: BulkDeleteCategoriesReqBody['category_ids'], user_id: string) {
    await prisma.category.deleteMany({
      where: { id: { in: category_ids }, userId: user_id }
    })
  }
}

const categoriesService = new CategoriesService()
export default categoriesService
