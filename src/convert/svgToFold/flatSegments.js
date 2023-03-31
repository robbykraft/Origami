/**
 * Rabbit Ear (c) Kraft
 */
import { multiplyMatrix2Vector2 } from "../../math/algebra/matrix2.js";
import parsers from "./parsers/index.js";
import {
	flattenDomTreeWithStyle,
} from "../../svg/general/dom.js";
import { transformStringToMatrix } from "../../svg/general/transforms.js";
/**
 *
 */
const transformSegment = (segment, transform) => {
	const seg = [[segment[0], segment[1]], [segment[2], segment[3]]];
	if (!transform) { return seg; }
	const matrix = transformStringToMatrix(transform);
	return matrix
		? seg.map(p => multiplyMatrix2Vector2(matrix, p))
		: seg;
};
/**
 *
 */
const flatSegments = (svgElement) => {
	// get a flat array of all elements in the tree, with all
	// styles also flattened (nested transformed computed, for example)
	const elements = flattenDomTreeWithStyle(svgElement);

	// convert all elements <path> <rect> etc into arrays of line segments
	return elements
		.filter(el => parsers[el.element.nodeName])
		.flatMap(el => parsers[el.element.nodeName](el.element)
			.map(segment => transformSegment(segment, el.attributes.transform))
			.map(segment => ({ ...el, segment })));
};

export default flatSegments;
