import { APIRequestContext, expect,test as base } from '@playwright/test';

const API_BASE_URL = process.env.API_BASE_URL || 'https://api-with-bugs.practicesoftwaretesting.com';
const API_EMAIL = process.env.API_EMAIL || 'admin@practicesoftwaretesting.com';
const API_PASSWORD = process.env.API_PASSWORD || 'welcome01';

type AuthFixtures = {
  authenticatedApiRequest: APIRequestContext;
};

export const test = base.extend<AuthFixtures>({
  authenticatedApiRequest: async ({ playwright }, use) => {
    const authContext = await playwright.request.newContext({
      baseURL: API_BASE_URL,
    });

    const authResponse = await authContext.post('/users/login', {
      headers: { 'Content-Type': 'application/json' },
      data: {
        email: API_EMAIL,
        password: API_PASSWORD,
      },
    });

    expect(authResponse.ok()).toBeTruthy();
    expect(authResponse.status()).toBe(200);

    const authData = await authResponse.json();
    const accessToken = authData.access_token;

    expect(accessToken).toBeTruthy();
    expect(typeof accessToken).toBe('string');

    await authContext.dispose();

    const authenticatedContext = await playwright.request.newContext({
      baseURL: API_BASE_URL,
      extraHTTPHeaders: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    await use(authenticatedContext);
    await authenticatedContext.dispose();
  },
});

export { expect } from '@playwright/test';

