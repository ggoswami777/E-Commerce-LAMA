import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { clerkMiddleware, getAuth } from '@hono/clerk-auth'
import { shouldBeUser } from './middleware/authMiddleware.js'
import stripe from './utils/stripe.js'

const app = new Hono()
app.use('*', clerkMiddleware())
app.get('/', (c) => {
  return c.text('Hello Hono!')
})
// app.post('/create-stripe-product',async (c) => {
//   const res=await stripe.products.create({
//     id:"123",
//     name:"Test Product",
//     default_price_data:{
//       currency:"usd",
//       unit_amount:10*100
//     },
//   });
//   return c.json(res);
// })
// app.post('/stripe-product-price',async (c) => {
//   const res=await stripe.prices.list({
//     product:"123",

//   })
// })

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