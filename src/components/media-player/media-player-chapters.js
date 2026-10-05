import { css, html, nothing } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import { styleMap } from 'lit/directives/style-map.js';

// Expects the host to provide _duration, _hovering, _hoverTime, _getPercentageTime() and _getTheme()
export const MediaPlayerChaptersMixin = superclass => class extends superclass {

	static properties = {
		metadata: { type: Object },
		_chapters: { state: true },
	};

	static styles = [super.styles, css`
		.chapter-marker, .chapter-marker-highlight {
			cursor: pointer;
			height: 6px;
			pointer-events: none;
			position: absolute;
			top: 4px;
			width: 3px;
			z-index: 2;
		}

		.chapter-marker {
			background-color: var(--d2l-color-ferrite);
		}

		.chapter-marker-highlight {
			background-color: var(--d2l-color-celestine-minus-1);
		}

		.chapter-marker[theme="dark"] {
			background-color: white;
		}
	`];

	constructor() {
		super();
		this._chapters = [];
	}

	willUpdate(changedProperties) {
		super.willUpdate(changedProperties);

		if (changedProperties.has('metadata')) {
			this._getMetadata();
		}

		// A chapter starting at the very end of the media has no visible range
		if (this._chapters.at(-1)?.time === Math.floor(this._duration)) {
			this._chapters = this._chapters.slice(0, -1);
		}
	}

	_getChapterMarkersView() {
		if (this._chapters.length === 0) return;

		let start, end;
		for (let i = 0; i < this._chapters.length; i++) {
			if (i === this._chapters.length - 1) {
				start = this._chapters[i].time;
				break;
			}
			else if (this._hoverTime >= this._chapters[i].time && this._hoverTime < this._chapters[i + 1].time) {
				start = this._chapters[i].time;
				end = this._chapters[i + 1].time;
				break;
			}
		}

		return this._chapters.map(chapter => {
			const highlight = this._hovering && this._hoverTime >= this._chapters[0].time && (chapter.time === start || chapter.time === end);
			return chapter.time > 0 ? html`
				<div
					class=${highlight ? 'chapter-marker-highlight' : 'chapter-marker'}
					theme="${ifDefined(this._getTheme())}"
					style=${styleMap({ left: `${this._getPercentageTime(chapter.time)}%` })}
				></div>
			` : nothing;
		});
	}

	_getChapterTitle() {
		if (!(this._chapters.length > 0 && this._hoverTime >= this._chapters[0].time)) return;

		const chapter = this._chapters.find((_chapter, index, chapters) => (
			index === chapters.length - 1 || (this._hoverTime >= chapters[0].time && this._hoverTime < chapters[index + 1].time)
		));
		const chapterTitle = chapter && chapter.title;

		if (!chapterTitle) return;

		if (typeof chapterTitle === 'string') {
			return chapterTitle;
		}

		for (const locale in chapterTitle) {
			if (locale.split('-')[0] === 'en') {
				return chapterTitle[locale];
			}
		}
	}

	_getMetadata() {
		if (!this.metadata) return;

		const data = (typeof this.metadata === 'string' || this.metadata instanceof String) ? JSON.parse(this.metadata) : this.metadata;
		if (!(data && data.chapters && data.chapters.length > 0)) return;
		let chapters = data.chapters.map(({ time, title }) => {
			return {
				time: parseInt(time),
				title
			};
		}).sort((a, b) => a.time - b.time);

		if (!data.cuts) {
			data.cuts = [];
		}

		// updating the chapter times based on the cuts, loops over all chapters per cut because it can change multiple chapters
		let cutDiff = 0;
		for (const cut of data.cuts) {
			const cutIn = cut.in - cutDiff;

			const newChapters = new Map(); // using map to preserve sort ordering

			if (!cut.out) { // if cut is until the end of the video
				for (const chapter of chapters) {
					if (chapter.time < cutIn) {
						newChapters.set(chapter.time, chapter.title);
					}
				}
			} else {
				const cutOut = cut.out - cutDiff;
				const cutLength = cutOut - cutIn;

				for (const chapter of chapters) {
					let newTime = chapter.time;
					if (chapter.time > cutIn && chapter.time <= cutOut) {
						newTime = cutIn;
					} else if (chapter.time > cutOut) {
						newTime = chapter.time - cutLength;
					}

					newChapters.set(newTime, chapter.title);
				}

				cutDiff += cutLength;
			}

			chapters = [...newChapters].map(([chapterTime, chapterTitle]) => ({
				time: chapterTime,
				title: chapterTitle
			}));
		}
		this._chapters = chapters;
	}
};
