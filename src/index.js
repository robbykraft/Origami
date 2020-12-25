/*
▁▂▃▄▅▆▇██▇▆▅▄▃▂▁▁▂▃▄▅▆▇██▇▆▅▄▃▂▁▁▂▃▄▅▆▇██▇▆▅▄▃▂▁▁▂▃▄▅▆▇██▇▆▅▄▃▂▁
                    _     _     _ _
                   | |   | |   (_) |
          _ __ __ _| |__ | |__  _| |_    ___  __ _ _ __
         | '__/ _` | '_ \| '_ \| | __|  / _ \/ _` | '__|
         | | | (_| | |_) | |_) | | |_  |  __/ (_| | |
         |_|  \__,_|_.__/|_.__/|_|\__|  \___|\__,_|_|

█▇▆▅▄▃▂▁▁▂▃▄▅▆▇██▇▆▅▄▃▂▁▁▂▃▄▅▆▇██▇▆▅▄▃▂▁▁▂▃▄▅▆▇██▇▆▅▄▃▂▁▁▂▃▄▅▆▇█
*/
import { isBrowser, isWebWorker, isNode } from "./environment/detect";
import math from "./math";
import root from "./root";
import use from "./use/index";
import graph_methods from "./graph/index";
import diagram from "./diagrams/index";
// build objects
import Constructors from "./constructors";
// prototypes
import GraphProto from "./prototypes/graph";
import PlanarGraphProto from "./prototypes/planar_graph";
import CreasePatternProto from "./prototypes/crease_pattern";
// import OrigamiProto from "./prototypes/origami";
import { file_spec, file_creator } from "./graph/fold_keys";
import { fold_object_certainty } from "./graph/fold_spec";
// static constructors for prototypes
import create from "./graph/create";
// top level things
import axiom from "./axioms/index";
import text from "./text/index";
// webgl
import * as foldToThree from "./webgl/fold-to-three";

// extensions
import SVG from "./extensions/svg";
import FoldToSvg from "./extensions/fold-to-svg";

const ConstructorPrototypes = {
  graph: GraphProto,
  // planargraph: PlanarGraphProto,
  // origami: GraphProto,
  cp: CreasePatternProto,
};

Object.keys(ConstructorPrototypes).forEach(name => {
  Constructors[name] = function () {
    return Object.assign(
      Object.create(ConstructorPrototypes[name]),
      ...Array.from(arguments)
        .filter(a => fold_object_certainty(a))
        .map(obj => JSON.parse(JSON.stringify(obj))), // deep copy input graph
      { file_spec, file_creator }
    );
  };
  Constructors[name].prototype = ConstructorPrototypes[name];
  Constructors[name].prototype.constructor = Constructors[name];
  // wrap static constructors with "this" initializer
  Object.keys(create).forEach(funcName => {
    Constructors[name][funcName] = function () {
      return Constructors[name](create[funcName](...arguments));
    };
  });
});

Object.assign(Constructors.graph, graph_methods);

const Ear = Object.assign(root, Constructors, {
  math: math.core,
  axiom,
	diagram,
  text,
	webgl: foldToThree,
});

Object.defineProperty(Ear, "use", {
  enumerable: false,
  value: use.bind(Ear),
})

Object.keys(math)
  .filter(key => key !== "core")
  .forEach((key) => { Ear[key] = math[key]; });

// const operating_systems = [
//   isBrowser ? "browser" : "",
//   isWebWorker ? "web-worker" : "",
//   isNode ? "node" : "",
// ].filter(a => a !== "").join(" ");
// console.log(`RabbitEar v0.1.91 [${operating_systems}]`);

// extensions
SVG.use(FoldToSvg);
FoldToSvg.use(SVG);
Ear.use(SVG);
Ear.use(FoldToSvg);

export default Ear;
