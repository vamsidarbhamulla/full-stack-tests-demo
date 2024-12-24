import { getPage, openPage, waitForPageLoad } from '@utils/pageUtils';
import { AddressDetails } from '@models/addressDetails';
import { addressData } from '@testdata/addressData';

const SELECTORS = () => ({
  country: getPage().getByPlaceholder('Please provide a country.'),
  name: getPage().getByPlaceholder('Please provide a name.'),
  mobile: getPage().getByPlaceholder('Please provide a mobile'),
  zipCode: getPage().getByPlaceholder('Please provide a ZIP code.'),
  address: getPage().getByPlaceholder('Please provide an address.'),
  city: getPage().getByPlaceholder('Please provide a city.'),
  state: getPage().getByPlaceholder('Please provide a state.'),
  submitButton: getPage().locator('#submitButton'),

  // email: getPage().locator('#email'),
  // password: getPage().locator('#password'),
  // registerAccountButton: getPage().getByRole('link', { name: 'Not yet a customer?' }),
});

export async function open() {
  await openPage('/address/create');
}

export async function create(name: string) {
  const addressDetails: AddressDetails = addressData(name);
  await SELECTORS().country.waitFor({ state: 'visible', timeout: 5000 });
  await SELECTORS().country.fill(addressDetails.country);
  await SELECTORS().name.fill(addressDetails.fullName);
  await SELECTORS().mobile.fill(addressDetails.mobileNum);
  await SELECTORS().zipCode.fill(addressDetails.zipCode);
  await SELECTORS().address.fill(addressDetails.street);
  await SELECTORS().city.fill(addressDetails.city);
  await SELECTORS().state.fill(addressDetails.state);

  // await page.getByPlaceholder('Please provide a country.').click();
  //   await page.getByPlaceholder('Please provide a country.').fill('Canada');
  //   await page.getByPlaceholder('Please provide a name.').click();
  //   await page.getByPlaceholder('Please provide a name.').fill('test user1');
  //   await page.getByPlaceholder('Please provide a mobile').click();
  //   await page.getByPlaceholder('Please provide a mobile').fill('7456713456');
  //   await page.getByPlaceholder('Please provide a ZIP code.').click();
  //   await page.getByPlaceholder('Please provide a ZIP code.').fill('V0N 4K6');
  //   await page.getByPlaceholder('Please provide an address.').click();
  //   await page.getByPlaceholder('Please provide an address.').fill('289 Rogers Street');
  //   await page.getByPlaceholder('Please provide a city.').click();
  //   await page.getByPlaceholder('Please provide a city.').fill('Ottawa');
  //   await page.getByPlaceholder('Please provide a state.').click();
  //   await page.getByPlaceholder('Please provide a state.').fill('Ontario');
  // await page.getByRole('button', { name: 'send Submit' }).click();

  await SELECTORS().submitButton.click();
  await waitForPageLoad();
}
