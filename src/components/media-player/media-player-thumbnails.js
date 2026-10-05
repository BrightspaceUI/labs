import { css, html } from 'lit';

const DEFAULT_PREVIEW_WIDTH = 160;
const DEFAULT_PREVIEW_HEIGHT = 90;

// Expects the host to provide _hovering, _hoverTime, _timelinePreviewOffset, _getChapterTitle() and static _formatTime()
export const MediaPlayerThumbnailsMixin = superclass => class extends superclass {

	static properties = {
		thumbnails: { type: String },
		_thumbnailsImage: { state: true },
	};

	static styles = [super.styles, css`
		#thumbnails-preview-container {
			bottom: 60px;
			position: absolute;
			transform: translateX(-50%);
			z-index: 2;
		}

		#thumbnails-preview-chapter {
			background: #00000072;
			position: absolute;
			text-align: center;
			text-shadow: 0 0 5px rgb(0 0 0 / 75%);
			width: 100%;
			z-index: 2;
		}

		#thumbnails-preview-time {
			background: #00000042;
			bottom: 3px;
			font-size: 14px;
			left: 0;
			position: absolute;
			text-align: center;
			text-shadow: 0 0 4px rgb(0 0 0 / 75%);
			width: 100%;
			z-index: 2;
		}

		#thumbnails-preview-image {
			background-repeat: no-repeat;
			position: relative;
			width: 100%;
			z-index: 2;
		}
	`];

	updated(changedProperties) {
		super.updated(changedProperties);

		if (changedProperties.has('thumbnails')) {
			this._getThumbnails();
		}
	}

	_getThumbnails() {
		if (!this.thumbnails) return;
		this._thumbnailsImage = new Image();
		this._thumbnailsImage.src = this.thumbnails;
	}

	_getTimelinePreview() {
		if (!this._hovering) return;
		const chapterTitleLabel = this._getChapterTitle();
		const hoverTimeText = this.constructor._formatTime(this._hoverTime);

		if (!(this.thumbnails && this._thumbnailsImage))
			return html`
				<div id="thumbnails-preview-container"
					style="width: ${DEFAULT_PREVIEW_WIDTH}px; left: clamp(${DEFAULT_PREVIEW_WIDTH / 2}px, ${this._timelinePreviewOffset}%, calc(100% - ${DEFAULT_PREVIEW_WIDTH / 2}px));">
					<div
						id="thumbnails-preview-image"
					>
						<span id="thumbnails-preview-time">${hoverTimeText}</span>
					</div>
					${chapterTitleLabel &&
						html`<span class="d2l-label-text" id="thumbnails-preview-chapter" style="bottom: ${DEFAULT_PREVIEW_HEIGHT - 60}px">${chapterTitleLabel}</span>`}
				</div>
			`;

		// format of the thumbnail is either [url]/timelineThumbnails-h<height>w<height>i<interval>-<hash>.[png|jpg]
		// or [url]/th<height>w<height>i<interval>-<hash>.[png|jpg]
		const matches = this.thumbnails.match(/(timelineThumbnails-|t)h(\d+)w(\d+)i(\d+)[^/]*$/i);
		if (matches && matches.length !== 5) return; // no matches
		const [ , , thumbHeight, thumbWidth, interval] = matches;

		const width = this._thumbnailsImage.width;
		const height = this._thumbnailsImage.height;

		const rows = height / thumbHeight;
		const columns = width / thumbWidth;

		let thumbNum = Math.floor(this._hoverTime / interval);
		if (thumbNum >= rows * columns) thumbNum = rows * columns - 1;

		const row = Math.floor(thumbNum / columns);
		const column = thumbNum % columns;

		return html`
			<div id="thumbnails-preview-container"
				style="width: ${thumbWidth}px; left: clamp(${thumbWidth / 2}px, ${this._timelinePreviewOffset}%, calc(100% - ${thumbWidth / 2}px));">
				<div
					id="thumbnails-preview-image"
					style="height: ${thumbHeight}px; background: url(${this._thumbnailsImage.src}) ${-column * thumbWidth}px ${-row * thumbHeight}px / ${width}px ${height}px;"
				>
					<span id="thumbnails-preview-time">${hoverTimeText}</span>
				</div>
				${chapterTitleLabel &&
					html`<span class="d2l-label-text" id="thumbnails-preview-chapter" style="bottom: ${thumbHeight}px">${chapterTitleLabel}</span>`}
			</div>
		`;
	}
};
