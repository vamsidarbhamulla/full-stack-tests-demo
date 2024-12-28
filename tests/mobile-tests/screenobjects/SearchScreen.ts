import AppScreen from './AppScreen';
import { sleep } from '@helpers/Utils';

const SELECTORS = {
    FOOTER_ICON_WIDGET: 'new UiSelector().resourceId("org.wikipedia.alpha:id/fragment_main_nav_tab_layout")',
    RECYCLER_VIEW: 'new UiSelector().resourceId("org.wikipedia.alpha:id/fragment_feed_feed")',

    SEARCH_SCREEN: 'new UiSelector().resourceId("org.wikipedia.alpha:id/search_bar")',
    SEARCH_FIELD: 'new UiSelector().resourceId("org.wikipedia.alpha:id/fragment_feed_header")',
    SEARCH_TEXT_FIELD: 'new UiSelector().resourceId("org.wikipedia.alpha:id/search_src_text")',
    SEARCH_CLOSE_BTN: 'new UiSelector().resourceId("org.wikipedia.alpha:id/search_close_btn")',
    SEARCH_BACK_BTN:'new UiSelector().className("android.widget.ImageButton")',

};
class SearchScreen extends AppScreen {
    constructor () {
        super(`android=${SELECTORS.SEARCH_SCREEN}`);
    }

    get screen () {return $(`android=${SELECTORS.SEARCH_SCREEN}`);}
    get searchRecommendations () {return $(`android=${SELECTORS.RECYCLER_VIEW}`);}
    get backToHome () {return $(`android=${SELECTORS.SEARCH_BACK_BTN}`);}


    get search () {return $(`android=${SELECTORS.SEARCH_FIELD}`);}
    get input () {return $(`android=${SELECTORS.SEARCH_TEXT_FIELD}`);}
    get closeSearch () {return $(`android=${SELECTORS.SEARCH_CLOSE_BTN}`);}


    async checkSearchScreen(){
        await this.screen.waitForDisplayed();
    }
    async searchInfo({ text } = { text: 'new york' }) {
        await this.search.click();
        await this.input.waitForDisplayed();
        await this.input.setValue(text);
        await this.searchRecommendations.waitForDisplayed();
        await this.scrollDown({ maxSwipes: 1, waitTimeAfterScroll: 500 });
        await sleep(2000);
        await this.closeSearch.click();
    }
}

export default new SearchScreen();
