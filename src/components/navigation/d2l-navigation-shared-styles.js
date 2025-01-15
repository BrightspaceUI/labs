import { css } from 'lit';

export const navigationSharedStyle = css`
	:host {
		--d2l-navigation-margin-regular: 30px;
	}

	.d2l-navigation-centerer {
		margin: 0 auto;
		max-width: 1230px;
	}

	.d2l-navigation-gutters {
		padding-left: 2.439%;
		padding-right: 2.439%;
		position: relative;
	}

	@media (max-width: 615px) {
		.d2l-navigation-gutters {
			padding-left: 15px;
			padding-right: 15px;
		}
	}

	@media (min-width: 1230px) {
		.d2l-navigation-gutters {
			padding-left: 30px;
			padding-right: 30px;
		}
	}
`;
