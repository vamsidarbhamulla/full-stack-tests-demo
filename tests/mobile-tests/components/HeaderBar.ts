
const SELECTORS = {
    HEADER_WIDGET: 'new UiSelector().resourceId("org.wikipedia.alpha:id/fragment_main_nav_tab_layout")',
    MORE_OPTION_MENU: 'new UiSelector().resourceId("org.wikipedia.alpha:id/menu_overflow_button")',
};
export default class HeaderBar {
    
    static async checkHeaderBar () {
        await $(`android=${SELECTORS.HEADER_WIDGET}`).waitForDisplayed();
        await $(`android=${SELECTORS.MORE_OPTION_MENU}`).waitForDisplayed();
    }

    static async tapOnMoreOptions () {
        await $(`android=${SELECTORS.HEADER_WIDGET}`).waitForDisplayed();
        await $(`android=${SELECTORS.MORE_OPTION_MENU}`).waitForDisplayed();
        await $(`android=${SELECTORS.MORE_OPTION_MENU}`).click();
    }
}
