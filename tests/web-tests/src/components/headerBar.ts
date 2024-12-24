import { getPage, waitForPageLoad } from '@utils/pageUtils';

const SELECTORS = () => ({
  accountMenu: getPage().getByLabel('Show/hide account menu'),
  loginMenuOption: getPage().locator('#navbarLoginButton'),
  shoppingCartButton: getPage().getByLabel('Show the shopping cart'),
});

export async function gotoLoginPage() {
  await SELECTORS().accountMenu.isVisible();
  await SELECTORS().accountMenu.click();
  await SELECTORS().loginMenuOption.isVisible();
  await SELECTORS().loginMenuOption.isEnabled();
  await SELECTORS().loginMenuOption.click();
  await waitForPageLoad();
}

export async function clickOnMenu() {
  await SELECTORS().accountMenu.click();
}

export async function clickOnShoppingCart() {
  await SELECTORS().shoppingCartButton.click();
  await waitForPageLoad();
}
