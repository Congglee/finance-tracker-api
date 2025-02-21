import { UserVerifyStatus } from '@prisma/client'
import { type JwtPayload } from 'jsonwebtoken'
import { TokenType } from '~/constants/enums'

export interface RegisterReqBody {
  name: string
  email: string
  password: string
  confirm_password: string
}

export interface LoginReqBody {
  email: string
  password: string
}

export interface TokenPayload extends JwtPayload {
  user_id: string
  token_type: TokenType
  verify: UserVerifyStatus
  exp: number
  iat: number
}
