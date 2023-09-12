import { getDocumentLocaleSettings } from '@brightspace-ui/intl/lib/common.js';

const localeSettings = getDocumentLocaleSettings();

export class LanguageListenerController {

	constructor(host) {
		(this.host = host).addController(this);
		this._handleLangUpdate = () => {
			this.language = localeSettings.language;
			this.host.requestUpdate();
		};
		this.language = localeSettings.language;
	}

	hostConnected() {
		localeSettings.addChangeListener(this._handleLangUpdate);
	}

	hostDisconnected() {
		localeSettings.removeChangeListener(this._handleLangUpdate);
	}
}
