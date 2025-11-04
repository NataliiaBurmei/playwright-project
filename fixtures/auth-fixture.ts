import { APIRequestContext, test as base } from '@playwright/test';

let accessToken: string;

type AuthFixtures = {
  apiRequest: APIRequestContext;
  authenticatedApiRequest: APIRequestContext;
};

export const test = base.extend<AuthFixtures>({
  apiRequest: async ({ request }, use) => {
    const authResponse = await request.post('https://api-with-bugs.practicesoftwaretesting.com/users/login', {
      headers: { 'Content-Type': 'application/json' },
      data: { email: 'admin@practicesoftwaretesting.com', password: 'welcome01' },
    });

    const { access_token } = await authResponse.json();

    accessToken = access_token;

    await use(request);
  },

  authenticatedApiRequest: async ({ playwright, apiRequest: _apiRequest }, use) => {
    const authenticatedContext = await playwright.request.newContext({
      baseURL: 'https://api-with-bugs.practicesoftwaretesting.com',
      extraHTTPHeaders: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    await use(authenticatedContext);
    await authenticatedContext.dispose();
  },
});

export { expect } from '@playwright/test';

