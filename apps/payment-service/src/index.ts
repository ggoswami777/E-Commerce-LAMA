import { serve } from '@hono/node-server'
import { Hono } from 'hono'

const app = new Hono()

app.get('/', (c) => {
  return c.text('Hello Hono!')
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