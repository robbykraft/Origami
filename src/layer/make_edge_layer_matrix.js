import { make_edges_edges_overlap } from "../graph/edges_edges";
import { make_edges_faces } from "../graph/make";

const make_edge_layer_matrix = (graph, face_matrix, epsilon) => {
  const edges_edges_overlap_matrix = make_edges_edges_overlap(graph, epsilon);
  const edges_faces = graph.edges_faces
    ? graph.edges_faces
    : make_edges_faces(graph);
  const edges_edges_overlap = edges_edges_overlap_matrix
    .map(row => row
      .map((val, i) => val ? i : undefined)
      .filter(a => a !== undefined))
  // TODO
  // from this point on, keep a catalog of every face that gets updated,
  // and every face that wasn't able to update due to lack of information.
  // we need to allow for a face that got passed over due to lack of info
  // to be able to be revisited and worked upon if new information was uncovered
  const faces_did_update = {};
  const faces_not_updated = {};
  // for every edge-edge pair overlap, get all adjacent faces involved
  // (each should have 1 or 2, 1 for boundary edges). check the face_matrix
  // for any rules about faces orders between any of these faces.
  // if no rules exist, we can't do anything. skip.
  // if at least one rule exists, set all other faces to obey the same rule,
  // meaning, if edge1's face is below edge2, then all of edge1's faces
  // must be below all of edge2's faces.
  const edge_matrix = edges_edges_overlap.map(() => []);
  edges_edges_overlap
    .forEach((row, e1) => row
      .forEach(e2 => edges_faces[e1]
        .forEach(f1 => edges_faces[e2]
          .filter(f2 => face_matrix[f1][f2] !== undefined)
          .forEach(f2 => { edge_matrix[e1][e2] = face_matrix[f1][f2]; }))));
  return edge_matrix;
};

export default make_edge_layer_matrix;
