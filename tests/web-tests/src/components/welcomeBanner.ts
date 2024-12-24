import { getPage } from '@utils/pageUtils';
import { expect } from '@playwright/test';

const SELECTORS = () => ({
  welcomeBanner: getPage().getByLabel('Close Welcome Banner'),
  dismissBannerButton: getPage().locator('button[aria-label="Close Welcome Banner"]'),
});

export async function handle() {
  await SELECTORS().dismissBannerButton.waitFor();
  await SELECTORS().dismissBannerButton.isVisible();
  await SELECTORS().dismissBannerButton.isEnabled();
  await SELECTORS().dismissBannerButton.click();
  await expect(SELECTORS().dismissBannerButton).toHaveCount(0);
}
