
const SELECTORS = {
    SETTINGS_OPTIONS: 'new UiSelector().resourceId("org.wikipedia.alpha:id/explore_overflow_settings")',
};
export default class MenuOptions {
    
    static async tapOnSettingsMenu () {
        await $(`android=${SELECTORS.SETTINGS_OPTIONS}`).waitForDisplayed();
        await $(`android=${SELECTORS.SETTINGS_OPTIONS}`).click();
    }
}
