import { getPage } from '@utils/pageUtils';
import { isElementVisible } from '@utils/locatorUtils';

const SELECTORS = () => ({
  languageSelectedMessage: getPage()
    .locator('.mat-simple-snack-bar-content')
    .filter({ hasText: 'Language has been changed' }),
});

export async function waitForDisappearIfVisible() {
  const exists = await isElementVisible(SELECTORS().languageSelectedMessage, 1000);

  if (exists) {
    await SELECTORS().languageSelectedMessage.waitFor({ state: 'hidden', timeout: 2000 });
  }
}
