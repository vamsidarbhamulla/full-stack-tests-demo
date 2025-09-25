import { test } from '@setup/pageSetup';
import * as popupDialog from '@components/popupDialog';

test.describe('verify user reviews', { tag: '@product' }, () => {
  test('should be able to view product reviews', async ({ homePage }) => {
    await homePage.open();
    await homePage.selectAppleJuice();
    await popupDialog.viewAppleJuiceReviews();
  });
});
