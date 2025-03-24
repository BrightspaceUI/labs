class FullscreenApi {
	static getNamesMap() {
		const names = [
			[
				'requestFullscreen',
				'exitFullscreen',
				'fullscreenElement',
				'fullscreenEnabled',
				'fullscreenchange',
				'fullscreenerror',
			],
			// New WebKit
			[
				'webkitRequestFullscreen',
				'webkitExitFullscreen',
				'webkitFullscreenElement',
				'webkitFullscreenEnabled',
				'webkitfullscreenchange',
				'webkitfullscreenerror',
			],
			// Old WebKit
			[
				'webkitRequestFullScreen',
				'webkitCancelFullScreen',
				'webkitCurrentFullScreenElement',
				'webkitCancelFullScreen',
				'webkitfullscreenchange',
				'webkitfullscreenerror',
			],
			[
				'mozRequestFullScreen',
				'mozCancelFullScreen',
				'mozFullScreenElement',
				'mozFullScreenEnabled',
				'mozfullscreenchange',
				'mozfullscreenerror',
			],
			[
				'msRequestFullscreen',
				'msExitFullscreen',
				'msFullscreenElement',
				'msFullscreenEnabled',
				'MSFullscreenChange',
				'MSFullscreenError',
			]
		];

		const map = {};
		for (let i = 0; i < names.length; i++) {
			const val = names[i];
			if (val && val[1] in document) {
				for (i = 0; i < val.length; i++) {
					map[names[0][i]] = val[i];
				}
				return map;
			}
		}

		return false;
	}

	constructor() {
		this.namesMap = FullscreenApi.getNamesMap();
		this.eventNamesMap = {
			change: this.namesMap.fullscreenchange,
			error: this.namesMap.fullscreenerror
		};
	}

	get element() {
		return document[this.namesMap.fullscreenElement];
	}

	get isEnabled() {
		return Boolean(document[this.namesMap.fullscreenEnabled]);
	}

	get isFullscreen() {
		return Boolean(document[this.namesMap.fullscreenElement]);
	}

	exit() {
		return new Promise((resolve, reject) => {
			if (!this.isFullscreen) {
				resolve();
				return;
			}

			const onFullScreenExit = () => {
				this.off('change', onFullScreenExit);
				resolve();
			};

			this.on('change', onFullScreenExit);

			const returnPromise = document[this.namesMap.exitFullscreen]();
			if (returnPromise instanceof Promise) {
				returnPromise.then(onFullScreenExit).catch(reject);
			}
		});
	}

	off(event, callback) {
		const eventName = this.eventNamesMap[event];
		if (eventName) {
			document.removeEventListener(eventName, callback, false);
		}
	}

	on(event, callback) {
		const eventName = this.eventNamesMap[event];
		if (eventName) {
			document.addEventListener(eventName, callback, false);
		}
	}

	onchange(callback) {
		this.on('change', callback);
	}

	onerror(callback) {
		this.on('error', callback);
	}

	request(element) {
		return new Promise((resolve, reject) => {
			const onFullScreenEntered = () => {
				this.off('change', onFullScreenEntered);
				resolve();
			};

			this.on('change', onFullScreenEntered);

			element = element || document.documentElement;

			const returnPromise = element[this.namesMap.requestFullscreen]();

			if (returnPromise instanceof Promise) {
				returnPromise.then(onFullScreenEntered).catch(reject);
			}
		});
	}

	toggle(element) {
		return this.isFullscreen ? this.exit() : this.request(element);
	}
}

export default new FullscreenApi();
