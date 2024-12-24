import { getPage, openPage, waitForPageLoad } from '@utils/pageUtils';

const SELECTORS = () => ({
  email: getPage().locator('#email'),
  password: getPage().locator('#password'),
  loginButton: getPage().locator('#loginButton'),
  registerAccountButton: getPage().getByRole('link', { name: 'Not yet a customer?' }),
});

export async function open() {
  await openPage('/login');
}

export async function gotoCreateAccountPage() {
  await SELECTORS().registerAccountButton.isVisible();
  await SELECTORS().registerAccountButton.click();
  await waitForPageLoad();
}

export async function login(email: string, password: string) {
  await SELECTORS().email.waitFor({ state: 'visible', timeout: 5000 });
  await SELECTORS().email.fill(email);
  await SELECTORS().password.fill(password);
  await SELECTORS().loginButton.click();
  await waitForPageLoad();
}
