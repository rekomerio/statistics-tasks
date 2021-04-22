import puppeteer from 'puppeteer';
import mocker from 'puppeteer-request-mocker'

describe('smoke', () => {
    let browser = null;
    let page = null;

    beforeAll(async () => {
        browser = await puppeteer.launch({
            headless: false
        });
    });

    beforeEach(async () => {
        const browserContext = browser.browserContexts()[0];
        page = await browserContext.newPage();
        await page.goto('http://localhost:9080/', {waitUntil: 'domcontentloaded'});
        await mocker.start({
            page: page,
            mockList: [
                '127.0.0.1:9080'
            ],
//            verbose: true
        });


    });


    afterEach(async () => {
        await mocker.stop();
        await page.close()
    });

    afterAll(async () => {
        await browser.close();
    });

    it('Page should have a Title', async () => {
        const pageTitle = await page.title();
        expect(pageTitle).toBe('Julkaisut')
    });
});