import puppeteer from 'puppeteer';
import { testDiff } from './utils.js';
import { VisualDiff } from '@brightspace-ui/visual-diff';

describe('autograde provided visual diff tests', () => {

	const visualDiff = new VisualDiff('d2l-grade-result-autograde-provided', import.meta.url);

	let browser, page;

	before(async() => {
		browser = await puppeteer.launch();
		page = await visualDiff.createPage(browser, { viewport: { width: 800, height: 2600 } });
		await page.goto(`${visualDiff.getBaseUrl()}/test/perceptual/d2l-grade-result-autograde-provided.visual-diff.html`, { waitUntil: ['networkidle0', 'load'] });
		await page.bringToFront();
		await visualDiff.disableAnimations(page);
	});

	beforeEach(async() => {
		await visualDiff.resetFocus(page);
	});

	after(() => browser.close());

	it('autograde-provided-number-grade-no-icons-manual-override-option', async function() {
		await testDiff(visualDiff, page, '#autograde-provided-number-grade-no-icons-manual-override-option', this.test.fullTitle());
	});

	it('autograde-provided-number-grade-icons-manual-override-option', async function() {
		await testDiff(visualDiff, page, '#autograde-provided-number-grade-icons-manual-override-option', this.test.fullTitle());
	});

	it('autograde-provided-number-grade-icons-tooltips-manual-override-option-grades', async function() {
		await testDiff(visualDiff, page, '#autograde-provided-number-grade-icons-tooltips-manual-override-option', this.test.fullTitle(), true);
	});

	it('autograde-provided-number-grade-icons-tooltips-manual-override-option-reports', async function() {
		await testDiff(visualDiff, page, '#autograde-provided-number-grade-icons-tooltips-manual-override-option', this.test.fullTitle(), false, true);
	});

	it('autograde-provided-letter-grade-no-icons-manual-override-option', async function() {
		await testDiff(visualDiff, page, '#autograde-provided-letter-grade-no-icons-manual-override-option', this.test.fullTitle());
	});

	it('autograde-provided-letter-grade-icons-manual-override-option', async function() {
		await testDiff(visualDiff, page, '#autograde-provided-letter-grade-icons-manual-override-option', this.test.fullTitle());
	});

	it('autograde-provided-letter-grade-icons-tooltips-manual-override-option-grades', async function() {
		await testDiff(visualDiff, page, '#autograde-provided-letter-grade-icons-tooltips-manual-override-option', this.test.fullTitle(), true);
	});

	it('autograde-provided-letter-grade-icons-tooltips-manual-override-option-reports', async function() {
		await testDiff(visualDiff, page, '#autograde-provided-letter-grade-icons-tooltips-manual-override-option', this.test.fullTitle(), false, true);
	});

	it('autograde-provided-number-grade-no-icons-clear-manual-override-option', async function() {
		await testDiff(visualDiff, page, '#autograde-provided-number-grade-no-icons-clear-manual-override-option', this.test.fullTitle());
	});

	it('autograde-provided-number-grade-icons-clear-manual-override-option', async function() {
		await testDiff(visualDiff, page, '#autograde-provided-number-grade-icons-clear-manual-override-option', this.test.fullTitle());
	});

	it('autograde-provided-number-grade-icons-tooltips-clear-manual-override-option-grades', async function() {
		await testDiff(visualDiff, page, '#autograde-provided-number-grade-icons-tooltips-clear-manual-override-option', this.test.fullTitle(), true);
	});

	it('autograde-provided-number-grade-icons-tooltips-clear-manual-override-option-reports', async function() {
		await testDiff(visualDiff, page, '#autograde-provided-number-grade-icons-tooltips-clear-manual-override-option', this.test.fullTitle(), false, true);
	});

	it('autograde-provided-letter-grade-no-icons-clear-manual-override-option', async function() {
		await testDiff(visualDiff, page, '#autograde-provided-letter-grade-no-icons-clear-manual-override-option', this.test.fullTitle());
	});

	it('autograde-provided-letter-grade-icons-clear-manual-override-option', async function() {
		await testDiff(visualDiff, page, '#autograde-provided-letter-grade-icons-clear-manual-override-option', this.test.fullTitle());
	});

	it('autograde-provided-letter-grade-icons-tooltips-clear-manual-override-option-grades', async function() {
		await testDiff(visualDiff, page, '#autograde-provided-letter-grade-icons-tooltips-clear-manual-override-option', this.test.fullTitle(), true);
	});

	it('autograde-provided-letter-grade-icons-tooltips-clear-manual-override-option-reports', async function() {
		await testDiff(visualDiff, page, '#autograde-provided-letter-grade-icons-tooltips-clear-manual-override-option', this.test.fullTitle(), false, true);
	});
});
