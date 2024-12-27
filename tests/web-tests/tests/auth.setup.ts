import { test as setup, expect } from '@playwright/test';
import path from 'path';
import * as loginPage from '@pages/loginPage';
import { createAccountApi } from '@utils/apiUtils';

const authFile = path.join(__dirname, '../playwright/.auth/user.json');

setup('authenticate', async ({ page }) => {
  await loginPage.open();
  
      let email = process.env.DEFAULT_EMAIL!;
      // create new user for each test using rest api based on environment variable from cli
      const newUser = await createAccountApi(apiContext);
      email = newUser?.data?.email ?? process.env.DEFAULT_EMAIL!;
      // console.log('new user created with email:', email, username)
      const password = process.env.DEFAULT_PASSWORD!;
      await loginPage.login(email, password);
});