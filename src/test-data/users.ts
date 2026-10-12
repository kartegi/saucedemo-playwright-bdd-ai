import { requireEnv } from '@config/env';

export type UserType = 'standard' | 'locked out' | 'problem' | 'performance glitch';

export interface Credentials {
  username: string;
  password: string;
}

const usernameVariable: Record<UserType, string> = {
  standard: 'STANDARD_USER',
  'locked out': 'LOCKED_OUT_USER',
  problem: 'PROBLEM_USER',
  'performance glitch': 'PERFORMANCE_GLITCH_USER',
};

/** Reads the variables when called, so a test only needs the users it actually uses. */
export function getUsername(type: UserType): string {
  return requireEnv(usernameVariable[type]);
}

export function getCredentials(type: UserType): Credentials {
  return { username: getUsername(type), password: requireEnv('USER_PASSWORD') };
}
