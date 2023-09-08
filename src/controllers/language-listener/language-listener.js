import { getDocumentLocaleSettings } from '@brightspace-ui/intl/lib/common.js';

export class LanguageListenerController {

	constructor(host) {
		(this.host = host).addController(this);
		this._localeSettings = getDocumentLocaleSettings();
		this._handleLangUpdate = () => this.host.requestUpdate();
		this.language = this._localeSettings.language;
	}

	hostConnected() {
		this._localeSettings.addChangeListener(this._handleLangUpdate);
	}

	hostDisconnected() {
		this._localeSettings.removeChangeListener(this._handleLangUpdate);
	}

	hostUpdate() {
		this.language = this._localeSettings.language;
	}
}
