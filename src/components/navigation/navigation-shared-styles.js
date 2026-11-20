import { css } from 'lit';

export const navigationSharedStyle = css`
	:host {
		--d2l-labs-navigation-margin-regular: 30px;
	}

	.d2l-labs-navigation-centerer {
		margin: 0 auto;
		max-width: 1230px;
	}

	.d2l-labs-navigation-gutters {
		padding-inline: 2.439%;
		position: relative;
	}

	@media (max-width: 615px) {
		.d2l-labs-navigation-gutters {
			padding-inline: 15px;
		}
	}

	@media (min-width: 1230px) {
		.d2l-labs-navigation-gutters {
			padding-inline: 30px;
		}
	}
`;
