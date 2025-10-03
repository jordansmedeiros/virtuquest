import { z } from 'zod';

// Server-side environment variables (private)
const serverSchema = z.object({
  N8N_BASE_URL: z.string().url(),
  N8N_API_KEY: z.string().min(1).optional(),
  N8N_WEBHOOK_SECRET: z.string().min(32),
  JWT_SECRET: z.string().min(32),
  JWT_REFRESH_SECRET: z.string().min(32),
  JWT_EXPIRES_IN: z.string().default('15m'),
  JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),
  DATABASE_URL: z.string().url().optional(),
  LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error']).default('info'),
  CACHE_TTL_BNCC: z.string().transform(Number).default('86400'),
  CACHE_TTL_BLOOM: z.string().transform(Number).default('86400'),
  CACHE_TTL_VIRTUDES: z.string().transform(Number).default('86400'),
  TELEMETRY_ENDPOINT: z.string().url().optional(),
  TELEMETRY_BATCH_SIZE: z.string().transform(Number).default('10'),
  TELEMETRY_FLUSH_INTERVAL: z.string().transform(Number).default('30000'),
  KHAN_ACADEMY_API_KEY: z.string().optional(),
  GOOGLE_FORMS_CLIENT_ID: z.string().optional(),
  GOOGLE_FORMS_CLIENT_SECRET: z.string().optional(),
  SEDUC_API_URL: z.string().url().optional(),
  SEDUC_API_KEY: z.string().optional(),
});

// Client-side environment variables (public)
const clientSchema = z.object({
  NEXT_PUBLIC_APP_URL: z.string().url(),
  NEXT_PUBLIC_APP_ENV: z.enum(['development', 'staging', 'production']).default('development'),
  NEXT_PUBLIC_ENABLE_AI_ASSISTANT: z
    .string()
    .transform((v) => v === 'true')
    .default('true'),
  NEXT_PUBLIC_ENABLE_GAMIFICATION: z
    .string()
    .transform((v) => v === 'true')
    .default('false'),
  NEXT_PUBLIC_ENABLE_TELEMETRY: z
    .string()
    .transform((v) => v === 'true')
    .default('true'),
  NEXT_PUBLIC_ENABLE_OFFLINE_MODE: z
    .string()
    .transform((v) => v === 'true')
    .default('true'),
  NEXT_PUBLIC_MOCK_N8N: z
    .string()
    .transform((v) => v === 'true')
    .default('false'),
  NEXT_PUBLIC_SHOW_DEBUG_INFO: z
    .string()
    .transform((v) => v === 'true')
    .default('false'),
});

// Combined schema
const envSchema = serverSchema.merge(clientSchema);

function validateEnv(): z.infer<typeof envSchema> {
  try {
    return envSchema.parse(process.env);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingVars = error.errors
        .map((err) => `${err.path.join('.')}: ${err.message}`)
        .join('\n');
      
      console.error('❌ Invalid environment variables:\n', missingVars);
      throw new Error('Environment validation failed');
    }
    throw error;
  }
}

// Validate and export environment variables
export const env = validateEnv();

// Export type for use across application
export type Env = typeof env;

/* Usage example:
import { env } from '@/lib/env';

// Type-safe access
const n8nUrl = env.N8N_BASE_URL; // string
const aiEnabled = env.NEXT_PUBLIC_ENABLE_AI_ASSISTANT; // boolean
*/