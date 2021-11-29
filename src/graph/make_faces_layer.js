import math from "../math";
import { invert_map } from "./maps";
import make_face_layer_matrix from "../layer/make_face_layer_matrix";
import make_groups_edges from "./make_groups_edges";
import get_common_orders from "../layer/get_common_orders";
import fold_edge_solver from "../layer/fold_edge_solver";
import make_layers_face from "../layer/make_layers_face";
import make_layers_face_solver from "../layer/layers_face_solver";
import flat_layer_order_symmetry_line from "../layer/flat_layer_symmetry_line";

const multiply_square_matrices = (a, b) => {
  const len = a.length;
  const res = Array.from(Array(len)).map(() => []);
  for (let i = 0; i < len; i++) {
    for (let j = 0; j < len; j++) {
      let dot = 0;
      for (let v = 0; v < len; v++) {
        const val1 = a[i][v];
        const val2 = b[v][j];
        dot += (val1 === undefined ? 0 : val1) * (val2 === undefined ? 0 : val2);
      }
      res[i][j] = dot;
    }
  }
  return res;
};

const matrix_count = (matrix) => {
  let count = 0;
  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < matrix.length; j++) {
      if (matrix[i][j] !== undefined) { count++; }
    }
  }
  return count;
};
/**
 * @description 
 * @param {object} a FOLD origami object. make sure it is FOLDED.
 */
const make_faces_layer = (graph, face = 0, epsilon = math.core.EPSILON) => {
  const matrix = make_face_layer_matrix(graph, face, epsilon);
  // const groups_edges = make_groups_edges(graph, epsilon);

  // experimental section:
  // flat_layer_order_symmetry_line(graph, matrix, {
  //   origin: [0,1],
  //   vector: [Math.SQRT1_2, -Math.SQRT1_2],
  // });

  // for (let i = 0; i < groups_edges.length; i++) {
  //   const relationships = fold_edge_solver(graph, groups_edges[i], matrix)
  //     .map(invert_map);
  //   get_common_orders(relationships).forEach(rule => {
  //     matrix[rule[0]][rule[1]] = rule[2];
  //   });
  // }

  // at this point, our matrix is complete, get a layer order
  // single solution
  const layers_face = make_layers_face(matrix);
  // multiple solutions
  // const solutions = make_layers_face_solver(matrix, initial_face_order);
  const faces_layer = invert_map(layers_face);
  faces_layer.matrix = matrix;
  return faces_layer;
};

export default make_faces_layer;
