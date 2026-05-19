import Fastify from 'fastify';
import cors from '@fastify/cors';
import formbody from '@fastify/formbody';
import multipart from '@fastify/multipart';
import rateLimit from '@fastify/rate-limit';
import fjwt from '@fastify/jwt';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';

import { config } from './config/index.js';
import { AppError } from './common/errors.js';
import './common/types.js';
import { authRoutes } from './modules/auth/auth.routes.js';
import { exerciseRoutes } from './modules/exercises/exercise.routes.js';
import { routineRoutes } from './modules/routines/routine.routes.js';
import { workoutRoutes } from './modules/workouts/workout.routes.js';

export async function buildApp() {
  const app = Fastify({
    logger: {
      level: config.NODE_ENV === 'production' ? 'info' : 'debug',
      transport: config.NODE_ENV !== 'production' ? { target: 'pino-pretty' } : undefined,
    },
  });

  // Plugins
  await app.register(cors, { origin: config.CORS_ORIGIN });
  await app.register(formbody);
  await app.register(multipart, { limits: { fileSize: 50 * 1024 * 1024 } });
  await app.register(rateLimit, { max: 100, timeWindow: '1 minute' });

  // JWT
  await app.register(fjwt, {
    secret: config.JWT_SECRET,
    sign: { expiresIn: config.JWT_ACCESS_EXPIRES_IN },
  });

  // Swagger
  await app.register(swagger, {
    openapi: {
      info: {
        title: 'GymFree API',
        description: 'Open-source gym workout tracker API',
        version: '0.1.0',
      },
      servers: [{ url: `http://localhost:${config.PORT}` }],
    },
  });
  await app.register(swaggerUi, { routePrefix: '/docs' });

  // Decorate request with user
  app.decorateRequest('user', null as any);

  // Error handler
  app.setErrorHandler((error: any, request, reply) => {
    if (error instanceof AppError) {
      return reply.status(error.statusCode).send({
        statusCode: error.statusCode,
        error: error.code,
        message: error.message,
      });
    }

    if (error.validation) {
      return reply.status(400).send({
        statusCode: 400,
        error: 'VALIDATION_ERROR',
        message: error.message,
        details: error.validation,
      });
    }

    // Log unexpected errors
    request.log.error(error);
    return reply.status(500).send({
      statusCode: 500,
      error: 'INTERNAL_ERROR',
      message: 'Internal server error',
    });
  });

  // Routes
  app.get('/health', async () => ({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  }));

  // API Routes
  await app.register(authRoutes, { prefix: '/api/auth' });
  await app.register(exerciseRoutes, { prefix: '/api/exercises' });
  await app.register(routineRoutes, { prefix: '/api/routines' });
  await app.register(workoutRoutes, { prefix: '/api/workouts' });

  return app;
}

async function start() {
  const app = await buildApp();

  try {
    await app.listen({ port: config.PORT, host: '0.0.0.0' });
    console.log(`🚀 GymFree API running at http://localhost:${config.PORT}`);
    console.log(`📚 API docs at http://localhost:${config.PORT}/docs`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}

start();
