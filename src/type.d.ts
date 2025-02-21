import { User } from '@prisma/client'
import { TokenPayload } from '~/types/auth.types'

declare module 'express' {
  interface Request {
    user?: User
    decoded_authorization?: TokenPayload
    decoded_refresh_token?: TokenPayload
  }
}
