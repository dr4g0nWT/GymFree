import type { FastifyRequest, FastifyReply } from 'fastify';
import { registerSchema, loginSchema, updateProfileSchema } from '@gymfree/shared';
import * as service from './auth.service.js';

export async function register(request: FastifyRequest, reply: FastifyReply) {
  const data = registerSchema.parse(request.body);

  const result = await service.register(data);

  const accessToken = await reply.jwtSign({
    id: result.user.id,
    email: result.user.email,
    username: result.user.username,
  });

  const refreshToken = await reply.jwtSign(
    { id: result.user.id, type: 'refresh' },
    { expiresIn: '30d' },
  );

  return reply.status(201).send({
    user: result.user,
    accessToken,
    refreshToken,
  });
}

export async function login(request: FastifyRequest, reply: FastifyReply) {
  const data = loginSchema.parse(request.body);

  const result = await service.login(data);

  const accessToken = await reply.jwtSign({
    id: result.user.id,
    email: result.user.email,
    username: result.user.username,
  });

  const refreshToken = await reply.jwtSign(
    { id: result.user.id, type: 'refresh' },
    { expiresIn: '30d' },
  );

  return reply.send({
    user: result.user,
    accessToken,
    refreshToken,
  });
}

export async function refresh(request: FastifyRequest, reply: FastifyReply) {
  const { refreshToken } = request.body as { refreshToken: string };

  if (!refreshToken) {
    return reply.status(400).send({
      statusCode: 400,
      error: 'VALIDATION_ERROR',
      message: 'Refresh token is required',
    });
  }

  try {
    const payload = request.jwt.verify<{ id: string; type: string }>(refreshToken);

    if (payload.type !== 'refresh') {
      return reply.status(401).send({
        statusCode: 401,
        error: 'UNAUTHORIZED',
        message: 'Invalid refresh token',
      });
    }

    const user = await service.getUserById(payload.id);

    const accessToken = await reply.jwtSign({
      id: user.id,
      email: user.email,
      username: user.username,
    });

    return reply.send({ accessToken });
  } catch {
    return reply.status(401).send({
      statusCode: 401,
      error: 'UNAUTHORIZED',
      message: 'Invalid or expired refresh token',
    });
  }
}

export async function me(request: FastifyRequest, reply: FastifyReply) {
  const userId = request.user!.id;
  const user = await service.getUserProfile(userId);
  return reply.send(user);
}

export async function updateMe(request: FastifyRequest, reply: FastifyReply) {
  const userId = request.user!.id;
  const data = updateProfileSchema.parse(request.body);
  const user = await service.updateProfile(userId, data);
  return reply.send(user);
}
