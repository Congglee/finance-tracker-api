import { Router } from 'express'
import {
  forgotPasswordController,
  loginController,
  logoutController,
  refreshTokenController,
  registerController,
  resendVerifyEmailController,
  verifyEmailController,
  verifyForgotPasswordController
} from '~/controllers/auth.controllers'
import {
  accessTokenValidator,
  emailVerifyTokenValidator,
  forgotPasswordValidator,
  loginValidator,
  refreshTokenValidator,
  registerValidator,
  verifyForgotPasswordTokenValidator
} from '~/middlewares/auth.middlewares'
import { wrapRequestHandler } from '~/utils/handlers'

const authRouter = Router()

authRouter.post('/register', registerValidator, wrapRequestHandler(registerController))

authRouter.post('/login', loginValidator, wrapRequestHandler(loginController))

authRouter.post('/logout', accessTokenValidator, refreshTokenValidator, wrapRequestHandler(logoutController))

authRouter.post('/refresh-token', refreshTokenValidator, wrapRequestHandler(refreshTokenController))

authRouter.post('/verify-email', emailVerifyTokenValidator, wrapRequestHandler(verifyEmailController))

authRouter.post('/resend-verify-email', accessTokenValidator, wrapRequestHandler(resendVerifyEmailController))

authRouter.post('/forgot-password', forgotPasswordValidator, wrapRequestHandler(forgotPasswordController))

authRouter.post(
  '/verify-forgot-password',
  verifyForgotPasswordTokenValidator,
  wrapRequestHandler(verifyForgotPasswordController)
)

export default authRouter
