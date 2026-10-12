import { defineParameterType } from 'playwright-bdd';
import type { UserType } from '@test-data/users';

defineParameterType({
  name: 'userType',
  regexp: /standard|locked out|problem|performance glitch/,
  transformer: (value: string) => value as UserType,
});
