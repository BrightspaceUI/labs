import puppeteer from 'puppeteer';
import { testDiff } from './utils.js';
import { VisualDiff } from '@brightspace-ui/visual-diff';

describe('optional override text substitution visual diff tests', () => {

	const visualDiff = new VisualDiff('d2l-grade-result-custom-manual-override-text', import.meta.url);

	let browser, page;

	before(async() => {
		browser = await puppeteer.launch();
		page = await visualDiff.createPage(browser);
		await page.goto(`${visualDiff.getBaseUrl()}/test/perceptual/d2l-grade-result-custom-manual-override-text.visual-diff.html`, { waitUntil: ['networkidle0', 'load'] });
		await page.bringToFront();
		await visualDiff.disableAnimations(page);
	});

	beforeEach(async() => {
		await visualDiff.resetFocus(page);
	});

	after(() => browser.close());

	it('custom-manual-override-text', async function() {
		await testDiff(visualDiff, page, '#custom-manual-override-text', this.test.fullTitle());
	});

	it('custom-manual-override-clear-text', async function() {
		await testDiff(visualDiff, page, '#custom-manual-override-clear-text', this.test.fullTitle());
	});
});
