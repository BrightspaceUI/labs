import '../../../src/components/accordion/accordion.js';
import { clickElem, expect, html } from '@brightspace-ui/testing';
import { setViewport as cmdSetViewport, emulateMedia, sendMouse } from '@web/test-runner-commands';
import { nextFrame, fixture as wcFixture } from '@open-wc/testing';
import { getDocumentLocaleSettings } from '@brightspace-ui/intl/lib/common.js';

/**
 * @param {*} node
 */
function getComposedChildren(node) {

	if (node?.nodeType !== Node.ELEMENT_NODE) {
		return [];
	}

	let nodes;
	const children = [];

	if (node.tagName === 'SLOT') {
		nodes = node.assignedNodes({ flatten: true });
	} else {
		if (node.shadowRoot) {
			node = node.shadowRoot;
		}
		nodes = node.children || node.childNodes;
	}

	for (let i = 0; i < nodes.length; i++) {
		if (nodes[i].nodeType === 1) {
			children.push(nodes[i]);
		}
	}

	return children;

}

/**
 * @param {*} elem
 * @param {boolean} awaitLoadingComplete
 */
async function waitForElem(elem, awaitLoadingComplete = true) {

	if (!elem) return;

	const doWait = async() => {

		const update = elem.updateComplete;
		if (typeof update === 'object' && Promise.resolve(update) === update) {
			console.log(performance.now(), 'waitForElem.doWait', elem.tagName.toLowerCase(), 'awaiting updateComplete...');
			await update;
			console.log(performance.now(), 'waitForElem.doWait', elem.tagName.toLowerCase(), 'awaiting nextFrame...');
			await nextFrame();
			console.log(performance.now(), 'waitForElem.doWait', elem.tagName.toLowerCase(), 'done');
		}

		if (awaitLoadingComplete && typeof elem.getLoadingComplete === 'function') {
			console.log(performance.now(), 'waitForElem.doWait', elem.tagName.toLowerCase(), 'awaiting loadingComplete...');
			await elem.getLoadingComplete();
			console.log(performance.now(), 'waitForElem.doWait', elem.tagName.toLowerCase(), 'awaiting nextFrame...');
			await nextFrame();
			console.log(performance.now(), 'waitForElem.doWait', elem.tagName.toLowerCase(), 'done');
		}

		const children = getComposedChildren(elem);
		await Promise.all(children.map(e => waitForElem(e, awaitLoadingComplete)));

	};

	await new Promise((resolve) => {
		const observer = new MutationObserver((records) => {
			for (const record of records) {
				for (const removedNode of record.removedNodes) {
					if (removedNode === elem) {
						observer.disconnect();
						resolve();
						return;
					}
				}
			}
		});
		observer.observe(elem.parentNode, { childList: true });
		doWait()
			.then(() => observer.disconnect())
			.then(resolve);
	});

}

/**
 *
 * @param {*} element
 * @param {{
 *      awaitLoadingComplete: boolean,
 * 		lang: string,
 *		mathjax: {renderLatex: boolean},
 *		rtl: boolean,
 *		pagePadding: boolean,
 *		media: string,
 *      viewport: { height: number, width: number }
 *	}} opts
 */
export async function fixture(element, opts = {}) {
	console.log(performance.now(), 'fixure.waiting for reset, fonts...');
	await Promise.all([reset(opts), document.fonts.ready]);
	console.log(performance.now(), 'fixure.reset/fonts complete');

	const parentNode = document.createElement('div');
	parentNode.setAttribute('id', 'd2l-test-fixture-container');

	const elem = await wcFixture(element, { parentNode });
	console.log(performance.now(), 'fixure.wcFixture complete, waiting for elements...');
	await waitForElem(elem, opts.awaitLoadingComplete);
	console.log(performance.now(), 'fixure.waiting for elements complete, waiting for pause...');

	await pause();
	console.log(performance.now(), 'fixure.pause complete, returning element');
	return elem;
}

async function pause() {
	const test = window.d2lTest || {};

	test.update?.();

	if (test.pause) {
		await test.pause;
		if (test.pause) test.pause = new Promise(r => test.run = r);
	}
}

const DEFAULT_PAGE_PADDING = true,
	DEFAULT_LANG = 'en',
	DEFAULT_MATHJAX_RENDER_LATEX = false,
	DEFAULT_MEDIA = 'screen',
	DEFAULT_VIEWPORT = {
		height: 800,
		width: 800
	};

const documentLocaleSettings = getDocumentLocaleSettings();

let
	currentPagePadding = true,
	currentMathjaxRenderLatex = DEFAULT_MATHJAX_RENDER_LATEX,
	currentMedia = DEFAULT_MEDIA,
	currentRtl = false,
	currentViewportHeight = 0,
	currentViewportWidth = 0,
	shouldResetMouse = false;

export function requestMouseReset() {
	shouldResetMouse = true;
}

export async function setViewport(viewport) {

	const newViewport = { ...DEFAULT_VIEWPORT, ...viewport };

	if (newViewport.height !== currentViewportHeight || newViewport.width !== currentViewportWidth) {
		currentViewportHeight = newViewport.height;
		currentViewportWidth = newViewport.width;
		await cmdSetViewport(newViewport).catch(() => {});
		return true;
	}

	return false;

}

export async function reset(opts = {}) {

	const defaultOpts = {
		lang: DEFAULT_LANG,
		mathjax: {},
		rtl: !!opts.lang?.startsWith('ar'),
		pagePadding: DEFAULT_PAGE_PADDING,
		media: DEFAULT_MEDIA
	};

	opts = { ...defaultOpts, ...opts };
	opts.mathjax.renderLatex = (typeof opts.mathjax.renderLatex === 'boolean') ? opts.mathjax.renderLatex : DEFAULT_MATHJAX_RENDER_LATEX;

	let awaitNextFrame = false;

	window.scroll(0, 0);

	if (opts.pagePadding !== currentPagePadding) {
		if (!opts.pagePadding) {
			document.body.classList.add('no-padding');
		}
		else {
			document.body.classList.remove('no-padding');
		}
		awaitNextFrame = true;
		currentPagePadding = opts.pagePadding;
	}

	if (shouldResetMouse) {
		shouldResetMouse = false;
		await sendMouse({ type: 'move', position: [0, 0] }).catch(() => {});
	}

	if (document.activeElement !== document.body) {
		document.activeElement.blur();
		awaitNextFrame = true;
	}

	if (opts.rtl !== currentRtl) {
		if (!opts.rtl) {
			document.documentElement.removeAttribute('dir');
		} else {
			document.documentElement.setAttribute('dir', 'rtl');
		}
		awaitNextFrame = true;
		currentRtl = opts.rtl;
	}

	opts.lang ??= '';
	if (documentLocaleSettings.language !== opts.lang) {
		document.documentElement.lang = opts.lang;
		awaitNextFrame = true;
	}

	if (await setViewport(opts.viewport)) {
		awaitNextFrame = true;
	}

	if (opts.mathjax.renderLatex !== currentMathjaxRenderLatex) {
		currentMathjaxRenderLatex = opts.mathjax.renderLatex;
		if (opts.mathjax.renderLatex === DEFAULT_MATHJAX_RENDER_LATEX) {
			document.documentElement.removeAttribute('data-mathjax-context');
		} else {
			document.documentElement.dataset.mathjaxContext = JSON.stringify({
				renderLatex: opts.mathjax.renderLatex
			});
		}
	}

	if (opts.media !== currentMedia) {
		currentMedia = opts.media;
		await emulateMedia({ media: opts.media }).catch(() => {});
		awaitNextFrame = true;
	}

	if (awaitNextFrame) {
		await nextFrame();
	}

}

const accordionCollapseFixture = html`
	<d2l-labs-accordion>
		<d2l-labs-accordion-collapse title="Item 1">Test</d2l-labs-accordion-collapse>
		<d2l-labs-accordion-collapse title="Item 2">Test</d2l-labs-accordion-collapse>
		<d2l-labs-accordion-collapse title="Item 3">Test</d2l-labs-accordion-collapse>
	</d2l-labs-accordion>
`;
const accordionCollapseFixtureLabel = html`
	<d2l-labs-accordion>
		<d2l-labs-accordion-collapse label="Item 1">Test</d2l-labs-accordion-collapse>
		<d2l-labs-accordion-collapse label="Item 2">Test</d2l-labs-accordion-collapse>
		<d2l-labs-accordion-collapse label="Item 3">Test</d2l-labs-accordion-collapse>
	</d2l-labs-accordion>
`;

describe('d2l-labs-accordion', () => {

	it.only('initial select state', async() => {
		const myEl = await fixture(accordionCollapseFixture);
		expect(myEl.selected).to.not.exist;
		expect(myEl.items[0].opened).to.be.false;
		expect(myEl.items[1].opened).to.be.false;
		expect(myEl.items[2].opened).to.be.false;
		expect(myEl.items[0].shadowRoot.querySelector('.collapse-title').title).to.equal('');
		expect(myEl.items[1].shadowRoot.querySelector('.collapse-title').title).to.equal('');
		expect(myEl.items[2].shadowRoot.querySelector('.collapse-title').title).to.equal('');
	});

	it.only('state change', async() => {
		const myEl = await fixture(accordionCollapseFixture);
		expect(myEl.items[0].opened).to.be.false;
		expect(myEl.items[1].opened).to.be.false;
		expect(myEl.items[2].opened).to.be.false;
		myEl.selected = 1;
		expect(myEl.items[0].opened).to.be.false;
		expect(myEl.items[1].opened).to.be.true;
		expect(myEl.items[2].opened).to.be.false;
	});

	it('trigger test', async() => {
		const myEl = await fixture(accordionCollapseFixture);
		expect(myEl.items[0].opened).to.be.false;
		await clickElem(myEl.items[0].shadowRoot.querySelector('#trigger'));
		expect(myEl.items[0].opened).to.be.true;
	});

	it('label instead of title', async() => {
		const myEl = await fixture(accordionCollapseFixtureLabel);
		expect(myEl.items[0].shadowRoot.querySelector('.collapse-title').title).to.equal('Item 1');
		expect(myEl.items[1].shadowRoot.querySelector('.collapse-title').title).to.equal('Item 2');
		expect(myEl.items[2].shadowRoot.querySelector('.collapse-title').title).to.equal('Item 3');
	});

});
