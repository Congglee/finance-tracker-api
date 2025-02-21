// Libraries import
import express from 'express'

// Middlewares import
import { defaultErrorHandler } from '~/middlewares/error.middlewares'

// Routes import
import authRouter from '~/routes/auth.routes'

const app = express()

// Enable JSON parsing for request bodies
app.use(express.json())

// Use app routes
app.use('/auth', authRouter)

// Error handler middleware
app.use(defaultErrorHandler)

export default app
