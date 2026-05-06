import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { clerkMiddleware } from '@hono/clerk-auth'

import sessionRoute from './routes/session.routes.js'
import {cors} from "hono/cors"
const app = new Hono()
app.use('*', clerkMiddleware())
app.use("*",cors({
  origin:["http://localhost:3002"]
}))
app.get('/', (c) => {
  return c.text('Hello Hono!')
})
app.route("/sessions",sessionRoute)
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