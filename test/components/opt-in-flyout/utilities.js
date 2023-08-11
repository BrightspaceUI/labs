const toArray = function(collection) {
	if (Array.from) {
		return Array.from(collection);
	}

	const array = [];
	for (let i = 0; i < collection.length; i++) {
		array.push(collection[i]);
	}
	return array;
};

export default {

	selectVisible: function(element, querySelector) {
		return toArray(element.querySelectorAll(querySelector)).filter(
			node => node.offsetParent !== null
		);
	}

};
