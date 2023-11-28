/**
 * Rabbit Ear (c) Kraft
 */
import {
	add2,
	scale2,
	distance2,
} from "../math/vector.js";
import { isCollinear } from "../math/line.js";
import { makePolygonNonCollinear } from "../math/polygon.js";
import { trilateration } from "../math/triangle.js";
import { pointsToLine } from "../math/convert.js";

/**
 * @description Transfer a point from one graph to another, given the
 * two graphs are isomorphic, but contain different vertices coords.
 * Supply a face index which contains the point.
 * @param {FOLD} from a fold graph which the point now lies inside
 * @param {FOLD} to a fold graph we want to move the point into
 * @param {number} face the index of the face which contains this point
 * @param {number[]} point the point, as it exists inside the "from" graph
 * @returns {number[]} a new point
 */
export const transferPointBetweenGraphs = (from, to, face, point) => {
	const faceVertices = from.faces_vertices[face];
	if (faceVertices.length < 3) { return point; }

	let fromPoly = faceVertices.map(v => from.vertices_coords[v]);
	let toPoly = faceVertices.map(v => to.vertices_coords[v]);

	// trilateration will fail if the first three points are collinear.
	if (isCollinear(fromPoly[0], fromPoly[1], fromPoly[2])) {
		fromPoly = makePolygonNonCollinear(fromPoly);
	}
	if (isCollinear(toPoly[0], toPoly[1], toPoly[2])) {
		toPoly = makePolygonNonCollinear(toPoly);
	}
	const distances = fromPoly.map(p => distance2(p, point));
	return trilateration(toPoly, distances);
};

/**
 * @description Transfer a point from one graph to another, given the
 * two graphs are isomorphic, but contain different vertices coords.
 * Use this method when the point lies along an edge, we can use the
 * edge parameter (along the edge's vector) to very precisely calculate
 * the position of the point in the new graph.
 * This method is more precise than transferPointBetweenGraphs.
 * @param {FOLD} from a fold graph which the point now lies inside
 * @param {FOLD} to a fold graph we want to move the point into
 * @param {number} edge the index of the edge which this point lies on
 * @param {number} parameter the parameter along the edge's vector where
 * this point lies. If using splitGraphLineFunction this is the "a" component.
 * @returns {number[]} a new point
 */
export const transferPointOnEdgeBetweenGraphs = (from, to, edge, parameter) => {
	const edgeSegment = to.edges_vertices[edge]
		.map(v => to.vertices_coords[v]);
	const edgeLine = pointsToLine(...edgeSegment);
	return add2(edgeLine.origin, scale2(edgeLine.vector, parameter));
};