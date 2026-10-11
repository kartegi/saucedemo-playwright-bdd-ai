import 'dotenv/config';

const get = (name: string, fallback: string): string => process.env[name] || fallback;

export const env = {
  baseUrl: get('BASE_URL', 'https://www.saucedemo.com'),
  password: get('USER_PASSWORD', 'secret_sauce'),
  users: {
    standard: get('STANDARD_USER', 'standard_user'),
    lockedOut: get('LOCKED_OUT_USER', 'locked_out_user'),
    problem: get('PROBLEM_USER', 'problem_user'),
    performanceGlitch: get('PERFORMANCE_GLITCH_USER', 'performance_glitch_user'),
  },
} as const;
