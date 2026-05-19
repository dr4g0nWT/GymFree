import { z } from 'zod';

const envSchema = z.object({
  PORT: z.coerce.number().default(3001),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  DATABASE_URL: z.string().url(),
  JWT_SECRET: z.string().min(32),
  JWT_ACCESS_EXPIRES_IN: z.string().default('7d'),
  JWT_REFRESH_EXPIRES_IN: z.string().default('30d'),
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
  STORAGE_ENDPOINT: z.string().default('localhost:9000'),
  STORAGE_ACCESS_KEY: z.string().default('gymfree'),
  STORAGE_SECRET_KEY: z.string().default('gymfree-dev'),
  STORAGE_BUCKET: z.string().default('gymfree-media'),
  STORAGE_USE_SSL: z.coerce.boolean().default(false),
  CORS_ORIGIN: z.string().default('*'),
  REDIS_URL: z.string().optional(),
});

function loadConfig() {
  const result = envSchema.safeParse(process.env);

  if (!result.success) {
    console.error('❌ Invalid environment variables:', result.error.flatten().fieldErrors);
    process.exit(1);
  }

  return result.data;
}

export const config = loadConfig();
export type Config = ReturnType<typeof loadConfig>;
