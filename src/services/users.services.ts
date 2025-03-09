import { User } from '@prisma/client'
import prisma from '~/client'
import { USERS_MESSAGES } from '~/constants/messages'
import { UpdateMeReqBody } from '~/types/users.types'
import { hashPassword } from '~/utils/crypto'
import { excludeFromObject } from '~/utils/helpers'

class UsersService {
  async getMe(user_id: string) {
    const user = (await prisma.user.findUnique({ where: { id: user_id } })) as User
    const result = excludeFromObject(user, ['password', 'emailVerifyToken', 'forgotPasswordToken'])

    return result
  }

  async updateMe(user_id: string, payload: UpdateMeReqBody) {
    const user = await prisma.user.update({
      where: { id: user_id },
      data: { ...payload }
    })
    const result = excludeFromObject(user, ['password', 'emailVerifyToken', 'forgotPasswordToken'])

    return result
  }

  async changePassword(user_id: string, new_password: string) {
    await prisma.user.update({
      where: { id: user_id },
      data: { password: hashPassword(new_password) }
    })

    return { message: USERS_MESSAGES.CHANGE_PASSWORD_SUCCESS }
  }
}

const usersService = new UsersService()
export default usersService
