import { test as setup } from '@playwright/test';
import * as fs from 'fs';

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

  if (!access_token) {
    throw new Error('Authentication failed: No access token received');
  }

  const tokenData = { token: access_token };
  fs.writeFileSync(authFile, JSON.stringify(tokenData, null, 2));
  await requestContext.dispose();
});

