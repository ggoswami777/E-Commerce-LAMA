import { clerkPlugin, getAuth } from '@clerk/fastify';
import Fastify from 'fastify';

const fastify = Fastify({
  logger: true
});
fastify.register(clerkPlugin);
fastify.get('/test',(request,reply)=>{
  const {userId}=getAuth(request);
  if(!userId){
    return reply.send({message:"You are not logged in"});
  }
  return reply.send({message:"Order service is authenticated!"});


})
fastify.get('/', async (request, reply) => {
  return { hello: 'order service' };
});

const start = async () => {
  try {
    await fastify.listen({ port: 8001, host: '0.0.0.0' });
    console.log('Order service is running on http://localhost:8001');
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
