/**
 * Rabbit Ear (c) Kraft
 */

/**
 * @description Add a vertex to the graph by setting its coordinates.
 * This method will maintain that all other arrays in the graph are valid,
 * any "vertices_" arrays that exist in the graph will be filled with
 * empty arrays. This vertex will be initialized as isolated.
 * @param {FOLD} graph a FOLD object
 * @param {number[]} coords the position of the new vertex
 * @returns {number} the index of the newly created vertex
 */
export const addVertex = (
	graph,
	coords,
	vertices = [],
	edges = [],
	faces = [],
) => {
	if (!graph.vertices_coords) { graph.vertices_coords = []; }

	// the index of the new vertex
	const vertex = graph.vertices_coords.length;

	// construct the new data for our vertex, it will be initially isolated.
	graph.vertices_coords[vertex] = coords;
	if (graph.vertices_vertices) { graph.vertices_vertices[vertex] = vertices; }
	if (graph.vertices_edges) { graph.vertices_edges[vertex] = edges; }
	if (graph.vertices_faces) { graph.vertices_faces[vertex] = faces; }

	return vertex;
};

/**
 * @description Add vertices to the graph by setting their coordinates.
 * This method will maintain that all other arrays in the graph are valid,
 * any "vertices_" arrays that exist in the graph will be filled with
 * empty arrays. The new vertices will be initialized as isolated.
 * @param {FOLD} graph a FOLD graph, modified in place.
 * @param {number[][]} vertices_coords array of points to be added to the graph
 * @param {number} [epsilon=1e-6] optional epsilon to merge similar vertices
 * @returns {number[]} index of vertex in new vertices_coords array.
 * the size of this array matches array size of source vertices.
 * duplicate (non-added) vertices returns their pre-existing counterpart's index.
 * @linkcode Origami ./src/graph/add/addVertices.js 16
 */
export const addVertices = (graph, coordses = []) => {
	if (!graph.vertices_coords) { graph.vertices_coords = []; }

	// the indices of the new vertices
	const vertices = coordses.map((_, i) => graph.vertices_coords.length + i);

	// construct the new data for our vertices, they will be initially isolated.
	vertices.forEach((vertex, i) => {
		graph.vertices_coords[vertex] = coordses[i];
		if (graph.vertices_vertices) { graph.vertices_vertices[vertex] = []; }
		if (graph.vertices_edges) { graph.vertices_edges[vertex] = []; }
		if (graph.vertices_faces) { graph.vertices_faces[vertex] = []; }
	});

	return vertices;
};