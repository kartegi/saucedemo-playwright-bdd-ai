import { defineParameterType } from 'playwright-bdd';
import { SORT_LABELS, type SortLabel, type SortOption } from '@pages/InventoryPage';
import { USER_TYPES, type UserType } from '@test-data/users';

const escapeRegExp = (text: string): string => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

defineParameterType({
  name: 'userType',
  regexp: new RegExp(USER_TYPES.join('|')),
  transformer: (value: string) => value as UserType,
});

// A sort order as the dropdown shows it, in double quotes: "Price (low to high)". An unknown label
// does not match, so bddgen reports the step as missing instead of failing at run time.
defineParameterType({
  name: 'sortOrder',
  regexp: new RegExp(`"(${Object.keys(SORT_LABELS).map(escapeRegExp).join('|')})"`),
  transformer: (label: string): SortOption => SORT_LABELS[label as SortLabel],
});
