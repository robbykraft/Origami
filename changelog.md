# 0.9.32 alpha

new layer solver implementation at ear.layer.solver(), huge performance improvement. solver returns data bound to a prototype which includes methods to process and analyze the data. methods include

```javascript
count()
solution(...indices)
allSolutions()
facesLayer(...indices)
allFacesLayers()
faceOrders(...indices)
allFaceOrders()
```

ear.layer.assignmentSolver renamed to ear.layer.singleVertexAssignmentSolver.

ear.math.enclosingBoundingBoxes, new method. test if one bounding box is entirely inside another.

ear.graph.makeEdgesEdgesSimilar, answers which edges have the same endpoints (vertices) as other edges. endpoints can be in any order.

performance improvements for ear.graph.makeFacesFacesOverlap, ear.graph.makeEdgesFacesOverlap.

# 0.9.31 alpha

axiom function wrapper has changed. `validate()` is now exposed to the user, as is the `axiomInBoundary` methods. Normal-distance parameterization methods are now named as such.

new convex hull algorithm. two entrypoints: `convexHull` returns points, `convexHullIndices` returns indices of points from your points parameter array.

`onLeave` added to the other three methods `onMove` `onPress` `onRelease` for SVG elements.

# 0.9.3 alpha

no longer requiring @xmldom/xmldom as a dependency. This library now has zero dependencies! [1]

`clean()` takes no options now and performs one consistent task: removes all bad edges and vertices. if you like you can call each submethod now `removeDuplicateVertices`, `removeCircularEdges`, `removeDuplicateEdges`, `removeIsolatedVertices`.

axiom function parameters have now changed to the much simpler "point, line" to consistenly separate types. This replaces "point, origin, vector" inputs where "origin, vector" are two components which describe a line, and "point" is points... **to update: modify your axiom function parameters, whever it asks for a line, make a ear.line() objects from your previous origin/vector pairs.**

```javascript
ear.graph.getBoundaryVertices // unsorted
ear.graph.getBoundary.vertices // sorted
```

> [1] if you use Rabbit Ear in NodeJS and create a SVG elements (virtually), you will need to import @xmldom. Because this is such a unique rare case, this is left to the user. This will be explained in the documentation.
