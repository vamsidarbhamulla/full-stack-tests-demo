import { test } from '@setup/pageSetup';
import * as headerBar from '@components/headerBar';

test.describe('verify user registration', () => {
  test(
    'should be able check new account created',
    { tag: ['@product', '@registration'] },
    async ({ homePage, loginPage, registrationPage }) => {
      // user actions/steps to open user registration page
      await homePage.open();
      await headerBar.gotoLoginPage();
      await loginPage.gotoCreateAccountPage();
      await registrationPage.validateRequiredFields();
      const { email, password } = await registrationPage.createAccount();
      await loginPage.login(email, password);
    },
  );
});
