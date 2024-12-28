import AppScreen from './AppScreen';

const SELECTORS = {
    HOME_SCREEN_HEADER: 'new UiSelector().resourceId("org.wikipedia.alpha:id/single_fragment_toolbar")',
    HOME_SCREEN_HEADER_TITLE: 'new UiSelector().resourceId("org.wikipedia.alpha:id/single_fragment_toolbar_wordmark")',
    HOME_SCREEN_HEADER_MENU: 'new UiSelector().resourceId("org.wikipedia.alpha:id/menu_overflow_button")',
    HOME_SCREEN_SEARCH_BAR: 'new UiSelector().resourceId("org.wikipedia.alpha:id/fragment_feed_header")',
   
    RECYCLER_VIEW: 'new UiSelector().resourceId("org.wikipedia.alpha:id/fragment_feed_feed")',
    VIEW_CARD_IMAGE: 'new UiSelector().resourceId("org.wikipedia.alpha:id/view_card_header_title")',

    SEARCH_FIELD: 'new UiSelector().resourceId("org.wikipedia.alpha:id/fragment_feed_header")',

};
class HomeScreen extends AppScreen {
    constructor () {
        super(`android=${SELECTORS.HOME_SCREEN_HEADER}`);
    }

    get screen () {return $(`android=${SELECTORS.HOME_SCREEN_HEADER}`);}
    get title () {return $(`android=${SELECTORS.HOME_SCREEN_HEADER_TITLE}`);}
    get menu () {return $(`android=${SELECTORS.HOME_SCREEN_HEADER_MENU}`);}
    get recyclerView () {return $(`android=${SELECTORS.RECYCLER_VIEW}`);}
    get viewCardImage () {return $(`android=${SELECTORS.VIEW_CARD_IMAGE}`);}


    get search () {return $(`android=${SELECTORS.SEARCH_FIELD}`);}

    async checkHomeScreen(){
        await this.screen.waitForDisplayed();
        await this.menu.waitForDisplayed();
        await this.title.waitForDisplayed();
    }

    async openSearch() {
        await this.search.click();
    }

    async scrollToBottom() {
        await this.scrollDown({ maxSwipes: 3, waitTimeAfterScroll: 500 });
    }

    async scrollToBeginning() {
        await this.scrollTop({ maxSwipes: 3, waitTimeAfterScroll: 500 });
    }
}

export default new HomeScreen();
