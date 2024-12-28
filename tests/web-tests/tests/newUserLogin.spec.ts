import { APIRequestContext } from '@playwright/test';
import { test } from '@setup/pageSetup';
import { createAccountApi } from '@utils/apiUtils';

test.describe('verify account login', () => {
  let apiContext: APIRequestContext;

  test.beforeAll('set api context', async ({ playwright }) => {
    apiContext = await playwright.request.newContext({
      // All Api requests we send go to this API endpoint.
      baseURL: process.env.BASE_URL,
    });
  });

  test.afterAll('dispose api context', async ({}) => {
    // Dispose all responses at the end of the test.
    await apiContext.dispose();
  });

  test(
    'should be able to login with a new user created from api',
    { tag: ['@product', '@login', '@newUserApi'] },
    async ({ loginPage }) => {
      await loginPage.start();

      let email = process.env.DEFAULT_EMAIL!;
      // create new user for each test using rest api based on environment variable from cli
      const newUser = await createAccountApi(apiContext);
      email = newUser?.data?.email ?? process.env.DEFAULT_EMAIL!;
      const password = process.env.DEFAULT_PASSWORD!;
      await loginPage.login(email, password);
    },
  );
});
