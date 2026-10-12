import { env } from '@config/env';

export type UserType = 'standard' | 'locked out' | 'problem' | 'performance glitch';

export interface Credentials {
  username: string;
  password: string;
}

const byType: Record<UserType, string> = {
  standard: env.users.standard,
  'locked out': env.users.lockedOut,
  problem: env.users.problem,
  'performance glitch': env.users.performanceGlitch,
};

export function getCredentials(type: UserType): Credentials {
  return { username: byType[type], password: env.password };
}
