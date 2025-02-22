import prisma from '~/client'
import { RegisterReqBody } from '~/types/auth.types'
import { v4 as uuidv4 } from 'uuid'
import { signToken, verifyToken } from '~/utils/jwt'
import { TokenType } from '~/constants/enums'
import { UserVerifyStatus } from '@prisma/client'
import { envConfig } from '~/config/environment'
import { hashPassword } from '~/utils/crypto'
import { AUTH_MESSAGES } from '~/constants/messages'
import { sendForgotPasswordEmail, sendVerifyRegisterEmail } from '~/providers/resend'

class AuthService {
  private signAccessToken({ user_id, verify }: { user_id: string; verify: UserVerifyStatus }) {
    return signToken({
      payload: { user_id, token_type: TokenType.AccessToken, verify },
      privateKey: envConfig.jwtSecretAccessToken,
      options: { expiresIn: envConfig.accessTokenExpiresIn }
    })
  }

  private signRefreshToken({ user_id, verify, exp }: { user_id: string; verify: UserVerifyStatus; exp?: number }) {
    if (exp) {
      return signToken({
        payload: { user_id, token_type: TokenType.RefreshToken, verify, exp },
        privateKey: envConfig.jwtSecretRefreshToken
      })
    }

    return signToken({
      payload: { user_id, token_type: TokenType.RefreshToken, verify },
      privateKey: envConfig.jwtSecretRefreshToken,
      options: { expiresIn: envConfig.refreshTokenExpiresIn }
    })
  }

  private signEmailVerifyToken({ user_id, verify }: { user_id: string; verify: UserVerifyStatus }) {
    return signToken({
      payload: { user_id, token_type: TokenType.EmailVerifyToken, verify },
      privateKey: envConfig.jwtSecretEmailVerifyToken,
      options: { expiresIn: envConfig.emailVerifyTokenExpiresIn }
    })
  }

  private signAccessAndRefreshToken({ user_id, verify }: { user_id: string; verify: UserVerifyStatus }) {
    return Promise.all([this.signAccessToken({ user_id, verify }), this.signRefreshToken({ user_id, verify })])
  }

  private decodeRefreshToken(refresh_token: string) {
    return verifyToken({ token: refresh_token, secretOrPublicKey: envConfig.jwtSecretRefreshToken })
  }

  private signForgotPasswordToken({ user_id, verify }: { user_id: string; verify: UserVerifyStatus }) {
    return signToken({
      payload: { user_id, token_type: TokenType.ForgotPasswordToken, verify },
      privateKey: envConfig.jwtSecretForgotPasswordToken,
      options: { expiresIn: envConfig.forgotPasswordTokenExpiresIn }
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

  async login({ user_id, verify }: { user_id: string; verify: UserVerifyStatus }) {
    const [access_token, refresh_token] = await this.signAccessAndRefreshToken({ user_id, verify })
    const { iat, exp } = await this.decodeRefreshToken(refresh_token)

    await prisma.refreshToken.create({
      data: {
        userId: user_id,
        token: refresh_token,
        iat: new Date(iat * 1000),
        exp: new Date(exp * 1000)
      }
    })

    return { access_token, refresh_token }
  }

  async logout(refresh_token: string) {
    await prisma.refreshToken.deleteMany({ where: { token: refresh_token } })
    return { message: AUTH_MESSAGES.LOGOUT_SUCCESS }
  }

  async refreshToken({
    user_id,
    verify,
    refresh_token,
    exp
  }: {
    user_id: string
    verify: UserVerifyStatus
    refresh_token: string
    exp: number
  }) {
    const [new_access_token, new_refresh_token] = await Promise.all([
      this.signAccessToken({ user_id, verify }),
      this.signRefreshToken({ user_id, verify }),
      prisma.refreshToken.deleteMany({ where: { token: refresh_token } })
    ])
    const decoded_refresh_token = await this.decodeRefreshToken(new_refresh_token)

    await prisma.refreshToken.create({
      data: {
        userId: user_id,
        token: new_refresh_token,
        iat: new Date(decoded_refresh_token.iat * 1000),
        exp: new Date(decoded_refresh_token.exp * 1000)
      }
    })

    return { access_token: new_access_token, refresh_token: new_refresh_token }
  }

  async verifyEmail(user_id: string) {
    const [token] = await Promise.all([
      this.signAccessAndRefreshToken({ user_id, verify: UserVerifyStatus.Verified }),
      await prisma.user.update({
        where: { id: user_id },
        data: { emailVerifyToken: '', verify: UserVerifyStatus.Verified }
      })
    ])
    const [access_token, refresh_token] = token
    const { iat, exp } = await this.decodeRefreshToken(refresh_token)

    await prisma.refreshToken.create({
      data: {
        userId: user_id,
        token: refresh_token,
        iat: new Date(iat * 1000),
        exp: new Date(exp * 1000)
      }
    })

    return { access_token, refresh_token }
  }

  async resendVerifyEmail(user_id: string, email: string) {
    const email_verify_token = await this.signEmailVerifyToken({
      user_id,
      verify: UserVerifyStatus.Unverified
    })
    await sendVerifyRegisterEmail(email, email_verify_token)

    await prisma.user.update({
      where: { id: user_id },
      data: { emailVerifyToken: email_verify_token }
    })

    return { message: AUTH_MESSAGES.RESEND_EMAIL_VERIFY_SUCCESS }
  }

  async forgotPassword({ user_id, email, verify }: { user_id: string; email: string; verify: UserVerifyStatus }) {
    const forgot_password_token = await this.signForgotPasswordToken({ user_id, verify })

    await prisma.user.update({
      where: { id: user_id },
      data: { forgotPasswordToken: forgot_password_token }
    })
    await sendForgotPasswordEmail(email, forgot_password_token)

    return { message: AUTH_MESSAGES.CHECK_EMAIL_TO_RESET_PASSWORD }
  }
}

const authService = new AuthService()
export default authService
