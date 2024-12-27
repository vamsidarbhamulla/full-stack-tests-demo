import { test } from '@setup/pageSetup';
import * as homePage from '@pages/homePage';
import * as loginPage from '@pages/loginPage';
import * as registrationPage from '@pages/registrationPage';
import * as headerBar from '@components/headerBar';

test.describe('verify user registration', () => {
  test('should be able check new account created', 
    {tag: ['@product', '@registration'],}, 
    async ({homePage}) => {
    // user actions/steps to open user registration page
    await homePage.check();
    await headerBar.gotoLoginPage();
    await loginPage.gotoCreateAccountPage();
    await registrationPage.validateRequiredFields();
    const { email, password } = await registrationPage.createAccount();
    await loginPage.login(email, password);
  });
});
