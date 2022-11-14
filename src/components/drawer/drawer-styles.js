
import '@brightspace-ui/core/components/colors/colors.js';
import { css } from 'lit';

export const drawerStyles = css`

	:host {
		--d2l-drawer-background-color: white;
		--d2l-drawer-border-color: var(--d2l-color-mica);
		--d2l-drawer-pulse-animation: d2l-drawer-pulse;

		display: none;
	}

	:host([open]),
	:host([_state="showing"]),
	:host([_state="hiding"]) {
		display: block;
	}

	:host([open]:not([_state="showing"])) {
		visibility: hidden;
	}

	:host([open][_state="showing"]),
	:host([open][_state="hiding"]) {
		visibility: visible;
	}

	.d2l-drawer-outer {
		animation: var(--d2l-drawer-close-animation) 200ms ease-in;
		background-color: var(--d2l-drawer-background-color);
		box-sizing: border-box;
		position: fixed;
		z-index: 1000;
	}

	d2l-focus-trap {
		display: block;
		height: 100%;
		width: 100%;
	}

	.d2l-drawer-inner {
		display: flex;
		flex-direction: column;
		height: 100%;
		width: 100%;
	}

	d2l-backdrop {
		background-color: var(--d2l-color-ferrite);
	}

	/* Positioning styles based on consumer preference */

	:host([position="right"]) > .d2l-drawer-outer {
		border-left: 1px solid var(--d2l-drawer-border-color);
		box-shadow: -5px 0 10px -2px rgba(0, 0, 0, 0.1);
	}

	:host([position="top"]) > .d2l-drawer-outer {
		border-left: 1px solid var(--d2l-drawer-border-color);
		box-shadow: -5px 0 10px -2px rgba(0, 0, 0, 0.1);
	}

	.d2l-drawer-content {
		box-sizing: border-box;
		flex: 1 0 0; /* TODO: Have this be toggleable, so that footer can pop up to bottom of content */
		overflow: hidden; /* scrollbar is kept hidden while we update the scroll position to avoid scrollbar flash */
		padding: 0 1.2rem;
	}

	/* WIP - Playing with "closeAborted" animation - WIP
	:host([_closeAborted][_state="showing"]) > .d2l-drawer-outer {
		animation: var(--d2l-drawer-pulse-animation) 400ms ease-in;
	} */

	/* Animation related states */
	:host([_state="showing"]) > .d2l-drawer-outer {
		/* must target direct child to avoid ancestor from interfering with closing child drawers in Legacy-Edge */
		animation: var(--d2l-drawer-open-animation) 250ms ease-out;
	}

	/* close, open, and pulse animations */
	/*  Possibly "overslide" by 5% or something, is this anti d2l-pattern? */

	@keyframes d2l-drawer-close-top {
		0% { transform: translateY(0); }
		100% { transform: translateY(-100%); }
	}

	@keyframes d2l-drawer-open-top {
		0% { transform: translateY(-75%); }
		100% { transform: translateY(0); }
	}

	@keyframes d2l-drawer-close-right {
		0% { transform: translateX(0); }
		100% { transform: translateX(100%); }
	}

	@keyframes d2l-drawer-open-right {
		0% { transform: translateX(75%); }
		100% { transform: translateX(0); }
	}

	@keyframes d2l-drawer-close-bottom {
		0% { transform: translateY(0); }
		100% { transform: translateY(100%); }
	}

	@keyframes d2l-drawer-open-bottom {
		0% { transform: translateY(75%); }
		100% { transform: translateY(0); }
	}

	@keyframes d2l-drawer-close-left {
		0% { transform: translateX(0); }
		100% { transform: translateX(-100%); }
	}

	@keyframes d2l-drawer-open-left {
		0% { transform: translateX(-75%); }
		100% { transform: translateX(0); }
	}

	/* Approx duration ~400ms */
	@keyframes d2l-drawer-pulse {
		0% { transform: scale(1); }
		50% { transform: scale(1.03); }
		100% { transform: scale(1); }
	}

	@media (prefers-reduced-motion: reduce) {
		.d2l-drawer-outer,
		:host([_state="showing"]) > .d2l-drawer-outer {
			animation: none;
		}
	}

`;

export const drawerHeaderStyles = css`

	.d2l-drawer-header {
		box-sizing: border-box;
		padding: 0.6rem 1.2rem 0.6rem 1.2rem;
	}

	.d2l-drawer-header > div {
		display: flex;
	}

	.d2l-drawer-header > div > h2 {
		align-self: center;
		flex: 1 0 0;
		margin: 0;
	}

	@media (max-width: 615px), (max-height: 420px) and (max-width: 900px) {
		.d2l-drawer-header {
			padding: 14px 20px 16px 20px;
		}
		.d2l-drawer-fullscreen .d2l-drawer-header > div > d2l-button-icon {
			margin: -8px -13px 0 15px;
		}
		:host([dir="rtl"]) .d2l-drawer-fullscreen .d2l-drawer-header > div > d2l-button-icon {
			margin-left: -13px;
			margin-right: 15px;
		}
	}
`;

export const drawerFooterStyles = css`

	.d2l-drawer-footer {
		align-items: center;
		box-sizing: border-box;
		display: flex;
		flex-wrap: wrap;
		gap: 0.6rem;
		justify-content: flex-end;
		padding: 0.6rem 1.2rem 1.2rem 1.2rem;
	} /* Better setup for actions would be cool */

	@media (max-width: 615px), (max-height: 420px) and (max-width: 900px) {
		.d2l-drawer-footer {
			padding: 0.6rem 1.2rem 1.2rem 1.2rem; /* Need to update */
		}
	}
`;

export const otherStyles = css`

	.d2l-drawer-outer-scroll .d2l-drawer-content {
		overflow: auto;
	}

	div.d2l-drawer-outer.d2l-drawer-fullscreen {
		border: none;
		border-radius: 0;
		box-shadow: none;
		height: 100% !important;
		top: 0;
		width: 100% !important;
	}

	@media (max-width: 615px), (max-height: 420px) and (max-width: 900px) {
		.d2l-drawer-outer.d2l-drawer-fullscreen {
			margin: 0 !important;
			min-width: calc(var(--d2l-vw, 1vw) * 100);
			top: 42px;
		}
	}
`;
