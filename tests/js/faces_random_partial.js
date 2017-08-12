// generate faces
faces_random_partial_callback = undefined;

var partialFaces = new PaperCreasePattern("canvas-faces-random-partial");
partialFaces.zoomToFit(0.05);

partialFaces.nearestEdgeColor = { hue:0, saturation:0.8, brightness:1 };

partialFaces.reset = function(){
	partialFaces.cp.clear();
	for(var i = 0; i < 30; i++){
		var angle = Math.random()*Math.PI*2;
		partialFaces.cp.creaseRay(new XYPoint(Math.random(), Math.random()), new XYPoint(Math.cos(angle), Math.sin(angle)));
	}
	var intersections = partialFaces.cp.chop();
	partialFaces.cp.generateFaces();
	partialFaces.initialize();
	if(faces_random_callback != undefined){
		faces_random_callback(intersections);
	}
}
partialFaces.reset();

partialFaces.onFrame = function(event) { }
partialFaces.onResize = function(event) { }
partialFaces.onMouseDown = function(event){ 
	partialFaces.reset();
}
partialFaces.onMouseUp = function(event){ }
partialFaces.onMouseMove = function(event) { }
