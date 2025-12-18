import '@brightspace-ui/core/components/colors/colors.js';
import { css, html, LitElement } from 'lit';
import { LocalizeLabsElement } from '../localize-labs-element.js';
import { RtlMixin } from '@brightspace-ui/core/mixins/rtl-mixin.js';

class SliderBar extends LocalizeLabsElement(RtlMixin(LitElement)) {

	static get properties() {
		return {
			value: { type: Number },
			immediateValue: { type: Number, reflect: true },
			hoverValue: { type: Number, reflect: true },
			dragging: { type: Boolean, reflect: true },
			hovering: { type: Boolean, reflect: true },
			vertical: { type: Boolean },
			fullWidth: { type: Boolean },
			min: { type: Number },
			max: { type: Number }
		};
	}

	static get styles() {
		return css`
	:host {
		--d2l-color-corundum-65-opacity: rgba(177, 185, 190, 0.65);
		--d2l-color-galena-88-opacity: rgba(110, 116, 119, 0.88);
		--d2l-calculated-seek-bar-height: var(--d2l-seek-bar-height, 6px);
		--d2l-calculated-knob-size: var(--d2l-knob-size, 32px);
		--d2l-half-knob-size: calc(var(--d2l-calculated-knob-size)/2);
		--d2l-half-knob-size-overflow: calc((var(--d2l-calculated-knob-size) - var(--d2l-calculated-seek-bar-height)) / 2 - 1px);
		--d2l-calculated-inner-knob-margin: var(--d2l-inner-knob-margin, 8px);
		--d2l-calculated-knob-box-shadow: var(--d2l-knob-box-shadow, 0 2px 4px 0 rgba(0, 0, 0, 0.52));
		--d2l-calculated-outer-knob-color: var(--d2l-outer-knob-color, var(--d2l-color-regolith));
		--d2l-calculated-outer-knob-border-color: var(--d2l-outer-knob-border-color, var(--d2l-color-pressicus));
		--d2l-inner-knob-color: var(--d2l-inner-knob-color, var(--d2l-color-celestine-plus-1));
		--d2l-calculated-knob-focus-color: var(--d2l-knob-focus-color, var(--d2l-color-celestine));
		--d2l-calculated-knob-focus-size: var(--d2l-knob-focus-size, 2px);
		--d2l-calculated-progress-border-color: var(--d2l-progress-border-color, var(--d2l-color-pressicus));
		--d2l-calculated-progress-border-radius: var(--d2l-progress-border-radius, 6px);
		--d2l-calculated-progress-shadow-color: var(--d2l-progress-shadow-color, var(--d2l-color-galena-88-opacity));
		--d2l-calculated-progress-active-color: var(--d2l-progress-active-color, var(--d2l-color-celestine-plus-1));
		--d2l-calculated-progress-background-color: var(--d2l-progress-background-color, var(--d2l-color-corundum-65-opacity));
		display: block;
	}

	:host(:focus) {
		outline: none;
	}

	:host(:focus) .slider-knob::after {
		border-radius: 50%;
		bottom: 0;
		box-shadow: 0 0 0 var(--d2l-calculated-knob-focus-size) var(--d2l-calculated-knob-focus-color);
		content: "";
		left: 0;
		position: absolute;
		right: 0;
		top: 0;
	}

	:host([solid]) .slider-knob-inner {
		display: none;
	}

	#sliderContainer {
		height: var(--d2l-calculated-knob-size);
		margin-left: var(--d2l-half-knob-size);
		margin-right: var(--d2l-half-knob-size);
		position: relative;
	}

	#knobContainer {
		bottom: 0;
		left: 0;
		pointer-events: none;
		position: absolute;
		right: 0;
		top: 0;
	}

	:host([fullWidth]) #sliderContainer {
		margin-left: 0;
		margin-right: 0;
	}

	:host([fullWidth]) #knobContainer {
		left: var(--d2l-half-knob-size);
		right: var(--d2l-half-knob-size);
	}

	.bar-container {
		cursor: pointer;
		overflow: hidden;
	}

	#sliderBar {
		padding: var(--d2l-half-knob-size-overflow) 0;
		width: 100%;
	}

	#progressContainer {
		--d2l-progress-container-color: var(--d2l-calculated-progress-background-color);
		background: var(--d2l-progress-container-color, var(--d2l-color-gypsum));
		border-radius: var(--d2l-calculated-progress-border-radius);
		box-shadow: inset 0 1px 0 0 var(--d2l-calculated-progress-shadow-color);
		height: var(--d2l-progress-height, 6px);
		position: relative;
	}

	#primaryProgress {
		--d2l-progress-active-color: var(--d2l-calculated-progress-active-color);
		background: var(--d2l-progress-active-color, var(--d2l-color-celestine));
		border-radius: var(--d2l-calculated-progress-border-radius);
		box-shadow: inset 0 1px 0 0 rgba(0, 0, 0, 0.07);
		height: 100%;
	}

	.slider-knob {
		background-color: var(--d2l-calculated-outer-knob-color);
		border-radius: 50%;
		box-shadow: var(--d2l-calculated-knob-box-shadow);
		cursor: pointer;
		height: calc((((var(--d2l-calculated-knob-size) / 2) - var(--d2l-calculated-seek-bar-height) / 2) * 2) + var(--d2l-calculated-seek-bar-height) - 2px);
		left: 0;
		margin-left: calc(-1 * ((var(--d2l-calculated-knob-size) / 2) - var(--d2l-calculated-seek-bar-height) / 2) - var(--d2l-calculated-seek-bar-height) / 2);
		position: absolute;
		top: 0;
		width: calc((((var(--d2l-calculated-knob-size) / 2) - var(--d2l-calculated-seek-bar-height) / 2) * 2) + var(--d2l-calculated-seek-bar-height) - 2px);
		z-index: 1;
	}

	.slider-knob-inner {
		background-color: var(--d2l-inner-knob-color);
		border-radius: 50%;
		box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.07);
		box-sizing: border-box;
		height: calc(100% - var(--d2l-calculated-inner-knob-margin) *2);
		margin: var(--d2l-calculated-inner-knob-margin);
		width: calc(100% - var(--d2l-calculated-inner-knob-margin) *2);
	}`;
	}

	constructor() {
		super();

		this.immediateValue = 0;
		this.hoverValue = 0;
		this.dragging = false;
		this.hovering = false;
		this.vertical = false;
		this.fullWidth = false;
		this.min = 0;
		this.max = 100;
	}

	connectedCallback() {
		super.connectedCallback();
		window.addEventListener('mouseup', () => { this._barUp(); });
		window.addEventListener('mousemove', (event) => { this._onTrack(event); });
	}

	disconnectedCallback() {
		super.disconnectedCallback();
		window.removeEventListener('mouseup', () => { this._barUp(); });
		window.removeEventListener('mousemove', (event) => { this._onTrack(event); });
	}

	render() {
		return html`
		<div id="sliderContainer"
			@mouseover="${this._onHostHover}"
			@mousemove="${this._onHostMove}"
			@mouseout="${this._onHostUnhover}"
		    style="width: ${this.fullWidth ? '100%' : 'auto'}"
		>
			<div class="bar-container">
				<div
					id="sliderBar"
					@mousedown="${this._barDown}"
					@keydown="${this._onKeyPress}"
					tabindex="0"
					role="slider"
					aria-label="${this.localize('components:mediaPlayer:sliderBarProgress')}"
					aria-orientation="${this.vertical ? 'vertical' : 'horizontal'}"
					aria-valuemin="${this.min}"
					aria-valuemax="${this.max}"
					aria-valuenow="${this.immediateValue ? this.immediateValue : 0}"
				>
					<div id="progressContainer">
						<div id="primaryProgress"></div>
					</div>
				</div>
			</div>
			<div id="knobContainer">
				<div id="sliderKnob"
					class="slider-knob"
				>
					<div class="slider-knob-inner"></div>
				</div>
			</div>
		</div>
		`;
	}

	updated(changedProperties) {
		this.ratio = this._calcRatio(this.value);

		if (changedProperties.has('value') || changedProperties.has('min') || changedProperties.has('max')) {
			this._updateKnob(this.value, this.min, this.max);
			this._progressChanged(this.value);
		}
		if (changedProperties.has('immediateValue')) {
			this._immediateValueChanged(this.immediateValue);
		}
		if (changedProperties.has('dragging')) {
			this._draggingChanged(this.dragging);
		}
		if (changedProperties.has('hoverValue')) {
			this._hoverValueChanged(this.hoverValue);
		}
		if (changedProperties.has('hovering')) {
			this._hoveringChanged(this.hovering);
		}
	}

	_barDown(event) {
		const knobContainer = this.shadowRoot.getElementById('knobContainer');
		this._w = knobContainer.offsetWidth;
		const rect = knobContainer.getBoundingClientRect();

		const mousePosition = this.vertical ? rect.bottom - event.clientY : event.clientX - rect.left;
		const ratio = mousePosition / this._w;

		this._x = mousePosition;
		this._startx = this._x;
		this._knobstartx = this._startx;

		this.dragging = true;
		this._positionKnob(ratio);

		event.preventDefault();
		this.shadowRoot.getElementById('sliderKnob').focus();
	}

	_barUp() {
		this._trackEnd();
		this.removeEventListener('mousemove', this._onTrack);
	}

	_calcKnobPosition(ratio) {
		return (this.max - this.min) * ratio + this.min;
	}

	_calcRatio(value) {
		return (value - this.min) / (this.max - this.min);
	}

	_calcStep(position) {
		return Math.min(Math.max(position, this.min), this.max);
	}

	_checkKey(event, key, valueChange) {
		if (event.key === key) {
			event.preventDefault();
			this.immediateValue += valueChange;
			this.dispatchEvent(new CustomEvent('position-change', { bubbles: true, composed: true }));
		}
	}

	_clampValue(value) {
		return Math.max(this.min, Math.min(this.max, value));
	}

	_draggingChanged() {
		if (this.dragging) {
			this.dispatchEvent(new CustomEvent('drag-start', { bubbles: true, composed: true }));
		} else {
			this.dispatchEvent(new CustomEvent('drag-end', { bubbles: true, composed: true }));
		}
	}

	_hoveringChanged() {
		if (this.hovering) {
			this.dispatchEvent(new CustomEvent('hovering-start', { bubbles: true, composed: true }));
		} else {
			this.dispatchEvent(new CustomEvent('hovering-end', { bubbles: true, composed: true }));
		}
	}

	_hoverValueChanged() {
		if (this.hovering) {
			this.dispatchEvent(new CustomEvent('hovering-move', { bubbles: true, composed: true }));
		}
	}

	_immediateValueChanged() {
		if (!this.dragging) {
			this.value = this.immediateValue;
		}
	}

	_onHostHover() {
		this.hovering = true;
	}

	_onHostMove(e) {
		if (this.hovering) {
			const rect = this.shadowRoot.getElementById('knobContainer').getBoundingClientRect();
			const mousePosition = this.vertical ? rect.bottom - e.clientY : e.clientX - rect.left;
			const ratio = mousePosition / this.shadowRoot.getElementById('knobContainer').offsetWidth;

			const value = this._calcStep(this._calcKnobPosition(ratio));
			if (value >= this.min && value <= this.max)
				this.hoverValue = value;
		}
	}

	_onHostUnhover() {
		this.hovering = false;

		this.removeEventListener('mousemove', this._onTrack);
	}

	_onKeyPress(event) {
		if (this.vertical) {
			this._checkKey(event, 'ArrowUp', 5);
			this._checkKey(event, 'ArrowDown', -5);
		} else {
			this._checkKey(event, 'ArrowRight', 5);
			this._checkKey(event, 'ArrowLeft', -5);
		}
	}

	_onTrack(event) {
		if (!this.dragging) {
			return;
		}

		this.dispatchEvent(new CustomEvent('position-change', { bubbles: true, composed: true }));
		event.stopPropagation();
		this._track(event);
	}

	_positionKnob(ratio) {
		this.immediateValue = this._calcStep(this._calcKnobPosition(ratio));
		this.ratio = this._calcRatio(this.immediateValue);

		const sliderKnob = this.shadowRoot.getElementById('sliderKnob');
		sliderKnob.style.left = `${this.ratio * 100}%`;

		if (this.dragging) {
			this._knobstartx = this.ratio * this._w;
			this._translate3d(0, 0, 0, sliderKnob);
		}
	}

	_progressChanged(value) {
		this.value = this._clampValue(value);

		const mainRatio = this._calcRatio(this.value) * 100;
		const progress = this.shadowRoot.getElementById('primaryProgress');

		this._transformProgress(progress, mainRatio);
	}

	_track(event) {
		if (!this.dragging) {
			this._trackStart(event);
		}
		const rect = this.shadowRoot.getElementById('knobContainer').getBoundingClientRect();
		const mousePosition = this.vertical ? rect.bottom - event.clientY : event.clientX - rect.left;
		this._x = mousePosition;

		this.immediateValue = this._calcStep(this._calcKnobPosition(this._x / this._w));

		const translateX = ((this._calcRatio(this.immediateValue) * this._w) - this._knobstartx);
		this._translate3d(`${translateX}px`, '0', '0', this.shadowRoot.getElementById('sliderKnob'));
	}

	_trackEnd() {
		const sliderKnobStyle = this.shadowRoot.getElementById('sliderKnob').style;

		this.dragging = false;
		this.value = this.immediateValue;
		sliderKnobStyle.transform = sliderKnobStyle.transformOrigin = '';
	}

	_trackStart() {
		const knobContainer = this.shadowRoot.getElementById('knobContainer');
		this._w = knobContainer.offsetWidth;
		this._x = this.ratio * this._w;
		this._startx = this._x;
		this._knobstartx = this._startx;
		this.dragging = true;
	}

	_transformProgress(progress, ratio) {
		progress.style.width = `${ratio}%`;
	}

	_translate3d(x, y, z, element) {
		element.style.transform = `translate3d(${x}, ${y}, ${z})`;
	}

	_updateKnob(value) {
		this._positionKnob(this._calcRatio(value));
	}
}
customElements.define('d2l-labs-slider-bar', SliderBar);
