// Libraries import
import express from 'express'

// Middlewares import
import { defaultErrorHandler } from '~/middlewares/error.middlewares'

// Routes import
import authRouter from '~/routes/auth.routes'
import categoriesRouter from '~/routes/categories.routes'
import usersRouter from '~/routes/users.routes'

const app = express()

// Enable JSON parsing for request bodies
app.use(express.json())

// Use app routes
app.use('/auth', authRouter)
app.use('/users', usersRouter)
app.use('/categories', categoriesRouter)

// Error handler middleware
app.use(defaultErrorHandler)

export default app
