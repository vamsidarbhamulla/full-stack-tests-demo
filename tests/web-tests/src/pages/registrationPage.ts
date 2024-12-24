import { getPage, openPage, waitForPageLoad } from '@utils/pageUtils';
import { Locator, expect } from '@playwright/test';
import { randEmail } from '@ngneat/falso';

const SELECTORS = () => ({
  email: getPage().getByLabel('Email address field'),
  password2: getPage().getByLabel('Field for the password'),
  password1: getPage()
    .locator('div')
    .filter({ hasText: /^Password \*$/ })
    .nth(1),
  password: getPage().locator('#passwordControl'),
  repeatPassword1: getPage()
    .locator('div')
    .filter({ hasText: /^Repeat Password \*$/ })
    .nth(1),
  repeatPassword: getPage().locator('#repeatPasswordControl'),
  showPasswordAdvice: getPage().locator('.mat-slide-toggle-bar'),
  securityQuestionSelector1: getPage().getByLabel('Selection list for the').locator('span'),
  securityQuestionSelector: getPage().locator('mat-select[role="combobox"]'),
  securityQuestionItem: getPage().locator('.mat-option-text'),
  securityQuestionAnswer: getPage().getByPlaceholder('Answer to your security'),
  securityQuestionAnswer1: getPage().locator('mat-form-field').filter({ hasText: 'Answer *' }),
  registerButton: getPage().locator('#registerButton'),
  registerApp: getPage().locator('app-register'),
  loginLink: getPage().locator('a[href="#/login"]'),
});

export async function open() {
  await openPage('/register');
}

export async function createAccount(
  { email, password, securityAnswer } = {
    email: randEmail(),
    password: process.env.DEFAULT_PASSWORD || 'test123',
    securityAnswer: process.env.SECURITY_ANS || 'test123',
  },
) {
  await SELECTORS().email.waitFor({ state: 'visible', timeout: 5000 });
  await SELECTORS().email.fill(email);
  await SELECTORS().password.fill(password);
  await SELECTORS().repeatPassword.fill(password);
  await SELECTORS().securityQuestionSelector.click();
  await SELECTORS().securityQuestionItem.filter({ hasText: " Mother's maiden name? " }).click();
  // await SELECTORS().securityQuestionSelector.selectOption(" Mother's maiden name? ");
  await SELECTORS().securityQuestionAnswer.click();
  await SELECTORS().securityQuestionAnswer.fill(securityAnswer);
  await SELECTORS().registerButton.click();
  await waitForPageLoad();
  return {
    email,
    password,
    securityAnswer,
  };
}

export async function validateRequiredFields() {
  await SELECTORS().email.waitFor({ state: 'visible', timeout: 5000 });
  await SELECTORS().email.click();
  await SELECTORS().password.click();
  await SELECTORS().repeatPassword.click();
  await SELECTORS().securityQuestionAnswer.click();
  await SELECTORS().email.click();

  await validateRequiredField(SELECTORS().email, 'Please provide an email address.');
  await validateRequiredField(SELECTORS().password, 'Please provide a password.');
  await validateRequiredField(SELECTORS().repeatPassword, 'Please repeat your password.');
  await validateRequiredField(
    SELECTORS().securityQuestionAnswer,
    'Please provide an answer to your security question.',
  );

  // await SELECTORS().securityQuestionSelector.click();
  // await SELECTORS().email.click();
  // await headerBar.clickOnMenu();
  // await getPage().evaluate(() => {
  //     document.getElementById('mat-select[role="combobox"]')
  // });
  // await validateRequiredField(SELECTORS().securityQuestionSelector, 'Please select a security question.');
}

export async function validateRequiredField(locator: Locator, expectedMessage: string) {
  const attribute = 'aria-describedby';
  const ariaDescribed = await locator.getAttribute(attribute);
  expect(ariaDescribed).toContain('mat-error');
  const actualMessage = await getPage().locator('mat-error').filter({ hasText: expectedMessage }).textContent();
  expect(actualMessage?.trim()).toEqual(expectedMessage.trim());
  await expect(SELECTORS().registerButton).toBeDisabled();
}
