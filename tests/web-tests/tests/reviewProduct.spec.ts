import { test } from '@setup/pageSetup';
import * as homePage from '@pages/homePage';
import * as popupDialog from '@components/popupDialog';

test.describe('verify user reviews can be viewed', () => {
  test('check apple juice reviews', async ({}) => {
    await homePage.open();
    await homePage.selectAppleJuice();
    await popupDialog.viewAppleJuiceReviews();
  });
});
