import { getPage } from '@utils/pageUtils';
import { expect } from '@playwright/test';

const SELECTORS = () => ({
  // home page footer
  itemCountSelector: getPage().getByRole('combobox'),
  itemCounterLabel: getPage().locator('.mat-paginator-range-label'),
  itemCounterDropDown: getPage().locator('#mat-select-4'),
  itemCounterDropDownArrow: getPage().locator('.mat-select-arrow-wrapper'),
  itemCounterOptionText: getPage().locator('.mat-option-text'),
});

export async function selectItemsPerPage({ count } = { count: '48' }) {
  await SELECTORS().itemCounterLabel.scrollIntoViewIfNeeded();
  await SELECTORS().itemCountSelector.click();
  await SELECTORS().itemCounterOptionText.filter({ hasText: count }).click();
}

export async function checkItemsLabel({ count } = { count: '48' }) {
  await expect(SELECTORS().itemCounterLabel).toContainText(count);
  // const text = await SELECTORS().itemCounterLabel
  // .evaluate(el => el.textContent);
  // assert
  // await SELECTORS().itemCounterOptionText.filter({ hasText: count }).click();
}
