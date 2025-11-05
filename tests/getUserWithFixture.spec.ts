import { test, expect } from 'fixtures/auth-fixture';

test.describe('Get Users Tests', () => {

  test('should get user successfully', async ({ authenticatedApiRequest}) => {
    const response = await authenticatedApiRequest.get('/users/me');
    expect(response.status()).toBe(200);
    const userData = await response.json();
    expect(userData).toHaveProperty('email');
  });
});
