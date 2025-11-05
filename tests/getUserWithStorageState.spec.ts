import { test, expect } from '@playwright/test';
import { getTokenFromStorage } from 'src/helper/getTokenFromStorage';

const API_BASE_URL = 'https://api-with-bugs.practicesoftwaretesting.com';

test('authenticated API test', async ({ request }) => {
  const token = getTokenFromStorage();

  const response = await request.get(`${API_BASE_URL}/users/me`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  expect(response.status()).toBe(200);
  const userData = await response.json();
  expect(userData).toHaveProperty('email');
  expect(userData).toHaveProperty('id');
});

