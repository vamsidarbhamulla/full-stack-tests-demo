import { randEmail } from '@ngneat/falso';
import { type Locator, type Page, expect } from '@playwright/test';
import { openPage, waitForPageLoad } from '@utils/pageUtils';

export class RegistrationPage {
  readonly page: Page;
  readonly SELECTORS;
  readonly uriPath: string;

  constructor(page: Page) {
    this.page = page;
    this.SELECTORS = this.selectors(this.page);
    this.uriPath = '/register';
  }

  async open() {
    await openPage({ page: this.page, uri: this.uriPath, handlePopup: false });
  }

  async start() {
    // use this method if we directly want to open the login page is
    await openPage({ page: this.page, uri: this.uriPath, handlePopup: true });
  }

  async check() {
    await this.SELECTORS.securityQuestionSelector.isVisible();
  }
  selectors(page: Page) {
    return {
      email: page.getByLabel('Email address field'),
      password2: page.getByLabel('Field for the password'),
      password1: this.page
        .locator('div')
        .filter({ hasText: /^Password \*$/ })
        .nth(1),
      password: page.locator('#passwordControl'),
      repeatPassword1: this.page
        .locator('div')
        .filter({ hasText: /^Repeat Password \*$/ })
        .nth(1),
      repeatPassword: page.locator('#repeatPasswordControl'),
      showPasswordAdvice: page.locator('.mat-slide-toggle-bar'),
      securityQuestionSelector1: page.getByLabel('Selection list for the').locator('span'),
      securityQuestionSelector: page.locator('mat-select[role="combobox"]'),
      securityQuestionItem: page.locator('.mat-option-text'),
      securityQuestionAnswer: page.getByPlaceholder('Answer to your security'),
      securityQuestionAnswer1: page.locator('mat-form-field').filter({ hasText: 'Answer *' }),
      registerButton: page.locator('#registerButton'),
      registerApp: page.locator('app-register'),
      loginLink: page.locator('a[href="#/login"]'),
    };
  }

  async createAccount(
    { email, password, securityAnswer } = {
      email: randEmail(),
      password: process.env.DEFAULT_PASSWORD || 'test123',
      securityAnswer: process.env.SECURITY_ANS || 'test123',
    },
  ) {
    await this.SELECTORS.email.waitFor({ state: 'visible', timeout: 5000 });
    await this.SELECTORS.email.fill(email);
    await this.SELECTORS.password.fill(password);
    await this.SELECTORS.repeatPassword.fill(password);
    await this.SELECTORS.securityQuestionSelector.click();
    await this.SELECTORS.securityQuestionItem.filter({ hasText: " Mother's maiden name? " }).click();
    // await this.SELECTORS.securityQuestionSelector.selectOption(" Mother's maiden name? ");
    await this.SELECTORS.securityQuestionAnswer.click();
    await this.SELECTORS.securityQuestionAnswer.fill(securityAnswer);
    await this.SELECTORS.registerButton.click();
    await waitForPageLoad();
    return {
      email,
      password,
      securityAnswer,
    };
  }

  async validateRequiredFields() {
    await this.SELECTORS.email.waitFor({ state: 'visible', timeout: 5000 });
    await this.SELECTORS.email.click();
    await this.SELECTORS.password.click();
    await this.SELECTORS.repeatPassword.click();
    await this.SELECTORS.securityQuestionAnswer.click();
    await this.SELECTORS.email.click();

    await this.validateRequiredField(this.SELECTORS.email, 'Please provide an email address.');
    await this.validateRequiredField(this.SELECTORS.password, 'Please provide a password.');
    await this.validateRequiredField(this.SELECTORS.repeatPassword, 'Please repeat your password.');
    await this.validateRequiredField(
      this.SELECTORS.securityQuestionAnswer,
      'Please provide an answer to your security question.',
    );

    // await this.SELECTORS.securityQuestionSelector.click();
    // await this.SELECTORS.email.click();
    // await headerBar.clickOnMenu();
    // await page.evaluate(() => {
    //     document.getElementById('mat-select[role="combobox"]')
    // });
    // await validateRequiredField(this.SELECTORS.securityQuestionSelector, 'Please select a security question.');
  }

  async validateRequiredField(locator: Locator, expectedMessage: string) {
    const attribute = 'aria-describedby';
    const ariaDescribed = await locator.getAttribute(attribute);
    expect(ariaDescribed).toContain('mat-error');
    const actualMessage = await this.page.locator('mat-error').filter({ hasText: expectedMessage }).textContent();
    expect(actualMessage?.trim()).toEqual(expectedMessage.trim());
    await expect(this.SELECTORS.registerButton).toBeDisabled();
  }
}
