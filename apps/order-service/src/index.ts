import Fastify from 'fastify';

const fastify = Fastify({
  logger: true
});

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
