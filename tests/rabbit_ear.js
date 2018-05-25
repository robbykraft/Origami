var rabbitEarProject = new OrigamiPaper("canvas-rabbit-ear").setPadding(0.05);
rabbitEarProject.show.faces = true;
rabbitEarProject.show.sectors = true;
rabbitEarProject.style.face.fillColor = {gray:1.0};
rabbitEarProject.style.sector.fillColors = [{alpha:0.0}, {alpha:0.0}];
rabbitEarProject.programModes = Object.freeze({"rabbitEar":1, "kawasaki":2});
rabbitEarProject.lastRabbitEarNode = undefined;
rabbitEarProject.style.face.scale = 1.0;
// rabbitEarProject.style.face.fillColor = rabbitEarProject.styles.byrne.yellow;

rabbitEarProject.reset = function(){
	this.cp.clear();
	this.cp.crease(0,0,1,1);
	this.cp.flatten();
	this.draw();
	this.mode = this.programModes.rabbitEar;
}
rabbitEarProject.reset();

rabbitEarProject.onMouseMove = function(event){
	this.updateStyles();
	this.nearest = this.cp.nearest(event.point);
	switch(this.mode){
		case this.programModes.rabbitEar:
			if(this.nearest.face){ this.faces[ this.nearest.face.index ].fillColor = this.styles.byrne.red; }
		break;
		case this.programModes.kawasaki:
			if(this.nearest.sector && this.nearest.sector.origin === this.lastRabbitEarNode){ 
				this.sectors[ this.nearest.sector.index ].fillColor = this.styles.byrne.red;
			}
		break;
	}
}
rabbitEarProject.onMouseDown = function(event){
	if(this.nearest.face != undefined){
		switch(this.mode){
			case this.programModes.rabbitEar:
				var edges = this.nearest.face.rabbitEar();
				this.cp.flatten();
				if(edges.length == 3){
					this.lastRabbitEarNode = edges[0].commonNodeWithEdge(edges[1]);
					this.mode = (this.mode%2)+1;
				}
			break;
			case this.programModes.kawasaki:
				if(this.nearest.sector && this.nearest.sector.origin === this.lastRabbitEarNode){ 
					var dir = this.nearest.sector.kawasakiFourth();
					this.cp.crease( new Ray(this.nearest.sector.origin, dir) );
					this.mode = (this.mode%2)+1;
				}
			break;
		}		
	}
	this.nearest.face = undefined;
	this.nearest.sector = undefined;
	this.cp.flatten();
	this.draw();
}

