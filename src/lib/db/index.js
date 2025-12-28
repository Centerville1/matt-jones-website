import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import * as schema from './schema/index.js';

// Use environment variables from different sources depending on context
// In SvelteKit: $env/static/private
// In Node.js scripts: process.env (with dotenv)
let TURSO_DATABASE_URL, TURSO_AUTH_TOKEN;

try {
  // Try SvelteKit environment first
  const env = await import('$env/static/private');
  TURSO_DATABASE_URL = env.TURSO_DATABASE_URL;
  TURSO_AUTH_TOKEN = env.TURSO_AUTH_TOKEN;
} catch {
  // Fallback to process.env for Node.js scripts
  TURSO_DATABASE_URL = process.env.TURSO_DATABASE_URL;
  TURSO_AUTH_TOKEN = process.env.TURSO_AUTH_TOKEN;
}

if (!TURSO_DATABASE_URL || !TURSO_AUTH_TOKEN) {
  throw new Error(
    'TURSO_DATABASE_URL and TURSO_AUTH_TOKEN must be set in .env file. See .env.example for setup instructions.',
  );
}

// Connect to Turso (used for both local dev and production)
const client = createClient({
  url: TURSO_DATABASE_URL,
  authToken: TURSO_AUTH_TOKEN,
});

export const db = drizzle(client, { schema });
