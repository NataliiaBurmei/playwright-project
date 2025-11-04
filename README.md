# Playwright TypeScript Project

A Playwright project with TypeScript for API testing, featuring authentication fixtures and automated test workflows.

## Getting Started

### Prerequisites

Make sure you have pnpm installed. If not, install it:
```bash
npm install -g pnpm
```

### Installation

1. Install dependencies:
```bash
pnpm install
```

2. Install Playwright browsers:
```bash
pnpm exec playwright install
```

### Running Tests

- Run all tests:
```bash
pnpm test
```

- Show test report:
```bash
pnpm test:report
```

## Fixtures

### Authentication Fixture

The project includes an `auth-fixture.ts` that provides automatic authentication for API tests.
- `apiRequest: APIRequestContext` - Base API request context (authenticates automatically)
- `authenticatedApiRequest: APIRequestContext` - Authenticated API request with Authorization header pre-configured

**Usage:**
```typescript
import { test, expect } from '../fixtures/auth-fixture';

test.describe('API Tests', () => {
  test('should get user info', async ({ authenticatedApiRequest }) => {
    const response = await authenticatedApiRequest.get('/users/me');
    expect(response.status()).toBe(200);
  });
});
```

## Writing Tests

Create new test files in the `tests/` folder with the `.spec.ts` extension:

### Example: API Test

```typescript
import { test, expect } from '../fixtures/auth-fixture';

test.describe('User API Tests', () => {
  test('should get current user', async ({ authenticatedApiRequest }) => {
    const response = await authenticatedApiRequest.get('/users/me');
    expect(response.status()).toBe(200);
    
    const data = await response.json();
    expect(data).toHaveProperty('email');
  });
```

## API Testing

This project is configured for testing the Practice Software Testing API:
- **Base URL:** `https://api-with-bugs.practicesoftwaretesting.com`
- **Authentication:** Bearer token (automatically handled by fixtures)
- **Credentials:** Configured in `auth-fixture.ts`

## CI/CD

GitHub Actions workflow is configured in `.github/workflows/playwright.yml`:
- Runs tests on push/PR to main branch
- Supports manual trigger
- Uploads test reports as artifacts
- Uses pnpm for dependency management

## Documentation

- **AGENTS.md** - Instructions for AI agents on writing tests with fixtures
