# Agent Instructions: Writing Tests with Fixtures

This document provides clear instructions for AI agents on how to write Playwright tests using the project's fixture system.

## Project Structure

```
playwright-project/
├── fixtures/              # Custom fixtures (reusable test setup)
│   └── auth-fixture.ts   # Authentication fixtures
├── tests/                # Test files (*.spec.ts)
│   └── getUser.spec.ts   # Example test file
├── playwright.config.ts  # Playwright configuration
├── tsconfig.json         # TypeScript configuration
└── package.json          # Dependencies
```

## Available Fixtures

### `auth-fixture.ts`

**Location:** `fixtures/auth-fixture.ts`

**Available Fixtures:**
- `apiRequest: APIRequestContext` - Authenticated API request context (automatically logs in)
- `accessToken: string` - The authentication token string

**What it does:**
- Automatically authenticates with the API before tests run
- Provides `apiRequest` for making authenticated API calls
- Provides `accessToken` for manual header inclusion if needed

## How to Write New Tests

### Step 1: Import the Fixture

Always import from the fixture file using path aliases:

```typescript
import { test, expect } from 'fixtures/auth-fixture';
```

### Step 2: Use the Fixtures in Your Test

Fixtures are automatically available when you destructure them in the test function:

```typescript
test('test name', async ({ apiRequest, accessToken }) => {
  // Your test code here
});
```

### Step 3: Write Your Test Logic

#### Example 1: API Test with Authenticated Request

```typescript
import { test, expect } from '../fixtures/auth-fixture';

test.describe('API Tests', () => {
  test('should get user info', async ({ apiRequest, accessToken }) => {
    const response = await apiRequest.get('https://api-with-bugs.practicesoftwaretesting.com/users/me', {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      },
    });
    
    expect(response.status()).toBe(200);
    const userData = await response.json();
    expect(userData).toHaveProperty('email');
  });
});
```

#### Example 2: Multiple API Calls in One Test

```typescript
import { test, expect } from '../fixtures/auth-fixture';

test.describe('User Management', () => {
  test('should create and retrieve user', async ({ apiRequest, accessToken }) => {
    // Create user
    const createResponse = await apiRequest.post(
      'https://api-with-bugs.practicesoftwaretesting.com/users',
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        data: {
          name: 'Test User',
          email: 'test@example.com'
        }
      }
    );
    expect(createResponse.status()).toBe(201);
    
    // Get user
    const getResponse = await apiRequest.get(
      'https://api-with-bugs.practicesoftwaretesting.com/users/me',
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      }
    );
    expect(getResponse.status()).toBe(200);
  });
});
```

## Fixture Execution Order

**Important:** Fixtures run automatically before your test code executes. The order is:

1. `apiRequest` runs first - authenticates and gets the token
2. `accessToken` runs second - provides the token (depends on `apiRequest`)
3. Your test code runs

**You don't need to manually call authentication** - it happens automatically when you use the fixtures.

## Best Practices for Agents

### ✅ DO:

1. **Always import fixtures from the fixture file:**
   ```typescript
   import { test, expect } from 'fixtures/auth-fixture';
   ```

2. **Destructure fixtures you need:**
   ```typescript
   test('test', async ({ apiRequest, accessToken }) => {
     // Use apiRequest and accessToken
   });
   ```

3. **Include Authorization header in API requests:**
   ```typescript
   headers: {
     'Authorization': `Bearer ${accessToken}`
   }
   ```

4. **Use descriptive test names:**
   ```typescript
   test('should get user profile successfully', async ({ ... }) => {
   ```

5. **Group related tests in describe blocks:**
   ```typescript
   test.describe('User API Tests', () => {
     // Multiple tests here
   });
   ```

### ❌ DON'T:

1. **Don't create a new authentication in each test** - use the fixtures
2. **Don't use relative path** - use alias paths (`fixtures/auth-fixture`)
3. **Don't forget the Authorization header** when making authenticated API calls
4. **Don't modify fixture files** unless explicitly asked - create new fixtures if needed
5. **Don't hardcode credentials** - they're already in the fixture

## Creating New Test Files

### File Naming Convention

- Use descriptive names: `getUser.spec.ts`, `createBooking.spec.ts`
- Always end with `.spec.ts`
- Place in `tests/` directory

### File Structure Template

```typescript
import { test, expect } from '../fixtures/auth-fixture';

test.describe('Feature Name Tests', () => {
  test('should perform action successfully', async ({ apiRequest, accessToken }) => {
    // Arrange - set up test data if needed
    
    // Act - perform the action
    const response = await apiRequest.get('/endpoint', {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });
    
    // Assert - verify the result
    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(data).toHaveProperty('expectedField');
  });
});
```

## API Endpoints Reference

**Base URL:** `https://api-with-bugs.practicesoftwaretesting.com`

**Common Endpoints:**
- `POST /users/login` - Authentication (handled by fixture)
- `GET /users/me` - Get current user
- `GET /users` - List users
- `POST /users` - Create user

**Note:** Always include `Authorization: Bearer ${accessToken}` header for authenticated endpoints.

## Common HTTP Methods

### GET Request
```typescript
const response = await apiRequest.get('/endpoint', {
  headers: {
    'Authorization': `Bearer ${accessToken}`
  }
});
```

### POST Request
```typescript
const response = await apiRequest.post('/endpoint', {
  headers: {
    'Authorization': `Bearer ${accessToken}`,
    'Content-Type': 'application/json'
  },
  data: {
    field1: 'value1',
    field2: 'value2'
  }
});
```

### PUT Request
```typescript
const response = await apiRequest.put('/endpoint', {
  headers: {
    'Authorization': `Bearer ${accessToken}`,
    'Content-Type': 'application/json'
  },
  data: { /* update data */ }
});
```

### DELETE Request
```typescript
const response = await apiRequest.delete('/endpoint', {
  headers: {
    'Authorization': `Bearer ${accessToken}`
  }
});
```

## Assertions

Use Playwright's `expect` for assertions:

```typescript
// Status code
expect(response.status()).toBe(200);

// Response body
const data = await response.json();
expect(data).toHaveProperty('id');
expect(data.email).toBe('user@example.com');

// Response headers
expect(response.headers()['content-type']).toContain('application/json');
```

## Running Tests

Tests can be run with:
```bash
pnpm test              # Run all tests
pnpm test:ui           # Run with UI mode
pnpm test:headed       # Run in headed mode (see browser)
pnpm test:debug        # Run in debug mode
```

## Troubleshooting

### Fixture not found
- Check import path: Use `'../fixtures/auth-fixture'` (relative path)
- Verify file exists in `fixtures/` directory

### Authentication fails
- Check if `apiRequest` fixture is destructured in test
- Verify API endpoint is accessible
- Check credentials in fixture file

### Token undefined
- Ensure `accessToken` is destructured along with `apiRequest`
- `accessToken` depends on `apiRequest`, so both must be included

## Summary for Agents

1. **Import:** `import { test, expect } from '../fixtures/auth-fixture';`
2. **Use fixtures:** Destructure `{ apiRequest, accessToken }` in test function
3. **Make requests:** Use `apiRequest` with `Authorization: Bearer ${accessToken}` header
4. **Assert:** Use `expect()` to verify responses
5. **Fixtures run automatically** - no manual setup needed

Remember: Fixtures handle authentication automatically. Just import, use, and write your test logic!
