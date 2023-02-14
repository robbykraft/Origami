/**
 * Rabbit Ear (c) Kraft
 */
import {
	normalize3,
	cross3,
	subtract,
	resize,
} from "../math/algebra/vectors.js";
/**
 *
 */
export const makeFacesNormal = ({ vertices_coords, faces_vertices }) => faces_vertices
	.map(vertices => vertices
		.map(vertex => vertices_coords[vertex]))
	.map(polygon => {
		// cross product unit vectors from point 0 to point 1 and 2.
		// as long as the face winding data is consistent, this gives consistent face normals
		const a = resize(3, subtract(polygon[1], polygon[0]));
		const b = resize(3, subtract(polygon[2], polygon[0]));
		return normalize3(cross3(a, b));
	});
/**
 *
 */
export const makeVerticesNormal = ({ vertices_coords, faces_vertices, faces_normal }) => {
	// add two 3D vectors, store result in first parameter
	const add3 = (a, b) => { a[0] += b[0]; a[1] += b[1]; a[2] += b[2]; };
	if (!faces_normal) {
		faces_normal = makeFacesNormal({ vertices_coords, faces_vertices });
	}
	const vertices_normals = vertices_coords.map(() => [0, 0, 0]);
	faces_vertices
		.forEach((vertices, f) => vertices
			.forEach(v => add3(vertices_normals[v], faces_normal[f])));
	return vertices_normals.map(v => normalize3(v));
};