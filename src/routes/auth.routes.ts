import { Router } from 'express'
import {
  loginController,
  logoutController,
  refreshTokenController,
  registerController,
  resendVerifyEmailController,
  verifyEmailController
} from '~/controllers/auth.controllers'
import {
  accessTokenValidator,
  emailVerifyTokenValidator,
  loginValidator,
  refreshTokenValidator,
  registerValidator
} from '~/middlewares/auth.middlewares'
import { wrapRequestHandler } from '~/utils/handlers'

const authRouter = Router()

authRouter.post('/register', registerValidator, wrapRequestHandler(registerController))

authRouter.post('/login', loginValidator, wrapRequestHandler(loginController))

authRouter.post('/logout', accessTokenValidator, refreshTokenValidator, wrapRequestHandler(logoutController))

authRouter.post('/refresh-token', refreshTokenValidator, wrapRequestHandler(refreshTokenController))

authRouter.post('/verify-email', emailVerifyTokenValidator, wrapRequestHandler(verifyEmailController))

authRouter.post('/resend-verify-email', accessTokenValidator, wrapRequestHandler(resendVerifyEmailController))

export default authRouter
