import AppScreen from './AppScreen';

const SELECTORS = {
    SETTINGS_SCREEN_HEADER:'new UiSelector().text("Settings")',
    SHOW_IMAGES_TOGGLE_1: 'new UiSelector().resourceId("org.wikipedia.alpha:id/switchWidget").instance(0)',
    SHOW_IMAGES_TOGGLE: 'new UiSelector().text("Show images")',
    SHOW_LINK_PREVIEWS_TOGGLE: 'new UiSelector().text("Show link previews")',
    SEND_USAGE_REPORTS_TOGGLE: 'new UiSelector().text("Send usage reports")',
    SEND_CRASH_REPORTS_TOGGLE: 'new UiSelector().text("Send crash reports")',
    NAVIGATE_TO_HOME_SCREEN: 'new UiSelector().description("Navigate up")',
};
class SettingsScreen extends AppScreen {
    constructor () {
        super(`android=${SELECTORS.SETTINGS_SCREEN_HEADER}`);
    }

    get screen () {return $(`android=${ SELECTORS.SETTINGS_SCREEN_HEADER }`);}


    get showImagesToggle () {return $(`android=${ SELECTORS.SHOW_IMAGES_TOGGLE }`);}
    get showLinkPreviewsToggle () {return $(`android=${ SELECTORS.SHOW_LINK_PREVIEWS_TOGGLE }`);}
    get sendUsageReportsToggle () {return $(`android=${SELECTORS.SEND_USAGE_REPORTS_TOGGLE}`);}
    get sendCrashReportsToggle () {return $(`android=${SELECTORS.SEND_CRASH_REPORTS_TOGGLE}`);}
    get navigateBackToHome () {return $(`android=${SELECTORS.NAVIGATE_TO_HOME_SCREEN}`);}

    async checkSettingsScreen(){
        await this.screen.waitForDisplayed();
    }

    async toggleShowImages(){
        await this.showImagesToggle.click();
    }

    async toggleShowLinkPreviews(){
        await this.showLinkPreviewsToggle.click();
    }

    async toggleSendUsageReports(){
        await this.sendUsageReportsToggle.click();
    }

    async toggleSendCrashReports(){
        await this.sendCrashReportsToggle.click();
    }

    async navigateToHomeScreen() {
        await this.navigateBackToHome.click();
    }

    async toggleAllSettings() {
        await this.toggleShowImages();
        await this.toggleShowLinkPreviews();
        await this.toggleSendUsageReports();
        await this.toggleSendCrashReports();
    }
}

export default new SettingsScreen();
