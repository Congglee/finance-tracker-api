import { config } from 'dotenv'
import logger from '~/config/logger'
import fs from 'fs'
import path from 'path'

const env = process.env.NODE_ENV
const envFilename = `.env.${env}`

if (!env) {
  logger.error(
    'You have not provided the NODE_ENV variable. Please provide it in the .env file. (example: NODE_ENV=development)'
  )
  logger.error(`Detect NODE_ENV = ${env}`)
  process.exit(1)
}

logger.info(`Detect NODE_ENV = ${env}, so the app will use ${envFilename} file`)

if (!fs.existsSync(path.resolve(envFilename))) {
  logger.error(`File ${envFilename} does not exist`)
  logger.error(
    `Please create a ${envFilename} file or run the app with another NODE_ENV (example: NODE_ENV=production)`
  )
  process.exit(1)
}

config({ path: envFilename })

export const isProduction = env === 'production'

export const envConfig = {
  port: (process.env.PORT as string) || '8000',
  host: (process.env.HOST as string) || 'http://localhost',

  jwtSecretEmailVerifyToken: process.env.JWT_SECRET_EMAIL_VERIFY_TOKEN as string,
  emailVerifyTokenExpiresIn: process.env.EMAIL_VERIFY_TOKEN_EXPIRES_IN as string,

  passwordSecret: process.env.PASSWORD_SECRET as string,

  clientUrl: process.env.CLIENT_URL as string,

  resendApiKey: process.env.RESEND_API_KEY as string,
  resendEmailFromAddress: process.env.RESEND_EMAIL_FROM_ADDRESS as string
}
