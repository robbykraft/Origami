/**
 * Rabbit Ear (c) Kraft
 */
import {
	EPSILON,
} from "../../math/constant.js";
import {
	includeL,
} from "../../math/compare.js";
import {
	scale2,
	add2,
} from "../../math/vector.js";
import {
	invertAssignment,
} from "../../fold/spec.js";
import {
	makeEdgesVector,
	makeFacesEdgesFromVertices,
} from "../make.js";
import {
	makeVerticesCoordsFlatFolded,
} from "../vertices/folded.js";
import {
	makeFacesWinding,
} from "../faces/winding.js";
import {
	faceContainingPoint,
} from "../faces/facePoint.js";
import {
	intersectLine,
} from "../intersect.js";

/**
 * @description Given a flat-foldable crease pattern, perform a fold through
 * its folded form and return a list of new crease edges as edges in the
 * crease pattern space.
 * @param {FOLD} graph a FOLD object, in crease pattern form
 * @param {VecLine} line a fold line
 * @param {string} assignment the segment's assignment through the first face
 * @param {number} [epsilon=1e-6] an optional epsilon
 * @returns {object[]} For each intersected face, a new segment object:
 * - edges: which two edges were intersected
 * - assignment: the assignment of the new segment
 * - points: the new segment's two endpoints
 */
export const foldCreasePattern = ({
	vertices_coords, edges_vertices, edges_foldAngle, edges_assignment,
	faces_vertices, faces_edges, faces_faces,
}, { vector, origin }, assignment = "V", epsilon = EPSILON) => {
	if (!faces_edges) {
		faces_edges = makeFacesEdgesFromVertices({ edges_vertices, faces_vertices });
	}

	// the face under the point's crease will get the assignment in the method
	// input parameter, and all other creases will be valley/mountain accordingly
	const startFace = faceContainingPoint(
		{ vertices_coords, faces_vertices },
		origin,
		vector,
	);

	// Only M and V will exchange. all others, this will be the same assignment
	const oppositeAssignment = invertAssignment(assignment);

	// this assumes the model is flat folded.
	// another approach would be to check for any non-flat edges, fold a 3D
	// graph, then find all faces that are in the same plane as startFace.
	const vertices_coordsFolded = makeVerticesCoordsFlatFolded({
		vertices_coords,
		edges_vertices,
		edges_foldAngle,
		edges_assignment,
		faces_vertices,
		faces_faces,
	}, startFace);

	// edge line data for the crease pattern state, needed to remap the edge
	// intersections, which were calculated in the folded state, into points
	// in the crease pattern state.
	const edges_origin = edges_vertices.map(ev => vertices_coords[ev[0]]);
	const edges_vector = makeEdgesVector({ vertices_coords, edges_vertices });

	// note that this copy of faces_winding will be forced to be the case that
	// our startFace is "true" instead of T/F based on face winding direction.
	const faces_winding = makeFacesWinding({
		vertices_coords: vertices_coordsFolded,
		faces_vertices,
	});
	if (!faces_winding[startFace]) {
		faces_winding.forEach((w, i) => { faces_winding[i] = !w; });
	}

	const { faces } = intersectLine(
		{ vertices_coords: vertices_coordsFolded, edges_vertices, faces_vertices, faces_edges },
		{ vector, origin },
		includeL,
		epsilon,
	);

	// only keep simple, convex faces
	faces.forEach((arr, f) => { if (arr.length !== 2) { delete faces[f]; } });

	const remapPoint = ({ vertex, edge, b }) => (vertex !== undefined
		? vertices_coords[vertex]
		: add2(scale2(edges_vector[edge], b), edges_origin[edge]));

	// the return object will be, for every intersected face,
	// an object which describes a new segment, including:
	// - edges: which two edges were intersected
	// - assignment: the assignment of the new segment
	// - points: the new segment's two endpoints
	// Note: the points will be remapped back into crease pattern space,
	// as all intersection data was calculated using the folded form's vertices.
	return faces.map((intersections, f) => ({
		intersections,
		assignment: faces_winding[f] ? assignment : oppositeAssignment,
		points: intersections.map(remapPoint),
	}));
};