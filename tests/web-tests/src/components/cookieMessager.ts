import { getPage } from '@utils/pageUtils';

const SELECTORS = () => ({
  dismisscookieMessage: getPage().getByLabel('dismiss cookie message'),
});

// <span class="mat-simple-snack-bar-content">Language has been changed to English</span>
// <span class="mat-simple-snack-bar-content">Language has been changed to English</span>

export async function dismiss() {
  await SELECTORS().dismisscookieMessage.click();
  await SELECTORS().dismisscookieMessage.waitFor({ state: 'hidden', timeout: 2000 });
}
