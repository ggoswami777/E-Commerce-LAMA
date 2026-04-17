import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { clerkMiddleware, getAuth } from '@hono/clerk-auth'
import { shouldBeUser } from './middleware/authMiddleware.js'

const app = new Hono()
app.use('*', clerkMiddleware())
app.get('/', (c) => {
  return c.text('Hello Hono!')
})
app.get('/test',shouldBeUser, (c) => {
  return c.json({
    message: 'Payment service is authenticated', userId:c.get("userId")
    
  })
})

const port = process.env.PORT ? parseInt(process.env.PORT) : 8002;

const start=async()=>{
  try {
    serve({
  fetch: app.fetch,
  port: port
}, (info) => {
  console.log(`Payment Service is running on http://localhost:${info.port}`)
})

  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}
start();