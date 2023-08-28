/* Math (c) Kraft, MIT License */
import { resize, subtract3, normalize3, dot3, scale3 } from '../algebra/vector.js';

/**
 *
 */
const projectPointOnPlane = (point, vector = [1, 0, 0], origin = [0, 0, 0]) => {
	const point3 = resize(3, point);
	const originToPoint = subtract3(point3, resize(3, origin));
	const normalized = normalize3(resize(3, vector));
	const magnitude = dot3(normalized, originToPoint);
	const planeToPoint = scale3(normalized, magnitude);
	return subtract3(point3, planeToPoint);
};

export { projectPointOnPlane };