/**
 * Rabbit Ear (c) Kraft
 */
/**
 * @description Convert an array of faces which are involved in one
 * taco/tortilla/transitivity condition into an array of arrays where
 * each face is paired with the others in the precise combination that
 * the solver is expecting for this particular condition.
 * @param {number[]} an array of the faces involved in this particular condition.
 * @linkcode Origami ./src/layer/solver2d/general.js 11
 */
export const constraintToFacePairs = ({
	// taco_taco (A,C) (B,D) (B,C) (A,D) (A,B) (C,D)
	taco_taco: f => [
		[f[0], f[2]],
		[f[1], f[3]],
		[f[1], f[2]],
		[f[0], f[3]],
		[f[0], f[1]],
		[f[2], f[3]],
	],
	// taco_tortilla (A,C) (A,B) (B,C)
	taco_tortilla: f => [[f[0], f[2]], [f[0], f[1]], [f[1], f[2]]],
	// tortilla_tortilla (A,C) (B,D)
	tortilla_tortilla: f => [[f[0], f[2]], [f[1], f[3]]],
	// transitivity (A,B) (B,C) (C,A)
	transitivity: f => [[f[0], f[1]], [f[1], f[2]], [f[2], f[0]]],
});
/**
 * @description Given an array of a pair of integers, sort the smallest
 * to be first, and format them into a space-separated string.
 * @linkcode Origami ./src/layer/solver2d/general.js 33
 */
const pairArrayToSortedPairString = pair => (pair[0] < pair[1]
	? `${pair[0]} ${pair[1]}`
	: `${pair[1]} ${pair[0]}`);
/**
 * @description Convert an array of faces which are involved in one
 * taco/tortilla/transitivity condition into an array of arrays where
 * each face is paired with the others in the precise combination that
 * the solver is expecting for this particular condition.
 * @param {number[]} an array of the faces involved in this particular condition.
 * @linkcode Origami ./src/layer/solver2d/general.js 44
 */
export const constraintToFacePairsStrings = ({
	// taco_taco (A,C) (B,D) (B,C) (A,D) (A,B) (C,D)
	taco_taco: f => [
		pairArrayToSortedPairString([f[0], f[2]]),
		pairArrayToSortedPairString([f[1], f[3]]),
		pairArrayToSortedPairString([f[1], f[2]]),
		pairArrayToSortedPairString([f[0], f[3]]),
		pairArrayToSortedPairString([f[0], f[1]]),
		pairArrayToSortedPairString([f[2], f[3]]),
	],
	// taco_tortilla (A,C) (A,B) (B,C)
	taco_tortilla: f => [
		pairArrayToSortedPairString([f[0], f[2]]),
		pairArrayToSortedPairString([f[0], f[1]]),
		pairArrayToSortedPairString([f[1], f[2]]),
	],
	// tortilla_tortilla (A,C) (B,D)
	tortilla_tortilla: f => [
		pairArrayToSortedPairString([f[0], f[2]]),
		pairArrayToSortedPairString([f[1], f[3]]),
	],
	// transitivity (A,B) (B,C) (C,A)
	transitivity: f => [
		pairArrayToSortedPairString([f[0], f[1]]),
		pairArrayToSortedPairString([f[1], f[2]]),
		pairArrayToSortedPairString([f[2], f[0]]),
	],
});

const signedLayerSolverValue = { 0: 0, 1: 1, 2: -1 };
/**
 * @description Convert a solution of facePairOrders with face-pair strings
 * as keys, and +1 or -1 as values, into a list of FOLD spec faceOrders,
 * where the normal of the second face in the pair establishes which
 * side is + or - for face A to exist on.
 * @param {object} facePairOrders an object with face-pair keys and +1/-1 value
 * @param {boolean[]} faces_winding for every face, is the face aligned
 * with the stacking-axis which was used in the layer solver.
 * @returns {number[][]} faceOrders array
 * @linkcode Origami ./src/layer/solver2d/general.js 81
 */
export const solverSolutionToFaceOrders = (facePairOrders, faces_winding) => {
	const keys = Object.keys(facePairOrders);
	const faceOrders = keys.map(string => string.split(" ").map(n => parseInt(n, 10)));
	faceOrders.forEach((faces, i) => {
		const value = signedLayerSolverValue[facePairOrders[keys[i]]];
		const side = (!faces_winding[faces[1]]) ? -value : value;
		// const side = (((value === 1) ^ (faces_aligned[faces[1]])) * -2) + 1;
		faces.push(side);
	});
	return faceOrders;
};
