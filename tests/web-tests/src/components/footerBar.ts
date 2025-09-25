import { getPage } from '@utils/pageUtils';
import { expect } from '@playwright/test';

const SELECTORS = () => ({
  // home page footer
  itemCountSelector: getPage().locator('mat-paginator').locator('.mat-mdc-paginator-touch-target'),
  itemCounterLabel: getPage().locator('.mat-mdc-paginator-range-label'),
  itemCounterDropDown: getPage().locator('#mat-select-4'),
  itemCounterDropDownArrow: getPage().locator('.mat-select-arrow-wrapper'),
  itemCounterOptionText: getPage().locator('.mat-mdc-option'),
});

export async function selectItemsPerPage({ count } = { count: '36' }) {
  await SELECTORS().itemCounterLabel.scrollIntoViewIfNeeded();
  await SELECTORS().itemCountSelector.click();
  await SELECTORS().itemCounterOptionText.filter({ hasText: count }).click();
}

export async function checkItemsLabel({ count } = { count: '48' }) {
  await expect(SELECTORS().itemCounterLabel).toContainText(count);
}
