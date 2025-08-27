import '../../../src/components/navigation/navigation-immersive.js';
import { aTimeout, expect, fixture, focusElem, html, nextFrame } from '@brightspace-ui/testing';

const pageContent = html`<div style="background-color: pink;">Main Page Content</div>`;
const normalFixture = html`<d2l-labs-navigation-immersive width-type="normal" back-link-href="https://www.d2l.com"></d2l-labs-navigation-immersive>${pageContent}`;
const noRightSlotFixture = html`<d2l-labs-navigation-immersive><div slot="middle">Middle</div></d2l-labs-navigation-immersive>${pageContent}`;
const noMiddleSlotFixture = html`<d2l-labs-navigation-immersive><div slot="right">Right</div></d2l-labs-navigation-immersive>${pageContent}`;
const allowOverflowFixture = html`<d2l-labs-navigation-immersive allow-overflow><div slot="right" style="background-color: red; height: 200px;">Should overflow</div></d2l-labs-navigation-immersive>${pageContent}`;
const backLinkTextFixture = html`<d2l-labs-navigation-immersive back-link-text="Long Text" back-link-text-short="Short Text"></d2l-labs-navigation-immersive>`;
const iframeFixture = html`<iframe src="../../../demo/components/navigation/immersive-context-bar.html" style="width: 100%; height: 400px; border: none;"></iframe>`;

describe('d2l-labs-navigation-immersive', () => {

	[1500, 929, 767].forEach((width) => {
		[
			{ name: 'normal', template: normalFixture },
			{ name: 'fullscreen', template: html`<d2l-labs-navigation-immersive width-type="fullscreen"></d2l-labs-navigation-immersive>${pageContent}` },
			{ name: 'both-slots', template: html`<d2l-labs-navigation-immersive><div slot="middle">Middle</div><div slot="right">Right</div></d2l-labs-navigation-immersive>${pageContent}` },
			{ name: 'no-right-slot', template: noRightSlotFixture },
			{ name: 'no-middle-slot', template: noMiddleSlotFixture },
			{ name: 'allow-overflow', template: allowOverflowFixture },
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

	describe('demo-pages', () => {
		it('immersive-context-bar', async() => {
			await fixture(iframeFixture, { viewport: { height: 400, width: 1500 } });
			await aTimeout(100);
			
			await expect(document).to.be.golden();
		});

		it('immersive-context-bar-with-text-spacing', async() => {
			const elem = await fixture(iframeFixture, { viewport: { height: 400, width: 1500 } });
			await aTimeout(100);

			try {
				const iframeWindow = elem.contentWindow;
				iframeWindow.eval(`
					(function(){
						var d=document,id='phltsbkmklt',el=d.getElementById(id),f=d.querySelectorAll('iframe'),i=0,l=f.length;
						if(el){
							function removeFromShadows(root){
								for(var el of root.querySelectorAll('*')){
									if(el.shadowRoot){
										el.shadowRoot.getElementById(id).remove();
										removeFromShadows(el.shadowRoot);
									}
								}
							}
							el.remove();
							if(l){
								for(i=0;i<l;i++){
									try{
										f[i].contentWindow.document.getElementById(id).remove();
										removeFromShadows(f[i].contentWindow.document);
									}catch(e){console.log(e)}
								}
							}
							removeFromShadows(d);
						}else{
							s=d.createElement('style');
							s.id=id;
							s.appendChild(d.createTextNode('*{line-height:1.5 !important;letter-spacing:0.12em !important;word-spacing:0.16em !important;}p{margin-bottom:2em !important;}'));
							function applyToShadows(root){
								for(var el of root.querySelectorAll('*')){
									if(el.shadowRoot){
										el.shadowRoot.appendChild(s.cloneNode(true));
										applyToShadows(el.shadowRoot);
									}
								}
							}
							d.getElementsByTagName('head')[0].appendChild(s);
							for(i=0;i<l;i++){
								try{
									f[i].contentWindow.document.getElementsByTagName('head')[0].appendChild(s.cloneNode(true));
									applyToShadows(f[i].contentWindow.document);
								}catch(e){console.log(e)}
							}
							applyToShadows(d);
						}
					})();
				`);
			} catch(e) {
				console.log('Could not access iframe content:', e);
			}

			await nextFrame();

			await expect(document).to.be.golden();
		});
	});

});
