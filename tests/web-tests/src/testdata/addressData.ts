import { AddressDetails } from '@models/addressDetails';
import { randAddress, randCountry, randFirstName, randNumber, randState, randZipCode } from '@ngneat/falso';

export function addressData(name = 'test user1'): AddressDetails {
  return {
    ...randAddress(),
    fullName: name || randFirstName(),
    mobileNum: `${randNumber({ min: 1111111111, max: 9999999999 })}`,
    state: randState(),
    country: randCountry(),
    zipCode: randZipCode().split('-')[0],
  };
}
