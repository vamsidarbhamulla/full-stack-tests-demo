import { test } from '@setup/pageSetup';
import * as popupDialog from '@components/popupDialog';

test.describe('verify user reviews can be viewed', { tag: '@product' }, () => {
  test('check apple juice reviews', async ({ homePage }) => {
    await homePage.open();
    await homePage.selectAppleJuice();
    await popupDialog.viewAppleJuiceReviews();
  });
});
