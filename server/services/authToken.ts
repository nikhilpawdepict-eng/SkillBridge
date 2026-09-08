import crypto from 'node:crypto';
import { User } from '../../src/types';

const TOKEN_TTL_SECONDS = 60 * 60 * 24;

const getSecret = () => process.env.AUTH_SECRET || 'skillbridge-development-secret-change-me';

export const createAuthToken = (user: User): string => {
  const payload = Buffer.from(JSON.stringify({
    userId: user.id,
    exp: Math.floor(Date.now() / 1000) + TOKEN_TTL_SECONDS,
  })).toString('base64url');
  const signature = crypto.createHmac('sha256', getSecret()).update(payload).digest('base64url');
  return `${payload}.${signature}`;
};

export const verifyAuthToken = (token: string): { userId: string } | null => {
  const [payload, signature] = token.split('.');
  if (!payload || !signature) return null;
  const expected = crypto.createHmac('sha256', getSecret()).update(payload).digest('base64url');
  if (signature.length !== expected.length) return null;
  if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) return null;
  try {
    const parsed = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8')) as { userId: string; exp: number };
    return parsed.exp > Math.floor(Date.now() / 1000) ? { userId: parsed.userId } : null;
  } catch {
    return null;
  }
};
