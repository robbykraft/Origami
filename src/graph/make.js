/**
 * Rabbit Ear (c) Kraft
 */
import math from "../math";
import implied from "./countImplied";
import {
	planarVertexWalk,
	filterWalkedBoundaryFace,
} from "./walk";
import { sortVerticesCounterClockwise } from "./sort";
/**
 * all of the graph methods follow a similar format.
 * the first argument is a FOLD graph. and the graph remains unmodified.
 * the method returns the data array.
 *
 * if you want to modify the input graph, assign the property after making it
 *  var graph = {...};
 *  graph.faces_faces = makeFacesFaces(graph);
 */
/**
 *
 *    VERTICES
 *
 */
/**
 * @description Make `vertices_edges` from `edges_vertices`, unsorted, which should
 * be used sparingly. Prefer makeVerticesEdges().
 * @param {FOLD} graph a FOLD object, containing edges_vertices
 * @returns {number[][]} array of array of numbers, where each row corresponds to a
 * vertex index and the values in the inner array are edge indices.
 * @linkcode Origami ./src/graph/make.js 31
 */
export const makeVerticesEdgesUnsorted = ({ edges_vertices }) => {
	const vertices_edges = [];
	// iterate over edges_vertices and swap the index for each of the contents
	// each edge (index 0: [3, 4]) will be converted into (index 3: [0], index 4: [0])
	// repeat. append to each array.
	edges_vertices.forEach((ev, i) => ev
		.forEach((v) => {
			if (vertices_edges[v] === undefined) {
				vertices_edges[v] = [];
			}
			vertices_edges[v].push(i);
		}));
	return vertices_edges;
};
/**
 * @description Make `vertices_edges` sorted, so that the edges are sorted
 * radially around the vertex, corresponding with the order in `vertices_vertices`.
 * @param {FOLD} graph a FOLD object, containing edges_vertices, vertices_vertices
 * @returns {number[][]} array of array of numbers, where each row corresponds to a
 * vertex index and the values in the inner array are edge indices.
 * @linkcode Origami ./src/graph/make.js 53
 */
export const makeVerticesEdges = ({ edges_vertices, vertices_vertices }) => {
	const edge_map = makeVerticesToEdgeBidirectional({ edges_vertices });
	return vertices_vertices
		.map((verts, i) => verts
			.map(v => edge_map[`${i} ${v}`]));
};
/**
 * discover adjacent vertices by way of their edge relationships.
 *
 * required FOLD arrays:
 * - vertices_coords
 * - edges_vertices
 *
 * helpful FOLD arrays: (will be made anyway)
 * - vertices_edges
 *
 * editor note: i almost rewrote this by caching edges_vector, making it
 * resemble the make_faces_vertices but the elegance of this simpler solution
 * feels like it outweighed the added complexity. it's worth revisiting tho.
 *
 * note: it is possible to rewrite this method to use faces_vertices to
 * discover adjacent vertices, currently this is 
 */
/**
 * @description Make `vertices_vertices` sorted radially counter-clockwise.
 * @param {FOLD} graph a FOLD object, containing vertices_coords, vertices_edges, edges_vertices
 * @returns {number[][]} array of array of numbers, where each row corresponds to a
 * vertex index and the values in the inner array are vertex indices.
 * @linkcode Origami ./src/graph/make.js 83
 */
export const makeVerticesVertices = ({ vertices_coords, vertices_edges, edges_vertices }) => {
	if (!vertices_edges) {
		vertices_edges = makeVerticesEdgesUnsorted({ edges_vertices });
	}
	// use adjacent edges to find adjacent vertices
	const vertices_vertices = vertices_edges
		.map((edges, v) => edges
			// the adjacent edge's edges_vertices also contains this vertex,
			// filter it out and we're left with the adjacent vertices
			.map(edge => edges_vertices[edge]
				.filter(i => i !== v))
			.reduce((a, b) => a.concat(b), []));
	return vertices_coords === undefined
		? vertices_vertices
		: vertices_vertices
			.map((verts, i) => sortVerticesCounterClockwise({ vertices_coords }, verts, i));
};
/**
 * @description Make `vertices_faces` **not sorted** counter-clockwise,
 * which should be used sparingly. Prefer makeVerticesFaces().
 * @param {FOLD} graph a FOLD object, containing vertices_coords, faces_vertices
 * @returns {number[][]} array of array of numbers, where each row corresponds to a
 * vertex index and the values in the inner array are face indices.
 * @linkcode Origami ./src/graph/make.js 108
 */
export const makeVerticesFacesUnsorted = ({ vertices_coords, faces_vertices }) => {
	if (!faces_vertices) { return vertices_coords.map(() => []); }
	// instead of initializing the array ahead of time (we would need to know
	// the length of something like vertices_coords)
	const vertices_faces = vertices_coords !== undefined
		? vertices_coords.map(() => [])
		: Array.from(Array(implied.vertices({ faces_vertices }))).map(() => []);
	// iterate over every face, then iterate over each of the face's vertices
	faces_vertices.forEach((face, f) => {
		// in the case that one face visits the same vertex multiple times,
		// this hash acts as an intermediary, basically functioning like a set,
		// and only allow one occurence of each vertex index.
		const hash = [];
		face.forEach((vertex) => { hash[vertex] = f; });
		hash.forEach((fa, v) => vertices_faces[v].push(fa));
	});
	return vertices_faces;
};
/**
 * @description Make `vertices_faces` sorted counter-clockwise.
 * @param {FOLD} graph a FOLD object, containing vertices_coords, vertices_vertices, faces_vertices
 * @returns {number[][]} array of array of numbers, where each row corresponds to a
 * vertex index and the values in the inner array are face indices.
 * @linkcode Origami ./src/graph/make.js 133
 */
export const makeVerticesFaces = ({ vertices_coords, vertices_vertices, faces_vertices }) => {
	if (!faces_vertices) { return vertices_coords.map(() => []); }
	if (!vertices_vertices) {
		return makeVerticesFacesUnsorted({ vertices_coords, faces_vertices });
	}
	const face_map = makeVerticesToFace({ faces_vertices });
	return vertices_vertices
		.map((verts, v) => verts
			.map((vert, i, arr) => [arr[(i + 1) % arr.length], v, vert]
				.join(" ")))
		.map(keys => keys
			.map(key => face_map[key]));
	// .filter(a => a !== undefined) // removed. read below.
};
// the old version of this method contained a filter to remove "undefined".
// because in the case of a boundary vertex of a closed polygon shape, there
// is no face that winds backwards around the piece and encloses infinity.
// unfortunately, this disconnects the index match with vertices_vertices.
/**
 * *not a geometry array*
 *
 * for fast backwards lookup of a edge by its vertices. this dictionary:
 * keys are each edge's vertices as a string separated by a space: "9 3"
 * value is the index of the edge.
 * example: "9 3" and "3 9" are both entries with a value of the edge's index.
 */
/**
 * @description Make an object which answers the question: "which edge connects
 * these two vertices?". This is accomplished by building an object with keys
 * containing vertex pairs (space separated string), and the value is the edge index.
 * This is bidirectional, so "7 15" and "15 7" are both keys that point to the same edge.
 * @param {FOLD} graph a FOLD object, containing edges_vertices
 * @returns {object} space-separated vertex pair keys, edge indices values
 * @linkcode Origami ./src/graph/make.js 168
 */
export const makeVerticesToEdgeBidirectional = ({ edges_vertices }) => {
	const map = {};
	edges_vertices
		.map(ev => ev.join(" "))
		.forEach((key, i) => { map[key] = i; });
	edges_vertices
		.map(ev => `${ev[1]} ${ev[0]}`)
		.forEach((key, i) => { map[key] = i; });
	return map;
};
/**
 * @description Make an object which answers the question: "which edge connects
 * these two vertices?". This is accomplished by building an object with keys
 * containing vertex pairs (space separated string), and the value is the edge index.
 * This is not bidirectional, so "7 15" can exist while "15 7" does not. This is useful
 * for example for looking up the edge's vector, which is direction specific.
 * @param {FOLD} graph a FOLD object, containing edges_vertices
 * @returns {object} space-separated vertex pair keys, edge indices values
 * @linkcode Origami ./src/graph/make.js 188
 */
export const makeVerticesToEdge = ({ edges_vertices }) => {
	const map = {};
	edges_vertices
		.map(ev => ev.join(" "))
		.forEach((key, i) => { map[key] = i; });
	return map;
};
/**
 * @description Make an object which answers the question: "which face contains these
 * 3 consecutive vertices? (3 vertices in sequential order, from two adjacent edges)"
 * The keys are space-separated trios of vertex indices, 3 vertices which
 * are found when walking a face. These 3 vertices uniquely point to one and only one
 * face, and the counter-clockwise walk direction is respected, this is not
 * bidirectional, and does not contain the opposite order of the same 3 vertices.
 * @param {FOLD} graph a FOLD object, containing faces_vertices
 * @returns {object} space-separated vertex trio keys, face indices values
 * @linkcode Origami ./src/graph/make.js 206
 */
export const makeVerticesToFace = ({ faces_vertices }) => {
	const map = {};
	faces_vertices
		.forEach((face, f) => face
			.map((_, i) => [0, 1, 2]
				.map(j => (i + j) % face.length)
				.map(n => face[n])
				.join(" "))
			.forEach(key => { map[key] = f; }));
	return map;
};
/**
 * @description For every vertex, make an array of vectors that point towards each
 * of the incident vertices. This is accomplised by taking the vertices_vertices
 * array and converting it into vectors, indices will be aligned with vertices_vertices.
 * @param {FOLD} graph a FOLD object, containing vertices_coords, vertices_vertices, edges_vertices
 * @returns {number[][][]} array of array of array of numbers, where each row corresponds
 * to a vertex index, inner arrays correspond to vertices_vertices, and inside is a 2D vector
 * @todo this can someday be rewritten without edges_vertices
 * @linkcode Origami ./src/graph/make.js 227
 */
export const makeVerticesVerticesVector = ({
	vertices_coords, vertices_vertices, edges_vertices, edges_vector,
}) => {
	if (!edges_vector) {
		edges_vector = makeEdgesVector({ vertices_coords, edges_vertices });
	}
	const edge_map = makeVerticesToEdge({ edges_vertices });
	return vertices_vertices
		.map((_, a) => vertices_vertices[a]
			.map((b) => {
				const edge_a = edge_map[`${a} ${b}`];
				const edge_b = edge_map[`${b} ${a}`];
				if (edge_a !== undefined) { return edges_vector[edge_a]; }
				if (edge_b !== undefined) { return math.core.flip(edges_vector[edge_b]); }
			}));
};
/**
 * @description Between pairs of counter-clockwise adjacent edges around a vertex
 * is the sector measured in radians. This builds an array of of sector angles,
 * index matched to vertices_vertices.
 * @param {FOLD} graph a FOLD object, containing vertices_coords, vertices_vertices, edges_vertices
 * @returns {number[][]} array of array of numbers, where each row corresponds
 * to a vertex index, inner arrays contains angles in radians
 * @linkcode Origami ./src/graph/make.js 252
 */
export const makeVerticesSectors = ({
	vertices_coords, vertices_vertices, edges_vertices, edges_vector,
}) => makeVerticesVerticesVector({
	vertices_coords, vertices_vertices, edges_vertices, edges_vector,
})
	.map(vectors => (vectors.length === 1 // leaf node
		? [math.core.TWO_PI] // interior_angles gives 0 for leaf nodes. we want 2pi
		: math.core.counterClockwiseSectors2(vectors)));
/**
 *
 *    EDGES
 *
 */
/**
 * @description Make `edges_edges` containing all vertex-adjacent edges.
 * This will be radially sorted if you call makeVerticesEdges before calling this.
 * @param {FOLD} graph a FOLD object, with entries edges_vertices, vertices_edges
 * @returns {number[][]} each entry relates to an edge, each array contains indices
 * of other edges.
 * @linkcode Origami ./src/graph/make.js 273
 */
export const makeEdgesEdges = ({ edges_vertices, vertices_edges }) =>
	edges_vertices.map((verts, i) => {
		const side0 = vertices_edges[verts[0]].filter(e => e !== i);
		const side1 = vertices_edges[verts[1]].filter(e => e !== i);
		return side0.concat(side1);
	});
/**
 * @description Make `edges_faces` where each edge is paired with its incident faces.
 * This is unsorted, prefer makeEdgesFaces()
 * @param {FOLD} graph a FOLD object, with entries edges_vertices, faces_edges
 * @returns {number[][]} each entry relates to an edge, each array contains indices
 * of adjacent faces.
 * @linkcode Origami ./src/graph/make.js 287
 */
export const makeEdgesFacesUnsorted = ({ edges_vertices, faces_edges }) => {
	// instead of initializing the array ahead of time (we would need to know
	// the length of something like edges_vertices)
	const edges_faces = edges_vertices !== undefined
		? edges_vertices.map(() => [])
		: Array.from(Array(implied.edges({ faces_edges }))).map(() => []);
	// todo: does not arrange counter-clockwise
	faces_edges.forEach((face, f) => {
		const hash = [];
		// in the case that one face visits the same edge multiple times,
		// this hash acts as a set allowing one occurence of each edge index.
		face.forEach((edge) => { hash[edge] = f; });
		hash.forEach((fa, e) => edges_faces[e].push(fa));
	});
	return edges_faces;
};
/**
 * @description Make `edges_faces` where each edge is paired with its incident faces.
 * This is sorted according to the FOLD spec, sorting faces on either side of an edge.
 * @param {FOLD} graph a FOLD object, with entries vertices_coords,
 * edges_vertices, faces_vertices, faces_edges
 * @returns {number[][]} each entry relates to an edge, each array contains indices
 * of adjacent faces.
 * @linkcode Origami ./src/graph/make.js 312
 */
export const makeEdgesFaces = ({
	vertices_coords, edges_vertices, edges_vector, faces_vertices, faces_edges, faces_center,
}) => {
	if (!edges_vertices) {
		return makeEdgesFacesUnsorted({ faces_edges });
	}
	if (!edges_vector) {
		edges_vector = makeEdgesVector({ vertices_coords, edges_vertices });
	}
	const edges_origin = edges_vertices.map(pair => vertices_coords[pair[0]]);
	if (!faces_center) {
		faces_center = makeFacesCenter({ vertices_coords, faces_vertices });
	}
	const edges_faces = edges_vertices.map(() => []);
	faces_edges.forEach((face, f) => {
		const hash = [];
		// in the case that one face visits the same edge multiple times,
		// this hash acts as a set allowing one occurence of each edge index.
		face.forEach((edge) => { hash[edge] = f; });
		hash.forEach((fa, e) => edges_faces[e].push(fa));
	});
	// sort edges_faces in 2D based on which side of the edge's vector
	// each face lies, sorting the face on the left first. see FOLD spec.
	edges_faces.forEach((faces, e) => {
		const faces_cross = faces
			.map(f => faces_center[f])
			.map(center => math.core.subtract2(center, edges_origin[e]))
			.map(vector => math.core.cross2(vector, edges_vector[e]));
		faces.sort((a, b) => faces_cross[a] - faces_cross[b]);
	});
	return edges_faces;
};

const assignment_angles = {
	M: -180, m: -180, V: 180, v: 180,
};
/**
 * @description Convert edges assignment into fold angle in degrees for every edge.
 * @param {FOLD} graph a FOLD object, with edges_assignment
 * @returns {number[]} array of fold angles in degrees
 * @linkcode Origami ./src/graph/make.js 354
 */
export const makeEdgesFoldAngle = ({ edges_assignment }) => edges_assignment
	.map(a => assignment_angles[a] || 0);
/**
 * @description Convert edges fold angle into assignment for every edge.
 * @param {FOLD} graph a FOLD object, with edges_foldAngle
 * @returns {string[]} array of fold assignments
 * @linkcode Origami ./src/graph/make.js 362
 */
export const makeEdgesAssignment = ({ edges_foldAngle }) => edges_foldAngle
	.map(a => {
		// todo, consider finding the boundary
		if (a === 0) { return "F"; }
		return a < 0 ? "M" : "V";
	});
/**
 * @description map vertices_coords onto edges_vertices so that the result
 * is an edge array where each edge contains its two points. Each point being
 * the 2D or 3D coordinate as an array of numbers.
 * @param {FOLD} graph a FOLD graph with vertices and edges
 * @returns {number[][][]} an array of array of points (which are arrays of numbers)
 * @linkcode Origami ./src/graph/make.js 376
 */
export const makeEdgesCoords = ({ vertices_coords, edges_vertices }) => edges_vertices
	.map(ev => ev.map(v => vertices_coords[v]));
/**
 * @description Turn every edge into a vector, basing the direction on the order of
 * the pair of vertices in each edges_vertices entry.
 * @param {FOLD} graph a FOLD graph, with vertices_coords, edges_vertices
 * @returns {number[][]} each entry relates to an edge, each array contains a 2D vector
 * @linkcode Origami ./src/graph/make.js 385
 */
export const makeEdgesVector = ({ vertices_coords, edges_vertices }) => makeEdgesCoords({
	vertices_coords, edges_vertices,
}).map(verts => math.core.subtract(verts[1], verts[0]));
/**
 * @description For every edge, find the length between the edges pair of vertices.
 * @param {FOLD} graph a FOLD graph, with vertices_coords, edges_vertices
 * @returns {number[]} the distance between each edge's pair of vertices
 * @linkcode Origami ./src/graph/make.js 394
 */
export const makeEdgesLength = ({ vertices_coords, edges_vertices }) => makeEdgesVector({
	vertices_coords, edges_vertices,
}).map(vec => math.core.magnitude(vec));
/**
 * @description Make an array of axis-aligned bounding boxes, one for each edge,
 * that encloses the edge, and will work in n-dimensions. Intended for
 * fast line-sweep algorithms.
 * @param {FOLD} graph a FOLD graph with vertices and edges.
 * @returns {object[]} an array of boxes, length matching the number of edges
 * @linkcode Origami ./src/graph/make.js 405
 */
export const makeEdgesBoundingBox = ({
	vertices_coords, edges_vertices, edges_coords,
}, epsilon = 0) => {
	if (!edges_coords) {
		edges_coords = makeEdgesCoords({ vertices_coords, edges_vertices });
	}
	return edges_coords.map(coords => math.core.boundingBox(coords, epsilon));
};
/**
 *
 *    FACES
 *
 */
/**
 * @description Rebuild all faces in a 2D planar graph by walking counter-clockwise
 * down every edge (both ways). This does not include the outside face which winds
 * around the boundary backwards enclosing the outside space.
 * @param {FOLD} graph a FOLD graph
 * @returns {object[]} array of faces as objects containing "vertices" "edges" and "angles"
 * @example
 * // to convert the return object into faces_vertices and faces_edges
 * var faces = makePlanarFaces(graph);
 * faces_vertices = faces.map(el => el.vertices);
 * faces_edges = faces.map(el => el.edges);
 * @linkcode Origami ./src/graph/make.js 431
 */
export const makePlanarFaces = ({
	vertices_coords, vertices_vertices, vertices_edges,
	vertices_sectors, edges_vertices, edges_vector,
}) => {
	if (!vertices_vertices) {
		vertices_vertices = makeVerticesVertices({ vertices_coords, edges_vertices, vertices_edges });
	}
	if (!vertices_sectors) {
		vertices_sectors = makeVerticesSectors({
			vertices_coords, vertices_vertices, edges_vertices, edges_vector,
		});
	}
	const vertices_edges_map = makeVerticesToEdgeBidirectional({ edges_vertices });
	// removes the one face that outlines the piece with opposite winding.
	// planarVertexWalk stores edges as vertex pair strings, "4 9",
	// convert these into edge indices
	return filterWalkedBoundaryFace(planarVertexWalk({
		vertices_vertices, vertices_sectors,
	})).map(f => ({ ...f, edges: f.edges.map(e => vertices_edges_map[e]) }));
};
// export const makePlanarFacesVertices = graph => makePlanarFaces(graph)
// 	.map(face => face.vertices);

// export const makePlanarFacesEdges = graph => makePlanarFaces(graph)
// 	.map(face => face.edges);

// const make_vertex_pair_to_edge_map = function ({ edges_vertices }) {
// 	if (!edges_vertices) { return {}; }
// 	const map = {};
// 	edges_vertices
// 		.map(ev => ev.sort((a, b) => a - b).join(" "))
// 		.forEach((key, i) => { map[key] = i; });
// 	return map;
// };
// todo: this needs to be tested
/**
 * @description Make `faces_vertices` from `faces_edges`.
 * @param {FOLD} graph a FOLD graph, with faces_edges, edges_vertices
 * @returns {number[][]} a `faces_vertices` array
 * @linkcode Origami ./src/graph/make.js 472
 */
export const makeFacesVerticesFromEdges = (graph) => graph.faces_edges
	.map(edges => edges
		.map(edge => graph.edges_vertices[edge])
		.map((pairs, i, arr) => {
			const next = arr[(i + 1) % arr.length];
			return (pairs[0] === next[0] || pairs[0] === next[1])
				? pairs[1]
				: pairs[0];
		}));
/**
 * @description Make `faces_edges` from `faces_vertices`.
 * @param {FOLD} graph a FOLD graph, with faces_vertices
 * @returns {number[][]} a `faces_edges` array
 * @linkcode Origami ./src/graph/make.js 487
 */
export const makeFacesEdgesFromVertices = (graph) => {
	const map = makeVerticesToEdgeBidirectional(graph);
	return graph.faces_vertices
		.map(face => face
			.map((v, i, arr) => [v, arr[(i + 1) % arr.length]].join(" ")))
		.map(face => face.map(pair => map[pair]));
};
/**
 * @description faces_faces is an array of edge-adjacent face indices for each face.
 * @param {FOLD} graph a FOLD graph, with faces_vertices
 * @returns {number[][]} each index relates to a face, each entry is an array
 * of numbers, each number is an index of an edge-adjacent face to this face.
 * @linkcode Origami ./src/graph/make.js 501
 */
export const makeFacesFaces = ({ faces_vertices }) => {
	const faces_faces = faces_vertices.map(() => []);
	const edgeMap = {};
	faces_vertices
		.map((face, f) => face
			.map((v0, i, arr) => {
				let v1 = arr[(i + 1) % face.length];
				if (v1 < v0) { [v0, v1] = [v1, v0]; }
				const key = `${v0} ${v1}`;
				if (edgeMap[key] === undefined) { edgeMap[key] = {}; }
				edgeMap[key][f] = true;
			}));
	Object.values(edgeMap)
		.map(obj => Object.keys(obj))
		.filter(arr => arr.length > 1)
		.forEach(pair => {
			faces_faces[pair[0]].push(parseInt(pair[1], 10));
			faces_faces[pair[1]].push(parseInt(pair[0], 10));
		});
	return faces_faces;
};
// export const makeFacesFaces = ({ faces_vertices }) => {
//   // if (!faces_vertices) { return undefined; }
//   const faces_faces = faces_vertices.map(() => []);
//   // create a map where each key is a string of the vertices of an edge,
//   // like "3 4"
//   // and each value is an array of faces adjacent to this edge.
//   const edgeMap = {};
//   faces_vertices.forEach((vertices_index, idx1) => {
//     vertices_index.forEach((v1, i, vs) => {
//       let v2 = vs[(i + 1) % vertices_index.length];
//       if (v2 < v1) { [v1, v2] = [v2, v1]; }
//       const key = `${v1} ${v2}`;
//       if (key in edgeMap) {
//         const idx2 = edgeMap[key];
//         faces_faces[idx1].push(idx2);
//         faces_faces[idx2].push(idx1);
//       } else {
//         edgeMap[key] = idx1;
//       }
//     });
//   });
//   return faces_faces;
// };
/**
 * @description map vertices_coords onto each face's set of vertices,
 * turning each face into an array of points, with an additional step:
 * ensure that each polygon has 0 collinear vertices.
 * this can result in a polygon with fewer vertices than is contained
 * in that polygon's faces_vertices array.
 * @param {FOLD} graph a FOLD graph, with vertices_coords, faces_vertices
 * @param {number} [epsilon=1e-6] an optional epsilon
 * @returns {number[][][]} array of array of points, where each point is an array of numbers
 * @linkcode Origami ./src/graph/make.js 556
 */
export const makeFacesPolygon = ({ vertices_coords, faces_vertices }, epsilon) => faces_vertices
	.map(verts => verts.map(v => vertices_coords[v]))
	.map(polygon => math.core.makePolygonNonCollinear(polygon, epsilon));
/**
 * @description map vertices_coords onto each face's set of vertices,
 * turning each face into an array of points. "Quick" meaning collinear vertices are
 * not removed, which in some cases, this will be the preferred method.
 * @param {FOLD} graph a FOLD graph, with vertices_coords, faces_vertices
 * @returns {number[][][]} array of array of points, where each point is an array of numbers
 * @linkcode Origami ./src/graph/make.js 567
 */
export const makeFacesPolygonQuick = ({ vertices_coords, faces_vertices }) => faces_vertices
	.map(verts => verts.map(v => vertices_coords[v]));
/**
 * @description For every face, get the face's centroid.
 * @param {FOLD} graph a FOLD graph, with vertices_coords, faces_vertices
 * @returns {number[][]} array of points, where each point is an array of numbers
 * @linkcode Origami ./src/graph/make.js 575
 */
export const makeFacesCenter = ({ vertices_coords, faces_vertices }) => faces_vertices
	.map(fv => fv.map(v => vertices_coords[v]))
	.map(coords => math.core.centroid(coords));
/**
 * @description This uses point average, not centroid, faces must
 * be convex, and again it's not precise, but in many use cases
 * this is often more than sufficient.
 * @param {FOLD} graph a FOLD graph, with vertices_coords, faces_vertices
 * @returns {number[][]} array of points, where each point is an array of numbers
 * @linkcode Origami ./src/graph/make.js 586
 */
export const makeFacesCenterQuick = ({ vertices_coords, faces_vertices }) => faces_vertices
	.map(vertices => vertices
		.map(v => vertices_coords[v])
		.reduce((a, b) => [a[0] + b[0], a[1] + b[1]], [0, 0])
		.map(el => el / vertices.length));
