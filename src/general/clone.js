/**
 * Rabbit Ear (c) Kraft
 */
/**
 * @description deep copy an object, like JSON.parse(JSON.stringify())
 * Update: We no longer need this. structuredClone is fully supported in
 * all browsers since 2022. Let's leave this in for now and wait a few years.
 *
 * this clone function is decent, except for:
 *  - it doesn't detect recursive cycles
 *  - weird behavior around Proxys
 * @author https://jsperf.com/deep-copy-vs-json-stringify-json-parse/5
 * @param {object} o
 * @returns {object} a deep copy of the input
 * @linkcode Origami ./src/general/clone.js 14
 */
const clone = function (o) {
	let newO;
	let i;
	if (typeof o !== "object") {
		return o;
	}
	if (!o) {
		return o;
	}
	if (Object.prototype.toString.apply(o) === "[object Array]") {
		newO = [];
		for (i = 0; i < o.length; i += 1) {
			newO[i] = clone(o[i]);
		}
		return newO;
	}
	newO = {};
	for (i in o) {
		if (o.hasOwnProperty(i)) {
			// this is where a self-similar reference causes an infinite loop
			newO[i] = clone(o[i]);
		}
	}
	return newO;
};

export default clone;
