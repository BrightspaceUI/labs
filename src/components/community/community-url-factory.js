
export const communityUrlFactory = (articleMap) => (langIdent) => {
	langIdent = langIdent.toLocaleLowerCase();
	let articleCode = articleMap[langIdent];
	let usedLangCode = articleCode !== undefined ? langIdent : undefined;
	if (articleCode === undefined) {
		// try and get a region-less match
		const regionlessLangIdent = langIdent.split('-')[0];
		Object.entries(articleMap).forEach(([langCode, currentArticle]) => {
			const regionlessLangCode = langCode.split('-')[0];
			if (regionlessLangIdent === regionlessLangCode) {
				articleCode = currentArticle;
				usedLangCode = langCode;
			}
		});
		// still undefined? use en
		if (articleCode === undefined) {
			articleCode = articleMap['en'];
			usedLangCode = 'en';
		}
	}
	return `https://community.d2l.com/brightspace${usedLangCode === 'en' ? '' : `-${usedLangCode}`}/kb/articles/${articleCode}`;
};
