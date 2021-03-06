import GraphProto from "./graph";
import CreasePatternProto from "./crease_pattern";
import OrigamiProto from "./origami";

import graph_methods from "../graph/index";
import { file_spec, file_creator } from "../graph/fold_keys";
import { fold_object_certainty } from "../graph/fold_spec";
import create from "../graph/create";

// if we ever need to call any of these constructors from somewhere
// else inside the library (creating a circular dependency)
// move this line into a file "Constructors.js", and remove the
// export at the bottom. have all files point to "Constructors.js"
// instead, and all circular dependencies will be avoided.
const Constructors = Object.create(null);

const ConstructorPrototypes = {
  graph: GraphProto,
  cp: CreasePatternProto,
  origami: OrigamiProto,
};

const default_graph = {
  graph: () => ({}),
  cp: create.square,
  origami: create.square,
};

Object.keys(ConstructorPrototypes).forEach(name => {
  Constructors[name] = function () {
    const argFolds = Array.from(arguments)
      .filter(a => fold_object_certainty(a))
       // deep copy input graph
      .map(obj => JSON.parse(JSON.stringify(obj)));
    return Object.assign(
      Object.create(ConstructorPrototypes[name]),
      (argFolds.length ? {} : default_graph[name]()),
      ...argFolds,
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

export default Constructors;

