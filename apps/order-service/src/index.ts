import { clerkPlugin, getAuth } from '@clerk/fastify';
import Fastify from 'fastify';
import { shouldBeUser } from './middleware/authMiddleware.js';
import { connectOrderDB } from '@repo/order-db';
import { orderRoute } from './routes/order.js';
const fastify = Fastify({
  logger: true
});
fastify.register(clerkPlugin);
fastify.get('/test',{preHandler:shouldBeUser},(request,reply)=>{
  return reply.send({message:"Order service is authenticated!",userId:request.userId});
})
fastify.get('/', async (request, reply) => {
  return { hello: 'order service' };
});

fastify.register(orderRoute);

const start = async () => {
  try {
    await connectOrderDB();
    await fastify.listen({ port: 8001, host: '0.0.0.0' });
    console.log('Order service is running on http://localhost:8001');
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};

start();
