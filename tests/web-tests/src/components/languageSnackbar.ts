import { getPage } from '@utils/pageUtils';
import { isElementVisible } from '@utils/locatorUtils';

const SELECTORS = () => ({
  languageSelectedMessage: getPage()
    .locator('.mat-simple-snack-bar-content')
    .filter({ hasText: 'Language has been changed' }), //.getByLabel('dismiss cookie message'),
});

// <span class="mat-simple-snack-bar-content">Language has been changed to English</span>
// <span class="mat-simple-snack-bar-content">Language has been changed to English</span>

export async function waitForDisappearIfVisible() {
  const exists = await isElementVisible(SELECTORS().languageSelectedMessage, 1000);

  if (exists) {
    await SELECTORS().languageSelectedMessage.waitFor({ state: 'hidden', timeout: 2000 });
  }
}
