import puppeteer from 'puppeteer';
import { testDiff } from './utils.js';
import { VisualDiff } from '@brightspace-ui/visual-diff';

describe('write enabled visual diff tests', () => {

	const visualDiff = new VisualDiff('d2l-grade-result-write-enabled', import.meta.url);

	let browser, page;

	before(async() => {
		browser = await puppeteer.launch();
		page = await visualDiff.createPage(browser, { viewport: { width: 800, height: 1100 } });
		await page.goto(`${visualDiff.getBaseUrl()}/test/perceptual/d2l-grade-result-write-enabled.visual-diff.html`, { waitUntil: ['networkidle0', 'load'] });
		await page.bringToFront();
		await visualDiff.disableAnimations(page);
	});

	beforeEach(async() => {
		await visualDiff.resetFocus(page);
	});

	after(() => browser.close());

	it('write-enabled-number-grade-no-icons', async function() {
		await testDiff(visualDiff, page, '#write-enabled-number-grade-no-icons', this.test.fullTitle());
	});

	it('write-enabled-number-decimal-grade-no-icons', async function() {
		await testDiff(visualDiff, page, '#write-enabled-number-decimal-grade-no-icons', this.test.fullTitle());
	});

	it('write-enabled-number-grade-icons', async function() {
		await testDiff(visualDiff, page, '#write-enabled-number-grade-icons', this.test.fullTitle());
	});

	it('write-enabled-number-grade-icons-tooltips-grade', async function() {
		await testDiff(visualDiff, page, '#write-enabled-number-grade-icons-tooltips', this.test.fullTitle(), true);
	});

	it('write-enabled-number-grade-icons-tooltips-reports', async function() {
		await testDiff(visualDiff, page, '#write-enabled-number-grade-icons-tooltips', this.test.fullTitle(), false, true);
	});

	it('write-enabled-number-range-validation-error', async function() {
		await testDiff(visualDiff, page, '#write-enabled-number-range-validation-error', this.test.fullTitle());
	});

	it('write-enabled-number-range-validation-error-tooltip', async function() {
		await testDiff(visualDiff, page, '#write-enabled-number-range-validation-error', this.test.fullTitle(), false, false, true);
	});

	it('write-enabled-number-negative-marking-enabled', async function() {
		await testDiff(visualDiff, page, '#write-enabled-number-negative-marking-enabled', this.test.fullTitle());
	});

	it('write-enabled-negative-grade-warning', async function() {
		await testDiff(visualDiff, page, '#write-enabled-negative-grade-warning', this.test.fullTitle(), false, false, true);
	});

	it('write-enabled-negative-grade-warning-icons', async function() {
		await testDiff(visualDiff, page, '#write-enabled-negative-grade-warning-icons', this.test.fullTitle(), false, false, true);
	});

	it('write-enabled-number-dynamic-width', async function() {
		await testDiff(visualDiff, page, '#write-enabled-number-dynamic-width', this.test.fullTitle());
	});

	it('write-enabled-letter-grade-no-icons', async function() {
		await testDiff(visualDiff, page, '#write-enabled-letter-grade-no-icons', this.test.fullTitle());
	});

	it('write-enabled-letter-grade-icons', async function() {
		await testDiff(visualDiff, page, '#write-enabled-letter-grade-icons', this.test.fullTitle());
	});

	it('write-enabled-letter-grade-icons-tooltips-grades', async function() {
		await testDiff(visualDiff, page, '#write-enabled-letter-grade-icons-tooltips', this.test.fullTitle(), true);
	});

	it('write-enabled-letter-grade-icons-tooltips-reports', async function() {
		await testDiff(visualDiff, page, '#write-enabled-letter-grade-icons-tooltips', this.test.fullTitle(), false, true);
	});
});
