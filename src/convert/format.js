import * as Origami from "../fold/origami";
import * as SVG from "../../include/svg";
import { segments } from "../../include/svg-segmentize";
import * as Segmentize from "../../include/svg-segmentize";
import { flatten_frame, load_file } from "../fold/file";
import { bounding_rect } from "../fold/planargraph";
import * as Draw from "../fold/draw";
// import * as Fold from "../include/fold";


export const intoFOLD = function(input, callback) {
	return load_file(input, function(fold) {
		if (callback != null) { callback(fold); }
	});
}

export const intoSVG = function(input, callback) {
	let syncFold, svg, async = false;
	// attempt to load synchronously, the callback will be called regardless,
	// we need a flag to flip when the call is done, then check if the async
	// call is in progress
	syncFold = load_file(input, function(fold) {
		if (async) {
			let svg = fold_to_svg(fold);
			if (callback != null) { 
				callback(svg);
			}
		}
	});
	async = true;
	// if the load was synchronous, syncFold will contain data. if not,
	// let the callback above finish off the conversion.
	if (syncFold !== undefined) {
		let svg = fold_to_svg(syncFold);
		if (callback != null) { 
			callback(svg);
		}
		return svg;
	}
}

export const intoORIPA = function(input, callback) {

}

export const svg_to_fold = function(svg) {
	// for each geometry, add creases without regards to invalid planar edge crossings
	//  (intersecting lines, duplicate vertices), clean up later.
	let graph = {
		"file_spec": 1.1,
		"file_creator": "RabbitEar",
		"file_classes": ["singleModel"],
		"frame_title": "",
		"frame_classes": ["creasePattern"],
		"frame_attributes": ["2D"],
		"vertices_coords": [],
		"vertices_vertices": [],
		"vertices_faces": [],
		"edges_vertices": [],
		"edges_faces": [],
		"edges_assignment": [],
		"edges_foldAngle": [],
		"edges_length": [],
		"faces_vertices": [],
		"faces_edges": [],
	};
	// return graph;
	// console.log("svg_to_fold");
	// console.log(Segmentize.svg(svg));
	// todo: import semgents into a planar graph, handle edge crossings
	segments(svg).forEach(l =>
		Origami.add_edge_between_points(graph, l[0], l[1], l[2], l[3])
	);
	return graph;
}

/**
 * specify a frame number otherwise it will render the top level
 */
export const fold_to_svg = function(fold, frame_number = 0) {
	// console.log("fold_to_svg start");
	let graph = frame_number
		? flatten_frame(fold, frame_number)
		: fold;
	// if (isFolded(graph)) { }
	let svg = SVG.svg();
	svg.setAttribute("x", "0px");
	svg.setAttribute("y", "0px");
	svg.setAttribute("width", "600px");
	svg.setAttribute("height", "600px");
	let groupNames = ["boundary", "face", "crease", "vertex"]
		.map(singular => groupNamesPlural[singular])
	let groups = groupNames.map(key => svg.group().setID(key));
	let obj = { ...groups };
	// console.log("fold_to_svg about to fill");
	// console.log(svg, {...groups});
	// return svg;
	Draw.intoGroups(graph, {...groups});
	SVG.setViewBox(svg, ...bounding_rect(graph));
	// console.log("fold_to_svg done");
	return svg;
}

const groupNamesPlural = {
	boundary: "boundaries",
	face: "faces",
	crease: "creases",
	vertex: "vertices"
};



const load_fold_object = function(input) {

}
const load_svg_element = function(input) {

}
const load_svg_filename = function(input) {

}