
const SELECTORS = {
    FOOTER_WIDGET: 'new UiSelector().resourceId("org.wikipedia.alpha:id/fragment_main_nav_tab_layout")',
    ICON_WIDGET: 'new UiSelector().resourceId("org.wikipedia.alpha:id/fragment_main_nav_tab_layout")',
    EXPLORE_ICON: 'new UiSelector().description("Explore")',
    MYLISTS_ICON: 'new UiSelector().description("My lists")',
    HISTORY_ICON: 'new UiSelector().description("History")',
    NEARBY_ICON: 'new UiSelector().description("Nearby")',
    MYLISTS_ICON_1: 'new UiSelector().resourceId("org.wikipedia.alpha:id/icon").instance(1)',
};
export default class FooterBar {
    
    static async tapOnHome () {
        await $(`android=${SELECTORS.EXPLORE_ICON}`).click();
    }
    static async tapOnMyLists () {
        await $(`android=${SELECTORS.MYLISTS_ICON}`).click();
    }

    static async tapOnSearchHistory () {
        await $(`android=${SELECTORS.HISTORY_ICON}`).click();
    }

    static async tapOnNearByLocations () {
        await $(`android=${SELECTORS.NEARBY_ICON}`).click();
    }

    static async waitForTabBarShown ():Promise<boolean|void> {
        return $(`android=${SELECTORS.FOOTER_WIDGET}`).waitForDisplayed({
            timeout: 20000,
        });
    }
}
