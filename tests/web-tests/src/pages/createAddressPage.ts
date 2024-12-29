import { AddressDetails } from '@models/addressDetails';
import { addressData } from '@testdata/addressData';
import { type Page } from '@playwright/test';
import { openPage, waitForPageLoad } from '@utils/pageUtils';

export class CreateAddressPage {
  readonly page: Page;
  readonly SELECTORS;
  readonly uriPath: string;

  constructor(page: Page) {
    this.page = page;
    this.SELECTORS = this.selectors(this.page);
    this.uriPath = '/address/create';
  }

  async open() {
    await openPage({ page: this.page, uri: this.uriPath, handlePopup: false });
  }

  async start() {
    // use this method if we directly want to open the page is
    await openPage({ page: this.page, uri: this.uriPath, handlePopup: true });
  }

  async check() {
    await this.SELECTORS.address.isVisible();
  }
  selectors(page: Page) {
    return {
      country: page.getByPlaceholder('Please provide a country.'),
      name: page.getByPlaceholder('Please provide a name.'),
      mobile: page.getByPlaceholder('Please provide a mobile'),
      zipCode: page.getByPlaceholder('Please provide a ZIP code.'),
      address: page.getByPlaceholder('Please provide an address.'),
      city: page.getByPlaceholder('Please provide a city.'),
      state: page.getByPlaceholder('Please provide a state.'),
      submitButton: page.locator('#submitButton'),
    };
  }

  async createAddress(name: string) {
    const addressDetails: AddressDetails = addressData(name);
    await this.SELECTORS.country.waitFor({ state: 'visible', timeout: 5000 });
    await this.SELECTORS.country.fill(addressDetails.country);
    await this.SELECTORS.name.fill(addressDetails.fullName);
    await this.SELECTORS.mobile.fill(addressDetails.mobileNum);
    await this.SELECTORS.zipCode.fill(addressDetails.zipCode);
    await this.SELECTORS.address.fill(addressDetails.street);
    await this.SELECTORS.city.fill(addressDetails.city);
    await this.SELECTORS.state.fill(addressDetails.state);

    await this.SELECTORS.submitButton.click();
    await waitForPageLoad();
  }
}
