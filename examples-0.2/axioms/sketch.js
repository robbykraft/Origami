let origami = RabbitEar.Origami("origami-cp", {padding:0.05});
let folded = RabbitEar.Origami("origami-fold", {padding:0.05});
// let folded = RabbitEar.Origami("origami-fold", {padding:0.05, shadows:true});

origami.markLayer = origami.group();
origami.arrowLayer = origami.group();
origami.controls = RE.svg.controls(origami, 0);
origami.axiom = undefined;
origami.subSelect = 0;  // some axioms have 2 or 3 results

// 1: hard reset, axiom has changed
origami.setAxiom = function(axiom) {
	if (axiom < 1 || axiom > 7) { return; }
	// axiom number buttons
	document.querySelectorAll("[id^=btn-axiom]")
		.forEach(b => b.className = "button");
	document.querySelector("#btn-axiom-"+axiom).className = "button button-red";
	// sub options buttons
	let optionCount = [null, 0, 0, 2, 0, 2, 3, 0][axiom];
	document.querySelectorAll("[id^=btn-option")
		.forEach((b,i) => b.style.opacity = i < optionCount ? 1 : 0);
	origami.setSubSel(origami.subSelect);
	
	origami.controls.removeAll();
	Array.from(Array([null, 2, 2, 4, 3, 4, 6, 5][axiom]))
		.map(_ => [Math.random(), Math.random()])
		.map(p => ({position: p, radius: 0.02, fill:"#e14929"}))
		.forEach(options => origami.controls.add(options));

	origami.axiom = axiom;
	origami.update();
}

origami.setSubSel = function(s) {
	document.querySelectorAll("[id^=btn-option")
		.forEach(b => b.className = "button");
	document.querySelector("#btn-option-"+s).className = "button button-red";

	origami.subSelect = s;
	origami.update();
}

// 2: soft reset, axiom params updated
origami.update = function() {
	// clear and re-fold axiom
	origami.cp = RabbitEar.bases.square;
	
	let pts = origami.controls.map(p => p.position);
	let lines = [];

	// convert points to lines if necessary
	switch (origami.axiom) {
		case 3: case 6: case 7:
			let v = [
				[pts[2][0] - pts[0][0], pts[2][1] - pts[0][1]],
				[pts[3][0] - pts[1][0], pts[3][1] - pts[1][1]]
			];
			lines = [RE.Line(pts[0], v[0]), RE.Line(pts[1], v[1])];
			break;
		case 4: case 5:
			lines = [RE.Line(pts[0], [pts[1][0]-pts[0][0], pts[1][1]-pts[0][1]])];
			break;
	}

	// axiom to get a crease line
	let creaseInfo;
	switch (origami.axiom){
		case 1:
		case 2: creaseInfo = RE.axiom(origami.axiom, ...pts);
			break;
		case 3: creaseInfo = RE.axiom(origami.axiom,
							lines[0].point, lines[0].vector,
							lines[1].point, lines[1].vector);
			break;
		case 4: creaseInfo = RE.axiom(origami.axiom,
							lines[0].point, lines[0].vector,
							pts[2]);
			break;
		case 5: creaseInfo = RE.axiom(origami.axiom,
							lines[0].point, lines[0].vector,
							pts[2], pts[3]);
			break;
		case 6: creaseInfo = RE.axiom(origami.axiom,
							lines[0].point, lines[0].vector,
							lines[1].point, lines[1].vector,
							pts[4], pts[5]);
			break;
		case 7: creaseInfo = RE.axiom(origami.axiom,
							lines[0].point, lines[0].vector,
							lines[1].point, lines[1].vector,
							pts[4]);
			break;
	}

	if (creaseInfo === undefined) { return; }

	// console.log(creaseInfo);

	if (creaseInfo.constructor === Array) {
		// if (creaseInfo[origami.subSelect] == null) {
// 
		// }
		creaseInfo = creaseInfo[origami.subSelect];
	}
	// console.log(creaseInfo);
	if (creaseInfo === undefined) {
		// switch
		origami.setSubSel((origami.subSelect+1)%3);
	}

	// console.log("creaseInfo", creaseInfo);
	origami.cp.valleyFold(creaseInfo);
	// console.log(origami.cp["re:fabricated"]);

	// until we get valleyFold returning the crease - create a duplicate
	// let creaseEdge = origami.cp.boundary.clipLine(creaseInfo);

	folded.cp = origami.cp;
	folded.fold();

	// draw axiom helper lines
	origami.markLayer.removeChildren();
	let auxLineStyle = "stroke:#e14929;stroke-width:0.005";
	lines
		.map(l => origami.cp.boundary.clipLine(l))
		.map(l => origami.markLayer.line(l[0][0], l[0][1], l[1][0], l[1][1]))
		.forEach(l => l.setAttribute("style", auxLineStyle));

	origami.arrowLayer.removeChildren();
	// console.log("fab", origami.cp["re:fabricated"]);
	origami.drawArrowsForAxiom(origami.axiom, origami.cp["re:fabricated"].crease);
}

origami.drawArrowsForAxiom = function(axiom, creaseLine){
	if (creaseLine == null) { return; }
	// until we get valleyFold returning the crease - create a duplicate
	let crease = origami.cp.boundary.clipLine(creaseLine);

	let pts = origami.controls.map(p => p.position);
	switch (axiom){
		case 2:
			origami.arrowLayer.arcArrow(pts[0], pts[1], {side:pts[0][0]<pts[1][0]});
			break;
		// case 2:
		// 	var intersect = crease.nearestPoint(pts[0]);
		// 	origami.drawArrowAcross(crease, intersect);
		// 	break;
		case 5:
			var intersect = crease.nearestPoint(pts[2]);  // todo: or [3] ?
			origami.drawArrowAcross(crease, intersect);
			break;
		case 6:
			let intersect1 = crease.nearestPoint(pts[4]);
			let intersect2 = crease.nearestPoint(pts[5]);
			origami.drawArrowAcross(crease, intersect1);
			origami.drawArrowAcross(crease, intersect2);
			break;
		case 7:
			var intersect = crease.nearestPoint(pts[4]);
			origami.drawArrowAcross(crease, intersect);
			break;
		default:
			origami.drawArrowAcross(crease);
			break;
	}
}

origami.onMouseMove = function(event){
	if (!origami.mouse.isPressed){ return; }
	origami.update();
}

// intersect is a point on the line,
// the point which the arrow should be cast perpendicularly across
// when left undefined, intersect will be the midpoint of the line.
origami.drawArrowAcross = function(crease, crossing){
	if (crease == null) {
		console.warn("drawArrowAcross not provided the correct parameters");
		return;
	}
	if (crossing == null) {
		crossing = crease.midpoint();
	}

	let normal = [-crease.vector[1], crease.vector[0]];
	let perpLine = { point: crossing, vector: normal };
	let perpClipEdge = origami.cp.boundary.clipLine(perpLine);

	let shortLength = [perpClipEdge[0], perpClipEdge[1]]
		.map(function(n){ return n.distanceTo(crossing); },this)
		.sort(function(a,b){ return a-b; })
		.shift();

	// another place it can fail
	let pts = [perpClipEdge[0], perpClipEdge[1]]
		.map(n => n.subtract(crossing).normalize())
		.filter(v => v !== undefined)
		.map(v => v.scale(shortLength))
		.map(v => crossing.add(v))
	if (pts.length < 2) { return; }

	let arrowStyle = { side: pts[0][0]<pts[1][0] };
	origami.arrowLayer.arcArrow(pts[0], pts[1], arrowStyle);
}

document.querySelectorAll("[id^=btn-axiom]")
	.forEach(b => b.onclick = function(e) {
		origami.setAxiom(parseInt(e.target.id.substring(10,11)));
	});
document.querySelectorAll("[id^=btn-option]")
	.forEach(b => b.onclick = function(e) {
		origami.setSubSel(parseInt(e.target.id.substring(11,12)));
	});

origami.setAxiom(1);