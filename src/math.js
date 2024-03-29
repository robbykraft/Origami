/* Math (c) Kraft, MIT License */
/**
 * Math (c) Kraft
 */
/**
 * type checking
 */
/**
 * one way to improve these input finders is to search in all indices
 * of the arguments list, right now it assumes THIS is the only thing
 * you're passing in. in the case that it isn't and there's an object
 * in the first slot, it won't find the valid data in the second.
 */
/**
 * @description get the type of an object, which includes the custom types in this library.
 * @param {any} any object
 * @returns {string} the type name
 * @linkcode Math ./src/types/typeof.js 17
 */
const typeOf = function (obj) {
	switch (obj.constructor.name) {
	case "vector":
	case "matrix":
	case "segment":
	case "ray":
	case "line":
	case "circle":
	case "ellipse":
	case "rect":
	case "polygon": return obj.constructor.name;
	}
	if (typeof obj === "object") {
		if (obj.radius != null) { return "circle"; }
		if (obj.width != null) { return "rect"; }
		if (obj.x != null || typeof obj[0] === "number") { return "vector"; }
		// line ray segment
		if (obj[0] != null && obj[0].length && (typeof obj[0].x === "number" || typeof obj[0][0] === "number")) { return "segment"; }
		if (obj.vector != null && obj.origin != null) { return "line"; } // or ray
	}
	return undefined;
};

/**
 * Math (c) Kraft
 */
/**
 * sort two vectors by their lengths, returning the shorter one first
 *
 */
// export const lengthSort = (a, b) => [a, b].sort((m, n) => m.length - n.length);
/**
 * force a vector into N-dimensions by adding 0s if they don't exist.
 */
const resize = (d, v) => (v.length === d
	? v
	: Array(d).fill(0).map((z, i) => (v[i] ? v[i] : z)));
/**
 * this makes the two vectors match in dimension.
 * the smaller array will be filled with 0s to match the length of the larger
 */
const resizeUp = (a, b) => {
	const size = a.length > b.length ? a.length : b.length;
	return [a, b].map(v => resize(size, v));
};
/**
 * this makes the two vectors match in dimension.
 * the larger array will be shrunk to match the length of the smaller
 */
const resizeDown = (a, b) => {
	const size = a.length > b.length ? b.length : a.length;
	return [a, b].map(v => resize(size, v));
};

const countPlaces = function (num) {
	const m = (`${num}`).match(/(?:\.(\d+))?(?:[eE]([+-]?\d+))?$/);
	if (!m) { return 0; }
	return Math.max(0, (m[1] ? m[1].length : 0) - (m[2] ? +m[2] : 0));
};
/**
 * @description clean floating point numbers, where 15.0000000000000002 becomes 15,
 * this method involves encoding and parsing so it is relatively expensive.
 * @param {number} num the floating point number to clean
 * @param {number} [places=15] the whole number of decimal places to
 * keep, beyond this point can be considered to be noise.
 * @returns {number} the cleaned floating point number
 */
const cleanNumber = function (num, places = 15) {
	if (typeof num !== "number") { return num; }
	const crop = parseFloat(num.toFixed(places));
	if (countPlaces(crop) === Math.min(places, countPlaces(num))) {
		return num;
	}
	return crop;
};

const isIterable = (obj) => obj != null
	&& typeof obj[Symbol.iterator] === "function";
/**
 * @description flatten only until the point of comma separated entities. recursive
 * @param {Array} args any array, intended to contain arrays of arrays.
 * @returns always an array
 */
const semiFlattenArrays = function () {
	switch (arguments.length) {
	case undefined:
	case 0: return Array.from(arguments);
	// only if its an array (is iterable) and NOT a string
	case 1: return isIterable(arguments[0]) && typeof arguments[0] !== "string"
		? semiFlattenArrays(...arguments[0])
		: [arguments[0]];
	default:
		return Array.from(arguments).map(a => (isIterable(a)
			? [...semiFlattenArrays(a)]
			: a));
	}
};
/**
 * totally flatten, recursive
 * @param {Array} args any array, intended to contain arrays of arrays.
 * @returns an array, always.
 */
const flattenArrays = function () {
	switch (arguments.length) {
	case undefined:
	case 0: return Array.from(arguments);
	// only if its an array (is iterable) and NOT a string
	case 1: return isIterable(arguments[0]) && typeof arguments[0] !== "string"
		? flattenArrays(...arguments[0])
		: [arguments[0]];
	default:
		return Array.from(arguments).map(a => (isIterable(a)
			? [...flattenArrays(a)]
			: a)).reduce((a, b) => a.concat(b), []);
	}
};

var resizers = /*#__PURE__*/Object.freeze({
	__proto__: null,
	resize: resize,
	resizeUp: resizeUp,
	resizeDown: resizeDown,
	cleanNumber: cleanNumber,
	semiFlattenArrays: semiFlattenArrays,
	flattenArrays: flattenArrays
});

/**
 * Math (c) Kraft
 */
// because an object may contain an operation that returns a copy of itself,
// or any other primitive for that matter, all primitive
// contructors will be assigned here to prevent circular dependencies
//
// this file should import no other file

var Constructors = Object.create(null);

/**
 * Math (c) Kraft
 */
/**
 * @description this epsilon is used throughout the library
 * @linkcode Math ./src/algebra/constants.js 6
 */
const EPSILON = 1e-6;
/**
 * @description radians to degrees
 * @linkcode Math ./src/algebra/constants.js 11
 */
const R2D = 180 / Math.PI;
/**
 * @description degrees to radians
 * @linkcode Math ./src/algebra/constants.js 16
 */
const D2R = Math.PI / 180;
/**
 * @description pi x 2
 * @linkcode Math ./src/algebra/constants.js 21
 */
const TWO_PI = Math.PI * 2;

var constants = /*#__PURE__*/Object.freeze({
	__proto__: null,
	EPSILON: EPSILON,
	R2D: R2D,
	D2R: D2R,
	TWO_PI: TWO_PI
});

/**
 * Math (c) Kraft
 */
/**
 * common functions that get reused, especially inside of map/reduce etc...
 */
/**
 * @description trivial method, returns true
 * @returns {boolean} true
 * @linkcode Math ./src/algebra/functions.js 11
 */
const fnTrue = () => true;
/**
 * @description multiply a parameter by itself
 * @param {number} n a number
 * @returns {number} a number
 * @linkcode Math ./src/algebra/functions.js 18
 */
const fnSquare = n => n * n;
/**
 * @description add two parameters
 * @param {number} a a number
 * @param {number} b a number
 * @returns {number} a number
 * @linkcode Math ./src/algebra/functions.js 26
 */
const fnAdd = (a, b) => a + (b || 0);
/**
 * @description is an input not undefined? using Javascript's triple equals !==
 * @param {any} a any input
 * @returns {boolean} true if the input is not undefined
 * @linkcode Math ./src/algebra/functions.js 33
 */
const fnNotUndefined = a => a !== undefined;
/**
 * @description boolean AND the two inputs
 * @param {any} a any input
 * @param {any} b any input
 * @returns {boolean} the AND of both inputs
 * @linkcode Math ./src/algebra/functions.js 41
 */
const fnAnd = (a, b) => a && b;
/**
 * @description concat the two arrays, resulting in one joined array
 * @param {Array} a any array input
 * @param {Array} b any array input
 * @returns {Array} one joined array
 * @linkcode Math ./src/algebra/functions.js 49
 */
const fnCat = (a, b) => a.concat(b);
/**
 * @description Convert a 2D vector to an angle in radians.
 * @param {number[]} v an input vector
 * @returns {number} the angle in radians
 * @linkcode Math ./src/algebra/functions.js 56
 */
const fnVec2Angle = v => Math.atan2(v[1], v[0]);
/**
 * @description Convert an angle in radians to a 2D vector.
 * @param {number} a the angle in radians
 * @returns {number[]} a 2D vector
 * @linkcode Math ./src/algebra/functions.js 63
 */
const fnToVec2 = a => [Math.cos(a), Math.sin(a)];
/**
 * @description Are two inputs equal using Javascript's triple equals?
 * @param {any} a any input
 * @param {any} b any input
 * @returns {boolean} true if the inputs are equal
 * @linkcode Math ./src/algebra/functions.js 71
 */
const fnEqual = (a, b) => a === b;
/**
 * @description Are two inputs equal within an epsilon of each other?
 * @param {number} a any number input
 * @param {number} b any number input
 * @returns {boolean} true if the numbers are near each other
 * @linkcode Math ./src/algebra/functions.js 79
 */
const fnEpsilonEqual = (a, b, epsilon = EPSILON) => Math.abs(a - b) < epsilon;
/**
 * @description Sort two numbers within an epsilon of each other, so that "1": a < b,
 * "-1": a > b, and "0": a ~= b (epsilon equal).
 * @param {number} a any number
 * @param {number} b any number
 * @param {number} [epsilon=1e-6] an optional epsilon
 * @returns {number} -1, 0, +1
 * @linkcode Math ./src/algebra/functions.js 89
 */
const fnEpsilonSort = (a, b, epsilon = EPSILON) => (
	fnEpsilonEqual(a, b, epsilon) ? 0 : Math.sign(b - a)
);
/**
 * @description are two vectors equal to each other within an epsilon. This method
 * uses a fast rectangle-area around each vector.
 * @param {number[]} a an array of numbers
 * @param {number[]} b an array of numbers
 * @returns {boolean} true if the vectors are similar within an epsilon
 * @linkcode Math ./src/algebra/functions.js 100
 */
const fnEpsilonEqualVectors = (a, b, epsilon = EPSILON) => {
	for (let i = 0; i < Math.max(a.length, b.length); i += 1) {
		if (!fnEpsilonEqual(a[i] || 0, b[i] || 0, epsilon)) { return false; }
	}
	return true;
};
/**
 * @description the inclusive test used in intersection algorithms, returns
 * true if the number is positive, including the epsilon between -epsilon and 0.
 * @returns {boolean} -Infinity...{false}...-epsilon...{true}...+Infinity
 * @linkcode Math ./src/algebra/functions.js 112
 */
const include = (n, epsilon = EPSILON) => n > -epsilon;
/**
 * @description the exclusive test used in intersection algorithms, returns
 * true if the number is positive, excluding the epsilon between 0 and +epsilon.
 * @returns {boolean} -Infinity...{false}...+epsilon...{true}...+Infinity
 * @linkcode Math ./src/algebra/functions.js 119
 */
const exclude = (n, epsilon = EPSILON) => n > epsilon;
/**
 * @description the function parameter for an inclusive line
 * @linkcode Math ./src/algebra/functions.js 124
 */
const includeL = fnTrue;
/**
 * @description the function parameter for an exclusive line
 * @linkcode Math ./src/algebra/functions.js 129
 */
const excludeL = fnTrue;
/**
 * @description the function parameter for an inclusive ray
 * @linkcode Math ./src/algebra/functions.js 134
 */
const includeR = include;
/**
 * @description the function parameter for an exclusive ray
 * @linkcode Math ./src/algebra/functions.js 139
 */
const excludeR = exclude;
/**
 * @description the function parameter for an inclusive segment
 * @linkcode Math ./src/algebra/functions.js 144
 */
const includeS = (t, e = EPSILON) => t > -e && t < 1 + e;
/**
 * @description the function parameter for an exclusive segment
 * @linkcode Math ./src/algebra/functions.js 149
 */
const excludeS = (t, e = EPSILON) => t > e && t < 1 - e;
/**
 * @description These clamp functions process lines/rays/segments intersections.
 * The line method allows all values.
 * @param {number} t the length along the vector
 * @returns {number} the clamped input value
 * @linkcode Math ./src/algebra/functions.js 157
 */
const lineLimiter = dist => dist;
/**
 * @description These clamp functions process lines/rays/segments intersections.
 * The ray method clamps values below -epsilon to be 0.
 * @param {number} t the length along the vector
 * @returns {number} the clamped input value
 * @linkcode Math ./src/algebra/functions.js 165
 */
const rayLimiter = dist => (dist < -EPSILON ? 0 : dist);
/**
 * @description These clamp functions process lines/rays/segments intersections.
 * The segment method clamps values below -epsilon to be 0 and above 1+epsilon to 1.
 * @param {number} t the length along the vector
 * @returns {number} the clamped input value
 * @linkcode Math ./src/algebra/functions.js 173
 */
const segmentLimiter = (dist) => {
	if (dist < -EPSILON) { return 0; }
	if (dist > 1 + EPSILON) { return 1; }
	return dist;
};

var functions = /*#__PURE__*/Object.freeze({
	__proto__: null,
	fnTrue: fnTrue,
	fnSquare: fnSquare,
	fnAdd: fnAdd,
	fnNotUndefined: fnNotUndefined,
	fnAnd: fnAnd,
	fnCat: fnCat,
	fnVec2Angle: fnVec2Angle,
	fnToVec2: fnToVec2,
	fnEqual: fnEqual,
	fnEpsilonEqual: fnEpsilonEqual,
	fnEpsilonSort: fnEpsilonSort,
	fnEpsilonEqualVectors: fnEpsilonEqualVectors,
	include: include,
	exclude: exclude,
	includeL: includeL,
	excludeL: excludeL,
	includeR: includeR,
	excludeR: excludeR,
	includeS: includeS,
	excludeS: excludeS,
	lineLimiter: lineLimiter,
	rayLimiter: rayLimiter,
	segmentLimiter: segmentLimiter
});

/**
 * Math (c) Kraft
 */

/**
 * algebra operations on vectors (mostly).
 *
 * vectors are assumed to be Javascript Arrays objects /
 * contain the Javascript Array prototype, as these methods depend
 * on the use of "map", "reduce" and other Array functions.
 *
 * ({x: y:} vectors as Javascript Objects will not work)
 *
 * many of these operations can handle vectors of arbitrary dimension
 * in which case there are two vectors as input, it will be noted that
 * "dimensions match first parameter", you should verify that the second
 * parameter is at least as long as the first (okay if it is longer)
 *
 * when a function name ends with a number (magnitude2) the input vector's
 * dimension is assumed to be this number.
 */

/**
 * @description compute the magnitude an n-dimensional vector
 * @param {number[]} v one vector, n-dimensions
 * @returns {number} one scalar
 * @linkcode Math ./src/algebra/vectors.js 32
 */
const magnitude = v => Math.sqrt(v
	.map(fnSquare)
	.reduce(fnAdd, 0));
/**
 * @description compute the magnitude a 2D vector
 * @param {number[]} v one 2D vector
 * @returns {number} one scalar
 * @linkcode Math ./src/algebra/vectors.js 41
 */
const magnitude2 = v => Math.sqrt(v[0] * v[0] + v[1] * v[1]);
/**
 * @description compute the square-magnitude an n-dimensional vector
 * @param {number[]} v one vector, n-dimensions
 * @returns {number} one scalar
 * @linkcode Math ./src/algebra/vectors.js 48
 */
const magSquared = v => v
	.map(fnSquare)
	.reduce(fnAdd, 0);
/**
 * @description normalize the input vector and return a new vector as a copy
 * @param {number[]} v one vector, n-dimensions
 * @returns {number[]} one vector, dimension matching the input vector
 * @linkcode Math ./src/algebra/vectors.js 57
 */
const normalize = (v) => {
	const m = magnitude(v);
	return m === 0 ? v : v.map(c => c / m);
};
/**
 * @description normalize the input vector and return a new vector as a copy
 * @param {number[]} v one 2D vector
 * @returns {number[]} one 2D vector
 * @linkcode Math ./src/algebra/vectors.js 67
 */
const normalize2 = (v) => {
	const m = magnitude2(v);
	return m === 0 ? v : [v[0] / m, v[1] / m];
};
/**
 * @description scale an input vector by one number, return a copy.
 * @param {number[]} v one vector, n-dimensions
 * @param {number} s one scalar
 * @returns {number[]} one vector
 * @linkcode Math ./src/algebra/vectors.js 78
 */
const scale = (v, s) => v.map(n => n * s);
/**
 * @description scale an input vector by one number, return a copy.
 * @param {number[]} v one 2D vector
 * @param {number} s one scalar
 * @returns {number[]} one 2D vector
 * @linkcode Math ./src/algebra/vectors.js 86
 */
const scale2 = (v, s) => [v[0] * s, v[1] * s];
/**
 * @description add two vectors and return the sum as another vector,
 * do not modify the input vectors.
 * @param {number[]} v one vector, n-dimensions
 * @param {number[]} u one vector, n-dimensions
 * @returns {number[]} one vector, dimension matching first parameter
 * @linkcode Math ./src/algebra/vectors.js 95
 */
const add = (v, u) => v.map((n, i) => n + (u[i] || 0));
/**
 * @description add two vectors and return the sum as another vector,
 * do not modify the input vectors.
 * @param {number[]} v one 2D vector
 * @param {number[]} u one 2D vector
 * @returns {number[]} one 2D vector
 * @linkcode Math ./src/algebra/vectors.js 104
 */
const add2 = (v, u) => [v[0] + u[0], v[1] + u[1]];
/**
 * @description subtract the second vector from the first, return the result as a copy.
 * @param {number[]} v one vector, n-dimensions
 * @param {number[]} u one vector, n-dimensions
 * @returns {number[]} one vector, dimension matching first parameter
 * @linkcode Math ./src/algebra/vectors.js 112
 */
const subtract = (v, u) => v.map((n, i) => n - (u[i] || 0));
/**
 * @description subtract the second vector from the first, return the result as a copy.
 * @param {number[]} v one 2D vector
 * @param {number[]} u one 2D vector
 * @returns {number[]} one 2D vector
 * @linkcode Math ./src/algebra/vectors.js 120
 */
const subtract2 = (v, u) => [v[0] - u[0], v[1] - u[1]];
/**
 * @description compute the dot product of two vectors.
 * @param {number[]} v one vector, n-dimensions
 * @param {number[]} u one vector, n-dimensions
 * @returns {number} one scalar
 * @linkcode Math ./src/algebra/vectors.js 128
 */
const dot = (v, u) => v
	.map((_, i) => v[i] * u[i])
	.reduce(fnAdd, 0);
/**
 * @description compute the dot product of two 2D vectors.
 * @param {number[]} v one 2D vector
 * @param {number[]} u one 2D vector
 * @returns {number} one scalar
 * @linkcode Math ./src/algebra/vectors.js 138
 */
const dot2 = (v, u) => v[0] * u[0] + v[1] * u[1];
/**
 * @description compute the midpoint of two vectors.
 * @param {number[]} v one vector, n-dimensions
 * @param {number[]} u one vector, n-dimensions
 * @returns {number} one vector, dimension matching first parameter
 * @linkcode Math ./src/algebra/vectors.js 146
 */
const midpoint = (v, u) => v.map((n, i) => (n + u[i]) / 2);
/**
 * @description compute the midpoint of two 2D vectors.
 * @param {number[]} v one 2D vector
 * @param {number[]} u one 2D vector
 * @returns {number} one 2D vector
 * @linkcode Math ./src/algebra/vectors.js 154
 */
const midpoint2 = (v, u) => scale2(add2(v, u), 0.5);
/**
 * @description the average of N number of vectors, similar to midpoint,
 * but can accept more than 2 inputs
 * @param {number[]} ...args any number of input vectors
 * @returns {number[]} one vector, dimension matching first parameter
 * @linkcode Math ./src/algebra/vectors.js 162
 */
const average = function () {
	if (arguments.length === 0) { return []; }
	const dimension = (arguments[0].length > 0) ? arguments[0].length : 0;
	const sum = Array(dimension).fill(0);
	Array.from(arguments)
		.forEach(vec => sum.forEach((_, i) => { sum[i] += vec[i] || 0; }));
	return sum.map(n => n / arguments.length);
};
/**
 * @description linear interpolate between two vectors
 * @param {number[]} v one vector, n-dimensions
 * @param {number[]} u one vector, n-dimensions
 * @param {number} t one scalar between 0 and 1 (not clamped)
 * @returns {number[]} one vector, dimensions matching first parameter
 * @linkcode Math ./src/algebra/vectors.js 178
 */
const lerp = (v, u, t) => {
	const inv = 1.0 - t;
	return v.map((n, i) => n * inv + (u[i] || 0) * t);
};
/**
 * @description the determinant of the matrix of the 2 vectors
 * (possible bad name, 2D cross product is undefined)
 * @param {number[]} v one 2D vector
 * @param {number[]} u one 2D vector
 * @returns {number} one scalar; the determinant; the magnitude of the vector
 * @linkcode Math ./src/algebra/vectors.js 190
 */
const cross2 = (v, u) => v[0] * u[1] - v[1] * u[0];
/**
 * @description the 3D cross product of two 3D vectors
 * @param {number[]} v one 3D vector
 * @param {number[]} u one 3D vector
 * @returns {number[]} one 3D vector
 * @linkcode Math ./src/algebra/vectors.js 198
 */
const cross3 = (v, u) => [
	v[1] * u[2] - v[2] * u[1],
	v[2] * u[0] - v[0] * u[2],
	v[0] * u[1] - v[1] * u[0],
];
/**
 * @description compute the distance between two vectors
 * @param {number[]} v one vector, n-dimensions
 * @param {number[]} u one vector, n-dimensions
 * @returns {number} one scalar
 * @linkcode Math ./src/algebra/vectors.js 210
 */
const distance = (v, u) => Math.sqrt(v
	.map((_, i) => (v[i] - u[i]) ** 2)
	.reduce(fnAdd, 0));
/**
 * @description compute the distance between two 2D vectors
 * @param {number[]} v one 2D vector
 * @param {number[]} u one 2D vector
 * @returns {number} one scalar
 * @linkcode Math ./src/algebra/vectors.js 220
 */
const distance2 = (v, u) => {
	const p = v[0] - u[0];
	const q = v[1] - u[1];
	return Math.sqrt((p * p) + (q * q));
};
/**
 * @description compute the distance between two 3D vectors
 * @param {number[]} v one 3D vector
 * @param {number[]} u one 3D vector
 * @returns {number} one scalar
 * @linkcode Math ./src/algebra/vectors.js 232
 */
const distance3 = (v, u) => {
	const a = v[0] - u[0];
	const b = v[1] - u[1];
	const c = v[2] - u[2];
	return Math.sqrt((a * a) + (b * b) + (c * c));
};
/**
 * @description return a copy of the input vector where each element's sign flipped
 * @param {number[]} v one vector, n-dimensions
 * @returns {number[]} one vector, dimensions matching input parameter
 * @linkcode Math ./src/algebra/vectors.js 244
 */
const flip = v => v.map(n => -n);
/**
 * @description return a copy of the input vector rotated 90 degrees counter-clockwise
 * @param {number[]} v one 2D vector
 * @returns {number[]} one 2D vector
 * @linkcode Math ./src/algebra/vectors.js 251
 */
const rotate90 = v => [-v[1], v[0]];
/**
 * @description return a copy of the input vector rotated 270 degrees counter-clockwise
 * @param {number[]} v one 2D vector
 * @returns {number[]} one 2D vector
 * @linkcode Math ./src/algebra/vectors.js 258
 */
const rotate270 = v => [v[1], -v[0]];
/**
 * @description check if a vector is degenerate, meaning its magnitude is below an epsilon limit.
 * @param {number[]} v one vector, n-dimensions
 * @param {number} [epsilon=1e-6] an optional epsilon with a default value of 1e-6
 * @returns {boolean} is the magnitude of the vector smaller than the epsilon?
 * @linkcode Math ./src/algebra/vectors.js 266
 */
const degenerate = (v, epsilon = EPSILON) => v
	.map(n => Math.abs(n))
	.reduce(fnAdd, 0) < epsilon;
/**
 * @description check if two vectors are parallel to each other within an epsilon
 * @param {number[]} v one vector, n-dimensions
 * @param {number[]} u one vector, n-dimensions
 * @param {number} [epsilon=1e-6] an optional epsilon with a default value of 1e-6
 * @returns {boolean} are the two vectors parallel within an epsilon?
 * @linkcode Math ./src/algebra/vectors.js 277
 */
const parallel = (v, u, epsilon = EPSILON) => 1 - Math
	.abs(dot(normalize(v), normalize(u))) < epsilon;
/**
 * @description check if two 2D vectors are parallel to each other within an epsilon
 * @param {number[]} v one 2D vector
 * @param {number[]} u one 2D vector
 * @param {number} [epsilon=1e-6] an optional epsilon with a default value of 1e-6
 * @returns {boolean} are the two vectors parallel within an epsilon?
 * @linkcode Math ./src/algebra/vectors.js 287
 */
const parallel2 = (v, u, epsilon = EPSILON) => Math
	.abs(cross2(v, u)) < epsilon;

var algebra = /*#__PURE__*/Object.freeze({
	__proto__: null,
	magnitude: magnitude,
	magnitude2: magnitude2,
	magSquared: magSquared,
	normalize: normalize,
	normalize2: normalize2,
	scale: scale,
	scale2: scale2,
	add: add,
	add2: add2,
	subtract: subtract,
	subtract2: subtract2,
	dot: dot,
	dot2: dot2,
	midpoint: midpoint,
	midpoint2: midpoint2,
	average: average,
	lerp: lerp,
	cross2: cross2,
	cross3: cross3,
	distance: distance,
	distance2: distance2,
	distance3: distance3,
	flip: flip,
	rotate90: rotate90,
	rotate270: rotate270,
	degenerate: degenerate,
	parallel: parallel,
	parallel2: parallel2
});

/**
 * Math (c) Kraft
 */
/**
 * @description the identity matrix for 3x3 matrices
 * @linkcode Math ./src/algebra/matrix3.js 14
 */
const identity3x3 = Object.freeze([1, 0, 0, 0, 1, 0, 0, 0, 1]);
/**
 * @description the identity matrix for 3x4 matrices (zero translation)
 * @linkcode Math ./src/algebra/matrix3.js 19
 */
const identity3x4 = Object.freeze(identity3x3.concat(0, 0, 0));
/**
 * @description test if a 3x4 matrix is the identity matrix within an epsilon
 * @param {number[]} matrix a 3x4 matrix
 * @returns {boolean} true if the matrix is the identity matrix
 * @linkcode Math ./src/algebra/matrix3.js 26
 */
const isIdentity3x4 = m => identity3x4
	.map((n, i) => Math.abs(n - m[i]) < EPSILON)
	.reduce((a, b) => a && b, true);
/**
 * @description multiply one 3D vector by a 3x4 matrix
 * @param {number[]} matrix one matrix in array form
 * @param {number[]} vector in array form
 * @returns {number[]} the transformed vector
 * @linkcode Math ./src/algebra/matrix3.js 36
 */
const multiplyMatrix3Vector3 = (m, vector) => [
	m[0] * vector[0] + m[3] * vector[1] + m[6] * vector[2] + m[9],
	m[1] * vector[0] + m[4] * vector[1] + m[7] * vector[2] + m[10],
	m[2] * vector[0] + m[5] * vector[1] + m[8] * vector[2] + m[11],
];
/**
 * @description multiply one 3D line by a 3x4 matrix
 * @param {number[]} matrix one matrix in array form
 * @param {number[]} vector the vector of the line
 * @param {number[]} origin the origin of the line
 * @returns {object} transformed line in point-vector form
 * @linkcode Math ./src/algebra/matrix3.js 49
 */
const multiplyMatrix3Line3 = (m, vector, origin) => ({
	vector: [
		m[0] * vector[0] + m[3] * vector[1] + m[6] * vector[2],
		m[1] * vector[0] + m[4] * vector[1] + m[7] * vector[2],
		m[2] * vector[0] + m[5] * vector[1] + m[8] * vector[2],
	],
	origin: [
		m[0] * origin[0] + m[3] * origin[1] + m[6] * origin[2] + m[9],
		m[1] * origin[0] + m[4] * origin[1] + m[7] * origin[2] + m[10],
		m[2] * origin[0] + m[5] * origin[1] + m[8] * origin[2] + m[11],
	],
});
/**
 * @description multiply two 3x4 matrices together
 * @param {number[]} matrix the first matrix
 * @param {number[]} matrix the second matrix
 * @returns {number[]} one matrix, the product of the two
 * @linkcode Math ./src/algebra/matrix3.js 68
 */
const multiplyMatrices3 = (m1, m2) => [
	m1[0] * m2[0] + m1[3] * m2[1] + m1[6] * m2[2],
	m1[1] * m2[0] + m1[4] * m2[1] + m1[7] * m2[2],
	m1[2] * m2[0] + m1[5] * m2[1] + m1[8] * m2[2],
	m1[0] * m2[3] + m1[3] * m2[4] + m1[6] * m2[5],
	m1[1] * m2[3] + m1[4] * m2[4] + m1[7] * m2[5],
	m1[2] * m2[3] + m1[5] * m2[4] + m1[8] * m2[5],
	m1[0] * m2[6] + m1[3] * m2[7] + m1[6] * m2[8],
	m1[1] * m2[6] + m1[4] * m2[7] + m1[7] * m2[8],
	m1[2] * m2[6] + m1[5] * m2[7] + m1[8] * m2[8],
	m1[0] * m2[9] + m1[3] * m2[10] + m1[6] * m2[11] + m1[9],
	m1[1] * m2[9] + m1[4] * m2[10] + m1[7] * m2[11] + m1[10],
	m1[2] * m2[9] + m1[5] * m2[10] + m1[8] * m2[11] + m1[11],
];
/**
 * @description calculate the determinant of a 3x4 or 3x3 matrix.
 * in the case of 3x4, the translation component is ignored.
 * @param {number[]} matrix one matrix in array form
 * @returns {number} the determinant of the matrix
 * @linkcode Math ./src/algebra/matrix3.js 89
 */
const determinant3 = m => (
	m[0] * m[4] * m[8]
	- m[0] * m[7] * m[5]
	- m[3] * m[1] * m[8]
	+ m[3] * m[7] * m[2]
	+ m[6] * m[1] * m[5]
	- m[6] * m[4] * m[2]
);
/**
 * @description invert a 3x4 matrix
 * @param {number[]} matrix one matrix in array form
 * @returns {number[]|undefined} the inverted matrix, or undefined if not possible
 * @linkcode Math ./src/algebra/matrix3.js 103
 */
const invertMatrix3 = (m) => {
	const det = determinant3(m);
	if (Math.abs(det) < 1e-6 || Number.isNaN(det)
		|| !Number.isFinite(m[9]) || !Number.isFinite(m[10]) || !Number.isFinite(m[11])) {
		return undefined;
	}
	const inv = [
		m[4] * m[8] - m[7] * m[5],
		-m[1] * m[8] + m[7] * m[2],
		m[1] * m[5] - m[4] * m[2],
		-m[3] * m[8] + m[6] * m[5],
		m[0] * m[8] - m[6] * m[2],
		-m[0] * m[5] + m[3] * m[2],
		m[3] * m[7] - m[6] * m[4],
		-m[0] * m[7] + m[6] * m[1],
		m[0] * m[4] - m[3] * m[1],
		-m[3] * m[7] * m[11] + m[3] * m[8] * m[10] + m[6] * m[4] * m[11]
			- m[6] * m[5] * m[10] - m[9] * m[4] * m[8] + m[9] * m[5] * m[7],
		m[0] * m[7] * m[11] - m[0] * m[8] * m[10] - m[6] * m[1] * m[11]
			+ m[6] * m[2] * m[10] + m[9] * m[1] * m[8] - m[9] * m[2] * m[7],
		-m[0] * m[4] * m[11] + m[0] * m[5] * m[10] + m[3] * m[1] * m[11]
			- m[3] * m[2] * m[10] - m[9] * m[1] * m[5] + m[9] * m[2] * m[4],
	];
	const invDet = 1.0 / det;
	return inv.map(n => n * invDet);
};
/**
 * @description make a 3x4 matrix representing a translation in 3D
 * @param {number} [x=0] the x component of the translation
 * @param {number} [y=0] the y component of the translation
 * @param {number} [z=0] the z component of the translation
 * @returns {number[]} one 3x4 matrix
 * @linkcode Math ./src/algebra/matrix3.js 137
 */
const makeMatrix3Translate = (x = 0, y = 0, z = 0) => identity3x3.concat(x, y, z);

// i0 and i1 direct which columns and rows are filled
// sgn manages right hand rule
const singleAxisRotate = (angle, origin, i0, i1, sgn) => {
	const mat = identity3x3.concat([0, 1, 2].map(i => origin[i] || 0));
	const cos = Math.cos(angle);
	const sin = Math.sin(angle);
	mat[i0 * 3 + i0] = cos;
	mat[i0 * 3 + i1] = (sgn ? +1 : -1) * sin;
	mat[i1 * 3 + i0] = (sgn ? -1 : +1) * sin;
	mat[i1 * 3 + i1] = cos;
	return mat;
};

/**
 * @description make a 3x4 matrix representing a rotation in 3D around the x-axis
 * (allowing you to specify the center of rotation if needed).
 * @param {number} angle the angle of rotation in radians
 * @param {number[]} [origin=[0,0,0]] the center of rotation
 * @returns {number[]} one 3x4 matrix
 * @linkcode Math ./src/algebra/matrix3.js 160
 */
const makeMatrix3RotateX = (angle, origin = [0, 0, 0]) => (
	singleAxisRotate(angle, origin, 1, 2, true));
/**
 * @description make a 3x4 matrix representing a rotation in 3D around the y-axis
 * (allowing you to specify the center of rotation if needed).
 * @param {number} angle the angle of rotation in radians
 * @param {number[]} [origin=[0,0,0]] the center of rotation
 * @returns {number[]} one 3x4 matrix
 * @linkcode Math ./src/algebra/matrix3.js 170
 */
const makeMatrix3RotateY = (angle, origin = [0, 0, 0]) => (
	singleAxisRotate(angle, origin, 0, 2, false));
/**
 * @description make a 3x4 matrix representing a rotation in 3D around the z-axis
 * (allowing you to specify the center of rotation if needed).
 * @param {number} angle the angle of rotation in radians
 * @param {number[]} [origin=[0,0,0]] the center of rotation
 * @returns {number[]} one 3x4 matrix
 * @linkcode Math ./src/algebra/matrix3.js 180
 */
const makeMatrix3RotateZ = (angle, origin = [0, 0, 0]) => (
	singleAxisRotate(angle, origin, 0, 1, true));
/**
 * @description make a 3x4 matrix representing a rotation in 3D
 * around a given vector and around a given center of rotation.
 * @param {number} angle the angle of rotation in radians
 * @param {number[]} [vector=[0,0,1]] the axis of rotation
 * @param {number[]} [origin=[0,0,0]] the center of rotation
 * @returns {number[]} one 3x4 matrix
 * @linkcode Math ./src/algebra/matrix3.js 191
 */
const makeMatrix3Rotate = (angle, vector = [0, 0, 1], origin = [0, 0, 0]) => {
	const pos = [0, 1, 2].map(i => origin[i] || 0);
	const [x, y, z] = resize(3, normalize(vector));
	const c = Math.cos(angle);
	const s = Math.sin(angle);
	const t = 1 - c;
	const trans = identity3x3.concat(-pos[0], -pos[1], -pos[2]);
	const trans_inv = identity3x3.concat(pos[0], pos[1], pos[2]);
	return multiplyMatrices3(trans_inv, multiplyMatrices3([
		t * x * x + c,     t * y * x + z * s, t * z * x - y * s,
		t * x * y - z * s, t * y * y + c,     t * z * y + x * s,
		t * x * z + y * s, t * y * z - x * s, t * z * z + c,
		0, 0, 0], trans));
};
// leave this in for legacy, testing. eventually this can be removed.
// const makeMatrix3RotateOld = (angle, vector = [0, 0, 1], origin = [0, 0, 0]) => {
// 	// normalize inputs
// 	const vec = resize(3, normalize(vector));
// 	const pos = [0, 1, 2].map(i => origin[i] || 0);
// 	const [a, b, c] = vec;
// 	const cos = Math.cos(angle);
// 	const sin = Math.sin(angle);
// 	const d = Math.sqrt((vec[1] * vec[1]) + (vec[2] * vec[2]));
// 	const b_d = Math.abs(d) < 1e-6 ? 0 : b / d;
// 	const c_d = Math.abs(d) < 1e-6 ? 1 : c / d;
// 	const t     = identity3x3.concat(-pos[0], -pos[1], -pos[2]);
// 	const t_inv = identity3x3.concat(pos[0], pos[1], pos[2]);
// 	const rx     = [1, 0, 0, 0, c_d, b_d, 0, -b_d, c_d, 0, 0, 0];
// 	const rx_inv = [1, 0, 0, 0, c_d, -b_d, 0, b_d, c_d, 0, 0, 0];
// 	const ry     = [d, 0, a, 0, 1, 0, -a, 0, d, 0, 0, 0];
// 	const ry_inv = [d, 0, -a, 0, 1, 0, a, 0, d, 0, 0, 0];
// 	const rz     = [cos, sin, 0, -sin, cos, 0, 0, 0, 1, 0, 0, 0];
// 	return multiplyMatrices3(t_inv,
// 		multiplyMatrices3(rx_inv,
// 			multiplyMatrices3(ry_inv,
// 				multiplyMatrices3(rz,
// 					multiplyMatrices3(ry,
// 						multiplyMatrices3(rx, t))))));
// };
/**
 * @description make a 3x4 matrix representing a uniform scale.
 * @param {number} [scale=1] the uniform scale value
 * @param {number[]} [origin=[0,0,0]] the center of transformation
 * @returns {number[]} one 3x4 matrix
 * @linkcode Math ./src/algebra/matrix3.js 237
 */
const makeMatrix3Scale = (scale = 1, origin = [0, 0, 0]) => [
	scale,
	0,
	0,
	0,
	scale,
	0,
	0,
	0,
	scale,
	scale * -origin[0] + origin[0],
	scale * -origin[1] + origin[1],
	scale * -origin[2] + origin[2],
];
/**
 * @description make a 3x4 representing a reflection across a line in the XY plane
 * This is a 2D operation, assumes everything is in the XY plane.
 * @param {number[]} vector one 2D vector specifying the reflection axis
 * @param {number[]} [origin=[0,0]] 2D origin specifying a point of reflection
 * @returns {number[]} one 3x4 matrix
 * @linkcode Math ./src/algebra/matrix3.js 259
 */
const makeMatrix3ReflectZ = (vector, origin = [0, 0]) => {
	// the line of reflection passes through origin, runs along vector
	const angle = Math.atan2(vector[1], vector[0]);
	const cosAngle = Math.cos(angle);
	const sinAngle = Math.sin(angle);
	const cos_Angle = Math.cos(-angle);
	const sin_Angle = Math.sin(-angle);
	const a = cosAngle * cos_Angle + sinAngle * sin_Angle;
	const b = cosAngle * -sin_Angle + sinAngle * cos_Angle;
	const c = sinAngle * cos_Angle + -cosAngle * sin_Angle;
	const d = sinAngle * -sin_Angle + -cosAngle * cos_Angle;
	const tx = origin[0] + a * -origin[0] + -origin[1] * c;
	const ty = origin[1] + b * -origin[0] + -origin[1] * d;
	return [a, b, 0, c, d, 0, 0, 0, 1, tx, ty, 0];
};

/**
 * 2D operation, assuming everything is 0 in the z plane
 * @param line in vector-origin form
 * @returns matrix3
 */
// export const make_matrix3_reflect = (vector, origin = [0, 0, 0]) => {
//   // the line of reflection passes through origin, runs along vector
//   return [];
// };

//               __                                           _
//   _________  / /_  ______ ___  ____     ____ ___  ____ _  (_)___  _____
//  / ___/ __ \/ / / / / __ `__ \/ __ \   / __ `__ \/ __ `/ / / __ \/ ___/
// / /__/ /_/ / / /_/ / / / / / / / / /  / / / / / / /_/ / / / /_/ / /
// \___/\____/_/\__,_/_/ /_/ /_/_/ /_/  /_/ /_/ /_/\__,_/_/ /\____/_/
//                                                     /___/

var matrix3 = /*#__PURE__*/Object.freeze({
	__proto__: null,
	identity3x3: identity3x3,
	identity3x4: identity3x4,
	isIdentity3x4: isIdentity3x4,
	multiplyMatrix3Vector3: multiplyMatrix3Vector3,
	multiplyMatrix3Line3: multiplyMatrix3Line3,
	multiplyMatrices3: multiplyMatrices3,
	determinant3: determinant3,
	invertMatrix3: invertMatrix3,
	makeMatrix3Translate: makeMatrix3Translate,
	makeMatrix3RotateX: makeMatrix3RotateX,
	makeMatrix3RotateY: makeMatrix3RotateY,
	makeMatrix3RotateZ: makeMatrix3RotateZ,
	makeMatrix3Rotate: makeMatrix3Rotate,
	makeMatrix3Scale: makeMatrix3Scale,
	makeMatrix3ReflectZ: makeMatrix3ReflectZ
});

/**
 * Math (c) Kraft
 */
/**
 * @returns {object} in form { point:[], vector:[] }
*/
const vectorOriginForm = (vector, origin) => ({
	vector: vector || [],
	origin: origin || [],
});
/**
 * search function arguments for a valid n-dimensional vector
 * can handle object-vector representation {x:, y:}
 *
 * @returns {number[]} vector in array form, or empty array for bad inputs
*/
const getVector = function () {
	// todo, incorporate constructors.vector check to all indices. and below
	if (arguments[0] instanceof Constructors.vector) { return arguments[0]; }
	let list = flattenArrays(arguments); // .filter(fnNotUndefined);
	if (list.length > 0
		&& typeof list[0] === "object"
		&& list[0] !== null
		&& !Number.isNaN(list[0].x)) {
		list = ["x", "y", "z"]
			.map(c => list[0][c])
			.filter(fnNotUndefined);
	}
	return list.filter(n => typeof n === "number");
};

/**
 * search function arguments for a an array of vectors. a vector of vectors
 * can handle object-vector representation {x:, y:}
 *
 * @returns {number[]} vector in array form, or empty array for bad inputs
*/
const getVectorOfVectors = function () {
	return semiFlattenArrays(arguments)
		.map(el => getVector(el));
};

/**
 * @returns {number[]} segment in array form [[a1, a2], [b1, b2]]
*/
const getSegment = function () {
	if (arguments[0] instanceof Constructors.segment) {
		return arguments[0];
	}
	const args = semiFlattenArrays(arguments);
	if (args.length === 4) {
		return [
			[args[0], args[1]],
			[args[2], args[3]],
		];
	}
	return args.map(el => getVector(el));
};

// this works for rays to interchangably except for that it will not
// typecast a line into a ray, it will stay a ray type.
const getLine = function () {
	const args = semiFlattenArrays(arguments);
	if (args.length === 0) { return vectorOriginForm([], []); }
	if (args[0] instanceof Constructors.line
		|| args[0] instanceof Constructors.ray
		|| args[0] instanceof Constructors.segment) { return args[0]; }
	if (args[0].constructor === Object && args[0].vector !== undefined) {
		return vectorOriginForm(args[0].vector || [], args[0].origin || []);
	}
	return typeof args[0] === "number"
		? vectorOriginForm(getVector(args))
		: vectorOriginForm(...args.map(a => getVector(a)));
};

const getRay = getLine;

const getRectParams = (x = 0, y = 0, width = 0, height = 0) => ({
	x, y, width, height,
});

const getRect = function () {
	if (arguments[0] instanceof Constructors.rect) { return arguments[0]; }
	const list = flattenArrays(arguments); // .filter(fnNotUndefined);
	if (list.length > 0
		&& typeof list[0] === "object"
		&& list[0] !== null
		&& !Number.isNaN(list[0].width)) {
		return getRectParams(...["x", "y", "width", "height"]
			.map(c => list[0][c])
			.filter(fnNotUndefined));
	}
	const numbers = list.filter(n => typeof n === "number");
	const rectParams = numbers.length < 4
		? [, , ...numbers]
		: numbers;
	return getRectParams(...rectParams);
};

/**
 * radius is the first parameter so that the origin can be N-dimensional
 * ...args is a list of numbers that become the origin.
 */
const getCircleParams = (radius = 1, ...args) => ({
	radius,
	origin: [...args],
});

const getCircle = function () {
	if (arguments[0] instanceof Constructors.circle) { return arguments[0]; }
	const vectors = getVectorOfVectors(arguments);
	const numbers = flattenArrays(arguments).filter(a => typeof a === "number");
	if (arguments.length === 2) {
		if (vectors[1].length === 1) {
			return getCircleParams(vectors[1][0], ...vectors[0]);
		}
		if (vectors[0].length === 1) {
			return getCircleParams(vectors[0][0], ...vectors[1]);
		}
		if (vectors[0].length > 1 && vectors[1].length > 1) {
			return getCircleParams(distance2(...vectors), ...vectors[0]);
		}
	} else {
		switch (numbers.length) {
		case 0: return getCircleParams(1, 0, 0, 0);
		case 1: return getCircleParams(numbers[0], 0, 0, 0);
		default: return getCircleParams(numbers.pop(), ...numbers);
		}
	}
	return getCircleParams(1, 0, 0, 0);
};

const maps3x4 = [
	[0, 1, 3, 4, 9, 10],
	[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
	[0, 1, 2, undefined, 3, 4, 5, undefined, 6, 7, 8, undefined, 9, 10, 11],
];
[11, 7, 3].forEach(i => delete maps3x4[2][i]);

const matrixMap3x4 = len => {
	let i;
	if (len < 8) i = 0;
	else if (len < 13) i = 1;
	else i = 2;
	return maps3x4[i];
};

/**
 * a matrix3 is a 4x3 matrix, 3x3 orientation with a column for translation
 *
 * @returns {number[]} array of 12 numbers, or undefined if bad inputs
*/
const getMatrix3x4 = function () {
	const mat = flattenArrays(arguments);
	const matrix = [...identity3x4];
	matrixMap3x4(mat.length)
		// .filter((_, i) => mat[i] != null)
		.forEach((n, i) => { if (mat[i] != null) { matrix[n] = mat[i]; } });
	return matrix;
};

/**
 * a matrix2 is a 2x3 matrix, 2x2 with a column to represent translation
 *
 * @returns {number[]} array of 6 numbers, or undefined if bad inputs
*/
// export const get_matrix2 = function () {
//   const m = getVector(arguments);
//   if (m.length === 6) { return m; }
//   if (m.length > 6) { return [m[0], m[1], m[2], m[3], m[4], m[5]]; }
//   if (m.length < 6) {
//     return identity2x3.map((n, i) => m[i] || n);
//   }
// };

var getters = /*#__PURE__*/Object.freeze({
	__proto__: null,
	getVector: getVector,
	getVectorOfVectors: getVectorOfVectors,
	getSegment: getSegment,
	getLine: getLine,
	getRay: getRay,
	getRectParams: getRectParams,
	getRect: getRect,
	getCircle: getCircle,
	getMatrix3x4: getMatrix3x4
});

/**
 * Math (c) Kraft
 */
/**
 * @notes in Robert Lang's U-D parameterization definition, U is defined
 * to be any vector made from an angle constrained between [0...180), meaning
 * the y component will never be negative.
 * The D component is allowed to be any number between -Infinity...Infinity
 *
 * The constraint on the normal-angle causes issues when converting back
 * and forth between vector-origin and UD parameterization. Lang's intention
 * is that lines do not have a directionality, whereas this library does,
 * (see: Axiom folding, which face to fold is decided by the line's vector).
 *
 * Therefore, this library modifies the paramterization slightly to allow
 * unconstrained normals, where the angle can be anywhere [0...360).
 * The cost is when testing equality, the normal and its flip must be checked,
 * or, U normals can be flipped (and the sign of D flipped) ahead of time.
 *  return d < 0
 *    ? { u: scale(u, -1/mag), d: -d }
 *    : { u: scale(u, 1/mag), d };
 */

/**
 * @description convert a line from one parameterization into another.
 * convert vector-origin into u-d (normal, distance-to-origin)
 * @linkcode Math ./src/types/parameterize.js 34
 */
// export const vectorOriginToUD = ({ vector, origin }) => {
// export const makeNormalDistanceLine = ({ vector, origin }) => {
const rayLineToUniqueLine = ({ vector, origin }) => {
	const mag = magnitude(vector);
	const normal = rotate90(vector);
	const distance = dot(origin, normal) / mag;
	return { normal: scale(normal, 1 / mag), distance };
};
/**
 * @description convert a line from one parameterization into another.
 * convert u-d (normal, distance-to-origin) into vector-origin
 * @linkcode Math ./src/types/parameterize.js 47
 */
// export const UDToVectorOrigin = ({ u, d }) => ({
// export const makeVectorOriginLine = ({ normal, distance }) => ({
const uniqueLineToRayLine = ({ normal, distance }) => ({
	vector: rotate270(normal),
	origin: scale(normal, distance),
});

var parameterize = /*#__PURE__*/Object.freeze({
	__proto__: null,
	rayLineToUniqueLine: rayLineToUniqueLine,
	uniqueLineToRayLine: uniqueLineToRayLine
});

/**
 * Math (c) Kraft
 */
/**
 * @description find the one item in the set which minimizes the
 * function when compared against another object provided in the arguments.
 * @param {any} obj the single item to test against the set
 * @param {any[]} array the set of items to test against
 * @param {function} compare_func a function which takes two items (which match
 * the type of the first parameter), execution of this function should return a scalar.
 * @returns {number[]} the index from the set which minimizes the compare function
 * @linkcode Math ./src/algebra/nearest.js 28
 */
const smallestComparisonSearch = (obj, array, compare_func) => {
	const objs = array.map((o, i) => ({ o, i, d: compare_func(obj, o) }));
	let index;
	let smallest_value = Infinity;
	for (let i = 0; i < objs.length; i += 1) {
		if (objs[i].d < smallest_value) {
			index = i;
			smallest_value = objs[i].d;
		}
	}
	return index;
};
/**
 * @description Find the indices from an array of vectors which all have
 * the smallest value within an epsilon.
 * @param {number[][]} vectors array of vectors
 * @returns {number[]} array of indices which all have the lowest X value.
 * @linkcode Math ./src/algebra/nearest.js 47
 */
const minimumXIndices = (vectors, compFn = fnEpsilonSort, epsilon = EPSILON) => {
	// find the set of all vectors that share the smallest X value within an epsilon
	let smallSet = [0];
	for (let i = 1; i < vectors.length; i += 1) {
		switch (compFn(vectors[i][0], vectors[smallSet[0]][0], epsilon)) {
		case 0: smallSet.push(i); break;
		case 1: smallSet = [i]; break;
		}
	}
	return smallSet;
};
/**
 * @description Get the index of the point in an array considered the absolute minimum.
 * First check the X values, and in the case of multiple minimums, check the Y values.
 * @param {number[][]} points array of points
 * @param {number} [epsilon=1e-6] an optional epsilon
 * @returns {number} the index of the point in the array with the smallest component values
 * @linkcode Math ./src/algebra/nearest.js 67
 */
const minimum2DPointIndex = (points, epsilon = EPSILON) => {
	// find the set of all points that share the smallest X value
	const smallSet = minimumXIndices(points, fnEpsilonSort, epsilon);
	// from this set, find the point with the smallest Y value
	let sm = 0;
	for (let i = 1; i < smallSet.length; i += 1) {
		if (points[smallSet[i]][1] < points[smallSet[sm]][1]) { sm = i; }
	}
	return smallSet[sm];
};

/**
 * @description find the one point in an array of 2D points closest to a 2D point.
 * @param {number[]} point the 2D point to test nearness to
 * @param {number[][]} array_of_points an array of 2D points to test against
 * @returns {number[]} one point from the array of points
 * @linkcode Math ./src/algebra/nearest.js 85
 */
const nearestPoint2 = (point, array_of_points) => {
	// todo speed up with partitioning
	const index = smallestComparisonSearch(point, array_of_points, distance2);
	return index === undefined ? undefined : array_of_points[index];
};
/**
 * @description find the one point in an array of points closest to a point.
 * @param {number[]} point the point to test nearness to
 * @param {number[][]} array_of_points an array of points to test against
 * @returns {number[]} one point from the array of points
 * @linkcode Math ./src/algebra/nearest.js 97
 */
const nearestPoint = (point, array_of_points) => {
	// todo speed up with partitioning
	const index = smallestComparisonSearch(point, array_of_points, distance);
	return index === undefined ? undefined : array_of_points[index];
};
/**
 * @description find the nearest point on a line, ray, or segment.
 * @param {number[]} vector the vector of the line
 * @param {number[]} origin a point that the line passes through
 * @param {number[]} point the point to test nearness to
 * @param {function} limiterFunc a clamp function to bound a calculation between 0 and 1
 * for segments, greater than 0 for rays, or unbounded for lines.
 * @param {number} [epsilon=1e-6] an optional epsilon
 * @returns {number[]} a point
 * @linkcode Math ./src/algebra/nearest.js 113
 */
const nearestPointOnLine = (vector, origin, point, limiterFunc, epsilon = EPSILON) => {
	origin = resize(vector.length, origin);
	point = resize(vector.length, point);
	const magSq = magSquared(vector);
	const vectorToPoint = subtract(point, origin);
	const dotProd = dot(vector, vectorToPoint);
	const dist = dotProd / magSq;
	// limit depending on line, ray, segment
	const d = limiterFunc(dist, epsilon);
	return add(origin, scale(vector, d));
};
/**
 * @description given a polygon and a point, in 2D, find a point on the boundary of the polygon
 * that is closest to the provided point.
 * @param {number[][]} polygon an array of points (which are arrays of numbers)
 * @param {number[]} point the point to test nearness to
 * @returns {number[]} a point
 * @linkcode Math ./src/algebra/nearest.js 132
 */
const nearestPointOnPolygon = (polygon, point) => {
	const v = polygon
		.map((p, i, arr) => subtract(arr[(i + 1) % arr.length], p));
	return polygon
		.map((p, i) => nearestPointOnLine(v[i], p, point, segmentLimiter))
		.map((p, i) => ({ point: p, i, distance: distance(p, point) }))
		.sort((a, b) => a.distance - b.distance)
		.shift();
};
/**
 * @description find the nearest point on the boundary of a circle to another point
 * that is closest to the provided point.
 * @param {number} radius the radius of the circle
 * @param {number[]} origin the origin of the circle as an array of numbers.
 * @param {number[]} point the point to test nearness to
 * @returns {number[]} a point
 * @linkcode Math ./src/algebra/nearest.js 150
 */
const nearestPointOnCircle = (radius, origin, point) => (
	add(origin, scale(normalize(subtract(point, origin)), radius)));

// todo
// const nearestPointOnEllipse = () => false;

var nearest = /*#__PURE__*/Object.freeze({
	__proto__: null,
	smallestComparisonSearch: smallestComparisonSearch,
	minimum2DPointIndex: minimum2DPointIndex,
	nearestPoint2: nearestPoint2,
	nearestPoint: nearestPoint,
	nearestPointOnLine: nearestPointOnLine,
	nearestPointOnPolygon: nearestPointOnPolygon,
	nearestPointOnCircle: nearestPointOnCircle
});

/**
 * Math (c) Kraft
 */
/**
 * @description sort an array of 2D points along a 2D vector.
 * @param {number[][]} points array of points (which are arrays of numbers)
 * @param {number[]} vector one 2D vector
 * @returns {number[][]} the same points, sorted.
 * @linkcode Math ./src/algebra/sort.js 18
 */
const sortPointsAlongVector2 = (points, vector) => points
	.map(point => ({ point, d: point[0] * vector[0] + point[1] * vector[1] }))
	.sort((a, b) => a.d - b.d)
	.map(a => a.point);
/**
 * @description given an array of already-sorted values (so that comparisons only
 * need to happen between neighboring items), cluster the numbers which are similar
 * within an epsilon. isolated values still get put in length-1 arrays. (all values returned)
 * and the clusters contain the indices from the param array, not the values.
 * @param {numbers[]} an array of sorted numbers
 * @param {numbers} [epsilon=1e-6] an optional epsilon
 * @returns {numbers[][]} an array of arrays, each inner array containin indices.
 * each inner array represents clusters of values which lie within an epsilon.
 * @linkcode Math ./src/algebra/sort.js 33
 */
const clusterIndicesOfSortedNumbers = (numbers, epsilon = EPSILON) => {
	const clusters = [[0]];
	let clusterIndex = 0;
	for (let i = 1; i < numbers.length; i += 1) {
		// if this scalar fits inside the current cluster
		if (fnEpsilonEqual(numbers[i], numbers[i - 1], epsilon)) {
			clusters[clusterIndex].push(i);
		} else {
			clusterIndex = clusters.length;
			clusters.push([i]);
		}
	}
	return clusters;
};
/**
 * @description radially sort point indices around the lowest-value point, clustering
 * similarly-angled points within an epsilon. Within these clusters, the points are
 * sorted by distance so the nearest point is listed first.
 * @param {number[][]} points an array of points
 * @param {number} [epsilon=1e-6] an optional epsilon
 * @returns {number[][]} this returns indices in clusters.
 * @linkcode Math ./src/algebra/sort.js 56
 */
const radialSortPointIndices = (points = [], epsilon = EPSILON) => {
	const first = minimum2DPointIndex(points, epsilon);
	const angles = points
		.map(p => subtract2(p, points[first]))
		.map(v => normalize2(v))
		.map(vec => dot2([0, 1], vec));
		// .map((p, i) => Math.atan2(unitVecs[i][1], unitVecs[i][0]));
	const rawOrder = angles
		.map((a, i) => ({ a, i }))
		.sort((a, b) => a.a - b.a)
		.map(el => el.i)
		.filter(i => i !== first);
	return [[first]]
		.concat(clusterIndicesOfSortedNumbers(rawOrder.map(i => angles[i]), epsilon)
			.map(arr => arr.map(i => rawOrder[i]))
			.map(cluster => (cluster.length === 1 ? cluster : cluster
				.map(i => ({ i, len: distance2(points[i], points[first]) }))
				.sort((a, b) => a.len - b.len)
				.map(el => el.i))));
};

var sort = /*#__PURE__*/Object.freeze({
	__proto__: null,
	sortPointsAlongVector2: sortPointsAlongVector2,
	clusterIndicesOfSortedNumbers: clusterIndicesOfSortedNumbers,
	radialSortPointIndices: radialSortPointIndices
});

/**
 * Math (c) Kraft
 */
/**
 * @description the identity matrix for 2x2 matrices
 * @linkcode Math ./src/algebra/matrix2.js 6
 */
const identity2x2 = [1, 0, 0, 1];
/**
 * @description the identity matrix for 2x3 matrices (zero translation)
 * @linkcode Math ./src/algebra/matrix2.js 11
 */
const identity2x3 = identity2x2.concat(0, 0);
/**
 * @param {number[]} vector, in array form
 * @param {number[]} matrix, in array form
 * @returns {number[]} vector, the input vector transformed by the matrix
 * @linkcode Math ./src/algebra/matrix2.js 18
 */
const multiplyMatrix2Vector2 = (matrix, vector) => [
	matrix[0] * vector[0] + matrix[2] * vector[1] + matrix[4],
	matrix[1] * vector[0] + matrix[3] * vector[1] + matrix[5],
];
/**
 * @param line in point-vector form, matrix
 * @returns transformed line in point-vector form
 * @linkcode Math ./src/algebra/matrix2.js 27
 */
const multiplyMatrix2Line2 = (matrix, vector, origin) => ({
	vector: [
		matrix[0] * vector[0] + matrix[2] * vector[1],
		matrix[1] * vector[0] + matrix[3] * vector[1],
	],
	origin: [
		matrix[0] * origin[0] + matrix[2] * origin[1] + matrix[4],
		matrix[1] * origin[0] + matrix[3] * origin[1] + matrix[5],
	],
});
/**
 * @param {number[]} matrix, matrix, left/right order matches what you'd see on a page.
 * @returns {number[]} matrix
 * @linkcode Math ./src/algebra/matrix2.js 42
 */
const multiplyMatrices2 = (m1, m2) => [
	m1[0] * m2[0] + m1[2] * m2[1],
	m1[1] * m2[0] + m1[3] * m2[1],
	m1[0] * m2[2] + m1[2] * m2[3],
	m1[1] * m2[2] + m1[3] * m2[3],
	m1[0] * m2[4] + m1[2] * m2[5] + m1[4],
	m1[1] * m2[4] + m1[3] * m2[5] + m1[5],
];
/**
 * @description calculate the determinant of a 2x3 or 2x2 matrix.
 * in the case of 2x3, the translation component is ignored.
 * @param {number[]} matrix one matrix in array form
 * @returns {number} the determinant of the matrix
 * @linkcode Math ./src/algebra/matrix2.js 57
 */
const determinant2 = m => m[0] * m[3] - m[1] * m[2];
/**
 * @description invert a 2x3 matrix
 * @param {number[]} matrix one matrix in array form
 * @returns {number[]|undefined} the inverted matrix, or undefined if not possible
 * @linkcode Math ./src/algebra/matrix2.js 64
 */
const invertMatrix2 = (m) => {
	const det = determinant2(m);
	if (Math.abs(det) < 1e-6
		|| Number.isNaN(det)
		|| !Number.isFinite(m[4])
		|| !Number.isFinite(m[5])) {
		return undefined;
	}
	return [
		m[3] / det,
		-m[1] / det,
		-m[2] / det,
		m[0] / det,
		(m[2] * m[5] - m[3] * m[4]) / det,
		(m[1] * m[4] - m[0] * m[5]) / det,
	];
};
/**
 * @param {number} x, y
 * @returns {number[]} matrix
 * @linkcode Math ./src/algebra/matrix2.js 86
 */
const makeMatrix2Translate = (x = 0, y = 0) => identity2x2.concat(x, y);
/**
 * @param ratio of scale, optional origin homothetic center (0,0 default)
 * @returns {number[]} matrix
 * @linkcode Math ./src/algebra/matrix2.js 92
 */
const makeMatrix2Scale = (x, y, origin = [0, 0]) => [
	x,
	0,
	0,
	y,
	x * -origin[0] + origin[0],
	y * -origin[1] + origin[1],
];
/**
 * @param angle of rotation, origin of transformation
 * @returns {number[]} matrix
 * @linkcode Math ./src/algebra/matrix2.js 105
 */
const makeMatrix2Rotate = (angle, origin = [0, 0]) => {
	const cos = Math.cos(angle);
	const sin = Math.sin(angle);
	return [
		cos,
		sin,
		-sin,
		cos,
		origin[0],
		origin[1],
	];
};
/**
 * remember vector comes before origin. origin comes last, so that it's easy
 * to leave it empty and make a reflection through the origin.
 * @param line in vector-origin form
 * @returns matrix
 * @linkcode Math ./src/algebra/matrix2.js 124
 */
const makeMatrix2Reflect = (vector, origin = [0, 0]) => {
	// the line of reflection passes through origin, runs along vector
	const angle = Math.atan2(vector[1], vector[0]);
	const cosAngle = Math.cos(angle);
	const sinAngle = Math.sin(angle);
	const cos_Angle = Math.cos(-angle);
	const sin_Angle = Math.sin(-angle);
	const a = cosAngle * cos_Angle + sinAngle * sin_Angle;
	const b = cosAngle * -sin_Angle + sinAngle * cos_Angle;
	const c = sinAngle * cos_Angle + -cosAngle * sin_Angle;
	const d = sinAngle * -sin_Angle + -cosAngle * cos_Angle;
	const tx = origin[0] + a * -origin[0] + -origin[1] * c;
	const ty = origin[1] + b * -origin[0] + -origin[1] * d;
	return [a, b, c, d, tx, ty];
};

//               __                                           _
//   _________  / /_  ______ ___  ____     ____ ___  ____ _  (_)___  _____
//  / ___/ __ \/ / / / / __ `__ \/ __ \   / __ `__ \/ __ `/ / / __ \/ ___/
// / /__/ /_/ / / /_/ / / / / / / / / /  / / / / / / /_/ / / / /_/ / /
// \___/\____/_/\__,_/_/ /_/ /_/_/ /_/  /_/ /_/ /_/\__,_/_/ /\____/_/
//                                                     /___/

var matrix2 = /*#__PURE__*/Object.freeze({
	__proto__: null,
	identity2x2: identity2x2,
	identity2x3: identity2x3,
	multiplyMatrix2Vector2: multiplyMatrix2Vector2,
	multiplyMatrix2Line2: multiplyMatrix2Line2,
	multiplyMatrices2: multiplyMatrices2,
	determinant2: determinant2,
	invertMatrix2: invertMatrix2,
	makeMatrix2Translate: makeMatrix2Translate,
	makeMatrix2Scale: makeMatrix2Scale,
	makeMatrix2Rotate: makeMatrix2Rotate,
	makeMatrix2Reflect: makeMatrix2Reflect
});

/**
 * Math (c) Kraft
 */

/**
 * exclusivity and inclusivity are flipped if the winding is flipped
 * these are intended for counter-clockwise winding.
 * eg: [1,0], [0,1], [-1,0], [0,-1]
 */
/**
 * @description tests if a point is inside a convex polygon
 * @param {number[]} point in array form
 * @param {number[][]} polygon in array of array form
 * @param {function} true for positive numbers, in/exclude near zero
 * @returns {boolean} is the point inside the polygon?
 * @linkcode Math ./src/intersection/overlap-polygon-point.js 23
 */
const overlapConvexPolygonPoint = (poly, point, func = exclude, epsilon = EPSILON) => poly
	.map((p, i, arr) => [p, arr[(i + 1) % arr.length]])
	.map(s => cross2(normalize(subtract(s[1], s[0])), subtract(point, s[0])))
	.map(side => func(side, epsilon))
	.map((s, _, arr) => s === arr[0])
	.reduce((prev, curr) => prev && curr, true);

/**
 * Tests whether or not a point is contained inside a polygon.
 * @returns {boolean} whether the point is inside the polygon or not
 * @example
 * var isInside = point_in_poly([0.5, 0.5], polygonPoints)
 *
 * unfortunately this has inconsistencies for when a point lies collinear along
 * an edge of the polygon, depending on the location or direction of the edge in space
 */
//
// really great function and it works for non-convex polygons
// but it has inconsistencies around inclusive and exclusive points
// when the lie along the polygon edge.
// for example, the unit square, point at 0 and at 1 alternate in/exclusive
// keeping it around in case someone can clean it up.
//
// export const point_in_poly = (point, poly) => {
//   // W. Randolph Franklin
//   // https://wrf.ecse.rpi.edu/Research/Short_Notes/pnpoly.html
//   let isInside = false;
//   for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
//     if ((poly[i][1] > point[1]) != (poly[j][1] > point[1])
//       && point[0] < (poly[j][0] - poly[i][0])
//       * (point[1] - poly[i][1]) / (poly[j][1] - poly[i][1])
//       + poly[i][0]) {
//       isInside = !isInside;
//     }
//   }
//   return isInside;
// };

/**
 * Math (c) Kraft
 */

const lineLineParameter = (
	lineVector,
	lineOrigin,
	polyVector,
	polyOrigin,
	polyLineFunc = includeS,
	epsilon = EPSILON,
) => {
	// a normalized determinant gives consistent values across all epsilon ranges
	const det_norm = cross2(normalize(lineVector), normalize(polyVector));
	// lines are parallel
	if (Math.abs(det_norm) < epsilon) { return undefined; }
	const determinant0 = cross2(lineVector, polyVector);
	const determinant1 = -determinant0;
	const a2b = subtract(polyOrigin, lineOrigin);
	const b2a = flip(a2b);
	const t0 = cross2(a2b, polyVector) / determinant0;
	const t1 = cross2(b2a, lineVector) / determinant1;
	if (polyLineFunc(t1, epsilon / magnitude(polyVector))) {
		return t0;
	}
	return undefined;
};

const linePointFromParameter = (vector, origin, t) => add(origin, scale(vector, t));

// get all intersections with polgyon faces using the polyLineFunc:
// - includeS or excludeS
// sort them so we can grab the two most opposite intersections
const getIntersectParameters = (poly, vector, origin, polyLineFunc, epsilon) => poly
	// polygon into array of arrays [vector, origin]
	.map((p, i, arr) => [subtract(arr[(i + 1) % arr.length], p), p])
	.map(side => lineLineParameter(
		vector,
		origin,
		side[0],
		side[1],
		polyLineFunc,
		epsilon,
	))
	.filter(fnNotUndefined)
	.sort((a, b) => a - b);

// we have already done the test that numbers is a valid array
// and the length is >= 2
const getMinMax = (numbers, func, scaled_epsilon) => {
	let a = 0;
	let b = numbers.length - 1;
	while (a < b) {
		if (func(numbers[a + 1] - numbers[a], scaled_epsilon)) { break; }
		a += 1;
	}
	while (b > a) {
		if (func(numbers[b] - numbers[b - 1], scaled_epsilon)) { break; }
		b -= 1;
	}
	if (a >= b) { return undefined; }
	return [numbers[a], numbers[b]];
};
/**
 * @description find the overlap between one line and one convex polygon and
 * clip the line into a segment (two endpoints) or return undefined if no overlap.
 * The input line can be a line, ray, or segment, as determined by "fnLine".
 * @param {number[][]} poly array of points (which are arrays of numbers)
 * @param {number[]} vector the vector of the line
 * @param {number[]} origin the origin of the line
 * @param {function} [fnPoly=include] include or exclude polygon boundary in clip
 * @param {function} [fnLine=includeL] function to determine line/ray/segment,
 * and inclusive or exclusive.
 * @param {number} [epsilon=1e-6] optional epsilon
 * @linkcode Math ./src/geometry/clip-line-polygon.js 92
 */
const clipLineConvexPolygon = (
	poly,
	vector,
	origin,
	fnPoly = include,
	fnLine = includeL,
	epsilon = EPSILON,
) => {
	const numbers = getIntersectParameters(poly, vector, origin, includeS, epsilon);
	if (numbers.length < 2) { return undefined; }
	const scaled_epsilon = (epsilon * 2) / magnitude(vector);
	// ends is now an array, length 2, of the min and max parameter on the line
	// this also verifies the two intersections are not the same point
	const ends = getMinMax(numbers, fnPoly, scaled_epsilon);
	if (ends === undefined) { return undefined; }
	// ends_clip is the intersection between 2 domains, the result
	// and the valid inclusive/exclusive function
	// todo: this line hardcodes the parameterization that segments and rays are cropping
	// their lowest point at 0 and highest (if segment) at 1
	const clip_fn = (t) => {
		if (fnLine(t)) { return t; }
		return t < 0.5 ? 0 : 1;
	};
	const ends_clip = ends.map(clip_fn);
	// if endpoints are the same, exit
	if (Math.abs(ends_clip[0] - ends_clip[1]) < (epsilon * 2) / magnitude(vector)) {
		return undefined;
	}
	// test if the solution is collinear to an edge by getting the segment midpoint
	// then test inclusive or exclusive depending on user parameter
	const mid = linePointFromParameter(vector, origin, (ends_clip[0] + ends_clip[1]) / 2);
	return overlapConvexPolygonPoint(poly, mid, fnPoly, epsilon)
		? ends_clip.map(t => linePointFromParameter(vector, origin, t))
		: undefined;
};

/**
 * Math (c) Kraft
 */
/**
 * @description clip two polygons and return their union. this works for non-convex
 * poylgons, but both polygons must have counter-clockwise winding; will not work
 * even if both are similarly-clockwise. Sutherland-Hodgman algorithm.
 * Implementation is from Rosetta Code, refactored to include an epsilon.
 * @attribution https://rosettacode.org/wiki/Sutherland-Hodgman_polygon_clipping#JavaScript
 * @param {number[][]} polygon1 an array of points, where each point is an array of numbers.
 * @param {number[][]} polygon2 an array of points, where each point is an array of numbers.
 * @param {number} [epsilon=1e-6] an optional epsilon
 * @returns {number[][]} a polygon as an array of points.
 * @linkcode Math ./src/geometry/clip-polygon-polygon.js 15
 */
const clipPolygonPolygon = (polygon1, polygon2, epsilon = EPSILON) => {
	let cp1;
	let cp2;
	let s;
	let e;
	const inside = (p) => (
		(cp2[0] - cp1[0]) * (p[1] - cp1[1])) > ((cp2[1] - cp1[1]) * (p[0] - cp1[0]) + epsilon
	);
	const intersection = () => {
		const dc = [cp1[0] - cp2[0], cp1[1] - cp2[1]];
		const dp = [s[0] - e[0], s[1] - e[1]];
		const n1 = cp1[0] * cp2[1] - cp1[1] * cp2[0];
		const n2 = s[0] * e[1] - s[1] * e[0];
		const n3 = 1.0 / (dc[0] * dp[1] - dc[1] * dp[0]);
		// console.log("intersection res", [(n1*dp[0] - n2*dc[0]) * n3, (n1*dp[1] - n2*dc[1]) * n3]);
		return [(n1 * dp[0] - n2 * dc[0]) * n3, (n1 * dp[1] - n2 * dc[1]) * n3];
	};
	let outputList = polygon1;
	cp1 = polygon2[polygon2.length - 1];
	for (let j in polygon2) {
		cp2 = polygon2[j];
		const inputList = outputList;
		outputList = [];
		s = inputList[inputList.length - 1];
		for (let i in inputList) {
			e = inputList[i];
			if (inside(e)) {
				if (!inside(s)) {
					outputList.push(intersection());
				}
				outputList.push(e);
			} else if (inside(s)) {
				outputList.push(intersection());
			}
			s = e;
		}
		cp1 = cp2;
	}
	return outputList.length === 0 ? undefined : outputList;
};

/**
 * Math (c) Kraft
 */
/**
 * measurements involving vectors and radians
 */
/**
 * @description check if the first parameter is counter-clockwise between A and B.
 * floor and ceiling can be unbounded, this method takes care of 0-2pi wrap around.
 * @param {number} angle angle in radians
 * @param {number} floor angle in radians, lower bound
 * @param {number} ceiling angle in radians, upper bound
 * @returns {boolean} is the angle between floor and ceiling
 * @linkcode Math ./src/geometry/radial.js 38
 */
const isCounterClockwiseBetween = (angle, floor, ceiling) => {
	while (ceiling < floor) { ceiling += TWO_PI; }
	while (angle > floor) { angle -= TWO_PI; }
	while (angle < floor) { angle += TWO_PI; }
	return angle < ceiling;
};
/**
 * @description There are 2 interior angles between 2 vectors (as an angle in radians),
 * A-to-B clockwise, and A-to-B counter-clockwise. Get the clockwise one from A to B.
 * @param {number} a vector as an angle in radians
 * @param {number} b vector as an angle in radians
 * @returns {number} interior angle in radians
 * @linkcode Math ./src/geometry/radial.js 52
 */
const clockwiseAngleRadians = (a, b) => {
	// this is on average 50 to 100 times faster than clockwiseAngle2
	while (a < 0) { a += TWO_PI; }
	while (b < 0) { b += TWO_PI; }
	while (a > TWO_PI) { a -= TWO_PI; }
	while (b > TWO_PI) { b -= TWO_PI; }
	const a_b = a - b;
	return (a_b >= 0)
		? a_b
		: TWO_PI - (b - a);
};
/**
 * @description There are 2 interior angles between 2 vectors (as an angle in radians),
 * A-to-B clockwise, and A-to-B counter-clockwise. Get the counter-clockwise one from A to B.
 * @param {number} a vector as an angle in radians
 * @param {number} b vector as an angle in radians
 * @returns {number} interior angle in radians, counter-clockwise from a to b
 * @linkcode Math ./src/geometry/radial.js 71
 */
const counterClockwiseAngleRadians = (a, b) => {
	// this is on average 50 to 100 times faster than counterClockwiseAngle2
	while (a < 0) { a += TWO_PI; }
	while (b < 0) { b += TWO_PI; }
	while (a > TWO_PI) { a -= TWO_PI; }
	while (b > TWO_PI) { b -= TWO_PI; }
	const b_a = b - a;
	return (b_a >= 0)
		? b_a
		: TWO_PI - (a - b);
};
/**
 * @description There are 2 interior angles between 2 vectors, A-to-B clockwise,
 * and A-to-B counter-clockwise. Get the clockwise one from A to B.
 * @param {number[]} a vector as an array of two numbers
 * @param {number[]} b vector as an array of two numbers
 * @returns {number} interior angle in radians, clockwise from a to b
 * @linkcode Math ./src/geometry/radial.js 90
 */
const clockwiseAngle2 = (a, b) => {
	const dotProduct = b[0] * a[0] + b[1] * a[1];
	const determinant = b[0] * a[1] - b[1] * a[0];
	let angle = Math.atan2(determinant, dotProduct);
	if (angle < 0) { angle += TWO_PI; }
	return angle;
};
/**
 * @description There are 2 interior angles between 2 vectors, A-to-B clockwise,
 * and A-to-B counter-clockwise. Get the counter-clockwise one from A to B.
 * @param {number[]} a vector as an array of two numbers
 * @param {number[]} b vector as an array of two numbers
 * @returns {number} interior angle in radians, counter-clockwise from a to b
 * @linkcode Math ./src/geometry/radial.js 105
 */
const counterClockwiseAngle2 = (a, b) => {
	const dotProduct = a[0] * b[0] + a[1] * b[1];
	const determinant = a[0] * b[1] - a[1] * b[0];
	let angle = Math.atan2(determinant, dotProduct);
	if (angle < 0) { angle += TWO_PI; }
	return angle;
};
/**
 * this calculates an angle bisection between the pair of vectors
 * clockwise from the first vector to the second
 *
 *     a  x
 *       /     . bisection
 *      /   .
 *     / .
 *     --------x  b
 */
/**
 * @description calculate the angle bisection clockwise from the first vector to the second.
 * @param {number[]} a one 2D vector
 * @param {number[]} b one 2D vector
 * @returns {number[]} one 2D vector
 * @linkcode Math ./src/geometry/radial.js 129
 */
const clockwiseBisect2 = (a, b) => fnToVec2(fnVec2Angle(a) - clockwiseAngle2(a, b) / 2);
/**
 * @description calculate the angle bisection counter-clockwise from the first vector to the second.
 * @param {number[]} a one 2D vector
 * @param {number[]} b one 2D vector
 * @returns {number[]} one 2D vector
 * @linkcode Math ./src/geometry/radial.js 137
 */
const counterClockwiseBisect2 = (a, b) => (
	fnToVec2(fnVec2Angle(a) + counterClockwiseAngle2(a, b) / 2)
);
/**
 * @description subsect into n-divisions the angle clockwise from one angle to the next
 * @param {number} divisions number of angles minus 1
 * @param {number} angleA one angle in radians
 * @param {number} angleB one angle in radians
 * @returns {number[]} array of angles in radians
 * @linkcode Math ./src/geometry/radial.js 148
 */
const clockwiseSubsectRadians = (divisions, angleA, angleB) => {
	const angle = clockwiseAngleRadians(angleA, angleB) / divisions;
	return Array.from(Array(divisions - 1))
		.map((_, i) => angleA + angle * (i + 1));
};
/**
 * @description subsect into n-divisions the angle counter-clockwise from one angle to the next
 * @param {number} divisions number of angles minus 1
 * @param {number} angleA one angle in radians
 * @param {number} angleB one angle in radians
 * @returns {number[]} array of angles in radians
 * @linkcode Math ./src/geometry/radial.js 161
 */
const counterClockwiseSubsectRadians = (divisions, angleA, angleB) => {
	const angle = counterClockwiseAngleRadians(angleA, angleB) / divisions;
	return Array.from(Array(divisions - 1))
		.map((_, i) => angleA + angle * (i + 1));
};
/**
 * @description subsect into n-divisions the angle clockwise from one vector to the next
 * @param {number} divisions number of angles minus 1
 * @param {number[]} vectorA one vector in array form
 * @param {number[]} vectorB one vector in array form
 * @returns {number[][]} array of vectors (which are arrays of numbers)
 * @linkcode Math ./src/geometry/radial.js 174
 */
const clockwiseSubsect2 = (divisions, vectorA, vectorB) => {
	const angleA = Math.atan2(vectorA[1], vectorA[0]);
	const angleB = Math.atan2(vectorB[1], vectorB[0]);
	return clockwiseSubsectRadians(divisions, angleA, angleB)
		.map(fnToVec2);
};
/**
 * @description subsect into n-divisions the angle counter-clockwise from one vector to the next
 * @param {number} divisions number of angles minus 1
 * @param {number[]} vectorA one vector in array form
 * @param {number[]} vectorB one vector in array form
 * @returns {number[][]} array of vectors (which are arrays of numbers)
 * @linkcode Math ./src/geometry/radial.js 188
 */
const counterClockwiseSubsect2 = (divisions, vectorA, vectorB) => {
	const angleA = Math.atan2(vectorA[1], vectorA[0]);
	const angleB = Math.atan2(vectorB[1], vectorB[0]);
	return counterClockwiseSubsectRadians(divisions, angleA, angleB)
		.map(fnToVec2);
};
/**
 * @description given two lines, find two lines which bisect the given lines,
 * if the given lines have an intersection, or return one line if they are parallel.
 * @param {number[]} vectorA the vector of the first line, as an array of numbers
 * @param {number[]} originA the origin of the first line, as an array of numbers
 * @param {number[]} vectorB the vector of the first line, as an array of numbers
 * @param {number[]} originB the origin of the first line, as an array of numbers
 * @param {number} [epsilon=1e-6] an optional epsilon for testing parallel-ness.
 * @returns {object[]} an array of objects with "vector" and "origin" keys defining a line
 * @linkcode Math ./src/geometry/radial.js 205
 */
const bisectLines2 = (vectorA, originA, vectorB, originB, epsilon = EPSILON) => {
	const determinant = cross2(vectorA, vectorB);
	const dotProd = dot(vectorA, vectorB);
	const bisects = determinant > -epsilon
		? [counterClockwiseBisect2(vectorA, vectorB)]
		: [clockwiseBisect2(vectorA, vectorB)];
	bisects[1] = determinant > -epsilon
		? rotate90(bisects[0])
		: rotate270(bisects[0]);
	const numerator = (originB[0] - originA[0]) * vectorB[1] - vectorB[0] * (originB[1] - originA[1]);
	const t = numerator / determinant;
	const normalized = [vectorA, vectorB].map(vec => normalize(vec));
	const isParallel = Math.abs(cross2(...normalized)) < epsilon;
	const origin = isParallel
		? midpoint(originA, originB)
		: [originA[0] + vectorA[0] * t, originA[1] + vectorA[1] * t];
	const solution = bisects.map(vector => ({ vector, origin }));
	if (isParallel) { delete solution[(dotProd > -epsilon ? 1 : 0)]; }
	return solution;
};
/**
 * @description sort an array of angles in radians by getting an array of
 * reference indices to the input array, instead of an array of angles.
 *
 * maybe there is such thing as an absolute radial origin (x axis?)
 * but this chooses the first element as the first element
 * and sort everything else counter-clockwise around it.
 *
 * @param {number[]|...number} args array or sequence of angles in radians
 * @returns {number[]} array of indices of the input array, indicating
 * the counter-clockwise sorted arrangement.
 * @linkcode Math ./src/geometry/radial.js 238
 */
const counterClockwiseOrderRadians = function () {
	const radians = Array.from(arguments).flat();
	const counter_clockwise = radians
		.map((_, i) => i)
		.sort((a, b) => radians[a] - radians[b]);
	return counter_clockwise
		.slice(counter_clockwise.indexOf(0), counter_clockwise.length)
		.concat(counter_clockwise.slice(0, counter_clockwise.indexOf(0)));
};
/**
 * @description sort an array of vectors by getting an array of
 * reference indices to the input array, instead of a sorted array of vectors.
 * @param {number[][]} args array of vectors (which are arrays of numbers)
 * @returns {number[]} array of indices of the input array, indicating
 * the counter-clockwise sorted arrangement.
 * @linkcode Math ./src/geometry/radial.js 255
 */
const counterClockwiseOrder2 = function () {
	return counterClockwiseOrderRadians(
		semiFlattenArrays(arguments).map(fnVec2Angle),
	);
};
/**
 * @description given an array of angles, return the sector angles between
 * consecutive parameters. if radially unsorted, this will sort them.
 * @param {number[]|...number} args array or sequence of angles in radians
 * @returns {number[]} array of sector angles in radians
 * @linkcode Math ./src/geometry/radial.js 267
 */
const counterClockwiseSectorsRadians = function () {
	const radians = Array.from(arguments).flat();
	const ordered = counterClockwiseOrderRadians(radians)
		.map(i => radians[i]);
	return ordered.map((rad, i, arr) => [rad, arr[(i + 1) % arr.length]])
		.map(pair => counterClockwiseAngleRadians(pair[0], pair[1]));
};
/**
 * @description given an array of vectors, return the sector angles between
 * consecutive parameters. if radially unsorted, this will sort them.
 * @param {number[][]} args array of 2D vectors (higher dimensions will be ignored)
 * @returns {number[]} array of sector angles in radians
 * @linkcode Math ./src/geometry/radial.js 281
 */
const counterClockwiseSectors2 = function () {
	return counterClockwiseSectorsRadians(
		getVectorOfVectors(arguments).map(fnVec2Angle),
	);
};
/**
 * subsect the angle between two lines, can handle parallel lines
 */
// export const subsect = function (divisions, pointA, vectorA, pointB, vectorB) {
//   const denominator = vectorA[0] * vectorB[1] - vectorB[0] * vectorA[1];
//   if (Math.abs(denominator) < EPSILON) { /* parallel */
//     const solution = [midpoint(pointA, pointB), [vectorA[0], vectorA[1]]];
//     const array = [solution, solution];
//     const dot = vectorA[0] * vectorB[0] + vectorA[1] * vectorB[1];
//     delete array[(dot > 0 ? 1 : 0)];
//     return array;
//   }
//   const numerator = (pointB[0] - pointA[0]) * vectorB[1] - vectorB[0] * (pointB[1] - pointA[1]);
//   const t = numerator / denominator;
//   const x = pointA[0] + vectorA[0] * t;
//   const y = pointA[1] + vectorA[1] * t;
//   const bisects = bisect_vectors(vectorA, vectorB);
//   bisects[1] = [-bisects[0][1], bisects[0][0]];
//   return bisects.map(el => [[x, y], el]);
// };
/**
 * @description which turn direction do 3 points make? clockwise or couter-clockwise
 * @param {number[]} p0 the start point
 * @param {number[]} p1 the middle point
 * @param {number[]} p2 the end point
 * @param {number} [epsilon=1e-6] optional epsilon
 * @returns {number|undefined} with 4 possible results:
 * - "0": collinear, no turn, forward
 * - "1": counter-clockwise turn, 0+epsilon < x < 180-epsilon
 * - "-1": clockwise turn, 0-epsilon > x > -180+epsilon
 * - "undefined": collinear but with a 180 degree turn.
 * @linkcode Math ./src/geometry/radial.js 319
 */
const threePointTurnDirection = (p0, p1, p2, epsilon = EPSILON) => {
	const v = normalize2(subtract2(p1, p0));
	const u = normalize2(subtract2(p2, p0));
	// not collinear
	const cross = cross2(v, u);
	if (!fnEpsilonEqual(cross, 0, epsilon)) {
		return Math.sign(cross);
	}
	// collinear. now we have to ensure the order is 0, 1, 2, and point
	// 1 lies between 0 and 2. otherwise we made a 180 degree turn (return undefined)
	return fnEpsilonEqual(distance2(p0, p1) + distance2(p1, p2), distance2(p0, p2))
		? 0
		: undefined;
};

var radial = /*#__PURE__*/Object.freeze({
	__proto__: null,
	isCounterClockwiseBetween: isCounterClockwiseBetween,
	clockwiseAngleRadians: clockwiseAngleRadians,
	counterClockwiseAngleRadians: counterClockwiseAngleRadians,
	clockwiseAngle2: clockwiseAngle2,
	counterClockwiseAngle2: counterClockwiseAngle2,
	clockwiseBisect2: clockwiseBisect2,
	counterClockwiseBisect2: counterClockwiseBisect2,
	clockwiseSubsectRadians: clockwiseSubsectRadians,
	counterClockwiseSubsectRadians: counterClockwiseSubsectRadians,
	clockwiseSubsect2: clockwiseSubsect2,
	counterClockwiseSubsect2: counterClockwiseSubsect2,
	bisectLines2: bisectLines2,
	counterClockwiseOrderRadians: counterClockwiseOrderRadians,
	counterClockwiseOrder2: counterClockwiseOrder2,
	counterClockwiseSectorsRadians: counterClockwiseSectorsRadians,
	counterClockwiseSectors2: counterClockwiseSectors2,
	threePointTurnDirection: threePointTurnDirection
});

/**
 * Math (c) Kraft
 */
/**
 * @description mirror an array and join it at the end, except
 * do not duplicate the final element, it should only appear once.
 */
const mirror = (arr) => arr.concat(arr.slice(0, -1).reverse());
/**
 * @description Convex hull from a set of 2D points, choose whether to include or exclude
 * points which lie collinear inside one of the boundary lines. modified Graham scan algorithm.
 * @param {number[][]} points array of points, each point is an array of numbers
 * @param {boolean} [includeCollinear=false] true to include points collinear along the boundary
 * @param {number} [epsilon=1e-6] undefined behavior when larger than 0.01
 * @returns {number[]} not the points, but the indices of points in your "points" array
 * @linkcode Math ./src/geometry/convex-hull.js 19
 */
const convexHullIndices = (points = [], includeCollinear = false, epsilon = EPSILON) => {
	if (points.length < 2) { return []; }
	const order = radialSortPointIndices(points, epsilon)
		.map(arr => (arr.length === 1 ? arr : mirror(arr)))
		.flat();
	order.push(order[0]);
	const stack = [order[0]];
	let i = 1;
	// threePointTurnDirection returns -1,0,1, with 0 as the collinear case.
	// setup our operation for each case, depending on includeCollinear
	const funcs = {
		"-1": () => stack.pop(),
		1: (next) => { stack.push(next); i += 1; },
		undefined: () => { i += 1; },
	};
	funcs[0] = includeCollinear ? funcs["1"] : funcs["-1"];
	while (i < order.length) {
		if (stack.length < 2) {
			stack.push(order[i]);
			i += 1;
			continue;
		}
		const prev = stack[stack.length - 2];
		const curr = stack[stack.length - 1];
		const next = order[i];
		const turn = threePointTurnDirection(...[prev, curr, next].map(j => points[j]), epsilon);
		funcs[turn](next);
	}
	stack.pop();
	return stack;
};
/**
 * @description Convex hull from a set of 2D points, choose whether to include or exclude
 * points which lie collinear inside one of the boundary lines. modified Graham scan algorithm.
 * @param {number[][]} points array of points, each point is an array of numbers
 * @param {boolean} [includeCollinear=false] true to include points collinear along the boundary
 * @param {number} [epsilon=1e-6] undefined behavior when larger than 0.01
 * @returns {number[][]} the convex hull as a list of points,
 * where each point is an array of numbers
 * @linkcode Math ./src/geometry/convex-hull.js 60
 */
const convexHull = (points = [], includeCollinear = false, epsilon = EPSILON) => (
	convexHullIndices(points, includeCollinear, epsilon)
		.map(i => points[i]));

var convexHull$1 = /*#__PURE__*/Object.freeze({
	__proto__: null,
	convexHullIndices: convexHullIndices,
	convexHull: convexHull
});

/**
 * Math (c) Kraft
 */
/**
 * @description Find the intersection of two lines. Lines can be lines/rays/segments,
 * and can be inclusve or exclusive in terms of their endpoints and the epsilon value.
 * @param {number[]} vector array of 2 numbers, the first line's vector
 * @param {number[]} origin array of 2 numbers, the first line's origin
 * @param {number[]} vector array of 2 numbers, the second line's vector
 * @param {number[]} origin array of 2 numbers, the second line's origin
 * @param {function} [aFunction=includeL] first line's boolean test normalized value lies collinear
 * @param {function} [bFunction=includeL] second line's boolean test normalized value lies collinear
 * @param {number} [epsilon=1e-6] optional epsilon
 * @returns {number[]|undefined} one 2D point or undefined
 * @linkcode Math ./src/intersection/intersect-line-line.js 26
*/
const intersectLineLine = (
	aVector,
	aOrigin,
	bVector,
	bOrigin,
	aFunction = includeL,
	bFunction = includeL,
	epsilon = EPSILON,
) => {
	// a normalized determinant gives consistent values across all epsilon ranges
	const det_norm = cross2(normalize(aVector), normalize(bVector));
	// lines are parallel
	if (Math.abs(det_norm) < epsilon) { return undefined; }
	const determinant0 = cross2(aVector, bVector);
	const determinant1 = -determinant0;
	const a2b = [bOrigin[0] - aOrigin[0], bOrigin[1] - aOrigin[1]];
	const b2a = [-a2b[0], -a2b[1]];
	const t0 = cross2(a2b, bVector) / determinant0;
	const t1 = cross2(b2a, aVector) / determinant1;
	if (aFunction(t0, epsilon / magnitude(aVector))
		&& bFunction(t1, epsilon / magnitude(bVector))) {
		return add(aOrigin, scale(aVector, t0));
	}
	return undefined;
};

/**
 * Math (c) Kraft
 */

const pleatParallel = (count, a, b) => {
	const origins = Array.from(Array(count - 1))
		.map((_, i) => (i + 1) / count)
		.map(t => lerp(a.origin, b.origin, t));
	const vector = [...a.vector];
	return origins.map(origin => ({ origin, vector }));
};

const pleatAngle = (count, a, b) => {
	const origin = intersectLineLine(a.vector, a.origin, b.vector, b.origin);
	const vectors = clockwiseAngle2(a.vector, b.vector) < counterClockwiseAngle2(a.vector, b.vector)
		? clockwiseSubsect2(count, a.vector, b.vector)
		: counterClockwiseSubsect2(count, a.vector, b.vector);
	return vectors.map(vector => ({ origin, vector }));
};
/**
 * @description Between two lines, make a repeating sequence of
 * evenly-spaced lines to simulate a series of pleats.
 * @param {line} object with two keys/values: { vector: [], origin: [] }
 * @param {line} object with two keys/values: { vector: [], origin: [] }
 * @param {number} the number of faces, the number of lines will be n-1.
 * @returns {line[]} an array of lines, objects which contain "vector" and "origin"
 * @linkcode Math ./src/geometry/pleat.js 39
 */
const pleat = (count, a, b) => {
	const lineA = getLine(a);
	const lineB = getLine(b);
	return parallel(lineA.vector, lineB.vector)
		? pleatParallel(count, lineA, lineB)
		: pleatAngle(count, lineA, lineB);
};

var pleat$1 = /*#__PURE__*/Object.freeze({
	__proto__: null,
	pleat: pleat
});

/**
 * Math (c) Kraft
 */

/**
 * the radius parameter measures from the center to the midpoint of the edge
 * vertex-axis aligned
 * todo: also possible to parameterize the radius as the center to the points
 * todo: can be edge-aligned
 */
const angleArray = count => Array
	.from(Array(Math.floor(count)))
	.map((_, i) => TWO_PI * (i / count));

const anglesToVecs = (angles, radius) => angles
	.map(a => [radius * Math.cos(a), radius * Math.sin(a)])
	.map(pt => pt.map(n => cleanNumber(n, 14))); // this step is costly!
// a = 2r tan(π/n)
/**
 * @description Make a regular polygon from a circumradius,
 * the first point is +X aligned.
 * @param {number} sides the number of sides in the polygon
 * @param {number} [circumradius=1] the polygon's circumradius
 * @returns {number[][]} an array of points, each point as an arrays of numbers
 * @linkcode Math ./src/geometry/polygons.js 34
 */
const makePolygonCircumradius = (sides = 3, radius = 1) => (
	anglesToVecs(angleArray(sides), radius)
);
/**
 * @description Make a regular polygon from a circumradius,
 * the middle of the first side is +X aligned.
 * @param {number} sides the number of sides in the polygon
 * @param {number} [circumradius=1] the polygon's circumradius
 * @returns {number[][]} an array of points, each point as an arrays of numbers
 * @linkcode Math ./src/geometry/polygons.js 45
 */
const makePolygonCircumradiusSide = (sides = 3, radius = 1) => {
	const halfwedge = Math.PI / sides;
	const angles = angleArray(sides).map(a => a + halfwedge);
	return anglesToVecs(angles, radius);
};
/**
 * @description Make a regular polygon from a inradius,
 * the first point is +X aligned.
 * @param {number} sides the number of sides in the polygon
 * @param {number} [inradius=1] the polygon's inradius
 * @returns {number[][]} an array of points, each point as an arrays of numbers
 * @linkcode Math ./src/geometry/polygons.js 58
 */
const makePolygonInradius = (sides = 3, radius = 1) => (
	makePolygonCircumradius(sides, radius / Math.cos(Math.PI / sides)));
/**
 * @description Make a regular polygon from a inradius,
 * the middle of the first side is +X aligned.
 * @param {number} sides the number of sides in the polygon
 * @param {number} [inradius=1] the polygon's inradius
 * @returns {number[][]} an array of points, each point as an arrays of numbers
 * @linkcode Math ./src/geometry/polygons.js 68
 */
const makePolygonInradiusSide = (sides = 3, radius = 1) => (
	makePolygonCircumradiusSide(sides, radius / Math.cos(Math.PI / sides)));
/**
 * @description Make a regular polygon from a side length,
 * the first point is +X aligned.
 * @param {number} sides the number of sides in the polygon
 * @param {number} [length=1] the polygon's side length
 * @returns {number[][]} an array of points, each point as an arrays of numbers
 * @linkcode Math ./src/geometry/polygons.js 78
 */
const makePolygonSideLength = (sides = 3, length = 1) => (
	makePolygonCircumradius(sides, (length / 2) / Math.sin(Math.PI / sides)));
/**
 * @description Make a regular polygon from a side length,
 * the middle of the first side is +X aligned.
 * @param {number} sides the number of sides in the polygon
 * @param {number} [length=1] the polygon's side length
 * @returns {number[][]} an array of points, each point as an arrays of numbers
 * @linkcode Math ./src/geometry/polygons.js 88
 */
const makePolygonSideLengthSide = (sides = 3, length = 1) => (
	makePolygonCircumradiusSide(sides, (length / 2) / Math.sin(Math.PI / sides)));
/**
 * @description Remove any collinear vertices from a n-dimensional polygon.
 * @param {number[][]} polygon a polygon as an array of ordered points in array form
 * @param {number} [epsilon=1e-6] an optional epsilon
 * @returns {number[][]} a copy of the polygon with collinear points removed
 * @linkcode Math ./src/geometry/polygons.js 97
 */
const makePolygonNonCollinear = (polygon, epsilon = EPSILON) => {
	// index map [i] to [i, i+1]
	const edges_vector = polygon
		.map((v, i, arr) => [v, arr[(i + 1) % arr.length]])
		.map(pair => subtract(pair[1], pair[0]));
	// the vertex to be removed. true=valid, false=collinear.
	// ask if an edge is parallel to its predecessor, this way,
	// the edge index will match to the collinear vertex.
	const vertex_collinear = edges_vector
		.map((vector, i, arr) => [vector, arr[(i + arr.length - 1) % arr.length]])
		.map(pair => !parallel(pair[1], pair[0], epsilon));
	return polygon
		.filter((vertex, v) => vertex_collinear[v]);
};
/**
 * @description Calculates the circumcircle which lies on three points.
 * @param {number[]} a one 2D point as an array of numbers
 * @param {number[]} b one 2D point as an array of numbers
 * @param {number[]} c one 2D point as an array of numbers
 * @returns {circle} one circle with keys "radius" (number) and "origin" (number[])
 * @linkcode Math ./src/geometry/polygons.js 119
 */
const circumcircle = function (a, b, c) {
	const A = b[0] - a[0];
	const B = b[1] - a[1];
	const C = c[0] - a[0];
	const D = c[1] - a[1];
	const E = A * (a[0] + b[0]) + B * (a[1] + b[1]);
	const F = C * (a[0] + c[0]) + D * (a[1] + c[1]);
	const G = 2 * (A * (c[1] - b[1]) - B * (c[0] - b[0]));
	if (Math.abs(G) < EPSILON) {
		const minx = Math.min(a[0], b[0], c[0]);
		const miny = Math.min(a[1], b[1], c[1]);
		const dx = (Math.max(a[0], b[0], c[0]) - minx) * 0.5;
		const dy = (Math.max(a[1], b[1], c[1]) - miny) * 0.5;
		return {
			origin: [minx + dx, miny + dy],
			radius: Math.sqrt(dx * dx + dy * dy),
		};
	}
	const origin = [(D * E - B * F) / G, (A * F - C * E) / G];
	const dx = origin[0] - a[0];
	const dy = origin[1] - a[1];
	return {
		origin,
		radius: Math.sqrt(dx * dx + dy * dy),
	};
};
/**
 * @description Calculates the signed area of a polygon.
 * This requires the polygon be non-self-intersecting.
 * @param {number[][]} points an array of 2D points, which are arrays of numbers
 * @returns {number} the area of the polygon
 * @example
 * var area = polygon.signedArea([ [1,2], [5,6], [7,0] ])
 * @linkcode Math ./src/geometry/polygons.js 154
 */
const signedArea = points => 0.5 * points
	.map((el, i, arr) => {
		const next = arr[(i + 1) % arr.length];
		return el[0] * next[1] - next[0] * el[1];
	}).reduce(fnAdd, 0);
/**
 * @description Calculates the centroid or the center of mass of the polygon.
 * @param {number[][]} points an array of 2D points, which are arrays of numbers
 * @returns {number[]} one 2D point as an array of numbers
 * @example
 * var centroid = polygon.centroid([ [1,2], [8,9], [8,0] ])
 * @linkcode Math ./src/geometry/polygons.js 167
 */
const centroid = (points) => {
	const sixthArea = 1 / (6 * signedArea(points));
	return points.map((el, i, arr) => {
		const next = arr[(i + 1) % arr.length];
		const mag = el[0] * next[1] - next[0] * el[1];
		return [(el[0] + next[0]) * mag, (el[1] + next[1]) * mag];
	}).reduce((a, b) => [a[0] + b[0], a[1] + b[1]], [0, 0])
		.map(c => c * sixthArea);
};
/**
 * @description Make an axis-aligned bounding box that encloses a set of points.
 * the optional padding is used to make the bounding box inclusive / exclusive
 * by adding padding on all sides, or inset in the case of negative number.
 * (positive=inclusive boundary, negative=exclusive boundary)
 * @param {number[][]} points an array of unsorted points, in any dimension
 * @param {number} [padding=0] optionally add padding around the box
 * @returns {BoundingBox} an object where "min" and "max" are two points and "span" is the lengths
 * @linkcode Math ./src/geometry/polygons.js 186
 */
const boundingBox = (points, padding = 0) => {
	const min = Array(points[0].length).fill(Infinity);
	const max = Array(points[0].length).fill(-Infinity);
	points.forEach(point => point
		.forEach((c, i) => {
			if (c < min[i]) { min[i] = c - padding; }
			if (c > max[i]) { max[i] = c + padding; }
		}));
	const span = max.map((m, i) => m - min[i]);
	return { min, max, span };
};

var polygons = /*#__PURE__*/Object.freeze({
	__proto__: null,
	makePolygonCircumradius: makePolygonCircumradius,
	makePolygonCircumradiusSide: makePolygonCircumradiusSide,
	makePolygonInradius: makePolygonInradius,
	makePolygonInradiusSide: makePolygonInradiusSide,
	makePolygonSideLength: makePolygonSideLength,
	makePolygonSideLengthSide: makePolygonSideLengthSide,
	makePolygonNonCollinear: makePolygonNonCollinear,
	circumcircle: circumcircle,
	signedArea: signedArea,
	centroid: centroid,
	boundingBox: boundingBox
});

/**
 * Math (c) Kraft
 */
/**
 * @description check if a point lies collinear along a line, and specify if the
 * line is a line/ray/segment and test whether the point lies within endpoint(s).
 * @param {number[]} vector the vector component of the line
 * @param {number[]} origin the origin component of the line
 * @param {number[]} point one 2D point
 * @parma {function} [func=excludeL] specify line/ray/segment and inclusive/exclusive
 * @param {number} [epsilon=1e-6] an optional epsilon with a default value of 1e-6
 * @returns {boolean} is the point collinear to the line, and in the case of ray/segment,
 * does the point lie within the bounds of the ray/segment?
 * @linkcode Math ./src/intersection/overlap-line-point.js 22
 */
const overlapLinePoint = (vector, origin, point, func = excludeL, epsilon = EPSILON) => {
	const p2p = subtract(point, origin);
	const lineMagSq = magSquared(vector);
	const lineMag = Math.sqrt(lineMagSq);
	// the line is degenerate
	if (lineMag < epsilon) { return false; }
	const cross = cross2(p2p, vector.map(n => n / lineMag));
	const proj = dot(p2p, vector) / lineMagSq;
	return Math.abs(cross) < epsilon && func(proj, epsilon / lineMag);
};

/**
 * Math (c) Kraft
 */
/**
 * @description Split a convex polygon by a line and rebuild each half into two convex polygons.
 * @param {number[][]} polygon an array of points, each point is an array of numbers
 * @param {number[]} vector the vector component of the line
 * @param {number[]} origin the origin component of the line
 * @returns {number[][][]} an array of one or two polygons, each polygon is an array of points,
 * each point is an array of numbers.
 * @linkcode Math ./src/geometry/split-polygon.js 19
 */
const splitConvexPolygon = (poly, lineVector, linePoint) => {
	// todo: should this return undefined if no intersection?
	//       or the original poly?

	//    point: intersection [x,y] point or null if no intersection
	// at_index: where in the polygon this occurs
	const vertices_intersections = poly.map((v, i) => {
		const intersection = overlapLinePoint(lineVector, linePoint, v, includeL);
		return { point: intersection ? v : null, at_index: i };
	}).filter(el => el.point != null);
	const edges_intersections = poly.map((v, i, arr) => ({
		point: intersectLineLine(
			lineVector,
			linePoint,
			subtract(v, arr[(i + 1) % arr.length]),
			arr[(i + 1) % arr.length],
			excludeL,
			excludeS,
		),
		at_index: i,
	}))
		.filter(el => el.point != null);

	// three cases: intersection at 2 edges, 2 points, 1 edge and 1 point
	if (edges_intersections.length === 2) {
		const sorted_edges = edges_intersections.slice()
			.sort((a, b) => a.at_index - b.at_index);

		const face_a = poly
			.slice(sorted_edges[1].at_index + 1)
			.concat(poly.slice(0, sorted_edges[0].at_index + 1));
		face_a.push(sorted_edges[0].point);
		face_a.push(sorted_edges[1].point);

		const face_b = poly
			.slice(sorted_edges[0].at_index + 1, sorted_edges[1].at_index + 1);
		face_b.push(sorted_edges[1].point);
		face_b.push(sorted_edges[0].point);
		return [face_a, face_b];
	}
	if (edges_intersections.length === 1 && vertices_intersections.length === 1) {
		vertices_intersections[0].type = "v";
		edges_intersections[0].type = "e";
		const sorted_geom = vertices_intersections.concat(edges_intersections)
			.sort((a, b) => a.at_index - b.at_index);

		const face_a = poly.slice(sorted_geom[1].at_index + 1)
			.concat(poly.slice(0, sorted_geom[0].at_index + 1));
		if (sorted_geom[0].type === "e") { face_a.push(sorted_geom[0].point); }
		face_a.push(sorted_geom[1].point); // todo: if there's a bug, it's here. switch this

		const face_b = poly
			.slice(sorted_geom[0].at_index + 1, sorted_geom[1].at_index + 1);
		if (sorted_geom[1].type === "e") { face_b.push(sorted_geom[1].point); }
		face_b.push(sorted_geom[0].point); // todo: if there's a bug, it's here. switch this
		return [face_a, face_b];
	}
	if (vertices_intersections.length === 2) {
		const sorted_vertices = vertices_intersections.slice()
			.sort((a, b) => a.at_index - b.at_index);
		const face_a = poly
			.slice(sorted_vertices[1].at_index)
			.concat(poly.slice(0, sorted_vertices[0].at_index + 1));
		const face_b = poly
			.slice(sorted_vertices[0].at_index, sorted_vertices[1].at_index + 1);
		return [face_a, face_b];
	}
	return [poly.slice()];
};

/**
 * Math (c) Kraft
 */
/**
 * @description this recursive algorithm works outwards-to-inwards, each repeat
 * decreases the size of the polygon by one point/side. (removes 2, adds 1)
 * and repeating the algorithm on the smaller polygon.
 *
 * @param {number[][]} array of point objects (arrays of numbers, [x, y]). the
 *   counter-clockwise sorted points of the polygon. as we recurse this list shrinks
 *   by removing the points that are "finished".
 *
 * @returns {object[]} array of line segments as objects with keys:
 *   "points": array of 2 points in array form [ [x, y], [x, y] ]
 *   "type": "skeleton" or "kawasaki", the latter being the projected perpendicular
 *   dropped edges down to the sides of the polygon.
 */
const recurseSkeleton = (points, lines, bisectors) => {
	// every point has an interior angle bisector vector, this ray is
	// tested for intersections with its neighbors on both sides.
	// "intersects" is fencepost mapped (i) to "points" (i, i+1)
	// because one point/ray intersects with both points on either side,
	// so in reverse, every point (i) relates to intersection (i-1, i)
	const intersects = points
		// .map((p, i) => math.ray(bisectors[i], p))
		// .map((ray, i, arr) => ray.intersect(arr[(i + 1) % arr.length]));
		.map((origin, i) => ({ vector: bisectors[i], origin }))
		.map((ray, i, arr) => intersectLineLine(
			ray.vector,
			ray.origin,
			arr[(i + 1) % arr.length].vector,
			arr[(i + 1) % arr.length].origin,
			excludeR,
			excludeR,
		));
	// project each intersection point down perpendicular to the edge of the polygon
	// const projections = lines.map((line, i) => line.nearestPoint(intersects[i]));
	const projections = lines.map((line, i) => (
		nearestPointOnLine(line.vector, line.origin, intersects[i], a => a)
	));
	// when we reach only 3 points remaining, we are at the end. we can return early
	// and skip unnecessary calculations, all 3 projection lengths will be the same.
	if (points.length === 3) {
		return points.map(p => ({ type: "skeleton", points: [p, intersects[0]] }))
			.concat([{ type: "perpendicular", points: [projections[0], intersects[0]] }]);
	}
	// measure the lengths of the projected lines, these will be used to identify
	// the smallest length, or the point we want to operate on this round.
	const projectionLengths = intersects
		.map((intersect, i) => distance(intersect, projections[i]));
	let shortest = 0;
	projectionLengths.forEach((len, i) => {
		if (len < projectionLengths[shortest]) { shortest = i; }
	});
	// we have the shortest length, we now have the solution for this round
	// (all that remains is to prepare the arguments for the next recursive call)
	const solutions = [
		{
			type: "skeleton",
			points: [points[shortest], intersects[shortest]],
		},
		{
			type: "skeleton",
			points: [points[(shortest + 1) % points.length], intersects[shortest]],
		},
		// perpendicular projection
		// we could expand this algorithm here to include all three instead of just one.
		// two more of the entries in "intersects" will have the same length as shortest
		{ type: "perpendicular", points: [projections[shortest], intersects[shortest]] },
		// ...projections.map(p => ({ type: "perpendicular", points: [p, intersects[shortest]] }))
	];
	// our new smaller polygon, missing two points now, but gaining one more (the intersection)
	// this is to calculate the new angle bisector at this new point.
	// we are now operating on the inside of the polygon, the lines that will be built from
	// this bisection will become interior skeleton lines.
	// first, flip the first vector so that both of the vectors originate at the
	// center point, and extend towards the neighbors.
	const newVector = clockwiseBisect2(
		flip(lines[(shortest + lines.length - 1) % lines.length].vector),
		lines[(shortest + 1) % lines.length].vector,
	);
	// delete 2 entries from "points" and "bisectors" and add each array's new element.
	// delete 1 entry from lines.
	const shortest_is_last_index = shortest === points.length - 1;
	points.splice(shortest, 2, intersects[shortest]);
	lines.splice(shortest, 1);
	bisectors.splice(shortest, 2, newVector);
	if (shortest_is_last_index) {
		// in the case the index was at the end of the array,
		// we tried to remove two elements but only removed one because
		// it was the last element. remove the first element too.
		points.splice(0, 1);
		bisectors.splice(0, 1);
		// also, the fencepost mapping of the lines array is off by one,
		// move the first element to the end of the array.
		lines.push(lines.shift());
	}
	return solutions.concat(recurseSkeleton(points, lines, bisectors));
};
/**
 * @description create a straight skeleton inside of a convex polygon
 * @param {number[][]} points counter-clockwise polygon as an array of points
 * (which are arrays of numbers)
 * @returns {object[]} list of objects containing "points" {number[][]}: two points
 * defining a line segment, and "type" {string}: either "skeleton" or "perpendicular"
 *
 * make sure:
 *  - your polygon is convex (todo: make this algorithm work with non-convex)
 *  - your polygon points are sorted counter-clockwise
 * @linkcode Math ./src/geometry/straight-skeleton.js 123
 */
const straightSkeleton = (points) => {
	// first time running this function, create the 2nd and 3rd parameters
	// convert the edges of the polygons into lines
	const lines = points
		.map((p, i, arr) => [p, arr[(i + 1) % arr.length]])
		// .map(side => math.line.fromPoints(...side));
		.map(side => ({ vector: subtract(side[1], side[0]), origin: side[0] }));
	// get the interior angle bisectors for every corner of the polygon
	// index map match to "points"
	const bisectors = points
		// each element into 3 (previous, current, next)
		.map((_, i, ar) => [(i - 1 + ar.length) % ar.length, i, (i + 1) % ar.length]
			.map(j => ar[j]))
		// make 2 vectors, from current point to previous/next neighbors
		.map(p => [subtract(p[0], p[1]), subtract(p[2], p[1])])
		// it is a little counter-intuitive but the interior angle between three
		// consecutive points in a counter-clockwise wound polygon is measured
		// in the clockwise direction
		.map(v => clockwiseBisect2(...v));
	// points is modified in place. create a copy
	// const points_clone = JSON.parse(JSON.stringify(points));
	// console.log("ss points", points_clone, points);
	return recurseSkeleton([...points], lines, bisectors);
};

/**
 * @description Check if a point is collinear and between two other points.
 * @param {number[]} p0 a segment point
 * @param {number[]} p1 the point to test collinearity
 * @param {number[]} p2 a segment point
 * @param {boolean} [inclusive=false] if the point is the same as the endpoints
 * @param {number} [epsilon=1e-6] an optional epsilon
 * @returns {boolean} true if the point lies collinear and between the other two points.
 * @linkcode Math ./src/intersection/general.js 19
 */
const collinearBetween = (p0, p1, p2, inclusive = false, epsilon = EPSILON) => {
	const similar = [p0, p2]
		.map(p => fnEpsilonEqualVectors(p1, p))
		.reduce((a, b) => a || b, false);
	if (similar) { return inclusive; }
	const vectors = [[p0, p1], [p1, p2]]
		.map(segment => subtract(segment[1], segment[0]))
		.map(vector => normalize(vector));
	return fnEpsilonEqual(1.0, dot(...vectors), epsilon);
};

var generalIntersect = /*#__PURE__*/Object.freeze({
	__proto__: null,
	collinearBetween: collinearBetween
});

/**
 * Math (c) Kraft
 */
/**
 *
 */
const enclosingBoundingBoxes = (outer, inner) => {
	const dimensions = Math.min(outer.min.length, inner.min.length);
	for (let d = 0; d < dimensions; d += 1) {
		// if one minimum is above the other's maximum, or visa versa
		if (inner.min[d] < outer.min[d] || inner.max[d] > outer.max[d]) {
			return false;
		}
	}
	return true;
};
/**
 * @description does one polygon (outer) completely enclose another polygon (inner),
 * currently, this only works for convex polygons.
 * @param {number[][]} outer a 2D convex polygon
 * @param {number[][]} inner a 2D convex polygon
 * @param {function} [fnInclusive] by default, the boundary is considered inclusive
 * @returns {boolean} is the "inner" polygon completely inside the "outer"
 *
 * @todo: should one function be include and the other exclude?
 * @linkcode Math ./src/intersection/encloses.js 30
 */
const enclosingPolygonPolygon = (outer, inner, fnInclusive = include) => {
	// these points should be *not inside* (false)
	const outerGoesInside = outer
		.map(p => overlapConvexPolygonPoint(inner, p, fnInclusive))
		.reduce((a, b) => a || b, false);
	// these points should be *inside* (true)
	const innerGoesOutside = inner
		.map(p => overlapConvexPolygonPoint(inner, p, fnInclusive))
		.reduce((a, b) => a && b, true);
	return (!outerGoesInside && innerGoesOutside);
};

var encloses = /*#__PURE__*/Object.freeze({
	__proto__: null,
	enclosingBoundingBoxes: enclosingBoundingBoxes,
	enclosingPolygonPolygon: enclosingPolygonPolygon
});

/**
 * Math (c) Kraft
 */

const acosSafe = (x) => {
	if (x >= 1.0) return 0;
	if (x <= -1.0) return Math.PI;
	return Math.acos(x);
};

const rotateVector2 = (center, pt, a) => {
	const x = pt[0] - center[0];
	const y = pt[1] - center[1];
	const xRot = x * Math.cos(a) + y * Math.sin(a);
	const yRot = y * Math.cos(a) - x * Math.sin(a);
	return [center[0] + xRot, center[1] + yRot];
};
/**
 * @description calculate the intersection of two circles, resulting in either no intersection,
 * or one or two points.
 * @param {number} radius1 the first circle's radius
 * @param {number[]} origin1 the first circle's origin
 * @param {number} radius2 the second circle's radius
 * @param {number[]} origin2 the second circle's origin
 * @param {number} [epsilon=1e-6] an optional epsilon
 * @returns {number[][]|undefined} an array of one or two points, or undefined if no intersection
 * @linkcode Math ./src/intersection/intersect-circle-circle.js 28
 */
const intersectCircleCircle = (c1_radius, c1_origin, c2_radius, c2_origin, epsilon = EPSILON) => {
	// sort by largest-smallest radius
	const r = (c1_radius < c2_radius) ? c1_radius : c2_radius;
	const R = (c1_radius < c2_radius) ? c2_radius : c1_radius;
	const smCenter = (c1_radius < c2_radius) ? c1_origin : c2_origin;
	const bgCenter = (c1_radius < c2_radius) ? c2_origin : c1_origin;
	// this is also the starting vector to rotate around the big circle
	const vec = [smCenter[0] - bgCenter[0], smCenter[1] - bgCenter[1]];
	const d = Math.sqrt((vec[0] ** 2) + (vec[1] ** 2));
	// infinite solutions // don't need this because the below case covers it
	// if (d < epsilon && Math.abs(R - r) < epsilon) { return undefined; }
	// no intersection (same center, different size)
	if (d < epsilon) { return undefined; }
	const point = vec.map((v, i) => (v / d) * R + bgCenter[i]);
	// kissing circles
	if (Math.abs((R + r) - d) < epsilon
		|| Math.abs(R - (r + d)) < epsilon) { return [point]; }
	// circles are contained
	if ((d + r) < R || (R + r < d)) { return undefined; }
	const angle = acosSafe((r * r - d * d - R * R) / (-2.0 * d * R));
	const pt1 = rotateVector2(bgCenter, point, +angle);
	const pt2 = rotateVector2(bgCenter, point, -angle);
	return [pt1, pt2];
};

/**
 * Math (c) Kraft
 */
/**
 * @description Calculate the intersection of a circle and a line; the line can
 * be a line, ray, or segment.
 * @param {number} circleRadius the circle's radius
 * @param {number[]} circleOrigin the center of the circle
 * @param {number[]} lineVector the vector component of the line
 * @param {number[]} lineOrigin the origin component of the line
 * @param {function} [lineFunc=includeL] set the line/ray/segment and inclusive/exclusive
 * @param {number} [epsilon=1e-6] an optional epsilon
 * @linkcode Math ./src/intersection/intersect-circle-line.js 20
 */
const intersectCircleLine = (
	circle_radius,
	circle_origin,
	line_vector,
	line_origin,
	line_func = includeL,
	epsilon = EPSILON,
) => {
	const magSq = line_vector[0] ** 2 + line_vector[1] ** 2;
	const mag = Math.sqrt(magSq);
	const norm = mag === 0 ? line_vector : line_vector.map(c => c / mag);
	const rot90 = rotate90(norm);
	const bvec = subtract(line_origin, circle_origin);
	const det = cross2(bvec, norm);
	if (Math.abs(det) > circle_radius + epsilon) { return undefined; }
	const side = Math.sqrt((circle_radius ** 2) - (det ** 2));
	const f = (s, i) => circle_origin[i] - rot90[i] * det + norm[i] * s;
	const results = Math.abs(circle_radius - Math.abs(det)) < epsilon
		? [side].map((s) => [s, s].map(f)) // tangent to circle
		: [-side, side].map((s) => [s, s].map(f));
	const ts = results.map(res => res.map((n, i) => n - line_origin[i]))
		.map(v => v[0] * line_vector[0] + line_vector[1] * v[1])
		.map(d => d / magSq);
	return results.filter((_, i) => line_func(ts[i], epsilon));
};

/**
 * Math (c) Kraft
 */

// todo, this is copied over in clip/polygon.js
const getUniquePair = (intersections) => {
	for (let i = 1; i < intersections.length; i += 1) {
		if (!fnEpsilonEqualVectors(intersections[0], intersections[i])) {
			return [intersections[0], intersections[i]];
		}
	}
	return undefined;
};

/**
 * generalized line-ray-segment intersection with convex polygon function
 * for lines and rays, line1 and line2 are the vector, origin in that order.
 * for segments, line1 and line2 are the two endpoints.
 */
const intersectConvexPolygonLineInclusive = (
	poly,
	vector,
	origin,
	fn_poly = includeS,
	fn_line = includeL,
	epsilon = EPSILON,
) => {
	const intersections = poly
		.map((p, i, arr) => [p, arr[(i + 1) % arr.length]]) // into segment pairs
		.map(side => intersectLineLine(
			subtract(side[1], side[0]),
			side[0],
			vector,
			origin,
			fn_poly,
			fn_line,
			epsilon,
		))
		.filter(a => a !== undefined);
	switch (intersections.length) {
	case 0: return undefined;
	case 1: return [intersections];
	default:
		// for two intersection points or more, in the case of vertex-
		// collinear intersections the same point from 2 polygon sides
		// can be returned. we need to filter for unique points.
		// if no 2 unique points found:
		// there was only one unique intersection point after all.
		return getUniquePair(intersections) || [intersections[0]];
	}
};

/**
 * @description generalized line-ray-segment intersection with convex polygon function
 * for lines and rays, line1 and line2 are the vector, origin in that order.
 * for segments, line1 and line2 are the two endpoints.
 *
 * this doubles as the exclusive condition, and the main export since it
 * checks for exclusive/inclusive and can early-return
 * @linkcode Math ./src/intersection/intersect-polygon-line.js 78
 */
const intersectConvexPolygonLine = (
	poly,
	vector,
	origin,
	fn_poly = includeS,
	fn_line = excludeL,
	epsilon = EPSILON,
) => {
	const sects = intersectConvexPolygonLineInclusive(
		poly,
		vector,
		origin,
		fn_poly,
		fn_line,
		epsilon,
	);
	// const sects = convex_poly_line_intersect(intersect_func, poly, line1, line2, epsilon);
	let altFunc; // the opposite func, as far as inclusive/exclusive
	switch (fn_line) {
	// case excludeL: altFunc = includeL; break;
	case excludeR: altFunc = includeR; break;
	case excludeS: altFunc = includeS; break;
	default: return sects;
	}
	// here on, we are only dealing with exclusive tests, parsing issues with
	// vertex-on intersections that still intersect or don't intersect the polygon.
	// repeat the computation but include intersections with the polygon's vertices.
	const includes = intersectConvexPolygonLineInclusive(
		poly,
		vector,
		origin,
		includeS,
		altFunc,
		epsilon,
	);
	// const includes = convex_poly_line_intersect(altFunc, poly, line1, line2, epsilon);
	// if there are still no intersections, the line doesn't intersect.
	if (includes === undefined) { return undefined; }
	// if there are intersections, see if the line crosses the entire polygon
	// (gives us 2 unique points)
	const uniqueIncludes = getUniquePair(includes);
	// first, deal with the case that there are no unique 2 points.
	if (uniqueIncludes === undefined) {
		switch (fn_line) {
		// if there is one intersection, check if a ray's origin is inside.
		// 1. if the origin is inside, consider the intersection valid
		// 2. if the origin is outside, same as the line case above. no intersection.
		case excludeR:
			// is the ray origin inside?
			return overlapConvexPolygonPoint(poly, origin, exclude, epsilon)
				? includes
				: undefined;
		// if there is one intersection, check if either of a segment's points are
		// inside the polygon, same as the ray above. if neither are, consider
		// the intersection invalid for the exclusive case.
		case excludeS:
			return overlapConvexPolygonPoint(poly, add(origin, vector), exclude, epsilon)
				|| overlapConvexPolygonPoint(poly, origin, exclude, epsilon)
				? includes
				: undefined;
		// if there is one intersection, an infinite line is intersecting the
		// polygon from the outside touching at just one vertex. this should be
		// considered undefined for the exclusive case.
		case excludeL: return undefined;
		default: return undefined;
		}
	}
	// now that we've covered all the other cases, we know that the line intersects
	// the polygon at two unique points. this should return true for all cases
	// except one: when the line is collinear to an edge of the polygon.
	// to test this, get the midpoint of the two intersects and do an exclusive
	// check if the midpoint is inside the polygon. if it is, the line is crossing
	// the polygon and the intersection is valid.
	return overlapConvexPolygonPoint(poly, midpoint(...uniqueIncludes), exclude, epsilon)
		? uniqueIncludes
		: sects;
};

/**
 * Math (c) Kraft
 */

// all intersection functions expect primitives to be in a certain form
// for example all lines are: vector, origin
const intersect_param_form = {
	polygon: a => [a],
	rect: a => [a],
	circle: a => [a.radius, a.origin],
	line: a => [a.vector, a.origin],
	ray: a => [a.vector, a.origin],
	segment: a => [a.vector, a.origin],
	// segment: a => [subtract(a[1], a[0]), a[0]],
};

const intersect_func = {
	polygon: {
		// polygon: intersectPolygonPolygon,
		// circle: convex_poly_circle,
		line: (a, b, fnA, fnB, ep) => intersectConvexPolygonLine(...a, ...b, includeS, fnB, ep),
		ray: (a, b, fnA, fnB, ep) => intersectConvexPolygonLine(...a, ...b, includeS, fnB, ep),
		segment: (a, b, fnA, fnB, ep) => intersectConvexPolygonLine(...a, ...b, includeS, fnB, ep),
	},
	circle: {
		// polygon: (a, b) => convex_poly_circle(b, a),
		circle: (a, b, fnA, fnB, ep) => intersectCircleCircle(...a, ...b, ep),
		line: (a, b, fnA, fnB, ep) => intersectCircleLine(...a, ...b, fnB, ep),
		ray: (a, b, fnA, fnB, ep) => intersectCircleLine(...a, ...b, fnB, ep),
		segment: (a, b, fnA, fnB, ep) => intersectCircleLine(...a, ...b, fnB, ep),
	},
	line: {
		polygon: (a, b, fnA, fnB, ep) => intersectConvexPolygonLine(...b, ...a, includeS, fnA, ep),
		circle: (a, b, fnA, fnB, ep) => intersectCircleLine(...b, ...a, fnA, ep),
		line: (a, b, fnA, fnB, ep) => intersectLineLine(...a, ...b, fnA, fnB, ep),
		ray: (a, b, fnA, fnB, ep) => intersectLineLine(...a, ...b, fnA, fnB, ep),
		segment: (a, b, fnA, fnB, ep) => intersectLineLine(...a, ...b, fnA, fnB, ep),
	},
	ray: {
		polygon: (a, b, fnA, fnB, ep) => intersectConvexPolygonLine(...b, ...a, includeS, fnA, ep),
		circle: (a, b, fnA, fnB, ep) => intersectCircleLine(...b, ...a, fnA, ep),
		line: (a, b, fnA, fnB, ep) => intersectLineLine(...b, ...a, fnB, fnA, ep),
		ray: (a, b, fnA, fnB, ep) => intersectLineLine(...a, ...b, fnA, fnB, ep),
		segment: (a, b, fnA, fnB, ep) => intersectLineLine(...a, ...b, fnA, fnB, ep),
	},
	segment: {
		polygon: (a, b, fnA, fnB, ep) => intersectConvexPolygonLine(...b, ...a, includeS, fnA, ep),
		circle: (a, b, fnA, fnB, ep) => intersectCircleLine(...b, ...a, fnA, ep),
		line: (a, b, fnA, fnB, ep) => intersectLineLine(...b, ...a, fnB, fnA, ep),
		ray: (a, b, fnA, fnB, ep) => intersectLineLine(...b, ...a, fnB, fnA, ep),
		segment: (a, b, fnA, fnB, ep) => intersectLineLine(...a, ...b, fnA, fnB, ep),
	},
};

// convert "rect" to "polygon"
const similar_intersect_types = {
	polygon: "polygon",
	rect: "polygon",
	circle: "circle",
	line: "line",
	ray: "ray",
	segment: "segment",
};

const default_intersect_domain_function = {
	polygon: exclude, // not used
	rect: exclude, // not used
	circle: exclude, // not used
	line: excludeL,
	ray: excludeR,
	segment: excludeS,
};

/**
 * @name intersect
 * @description get the intersection of two geometry objects, the type of each is inferred.
 * @param {any} a any geometry object
 * @param {any} b any geometry object
 * @param {number} [epsilon=1e-6] optional epsilon
 * @returns {number[]|number[][]|undefined} the type of the result varies depending on
 * the type of the input parameters, it is always one point, or an array of points,
 * or undefined if no intersection.
 * @linkcode Math ./src/intersection/intersect.js 92
 */
const intersect = function (a, b, epsilon) {
	const type_a = typeOf(a);
	const type_b = typeOf(b);
	const aT = similar_intersect_types[type_a];
	const bT = similar_intersect_types[type_b];
	const params_a = intersect_param_form[type_a](a);
	const params_b = intersect_param_form[type_b](b);
	const domain_a = a.domain_function || default_intersect_domain_function[type_a];
	const domain_b = b.domain_function || default_intersect_domain_function[type_b];
	return intersect_func[aT][bT](params_a, params_b, domain_a, domain_b, epsilon);
};

/**
 * Math (c) Kraft
 */
/**
 * @description find out if two convex polygons are overlapping by searching
 * for a dividing axis, which should be one side from one of the polygons.
 * @linkcode Math ./src/intersection/overlap-polygons.js 13
 */
const overlapConvexPolygons = (poly1, poly2, epsilon = EPSILON) => {
	for (let p = 0; p < 2; p += 1) {
		// for non-overlapping convex polygons, it's possible that only only
		// one edge on one polygon holds the property of being a dividing axis.
		// we must run the algorithm on both polygons
		const polyA = p === 0 ? poly1 : poly2;
		const polyB = p === 0 ? poly2 : poly1;
		for (let i = 0; i < polyA.length; i += 1) {
			// each edge of polygonA will become a line
			const origin = polyA[i];
			const vector = rotate90(subtract(polyA[(i + 1) % polyA.length], polyA[i]));
			// project each point from the other polygon on to the line's perpendicular
			// also, subtracting the origin (from the first poly) such that the
			// numberline is centered around zero. if the test passes, this polygon's
			// projections will be entirely above or below 0.
			const projected = polyB
				.map(point => subtract(point, origin))
				.map(v => dot(vector, v));
			// is the first polygon on the positive or negative side?
			const other_test_point = polyA[(i + 2) % polyA.length];
			const side_a = dot(vector, subtract(other_test_point, origin));
			const side = side_a > 0; // use 0. not epsilon
			// is the second polygon on whichever side of 0 that the first isn't?
			const one_sided = projected
				.map(dotProd => (side ? dotProd < epsilon : dotProd > -epsilon))
				.reduce((a, b) => a && b, true);
			// if true, we found a dividing axis
			if (one_sided) { return false; }
		}
	}
	return true;
};

/**
 * Math (c) Kraft
 */

const overlapCirclePoint = (radius, origin, point, func = exclude, epsilon = EPSILON) => (
	func(radius - distance2(origin, point), epsilon)
);

/**
 * Math (c) Kraft
 */
/**
 * @description 2D line intersection function, generalized and works for lines,
 * rays, segments.
 * @param {number[]} array of 2 numbers, the first line's vector
 * @param {number[]} array of 2 numbers, the first line's origin
 * @param {number[]} array of 2 numbers, the second line's vector
 * @param {number[]} array of 2 numbers, the second line's origin
 * @param {function} first line's boolean test normalized value lies collinear
 * @param {function} seconde line's boolean test normalized value lies collinear
 * @linkcode Math ./src/intersection/overlap-line-line.js 21
*/

// export const exclude_s = (t, e = EPSILON) => t > e && t < 1 - e;

const overlapLineLine = (
	aVector,
	aOrigin,
	bVector,
	bOrigin,
	aFunction = excludeL,
	bFunction = excludeL,
	epsilon = EPSILON,
) => {
	const denominator0 = cross2(aVector, bVector);
	const denominator1 = -denominator0;
	const a2b = [bOrigin[0] - aOrigin[0], bOrigin[1] - aOrigin[1]];
	if (Math.abs(denominator0) < epsilon) { // parallel
		if (Math.abs(cross2(a2b, aVector)) > epsilon) { return false; }
		const bPt1 = a2b;
		const bPt2 = add(bPt1, bVector);
		// a will be between 0 and 1
		const aProjLen = dot(aVector, aVector);
		const bProj1 = dot(bPt1, aVector) / aProjLen;
		const bProj2 = dot(bPt2, aVector) / aProjLen;
		const bProjSm = bProj1 < bProj2 ? bProj1 : bProj2;
		const bProjLg = bProj1 < bProj2 ? bProj2 : bProj1;
		const bOutside1 = bProjSm > 1 - epsilon;
		const bOutside2 = bProjLg < epsilon;
		if (bOutside1 || bOutside2) { return false; }
		return true;
	}
	const b2a = [-a2b[0], -a2b[1]];
	const t0 = cross2(a2b, bVector) / denominator0;
	const t1 = cross2(b2a, aVector) / denominator1;
	return aFunction(t0, epsilon / magnitude(aVector))
		&& bFunction(t1, epsilon / magnitude(bVector));
};

/**
 * Math (c) Kraft
 */

// all intersection functions expect primitives to be in a certain form
// for example all lines are: vector, origin
const overlap_param_form = {
	polygon: a => [a],
	rect: a => [a],
	circle: a => [a.radius, a.origin],
	line: a => [a.vector, a.origin],
	ray: a => [a.vector, a.origin],
	segment: a => [a.vector, a.origin],
	// segment: a => [subtract(a[1], a[0]), a[0]],
	vector: a => [a],
};

const overlap_func = {
	polygon: {
		polygon: (a, b, fnA, fnB, ep) => overlapConvexPolygons(...a, ...b, ep),
		// circle: (a, b) =>
		// line: (a, b) =>
		// ray: (a, b) =>
		// segment: (a, b) =>
		vector: (a, b, fnA, fnB, ep) => overlapConvexPolygonPoint(...a, ...b, fnA, ep),
	},
	circle: {
		// polygon: (a, b) =>
		// circle: (a, b) =>
		// line: (a, b) =>
		// ray: (a, b) =>
		// segment: (a, b) =>
		vector: (a, b, fnA, fnB, ep) => overlapCirclePoint(...a, ...b, exclude, ep),
	},
	line: {
		// polygon: (a, b) =>
		// circle: (a, b) =>
		line: (a, b, fnA, fnB, ep) => overlapLineLine(...a, ...b, fnA, fnB, ep),
		ray: (a, b, fnA, fnB, ep) => overlapLineLine(...a, ...b, fnA, fnB, ep),
		segment: (a, b, fnA, fnB, ep) => overlapLineLine(...a, ...b, fnA, fnB, ep),
		vector: (a, b, fnA, fnB, ep) => overlapLinePoint(...a, ...b, fnA, ep),
	},
	ray: {
		// polygon: (a, b) =>
		// circle: (a, b) =>
		line: (a, b, fnA, fnB, ep) => overlapLineLine(...b, ...a, fnB, fnA, ep),
		ray: (a, b, fnA, fnB, ep) => overlapLineLine(...a, ...b, fnA, fnB, ep),
		segment: (a, b, fnA, fnB, ep) => overlapLineLine(...a, ...b, fnA, fnB, ep),
		vector: (a, b, fnA, fnB, ep) => overlapLinePoint(...a, ...b, fnA, ep),
	},
	segment: {
		// polygon: (a, b) =>
		// circle: (a, b) =>
		line: (a, b, fnA, fnB, ep) => overlapLineLine(...b, ...a, fnB, fnA, ep),
		ray: (a, b, fnA, fnB, ep) => overlapLineLine(...b, ...a, fnB, fnA, ep),
		segment: (a, b, fnA, fnB, ep) => overlapLineLine(...a, ...b, fnA, fnB, ep),
		vector: (a, b, fnA, fnB, ep) => overlapLinePoint(...a, ...b, fnA, ep),
	},
	vector: {
		polygon: (a, b, fnA, fnB, ep) => overlapConvexPolygonPoint(...b, ...a, fnB, ep),
		circle: (a, b, fnA, fnB, ep) => overlapCirclePoint(...b, ...a, exclude, ep),
		line: (a, b, fnA, fnB, ep) => overlapLinePoint(...b, ...a, fnB, ep),
		ray: (a, b, fnA, fnB, ep) => overlapLinePoint(...b, ...a, fnB, ep),
		segment: (a, b, fnA, fnB, ep) => overlapLinePoint(...b, ...a, fnB, ep),
		vector: (a, b, fnA, fnB, ep) => fnEpsilonEqualVectors(...a, ...b, ep),
	},
};

// convert "rect" to "polygon"
const similar_overlap_types = {
	polygon: "polygon",
	rect: "polygon",
	circle: "circle",
	line: "line",
	ray: "ray",
	segment: "segment",
	vector: "vector",
};

const default_overlap_domain_function = {
	polygon: exclude,
	rect: exclude,
	circle: exclude, // not used
	line: excludeL,
	ray: excludeR,
	segment: excludeS,
	vector: excludeL, // not used
};
/**
 * @name overlap
 * @description test whether or not two geometry objects overlap each other.
 * @param {any} a any geometry object
 * @param {any} b any geometry object
 * @param {number} [epsilon=1e-6] optional epsilon
 * @returns {boolean} true if the two objects overlap.
 * @linkcode Math ./src/intersection/overlap.js 106
 */
const overlap = function (a, b, epsilon) {
	const type_a = typeOf(a);
	const type_b = typeOf(b);
	const aT = similar_overlap_types[type_a];
	const bT = similar_overlap_types[type_b];
	const params_a = overlap_param_form[type_a](a);
	const params_b = overlap_param_form[type_b](b);
	const domain_a = a.domain_function || default_overlap_domain_function[type_a];
	const domain_b = b.domain_function || default_overlap_domain_function[type_b];
	return overlap_func[aT][bT](params_a, params_b, domain_a, domain_b, epsilon);
};

/**
 * Math (c) Kraft
 */
/**
 * @description Test if two axis-aligned bounding boxes overlap each other.
 * @param {BoundingBox} box1 an axis-aligned bounding box, the result of calling boundingBox(...)
 * @param {BoundingBox} box2 an axis-aligned bounding box, the result of calling boundingBox(...)
 * @returns {boolean} true if the bounding boxes overlap each other
 * @linkcode Math ./src/intersection/overlap-bounding-boxes.js 9
 */
const overlapBoundingBoxes = (box1, box2) => {
	const dimensions = Math.min(box1.min.length, box2.min.length);
	for (let d = 0; d < dimensions; d += 1) {
		// if one minimum is above the other's maximum, or visa versa
		if (box1.min[d] > box2.max[d] || box1.max[d] < box2.min[d]) {
			return false;
		}
	}
	return true;
};

/**
 * Math (c) Kraft
 */

const VectorArgs = function () {
	this.push(...getVector(arguments));
};

/**
 * Math (c) Kraft
 */
const VectorGetters = {
	x: function () { return this[0]; },
	y: function () { return this[1]; },
	z: function () { return this[2]; },
	// magnitude: function () { return magnitude(this); },
};

/**
 * Math (c) Kraft
 */

const table = {
	preserve: { // don't transform the return type. preserve it
		magnitude: function () { return magnitude(this); },
		isEquivalent: function () {
			return fnEpsilonEqualVectors(this, getVector(arguments));
		},
		isParallel: function () {
			return parallel(...resizeUp(this, getVector(arguments)));
		},
		isCollinear: function (line) {
			return overlap(this, line);
		},
		dot: function () {
			return dot(...resizeUp(this, getVector(arguments)));
		},
		distanceTo: function () {
			return distance(...resizeUp(this, getVector(arguments)));
		},
		overlap: function (other) {
			return overlap(this, other);
		},
	},
	vector: { // return type
		copy: function () { return [...this]; },
		normalize: function () { return normalize(this); },
		scale: function () { return scale(this, arguments[0]); },
		flip: function () { return flip(this); },
		rotate90: function () { return rotate90(this); },
		rotate270: function () { return rotate270(this); },
		cross: function () {
			return cross3(
				resize(3, this),
				resize(3, getVector(arguments)),
			);
		},
		transform: function () {
			return multiplyMatrix3Vector3(
				getMatrix3x4(arguments),
				resize(3, this),
			);
		},
		/**
		 * @description add a vector to this vector.
		 * @param {number[]} vector one vector
		 * @returns {number[]} one vector, the sum of this and the input vector
		 */
		add: function () {
			return add(this, resize(this.length, getVector(arguments)));
		},
		subtract: function () {
			return subtract(this, resize(this.length, getVector(arguments)));
		},
		// todo, can this be improved?
		rotateZ: function (angle, origin) {
			return multiplyMatrix3Vector3(
				getMatrix3x4(makeMatrix2Rotate(angle, origin)),
				resize(3, this),
			);
		},
		lerp: function (vector, pct) {
			return lerp(this, resize(this.length, getVector(vector)), pct);
		},
		midpoint: function () {
			return midpoint(...resizeUp(this, getVector(arguments)));
		},
		bisect: function () {
			return counterClockwiseBisect2(this, getVector(arguments));
		},
	},
};

// the default export
const VectorMethods = {};

Object.keys(table.preserve).forEach(key => {
	VectorMethods[key] = table.preserve[key];
});

Object.keys(table.vector).forEach(key => {
	VectorMethods[key] = function () {
		return Constructors.vector(...table.vector[key].apply(this, arguments));
	};
});

/**
 * Math (c) Kraft
 */

const VectorStatic = {
	fromAngle: function (angle) {
		return Constructors.vector(Math.cos(angle), Math.sin(angle));
	},
	fromAngleDegrees: function (angle) {
		return Constructors.vector.fromAngle(angle * D2R);
	},
};

/**
 * Math (c) Kraft
 */

var Vector = {
	vector: {
		P: Array.prototype, // vector is a special case, it's an instance of an Array
		A: VectorArgs,
		G: VectorGetters,
		M: VectorMethods,
		S: VectorStatic,
	},
};

/**
 * Math (c) Kraft
 */

var Static = {
	fromPoints: function () {
		const points = getVectorOfVectors(arguments);
		return this.constructor({
			vector: subtract(points[1], points[0]),
			origin: points[0],
		});
	},
	fromAngle: function () {
		const angle = arguments[0] || 0;
		return this.constructor({
			vector: [Math.cos(angle), Math.sin(angle)],
			origin: [0, 0],
		});
	},
	perpendicularBisector: function () {
		const points = getVectorOfVectors(arguments);
		return this.constructor({
			vector: rotate90(subtract(points[1], points[0])),
			origin: average(points[0], points[1]),
		});
	},
};

/**
 * Math (c) Kraft
 */

// do not define object methods as arrow functions in here

/**
 * this prototype is shared among line types: lines, rays, segments.
 * it's counting on each type having defined:
 * - an origin
 * - a vector
 * - domain_function which takes one or two inputs (t0, epsilon) and returns
 *   true if t0 lies inside the boundary of the line, t0 is scaled to vector
 * - similarly, clip_function, takes two inputs (d, epsilon)
 *   and returns a modified d for what is considered valid space between 0-1
 */

const LinesMethods = {
// todo, this only takes line types. it should be able to take a vector
	isParallel: function () {
		const arr = resizeUp(this.vector, getLine(arguments).vector);
		return parallel(...arr);
	},
	isCollinear: function () {
		const line = getLine(arguments);
		return overlapLinePoint(this.vector, this.origin, line.origin)
			&& parallel(...resizeUp(this.vector, line.vector));
	},
	isDegenerate: function (epsilon = EPSILON) {
		return degenerate(this.vector, epsilon);
	},
	reflectionMatrix: function () {
		return Constructors.matrix(makeMatrix3ReflectZ(this.vector, this.origin));
	},
	nearestPoint: function () {
		const point = getVector(arguments);
		return Constructors.vector(
			nearestPointOnLine(this.vector, this.origin, point, this.clip_function),
		);
	},
	// this works with lines and rays, it should be overwritten for segments
	transform: function () {
		const dim = this.dimension;
		const r = multiplyMatrix3Line3(
			getMatrix3x4(arguments),
			resize(3, this.vector),
			resize(3, this.origin),
		);
		return this.constructor(resize(dim, r.vector), resize(dim, r.origin));
	},
	translate: function () {
		const origin = add(...resizeUp(this.origin, getVector(arguments)));
		return this.constructor(this.vector, origin);
	},
	intersect: function () {
		return intersect(this, ...arguments);
	},
	overlap: function () {
		return overlap(this, ...arguments);
	},
	bisect: function (lineType, epsilon) {
		const line = getLine(lineType);
		return bisectLines2(this.vector, this.origin, line.vector, line.origin, epsilon)
			.map(l => this.constructor(l));
	},
};

/**
 * Math (c) Kraft
 */

var Line = {
	line: {
		P: Object.prototype,

		A: function () {
			const l = getLine(...arguments);
			this.vector = Constructors.vector(l.vector);
			this.origin = Constructors.vector(resize(this.vector.length, l.origin));
			const alt = rayLineToUniqueLine({ vector: this.vector, origin: this.origin });
			this.normal = alt.normal;
			this.distance = alt.distance;
			Object.defineProperty(this, "domain_function", { writable: true, value: includeL });
		},

		G: {
			// length: () => Infinity,
			dimension: function () {
				return [this.vector, this.origin]
					.map(p => p.length)
					.reduce((a, b) => Math.max(a, b), 0);
			},
		},

		M: Object.assign({}, LinesMethods, {
			inclusive: function () { this.domain_function = includeL; return this; },
			exclusive: function () { this.domain_function = excludeL; return this; },
			clip_function: dist => dist,
			svgPath: function (length = 20000) {
				const start = add(this.origin, scale(this.vector, -length / 2));
				const end = scale(this.vector, length);
				return `M${start[0]} ${start[1]}l${end[0]} ${end[1]}`;
			},
		}),

		S: Object.assign({
			fromNormalDistance: function () {
				return this.constructor(uniqueLineToRayLine(arguments[0]));
			},
		}, Static),

	},
};

/**
 * Math (c) Kraft
 */

// LineProto.prototype.constructor = LineProto;

var Ray = {
	ray: {
		P: Object.prototype,

		A: function () {
			const ray = getLine(...arguments);
			this.vector = Constructors.vector(ray.vector);
			this.origin = Constructors.vector(resize(this.vector.length, ray.origin));
			Object.defineProperty(this, "domain_function", { writable: true, value: includeR });
		},

		G: {
			// length: () => Infinity,
			dimension: function () {
				return [this.vector, this.origin]
					.map(p => p.length)
					.reduce((a, b) => Math.max(a, b), 0);
			},
		},

		M: Object.assign({}, LinesMethods, {
			inclusive: function () { this.domain_function = includeR; return this; },
			exclusive: function () { this.domain_function = excludeR; return this; },
			flip: function () {
				return Constructors.ray(flip(this.vector), this.origin);
			},
			scale: function (scale) {
				return Constructors.ray(this.vector.scale(scale), this.origin);
			},
			normalize: function () {
				return Constructors.ray(this.vector.normalize(), this.origin);
			},
			// distance is between 0 and 1, representing the vector between start and end. cap accordingly
			clip_function: rayLimiter,
			svgPath: function (length = 10000) {
				const end = this.vector.scale(length);
				return `M${this.origin[0]} ${this.origin[1]}l${end[0]} ${end[1]}`;
			},

		}),

		S: Static,

	},
};

/**
 * Math (c) Kraft
 */

var Segment = {
	segment: {
		P: Array.prototype,

		A: function () {
			const a = getSegment(...arguments);
			this.push(...[a[0], a[1]].map(v => Constructors.vector(v)));
			this.vector = Constructors.vector(subtract(this[1], this[0]));
			// the fast way, but i think we need the ability to call seg[0].x
			// this.push(a[0], a[1]);
			// this.vector = subtract(this[1], this[0]);
			this.origin = this[0];
			Object.defineProperty(this, "domain_function", { writable: true, value: includeS });
		},

		G: {
			points: function () { return this; },
			magnitude: function () { return magnitude(this.vector); },
			dimension: function () {
				return [this.vector, this.origin]
					.map(p => p.length)
					.reduce((a, b) => Math.max(a, b), 0);
			},
		},

		M: Object.assign({}, LinesMethods, {
			inclusive: function () { this.domain_function = includeS; return this; },
			exclusive: function () { this.domain_function = excludeS; return this; },
			clip_function: segmentLimiter,
			transform: function (...innerArgs) {
				const dim = this.points[0].length;
				const mat = getMatrix3x4(innerArgs);
				const transformed_points = this.points
					.map(point => resize(3, point))
					.map(point => multiplyMatrix3Vector3(mat, point))
					.map(point => resize(dim, point));
				return Constructors.segment(transformed_points);
			},
			translate: function () {
				const translate = getVector(arguments);
				const transformed_points = this.points
					.map(point => add(...resizeUp(point, translate)));
				return Constructors.segment(transformed_points);
			},
			midpoint: function () {
				return Constructors.vector(average(this.points[0], this.points[1]));
			},
			svgPath: function () {
				const pointStrings = this.points.map(p => `${p[0]} ${p[1]}`);
				return ["M", "L"].map((cmd, i) => `${cmd}${pointStrings[i]}`)
					.join("");
			},
		}),

		S: {
			fromPoints: function () {
				return this.constructor(...arguments);
			},
		},

	},
};

/**
 * Math (c) Kraft
 */
/**
 * circle constructors:
 * circle(1, [4,5]) radius:1, origin:4,5
 * circle([4,5], 1) radius:1, origin:4,5
 * circle(1, 2) radius: 2, origin:1
 * circle(1, 2, 3) radius: 3, origin:1,2
 * circle(1, 2, 3, 4) radius: 4, origin:1,2,3
 * circle([1,2], [3,4]) radius:(dist between pts), origin:1,2
 * circle([1,2], [3,4], [5,6]) circumcenter between 3 points
 */

const CircleArgs = function () {
	const circle = getCircle(...arguments);
	this.radius = circle.radius;
	this.origin = Constructors.vector(...circle.origin);
};

/**
 * Math (c) Kraft
 */
const CircleGetters = {
	x: function () { return this.origin[0]; },
	y: function () { return this.origin[1]; },
	z: function () { return this.origin[2]; },
};

/**
 * Math (c) Kraft
 */

const pointOnEllipse = function (cx, cy, rx, ry, zRotation, arcAngle) {
	const cos_rotate = Math.cos(zRotation);
	const sin_rotate = Math.sin(zRotation);
	const cos_arc = Math.cos(arcAngle);
	const sin_arc = Math.sin(arcAngle);
	return [
		cx + cos_rotate * rx * cos_arc + -sin_rotate * ry * sin_arc,
		cy + sin_rotate * rx * cos_arc + cos_rotate * ry * sin_arc,
	];
};

const pathInfo = function (cx, cy, rx, ry, zRotation, arcStart_, deltaArc_) {
	let arcStart = arcStart_;
	if (arcStart < 0 && !Number.isNaN(arcStart)) {
		while (arcStart < 0) {
			arcStart += Math.PI * 2;
		}
	}
	const deltaArc = deltaArc_ > Math.PI * 2 ? Math.PI * 2 : deltaArc_;
	const start = pointOnEllipse(cx, cy, rx, ry, zRotation, arcStart);
	// we need to divide the circle in half and make 2 arcs
	const middle = pointOnEllipse(cx, cy, rx, ry, zRotation, arcStart + deltaArc / 2);
	const end = pointOnEllipse(cx, cy, rx, ry, zRotation, arcStart + deltaArc);
	const fa = ((deltaArc / 2) > Math.PI) ? 1 : 0;
	const fs = ((deltaArc / 2) > 0) ? 1 : 0;
	return {
		x1: start[0],
		y1: start[1],
		x2: middle[0],
		y2: middle[1],
		x3: end[0],
		y3: end[1],
		fa,
		fs,
	};
};

const cln = n => cleanNumber(n, 4);

// (rx ry x-axis-rotation large-arc-flag sweep-flag x y)+
const ellipticalArcTo = (rx, ry, phi_degrees, fa, fs, endX, endY) => (
	`A${cln(rx)} ${cln(ry)} ${cln(phi_degrees)} ${cln(fa)} ${cln(fs)} ${cln(endX)} ${cln(endY)}`
);

/**
 * Math (c) Kraft
 */

// // (rx ry x-axis-rotation large-arc-flag sweep-flag x y)+
// const circleArcTo = (radius, end) =>
//   `A${radius} ${radius} 0 0 0 ${end[0]} ${end[1]}`;

// const circlePoint = (origin, radius, angle) => [
//   origin[0] + radius * Math.cos(angle),
//   origin[1] + radius * Math.sin(angle),
// ];

// const circlePoints = c => Array.from(Array(count))
//   .map((_, i) => { return })

const CircleMethods = {
	nearestPoint: function () {
		return Constructors.vector(nearestPointOnCircle(
			this.radius,
			this.origin,
			getVector(arguments),
		));
	},

	intersect: function (object) {
		return intersect(this, object);
	},

	overlap: function (object) {
		return overlap(this, object);
	},

	svgPath: function (arcStart = 0, deltaArc = Math.PI * 2) {
		const info = pathInfo(this.origin[0], this.origin[1], this.radius, this.radius, 0, arcStart, deltaArc);
		const arc1 = ellipticalArcTo(this.radius, this.radius, 0, info.fa, info.fs, info.x2, info.y2);
		const arc2 = ellipticalArcTo(this.radius, this.radius, 0, info.fa, info.fs, info.x3, info.y3);
		return `M${info.x1} ${info.y1}${arc1}${arc2}`;

		// const arcMid = arcStart + deltaArc / 2;
		// const start = circlePoint(this.origin, this.radius, arcStart);
		// const mid = circlePoint(this.origin, this.radius, arcMid);
		// const end = circlePoint(this.origin, this.radius, arcStart + deltaArc);
		// const arc1 = circleArcTo(this.radius, mid);
		// const arc2 = circleArcTo(this.radius, end);
		// return `M${cln(start[0])} ${cln(start[1])}${arc1}${arc2}`;
	},
	points: function (count = 128) {
		return Array.from(Array(count))
			.map((_, i) => ((2 * Math.PI) / count) * i)
			.map(angle => [
				this.origin[0] + this.radius * Math.cos(angle),
				this.origin[1] + this.radius * Math.sin(angle),
			]);
	},
	polygon: function () {
		return Constructors.polygon(this.points(arguments[0]));
	},
	segments: function () {
		const points = this.points(arguments[0]);
		return points.map((point, i) => {
			const nextI = (i + 1) % points.length;
			return [point, points[nextI]];
		}); // .map(a => Constructors.segment(...a));
	},
};

/**
 * Math (c) Kraft
 */

const CircleStatic = {
	fromPoints: function () {
		if (arguments.length === 3) {
			const result = circumcircle(...arguments);
			return this.constructor(result.radius, result.origin);
		}
		return this.constructor(...arguments);
	},
	fromThreePoints: function () {
		const result = circumcircle(...arguments);
		return this.constructor(result.radius, result.origin);
	},
};

/**
 * Math (c) Kraft
 */

var Circle = {
	circle: {
		A: CircleArgs,
		G: CircleGetters,
		M: CircleMethods,
		S: CircleStatic,
	},
};

/**
 * Math (c) Kraft
 */

const getFoci = function (center, rx, ry, spin) {
	const order = rx > ry;
	const lsq = order ? (rx ** 2) - (ry ** 2) : (ry ** 2) - (rx ** 2);
	const l = Math.sqrt(lsq);
	const trigX = order ? Math.cos(spin) : Math.sin(spin);
	const trigY = order ? Math.sin(spin) : Math.cos(spin);
	return [
		Constructors.vector(center[0] + l * trigX, center[1] + l * trigY),
		Constructors.vector(center[0] - l * trigX, center[1] - l * trigY),
	];
};

var Ellipse = {
	ellipse: {
		A: function () {
			// const arr = Array.from(arguments);
			const numbers = flattenArrays(arguments).filter(a => !Number.isNaN(a));
			const params = resize(5, numbers);
			this.rx = params[0];
			this.ry = params[1];
			this.origin = Constructors.vector(params[2], params[3]);
			this.spin = params[4];
			this.foci = getFoci(this.origin, this.rx, this.ry, this.spin);
			// const numbers = arr.filter(param => !isNaN(param));
			// const vectors = getVector_of_vectors(arr);
			// if (numbers.length === 4) {
			//   // this.origin = Constructors.vector(numbers[0], numbers[1]);
			//   // this.rx = numbers[2];
			//   // this.ry = numbers[3];
			// } else if (vectors.length === 2) {
			//   // two foci
			//   // this.radius = distance2(...vectors);
			//   // this.origin = Constructors.vector(...vectors[0]);
			// }
		},

		// todo, ellipse is not ready to have a Z yet. figure out arguments first
		G: {
			x: function () { return this.origin[0]; },
			y: function () { return this.origin[1]; },
			// z: function () { return this.origin[2]; },
		},
		M: {
			// nearestPoint: function () {
			//   return Constructors.vector(nearest_point_on_ellipse(
			//     this.origin,
			//     this.radius,
			//     getVector(arguments)
			//   ));
			// },
			// intersect: function (object) {
			//   return Intersect(this, object);
			// },
			svgPath: function (arcStart = 0, deltaArc = Math.PI * 2) {
				const info = pathInfo(
					this.origin[0],
					this.origin[1],
					this.rx,
					this.ry,
					this.spin,
					arcStart,
					deltaArc,
				);
				const arc1 = ellipticalArcTo(this.rx, this.ry, (this.spin / Math.PI)
					* 180, info.fa, info.fs, info.x2, info.y2);
				const arc2 = ellipticalArcTo(this.rx, this.ry, (this.spin / Math.PI)
					* 180, info.fa, info.fs, info.x3, info.y3);
				return `M${info.x1} ${info.y1}${arc1}${arc2}`;
			},
			points: function (count = 128) {
				return Array.from(Array(count))
					.map((_, i) => ((2 * Math.PI) / count) * i)
					.map(angle => pointOnEllipse(
						this.origin.x,
						this.origin.y,
						this.rx,
						this.ry,
						this.spin,
						angle,
					));
			},
			polygon: function () {
				return Constructors.polygon(this.points(arguments[0]));
			},
			segments: function () {
				const points = this.points(arguments[0]);
				return points.map((point, i) => {
					const nextI = (i + 1) % points.length;
					return [point, points[nextI]];
				}); // .map(a => Constructors.segment(...a));
			},

		},

		S: {
			// static methods
			// fromPoints: function () {
			//   const points = getVector_of_vectors(arguments);
			//   return Constructors.circle(points, distance2(points[0], points[1]));
			// }
		},
	},
};

/**
 * Math (c) Kraft
 */

// a polygon is expecting to have these properties:
// this - an array of vectors in [] form
// this.points - same as above
// this.sides - array edge pairs of points
// this.vectors - non-normalized vectors relating to this.sides.
const PolygonMethods = {
	/**
	 * @description calculate the signed area of this polygon
	 * @returns {number} the signed area
	 */
	area: function () {
		return signedArea(this);
	},
	// midpoint: function () { return average(this); },
	centroid: function () {
		return Constructors.vector(centroid(this));
	},
	boundingBox: function () {
		return boundingBox(this);
	},
	// contains: function () {
	//   return overlap_convex_polygon_point(this, getVector(arguments));
	// },
	straightSkeleton: function () {
		return straightSkeleton(this);
	},
	// scale will return a rect for rectangles, otherwise polygon
	scale: function (magnitude, center = centroid(this)) {
		const newPoints = this
			.map(p => [0, 1].map((_, i) => p[i] - center[i]))
			.map(vec => vec.map((_, i) => center[i] + vec[i] * magnitude));
		return this.constructor.fromPoints(newPoints);
	},
	rotate: function (angle, centerPoint = centroid(this)) {
		const newPoints = this.map((p) => {
			const vec = [p[0] - centerPoint[0], p[1] - centerPoint[1]];
			const mag = Math.sqrt((vec[0] ** 2) + (vec[1] ** 2));
			const a = Math.atan2(vec[1], vec[0]);
			return [
				centerPoint[0] + Math.cos(a + angle) * mag,
				centerPoint[1] + Math.sin(a + angle) * mag,
			];
		});
		return Constructors.polygon(newPoints);
	},
	translate: function () {
		const vec = getVector(...arguments);
		const newPoints = this.map(p => p.map((n, i) => n + vec[i]));
		return this.constructor.fromPoints(newPoints);
	},
	transform: function () {
		const m = getMatrix3x4(...arguments);
		const newPoints = this
			.map(p => multiplyMatrix3Vector3(m, resize(3, p)));
		return Constructors.polygon(newPoints);
	},
	// sectors: function () {
	//   return this.map((p, i, arr) => {
	//     const prev = (i + arr.length - 1) % arr.length;
	//     const next = (i + 1) % arr.length;
	//     const center = p;
	//     const a = arr[prev].map((n, j) => n - center[j]);
	//     const b = arr[next].map((n, j) => n - center[j]);
	//     return Constructors.sector(b, a, center);
	//   });
	// },
	nearest: function () {
		const point = getVector(...arguments);
		const result = nearestPointOnPolygon(this, point);
		return result === undefined
			? undefined
			: Object.assign(result, { edge: this.sides[result.i] });
	},
	split: function () {
		const line = getLine(...arguments);
		// const split_func = this.isConvex ? splitConvexPolygon : split_polygon;
		const split_func = splitConvexPolygon;
		return split_func(this, line.vector, line.origin)
			.map(poly => Constructors.polygon(poly));
	},
	overlap: function () {
		return overlap(this, ...arguments);
	},
	intersect: function () {
		return intersect(this, ...arguments);
	},
	clip: function (line_type, epsilon) {
		const fn_line = line_type.domain_function ? line_type.domain_function : includeL;
		const segment = clipLineConvexPolygon(
			this,
			line_type.vector,
			line_type.origin,
			this.domain_function,
			fn_line,
			epsilon,
		);
		return segment ? Constructors.segment(segment) : undefined;
	},
	svgPath: function () {
		// make every point a Move or Line command, append with a "z" (close path)
		const pre = Array(this.length).fill("L");
		pre[0] = "M";
		return `${this.map((p, i) => `${pre[i]}${p[0]} ${p[1]}`).join("")}z`;
	},
};

/**
 * Math (c) Kraft
 */

/**
 * this Rectangle type is aligned to the axes for speedy calculation.
 * for a rectangle that can be rotated, use Polygon or ConvexPolygon
 */
const rectToPoints = r => [
	[r.x, r.y],
	[r.x + r.width, r.y],
	[r.x + r.width, r.y + r.height],
	[r.x, r.y + r.height],
];

const rectToSides = r => [
	[[r.x, r.y], [r.x + r.width, r.y]],
	[[r.x + r.width, r.y], [r.x + r.width, r.y + r.height]],
	[[r.x + r.width, r.y + r.height], [r.x, r.y + r.height]],
	[[r.x, r.y + r.height], [r.x, r.y]],
];

var Rect = {
	rect: {
		P: Array.prototype,
		A: function () {
			const r = getRect(...arguments);
			this.width = r.width;
			this.height = r.height;
			this.origin = Constructors.vector(r.x, r.y);
			this.push(...rectToPoints(this));
			Object.defineProperty(this, "domain_function", { writable: true, value: include });
		},
		G: {
			x: function () { return this.origin[0]; },
			y: function () { return this.origin[1]; },
			center: function () {
				return Constructors.vector(
					this.origin[0] + this.width / 2,
					this.origin[1] + this.height / 2,
				);
			},
		},
		M: Object.assign({}, PolygonMethods, {
			inclusive: function () { this.domain_function = include; return this; },
			exclusive: function () { this.domain_function = exclude; return this; },
			area: function () { return this.width * this.height; },
			segments: function () { return rectToSides(this); },
			svgPath: function () {
				return `M${this.origin.join(" ")}h${this.width}v${this.height}h${-this.width}Z`;
			},
		}),
		S: {
			fromPoints: function () {
				const box = boundingBox(getVectorOfVectors(arguments));
				return Constructors.rect(box.min[0], box.min[1], box.span[0], box.span[1]);
			},
		},
	},
};

/**
 * Math (c) Kraft
 */

var Polygon = {
	polygon: {
		P: Array.prototype,
		A: function () {
			this.push(...semiFlattenArrays(arguments));
			// this.points = semiFlattenArrays(arguments);
			// .map(v => Constructors.vector(v));
			this.sides = this
				.map((p, i, arr) => [p, arr[(i + 1) % arr.length]]);
			// .map(ps => Constructors.segment(ps[0][0], ps[0][1], ps[1][0], ps[1][1]));
			this.vectors = this.sides.map(side => subtract(side[1], side[0]));
			// this.sectors
			Object.defineProperty(this, "domain_function", { writable: true, value: include });
		},
		G: {
			// todo: convex test
			isConvex: function () {
				return undefined;
			},
			points: function () {
				return this;
			},
			// edges: function () {
			//   return this.sides;
			// },
		},
		M: Object.assign({}, PolygonMethods, {
			inclusive: function () { this.domain_function = include; return this; },
			exclusive: function () { this.domain_function = exclude; return this; },
			segments: function () {
				return this.sides;
			},
		}),
		S: {
			fromPoints: function () {
				return this.constructor(...arguments);
			},
			regularPolygon: function () {
				return this.constructor(makePolygonCircumradius(...arguments));
			},
			convexHull: function () {
				return this.constructor(convexHull(...arguments));
			},
		},
	},
};

/**
 * Math (c) Kraft
 */

var Polyline = {
	polyline: {
		P: Array.prototype,
		A: function () {
			this.push(...semiFlattenArrays(arguments));
			// .map(v => Constructors.vector(v));
			// this.sides = this
			//   .map((p, i, arr) => [p, arr[(i + 1) % arr.length]]);
			// this.sides.pop(); // polylines are not closed. remove the last segment
			// .map(ps => Constructors.segment(ps[0][0], ps[0][1], ps[1][0], ps[1][1]));
			// this.vectors = this.sides.map(side => subtract(side[1], side[0]));
			// this.sectors
		},
		G: {
			points: function () {
				return this;
			},
			// edges: function () {
			//   return this.sides;
			// },
		},
		M: {
			// segments: function () {
			//   return this.sides;
			// },
			svgPath: function () {
				// make every point a Move or Line command, no closed path at the end
				const pre = Array(this.length).fill("L");
				pre[0] = "M";
				return `${this.map((p, i) => `${pre[i]}${p[0]} ${p[1]}`).join("")}`;
			},

		},
		S: {
			fromPoints: function () {
				return this.constructor(...arguments);
			},
		},
	},
};

/**
 * Math (c) Kraft
 */

/**
 * 3D Matrix (3x4) with translation component in x,y,z. column-major order
 *
 *   x y z translation
 *   | | | |           indices
 * [ 1 0 0 0 ]   x   [ 0 3 6 9 ]
 * [ 0 1 0 0 ]   y   [ 1 4 7 10]
 * [ 0 0 1 0 ]   z   [ 2 5 8 11]
 */

// this is 4x faster than calling Object.assign(thisMat, mat)
const array_assign = (thisMat, mat) => {
	for (let i = 0; i < 12; i += 1) {
		thisMat[i] = mat[i];
	}
	return thisMat;
};

var Matrix = {
	matrix: {
		P: Array.prototype,

		A: function () {
			// [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0].forEach(m => this.push(m));
			getMatrix3x4(arguments).forEach(m => this.push(m));
		},

		G: {
		},

		M: {
			copy: function () { return Constructors.matrix(...Array.from(this)); },
			set: function () {
				return array_assign(this, getMatrix3x4(arguments));
			},
			isIdentity: function () { return isIdentity3x4(this); },
			// todo: is this right, on the right hand side?
			multiply: function (mat) {
				return array_assign(this, multiplyMatrices3(this, mat));
			},
			determinant: function () {
				return determinant3(this);
			},
			inverse: function () {
				return array_assign(this, invertMatrix3(this));
			},
			// todo: is this the right order (this, transform)?
			translate: function (x, y, z) {
				return array_assign(
					this,
					multiplyMatrices3(this, makeMatrix3Translate(x, y, z)),
				);
			},
			rotateX: function (radians) {
				return array_assign(
					this,
					multiplyMatrices3(this, makeMatrix3RotateX(radians)),
				);
			},
			rotateY: function (radians) {
				return array_assign(
					this,
					multiplyMatrices3(this, makeMatrix3RotateY(radians)),
				);
			},
			rotateZ: function (radians) {
				return array_assign(
					this,
					multiplyMatrices3(this, makeMatrix3RotateZ(radians)),
				);
			},
			rotate: function (radians, vector, origin) {
				const transform = makeMatrix3Rotate(radians, vector, origin);
				return array_assign(this, multiplyMatrices3(this, transform));
			},
			scale: function (amount) {
				return array_assign(
					this,
					multiplyMatrices3(this, makeMatrix3Scale(amount)),
				);
			},
			reflectZ: function (vector, origin) {
				const transform = makeMatrix3ReflectZ(vector, origin);
				return array_assign(this, multiplyMatrices3(this, transform));
			},
			// todo, do type checking
			transform: function (...innerArgs) {
				return Constructors.vector(
					multiplyMatrix3Vector3(this, resize(3, getVector(innerArgs))),
				);
			},
			transformVector: function (vector) {
				return Constructors.vector(
					multiplyMatrix3Vector3(this, resize(3, getVector(vector))),
				);
			},
			transformLine: function (...innerArgs) {
				const l = getLine(innerArgs);
				return Constructors.line(multiplyMatrix3Line3(this, l.vector, l.origin));
			},
		},

		S: {},
	},
};

/**
 * Math (c) Kraft
 */
// import Junction from "./junction/index";
// import Plane from "./plane/index";
// import Matrix2 from "./matrix/matrix2";

// import PolygonPrototype from "./prototypes/polygon";

// Each primitive is defined by these key/values:
// {
//   P: proto- the prototype of the prototype (default: Object.prototype)
//   G: getters- will become Object.defineProperty(___, ___, { get: })
//   M: methods- will become Object.defineProperty(___, ___, { value: })
//   A: args- parse user-arguments, set properties on "this"
//   S: static- static methods added to the constructor
// }
// keys are one letter to shrink minified compile size

const Definitions = Object.assign(
	{},
	Vector,
	Line,
	Ray,
	Segment,
	Circle,
	Ellipse,
	Rect,
	Polygon,
	Polyline,
	Matrix,
	// Junction,
	// Plane,
	// Matrix2,
);

const create = function (primitiveName, args) {
	const a = Object.create(Definitions[primitiveName].proto);
	Definitions[primitiveName].A.apply(a, args);
	return a; // Object.freeze(a); // basically no cost. matrix needs to able to be modified now
};

// these have to be typed out longform like this
// this function name is what appears as the object type name in use
/**
 * @memberof ear
 * @description Make a vector primitive from a sequence of numbers.
 * This vector/point object comes with object methods, the object is **immutable**
 * and methods will return modified copies. The object inherits from Array.prototype
 * so that its components can be accessed via array syntax, [0], [1], or .x, .y, .z properties.
 * There is no limit to the dimensions, some methods like cross product are dimension-specific.
 * @param {...number|number[]} numbers a list of numbers as arguments or inside an array
 * @returns {vector} one vector object
 */
const vector = function () { return create("vector", arguments); };
/**
 * @memberof ear
 * @description Make a line defined by a vector and a point passing through the line.
 * This object comes with object methods and can be used in intersection calculations.
 * @param {number[]} vector the line's vector
 * @param {number[]} origin the line's origin (without this, it will assumed to be the origin)
 * @returns {line} one line object
 */
const line = function () { return create("line", arguments); };
/**
 * @memberof ear
 * @description Make a ray defined by a vector and an origin point.
 * This object comes with object methods and can be used in intersection calculations.
 * @param {number[]} vector the ray's vector
 * @param {number[]} origin the ray's origin (without this, it will assumed to be the origin)
 * @returns {ray} one ray object
 */
const ray = function () { return create("ray", arguments); };
/**
 * @memberof ear
 * @description Make a segment defined by two endpoints. This object comes
 * with object methods and can be used in intersection calculations.
 * @param {number[]} a the first point
 * @param {number[]} b the second point
 * @returns {segment} one segment object
 */
const segment = function () { return create("segment", arguments); };
/**
 * @memberof ear
 * @description Make a circle defined by a radius and a center. This comes with
 * object methods and can be used in intersection calculations.
 * @param {number} radius the circle's radius
 * @param {number[]|...number} origin the center of the circle
 * @returns {circle} one circle object
 */
const circle = function () { return create("circle", arguments); };
/**
 * @memberof ear
 * @description Make an ellipse defined by a two radii and a center. This comes with object methods.
 * @param {number} rx the radius along the x axis
 * @param {number} ry the radius along the y axis
 * @param {number[]} origin the center of the ellipse
 * @param {number} spin the angle of rotation in radians
 * @returns {ellipse} one ellipse object
 */
const ellipse = function () { return create("ellipse", arguments); };
/**
 * @memberof ear
 * @description Make an 2D axis-aligned rectangle defined by a corner point
 * and a width and height. This comes with object methods and can
 * be used in intersection calculations.
 * @param {number} x the x coordinate of the origin
 * @param {number} y the y coordinate of the origin
 * @param {number} width the width of the rectangle
 * @param {number} height the height of the rectangle
 * @returns {rect} one rect object
 */
const rect = function () { return create("rect", arguments); };
/**
 * @memberof ear
 * @description Make a polygon defined by a sequence of points. This comes with
 * object methods and can be used in intersection calculations. The polygon can be non-convex,
 * but some methods only work on convex polygons.
 * @param {number[][]|...number[]} points one array containing points (array of numbers)
 * or a list of points as the arguments.
 * @returns {polygon} one polygon object
 */
const polygon = function () { return create("polygon", arguments); };
/**
 * @memberof ear
 * @description Make a polyline defined by a sequence of points.
 * @param {number[][]|...number[]} points one array containing points (array of numbers)
 * or a list of points as the arguments.
 * @returns {polyline} one polyline object
 */
const polyline = function () { return create("polyline", arguments); };
/**
 * @memberof ear
 * @description Make a 3x4 column-major matrix containing three basis
 * vectors and a translation column. This comes with object methods and
 * this is the one primitive in the library which **is mutable**.
 * @param {number[]|...number} numbers one array of 12 numbers, or 12 numbers listed as parameters.
 * @returns {matrix} one 3x4 matrix object
 */
const matrix = function () { return create("matrix", arguments); };
// const junction = function () { return create("junction", arguments); };
// const plane = function () { return create("plane", arguments); };
// const matrix2 = function () { return create("matrix2", arguments); };

/**
 * @typedef vector
 * @type {object}
 * @description a vector/point primitive. there is no limit to the number of dimensions.
 * @property {number[]} 0...n array indices for the individual vector values.
 */

/**
 * @typedef matrix
 * @type {object}
 * @description a 3x4 matrix representing a transformation in 3D space,
 * including a translation component.
 * @property {number[]} 0...11 array indices for the individual matrix values
 */

/**
 * @typedef line
 * @type {object}
 * @description a line primitive
 * @property {number[]} vector a vector which represents the direction of the line
 * @property {number[]} origin a point that passes through the line
 */

/**
 * @typedef ray
 * @type {object}
 * @description a ray primitive
 * @property {number[]} vector a vector which represents the direction of the line
 * @property {number[]} origin the origin of the ray
 */

/**
 * @typedef segment
 * @type {object}
 * @description a segment primitive, defined by two endpoints
 * @property {number[]} 0 array index 0, the location of the first point
 * @property {number[]} 1 array index 1, the location of the second point
 * @property {number[]} vector a vector which represents the direction and length of the segment
 * @property {number[]} origin the first segment point
 */

/**
 * @typedef rect
 * @type {object}
 * @description an axis-aligned rectangle primitive
 * @property {number} width
 * @property {number} height
 * @property {number[]} origin the bottom left corner (or top level for Y-down computer screens)
 */

/**
 * @typedef circle
 * @type {object}
 * @description a circle primitive
 * @property {number} radius
 * @property {number[]} origin
 */

/**
 * @typedef ellipse
 * @type {object}
 * @description a ellipse primitive
 * @property {number} rx radius in the primary axis
 * @property {number} ry radius in the secondary axis
 * @property {number} spin the angle of rotation through the center in radians
 * @property {number[]} origin the center of the ellipse
 * @property {number[][]} foci array of two points, each focus of the ellipse
 */

/**
 * @typedef polygon
 * @type {object}
 * @description a polygon primitive
 * @property {number[][]} points a sequence of points, each point being an array of numbers
 */

/**
 * @typedef polyline
 * @type {object}
 * @description a polyline primitive
 * @property {number[][]} points a sequence of points, each point being an array of numbers
 */

Object.assign(Constructors, {
	vector,
	line,
	ray,
	segment,
	circle,
	ellipse,
	rect,
	polygon,
	polyline,
	matrix,
	// junction,
	// plane,
	// matrix2,
});

// build prototypes
Object.keys(Definitions).forEach(primitiveName => {
	// create the prototype
	const Proto = {};
	Proto.prototype = Definitions[primitiveName].P != null
		? Object.create(Definitions[primitiveName].P)
		: Object.create(Object.prototype);
	Proto.prototype.constructor = Proto;

	// make this present in the prototype chain so "instanceof" works
	Constructors[primitiveName].prototype = Proto.prototype;
	Constructors[primitiveName].prototype.constructor = Constructors[primitiveName];

	// getters
	Object.keys(Definitions[primitiveName].G)
		.forEach(key => Object.defineProperty(Proto.prototype, key, {
			get: Definitions[primitiveName].G[key],
			// enumerable: true
		}));

	// methods
	Object.keys(Definitions[primitiveName].M)
		.forEach(key => Object.defineProperty(Proto.prototype, key, {
			value: Definitions[primitiveName].M[key],
		}));

	// applied to the constructor not the prototype
	Object.keys(Definitions[primitiveName].S)
		.forEach(key => Object.defineProperty(Constructors[primitiveName], key, {
			// bind to the prototype, this.constructor will point to the constructor
			value: Definitions[primitiveName].S[key]
				.bind(Constructors[primitiveName].prototype),
		}));

	// done with prototype
	// Object.freeze(Proto.prototype); // now able to be modified from the outside

	// store the prototype on the Definition, to be called during instantiation
	Definitions[primitiveName].proto = Proto.prototype;
});

/**
 * Math (c) Kraft
 */
/**
 * @description A collection of math functions with a focus on linear algebra,
 * computational geometry, intersection of shapes, and some origami-specific operations.
 */
const math = Constructors;
// const math = Object.create(null);
/*
 * the logic is under ".core", the primitives are under the top level.
 * the primitives have arguments type inference. the logic core is strict:
 *
 * points are array syntax [x,y]
 * segments are pairs of points [x,y], [x,y]
 * lines/rays are point-array value objects { vector: [x,y], origin: [x,y] }
 * polygons are an ordered set of points [[x,y], [x,y], ...]
 *
 * the primitives store object methods under their prototype,
 * the top level has properties like x, y, z.
 */
math.core = Object.assign(
	Object.create(null),
	constants,
	resizers,
	getters,
	functions,
	algebra,
	sort,

	radial,
	convexHull$1,
	pleat$1,
	polygons,
	radial,

	matrix2,
	matrix3,
	nearest,
	parameterize,
	generalIntersect,
	encloses,
	{
		intersectConvexPolygonLine,
		intersectCircleCircle,
		intersectCircleLine,
		intersectLineLine,
		overlapConvexPolygons,
		overlapConvexPolygonPoint,
		overlapBoundingBoxes,
		overlapLineLine,
		overlapLinePoint,
		clipLineConvexPolygon,
		clipPolygonPolygon,
		splitConvexPolygon,
		straightSkeleton,
	},
);

math.typeof = typeOf;
math.intersect = intersect;
math.overlap = overlap;

export { math as default };
