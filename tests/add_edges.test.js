const ear = require("../rabbit-ear");

test("empty", () => expect(true).toBe(true));

// test("add edges", () => {
//   const graph = {};

//   ear.graph.add_edges(graph, {
//     edges_vertices: [
//       ear.graph.add_vertices(graph, [[0, 0], [1, 1]])
//     ]
//   });

//   ear.graph.add_edges(graph, {
//     edges_vertices: [
//       ear.graph.add_vertices(graph, [[2, 2], [3, 3]])
//     ]
//   });

//   ear.graph.add_edges(graph, {
//     edges_vertices: [
//       ear.graph.add_vertices(graph, [[1, 1], [2, 2]])
//     ]
//   });

//   expect(JSON.stringify(graph.edges_vertices))
//     .toBe(JSON.stringify([ [0, 1], [2, 3], [1, 2] ]));

//   expect(JSON.stringify(graph.vertices_coords))
//     .toBe(JSON.stringify([ [0, 0], [1, 1], [2, 2], [3, 3] ]));
// });
