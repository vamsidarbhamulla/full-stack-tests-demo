import { test as setup } from '@setup/pageSetup';
import { createAccountApi } from '@utils/apiUtils';

setup('authenticate', { tag: '@auth' }, async ({ loginPage, context }) => {
  await loginPage.open();

  let email = process.env.DEFAULT_EMAIL!;
  // create new user for each test using rest api based on environment variable from cli
  const newUser = await createAccountApi(context.request, email);
  email = newUser?.data?.email ?? process.env.DEFAULT_EMAIL!;
  const password = process.env.DEFAULT_PASSWORD!;
  await loginPage.login(email, password);
});
