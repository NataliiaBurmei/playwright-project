import { test as setup, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

const authFile = 'playwright/.auth/user.json';

setup('authenticate', async ({ playwright }) => {
  const requestContext = await playwright.request.newContext({
    baseURL: 'https://api-with-bugs.practicesoftwaretesting.com',
  });

  const response = await requestContext.post('/users/login', {
    headers: { 'Content-Type': 'application/json' },
    data: {
      email: 'admin@practicesoftwaretesting.com',
      password: 'welcome01',
    },
  });

  const { access_token } = await response.json();

  expect(access_token).toBeTruthy();
  expect(typeof access_token).toBe('string');

  ensureDirectoryExists(authFile);

  const tokenData = { token: access_token };  fs.writeFileSync(authFile, JSON.stringify(tokenData, null, 2));
  await requestContext.dispose();
});

function ensureDirectoryExists(filePath: string): void {
  const dir = path.dirname(filePath);
  fs.mkdirSync(dir, { recursive: true });
}

