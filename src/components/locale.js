export default async function getLocalizationTranslations(langs) {
	for await (const lang of langs) {
		let translations;
		switch (lang) {
			case 'en':
				translations = await import('../../locales/en.js');
				break;
		}

		if (translations && translations.val) {
			return {
				language: lang,
				resources: translations.val
			};
		}
	}

	return null;
}
