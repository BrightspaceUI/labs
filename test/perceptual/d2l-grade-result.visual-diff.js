import puppeteer from 'puppeteer';
import { testDiff } from './utils.js';
import { VisualDiff } from '@brightspace-ui/visual-diff';

describe('d2l-labs-d2l-grade-result', () => {

	const visualDiff = new VisualDiff('d2l-grade-result', import.meta.url);

	let browser, page;

	before(async() => {
		browser = await puppeteer.launch();
		page = await visualDiff.createPage(browser);
		await page.goto(`${visualDiff.getBaseUrl()}/test/perceptual/d2l-grade-result.visual-diff.html`, { waitUntil: ['networkidle0', 'load'] });
		await page.bringToFront();
		await visualDiff.disableAnimations(page);
	});

	beforeEach(async() => {
		await visualDiff.resetFocus(page);
	});

	after(() => browser.close());

	it('d2l-labs-d2l-grade-result', async function() {
		await testDiff(visualDiff, page, '#d2l-labs-d2l-grade-result', this.test.fullTitle());
	});

});
