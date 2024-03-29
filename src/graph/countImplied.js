/**
 * Rabbit Ear (c) Kraft
 */
import * as S from "../general/strings";
import { getGraphKeysWithSuffix } from "../fold/spec";
/**
 * @description Search inside arrays inside arrays and return
 * the largest number.
 * @returns {number} largest number in array in arrays.
 */
const array_in_array_max_number = (arrays) => {
	let max = -1; // will become 0 if nothing is found
	arrays
		.filter(a => a !== undefined)
		.forEach(arr => arr
			.forEach(el => el
				.forEach((e) => {
					if (e > max) { max = e; }
				})));
	return max;
};
/**
 * @description Search inside arrays inside arrays and return
 * the largest number by only checking indices 0 and 1 in the
 * inner arrays.
 * @returns {number} largest number in indices 0 or 1 of array in arrays.
 */
const max_num_in_orders = (array) => {
	let max = -1; // will become 0 if nothing is found
	array.forEach(el => {
		// exception. index 2 is orientation, not index. check only 0, 1
		if (el[0] > max) { max = el[0]; }
		if (el[1] > max) { max = el[1]; }
	});
	return max;
}
const ordersArrayNames = {
	edges: "edgeOrders",
	faces: "faceOrders",
};
/**
 * @description Get the number of vertices, edges, or faces in the graph, as
 * evidenced by their appearance in other arrays; ie: searching faces_vertices
 * for the largest vertex index, and inferring number of vertices is that long.
 * @param {FOLD} graph a FOLD graph
 * @param {string} key the prefix for a key, eg: "vertices"
 * @returns {number} the number of vertices, edges, or faces in the graph.
 * @linkcode Origami ./src/graph/countImplied.js 48
 */
const countImplied = (graph, key) => Math.max(
	// return the maximum value between (1/2):
	// 1. a found geometry in another geometry's array ("vertex" in "faces_vertices")
	array_in_array_max_number(
		getGraphKeysWithSuffix(graph, key).map(str => graph[str]),
	),
	// 2. a found geometry in a faceOrders or edgeOrders type of array (special case)
	graph[ordersArrayNames[key]]
		? max_num_in_orders(graph[ordersArrayNames[key]])
		: -1,
) + 1;

// standard graph components names
countImplied.vertices = graph => countImplied(graph, S._vertices);
countImplied.edges = graph => countImplied(graph, S._edges);
countImplied.faces = graph => countImplied(graph, S._faces);

export default countImplied;
