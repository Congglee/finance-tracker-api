import prisma from '~/client'
import { RegisterReqBody } from '~/types/auth.types'
import { v4 as uuidv4 } from 'uuid'
import { signToken } from '~/utils/jwt'
import { TokenType } from '~/constants/enums'
import { UserVerifyStatus } from '@prisma/client'
import { envConfig } from '~/config/environment'
import { hashPassword } from '~/utils/crypto'
import { AUTH_MESSAGES } from '~/constants/messages'
import { sendVerifyRegisterEmail } from '~/providers/resend'

class AuthService {
  private signEmailVerifyToken({ user_id, verify }: { user_id: string; verify: UserVerifyStatus }) {
    return signToken({
      payload: { user_id, token_type: TokenType.EmailVerifyToken, verify },
      privateKey: envConfig.jwtSecretEmailVerifyToken,
      options: { expiresIn: envConfig.emailVerifyTokenExpiresIn }
    })
  }

  async checkEmailExist(email: string) {
    const user = await prisma.user.findUnique({ where: { email } })
    return Boolean(user)
  }

  async register(payload: RegisterReqBody) {
    const user_id = uuidv4()
    const email_verify_token = await this.signEmailVerifyToken({
      user_id,
      verify: UserVerifyStatus.Unverified
    })

    await prisma.user.create({
      data: {
        id: user_id,
        name: payload.name,
        email: payload.email,
        emailVerifyToken: email_verify_token,
        password: hashPassword(payload.password)
      }
    })

    await sendVerifyRegisterEmail(payload.email, email_verify_token)

    return { message: AUTH_MESSAGES.REGISTER_SUCCESS }
  }
}

const authService = new AuthService()
export default authService
