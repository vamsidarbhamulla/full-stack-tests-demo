import { type Page } from '@playwright/test';
import { openPage, waitForPageLoad } from '@utils/pageUtils';

export class LoginPage {
  readonly page: Page;
  readonly SELECTORS;
  readonly uriPath: string;
  constructor(page: Page) {
    this.page = page;
    this.SELECTORS = this.selectors(this.page);
    this.uriPath = '/login';
  }

  async open() {
    await openPage({ page: this.page, uri: this.uriPath, handlePopup: false });
  }

  async start() {
    // use this method if we directly want to open the login page is
    await openPage({ page: this.page, uri: this.uriPath, handlePopup: true });
  }
  selectors(page: Page) {
    return {
      email: page.locator('#email'),
      password: page.locator('#password'),
      loginButton: page.locator('#loginButton'),
      registerAccountButton: page.getByRole('link', { name: 'Not yet a customer?' }),
    };
  }

  async check() {
    await this.SELECTORS.email.isVisible();
  }

  async gotoCreateAccountPage() {
    await this.SELECTORS.registerAccountButton.isVisible();
    await this.SELECTORS.registerAccountButton.click();
    await waitForPageLoad();
  }

  async login(email: string, password: string) {
    await this.SELECTORS.email.waitFor({ state: 'visible', timeout: 5000 });
    await this.SELECTORS.email.fill(email);
    await this.SELECTORS.password.fill(password);
    await this.SELECTORS.loginButton.click();
    await waitForPageLoad();
  }
}
