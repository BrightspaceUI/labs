import puppeteer from 'puppeteer';
import { testDiff } from './utils.js';
import { VisualDiff } from '@brightspace-ui/visual-diff';

describe('read only visual diff tests', () => {

	const visualDiff = new VisualDiff('d2l-grade-result-read-only', import.meta.url);

	let browser, page;

	before(async() => {
		browser = await puppeteer.launch();
		page = await visualDiff.createPage(browser);
		await page.goto(`${visualDiff.getBaseUrl()}/test/perceptual/d2l-grade-result-read-only.visual-diff.html`, { waitUntil: ['networkidle0', 'load'] });
		await page.bringToFront();
		await visualDiff.disableAnimations(page);
	});

	beforeEach(async() => {
		await visualDiff.resetFocus(page);
	});

	after(() => browser.close());

	it('read-only-number-grade-no-icons', async function() {
		await testDiff(visualDiff, page, '#read-only-number-grade-no-icons', this.test.fullTitle());
	});

	it('read-only-number-decimal-grade-no-icons', async function() {
		await testDiff(visualDiff, page, '#read-only-number-decimal-grade-no-icons', this.test.fullTitle());
	});

	it('read-only-negative-grade-no-icons', async function() {
		await testDiff(visualDiff, page, '#read-only-negative-grade-no-icons', this.test.fullTitle());
	});

	it('read-only-number-grade-icons', async function() {
		await testDiff(visualDiff, page, '#read-only-number-grade-icons', this.test.fullTitle());
	});

	it('read-only-number-grade-icons-tooltips-grades', async function() {
		await testDiff(visualDiff, page, '#read-only-number-grade-icons-tooltips', this.test.fullTitle(), true);
	});

	it('read-only-number-grade-icons-tooltips-reports', async function() {
		await testDiff(visualDiff, page, '#read-only-number-grade-icons-tooltips', this.test.fullTitle(), false, true);
	});

	it('read-only-negative-grade-icons', async function() {
		await testDiff(visualDiff, page, '#read-only-negative-grade-icons', this.test.fullTitle());
	});

	it('read-only-number-grade-empty-numerator', async function() {
		await testDiff(visualDiff, page, '#read-only-number-grade-empty-numerator', this.test.fullTitle());
	});

	it('read-only-letter-grade-no-icons', async function() {
		await testDiff(visualDiff, page, '#read-only-letter-grade-no-icons', this.test.fullTitle());
	});

	it('read-only-letter-grade-icons', async function() {
		await testDiff(visualDiff, page, '#read-only-letter-grade-icons', this.test.fullTitle());
	});

	it('read-only-letter-grade-icons-tooltips-grades', async function() {
		await testDiff(visualDiff, page, '#read-only-letter-grade-icons-tooltips', this.test.fullTitle(), true);
	});

	it('read-only-letter-grade-icons-tooltips-reports', async function() {
		await testDiff(visualDiff, page, '#read-only-letter-grade-icons-tooltips', this.test.fullTitle(), false, true);
	});

	it('d2l-labs-d2l-grade-result-with-subtitle', async function() {
		await testDiff(visualDiff, page, '#d2l-labs-d2l-grade-result-with-subtitle', this.test.fullTitle());
	});

});
