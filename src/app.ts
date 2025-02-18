import express from 'express'
import prisma from '~/client'

const app = express()

app.use(express.json())

async function main() {
  const allUsers = await prisma.user.findMany()
  console.log(allUsers)
}

main().catch((error) => {
  console.error('Error in main function:', error)
})

export default app
