import * as fs from 'fs';

export function getTokenFromStorage(): string {
  const storageState = JSON.parse(fs.readFileSync('playwright/.auth/user.json', 'utf-8'));
  return storageState.token || '';
}
