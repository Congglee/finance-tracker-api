import { Category, User } from '@prisma/client'
import { TokenPayload } from '~/types/auth.types'

declare module 'express' {
  interface Request {
    decoded_authorization?: TokenPayload
    decoded_refresh_token?: TokenPayload
    decoded_email_verify_token?: TokenPayload
    decoded_forgot_password_token?: TokenPayload

    user?: User
    category?: Category
  }
}
