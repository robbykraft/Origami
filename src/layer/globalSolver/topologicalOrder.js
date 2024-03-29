/**
 * Rabbit Ear (c) Kraft
 */
/**
 * @description find a topological ordering from a set of facePairOrders
 * @param {object} facePairOrders a solution of face layer facePairOrders where
 * the keys are space-separated pair of faces, and the value is +1 0 or -1.
 * @param {FOLD} graph an optional FOLD graph
 * @returns {number[]} layers_face, for every layer (key) which face (value) inhabits it.
 * @linkcode Origami ./src/layer/globalSolver/topologicalOrder.js 10
 */
const topologicalOrder = (facePairOrders, graph) => {
	if (!facePairOrders) { return []; }
	const faces_children = [];
	// use the facePairOrders face pair relationships to fill an array where
	// index: face, value: array of the face's children (faces below the face)
	Object.keys(facePairOrders).forEach(key => {
		const pair = key.split(" ").map(n => parseInt(n, 10));
		if (facePairOrders[key] === -1) { pair.reverse(); }
		if (faces_children[pair[0]] === undefined) {
			faces_children[pair[0]] = [];
		}
		faces_children[pair[0]].push(pair[1]);
	});
	// not all faces are encoded in the facePairOrders. use the graph to fill in
	// any remaining faces with empty arrays (no child faces / faces below)
	if (graph && graph.faces_vertices) {
		graph.faces_vertices.forEach((_, f) => {
			if (faces_children[f] === undefined) {
				faces_children[f] = [];
			}
		});
	}
	// console.log("faces_children", JSON.parse(JSON.stringify(faces_children)));
	const layers_face = [];
	const faces_visited = [];
	let protection = 0;
	for (let f = 0; f < faces_children.length; f += 1) {
		if (faces_visited[f]) { continue; }
		const stack = [f];
		while (stack.length && protection < faces_children.length * 2) {
			const stack_end = stack[stack.length - 1];
			if (faces_children[stack_end] && faces_children[stack_end].length) {
				const next = faces_children[stack_end].pop();
				if (!faces_visited[next]) { stack.push(next); }
				continue;
			} else {
				// we reached a leaf, add it to the layers.
				layers_face.push(stack_end);
				faces_visited[stack_end] = true;
				stack.pop();
			}
			protection += 1;
		}
	}
	// console.log("faces_children", faces_children);
	// console.log("protection", protection);
	if (protection >= faces_children.length * 2) {
		console.warn("fix protection in topological order");
	}
	// console.log("layers_face", layers_face);
	// console.log("faces_visited", faces_visited);
	return layers_face;
};

export default topologicalOrder;
