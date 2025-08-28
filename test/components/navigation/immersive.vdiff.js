import '../../../src/components/navigation/navigation-immersive.js';
import '@brightspace-ui/core/templates/primary-secondary/primary-secondary.js';
import { expect, fixture, focusElem, html, nextFrame } from '@brightspace-ui/testing';

const pageContent = html`<div style="background-color: pink;">Main Page Content</div>`;
const normalFixture = html`<d2l-labs-navigation-immersive width-type="normal" back-link-href="https://www.d2l.com"></d2l-labs-navigation-immersive>${pageContent}`;
const noRightSlotFixture = html`<d2l-labs-navigation-immersive><div slot="middle">Middle</div></d2l-labs-navigation-immersive>${pageContent}`;
const noMiddleSlotFixture = html`<d2l-labs-navigation-immersive><div slot="right">Right</div></d2l-labs-navigation-immersive>${pageContent}`;
const allowOverflowFixture = html`<d2l-labs-navigation-immersive allow-overflow><div slot="right" style="background-color: red; height: 200px;">Should overflow</div></d2l-labs-navigation-immersive>${pageContent}`;
const backLinkTextFixture = html`<d2l-labs-navigation-immersive back-link-text="Long Text" back-link-text-short="Short Text"></d2l-labs-navigation-immersive>`;
const contextBarFixture = html`
	<style>
		.context-bar {
			align-items: center;
			background-color: #f8f9fa;
			border-bottom: 1px solid #e3e9f1;
			display: flex;
			padding: 12px 24px;
		}
	</style>
	<d2l-template-primary-secondary resizable width-type="fullscreen">
		<div slot="header">
			<d2l-labs-navigation-immersive 
				width-type="fullscreen" 
				back-link-href="https://www.d2l.com"
				back-link-text="Back to D2L">
				<div slot="middle">Economics 101</div>
				<div slot="right">Right slot</div>
			</d2l-labs-navigation-immersive>
			<div class="context-bar">
				<div>Additional Context Information</div>
			</div>
		</div>
		<div slot="primary">
			<h2>Main Content Area</h2>
			<p>First Item in Page Content</p>
			<p>Page Contents</p>
		</div>
		<div slot="secondary">
			<h3>Secondary Area</h3>
			<p>This is the secondary content area.</p>
		</div>
	</d2l-template-primary-secondary>
`;

describe('d2l-labs-navigation-immersive', () => {

	[1500, 929, 767].forEach((width) => {
		[
			{ name: 'normal', template: normalFixture },
			{ name: 'fullscreen', template: html`<d2l-labs-navigation-immersive width-type="fullscreen"></d2l-labs-navigation-immersive>${pageContent}` },
			{ name: 'both-slots', template: html`<d2l-labs-navigation-immersive><div slot="middle">Middle</div><div slot="right">Right</div></d2l-labs-navigation-immersive>${pageContent}` },
			{ name: 'no-right-slot', template: noRightSlotFixture },
			{ name: 'no-middle-slot', template: noMiddleSlotFixture },
			{ name: 'allow-overflow', template: allowOverflowFixture },
			{ name: 'immersive-context-bar', template: contextBarFixture }
		].forEach(({ name, template }) => {
			describe(name, () => {
				it(`${width}`, async() => {
					await fixture(template, { viewport: { height: 200, width } });
					await expect(document).to.be.golden();
				});
			});
		});
	});

	describe('focus', () => {
		it('back-button', async() => {
			const elem = await fixture(normalFixture, { viewport: { height: 200, width: 1000 } });
			await focusElem(elem.shadowRoot.querySelector('d2l-labs-navigation-link-back'));
			await expect(document).to.be.golden();
		});
	});

	describe('new-slots', () => {
		[
			{ name: 'right', template: noRightSlotFixture },
			{ name: 'middle', template: noMiddleSlotFixture }
		].forEach(({ name, template }) => {
			it(name, async() => {
				const elem = await fixture(template, { viewport: { height: 200, width: 1000 } });
				const newContent = document.createElement('div');
				newContent.setAttribute('slot', name);
				newContent.innerHTML = 'New Content';
				elem.appendChild(newContent);
				await elem.updateComplete;
				await expect(document).to.be.golden();
			});
		});
	});

	describe('back-text', () => {
		it('short', async() => {
			await fixture(backLinkTextFixture, { viewport: { height: 200, width: 500 } });
			await expect(document).to.be.golden();
		});
		it('long', async() => {
			await fixture(backLinkTextFixture, { viewport: { height: 200, width: 650 } });
			await expect(document).to.be.golden();
		});
		it('short-not-set', async() => {
			await fixture(
				html`<d2l-labs-navigation-immersive back-link-text="Long Text"></d2l-labs-navigation-immersive>`,
				{ viewport: { height: 200, width: 500 } }
			);
			await expect(document).to.be.golden();
		});
	});

	describe('context-bar', () => {

		it('with-text-spacing-change', async() => {
			await fixture(contextBarFixture, { viewport: { height: 400, width: 1500 } });
			await nextFrame();

			// Apply accessibility styles directly to the page
			const style = document.createElement('style');
			style.id = 'phltsbkmklt';
			style.appendChild(document.createTextNode('*{line-height:1.5 !important;letter-spacing:0.12em !important;word-spacing:0.16em !important;}p{margin-bottom:2em !important;}'));

			// Add to head
			document.head.appendChild(style);

			// Apply to shadow roots
			function applyToShadows(root) {
				for (const el of root.querySelectorAll('*')) {
					if (el.shadowRoot) {
						el.shadowRoot.appendChild(style.cloneNode(true));
						applyToShadows(el.shadowRoot);
					}
				}
			}
			applyToShadows(document);

			// Wait for any ResizeObserver callbacks to complete
			await nextFrame();

			await expect(document).to.be.golden();
		});
	});

});
