<?php include 'header.php';?>
<script type="text/javascript" src="../lib/perlin.js"></script>

<h3 class="centered" style="padding-top:2em;">CHAPTER II.</h3>
<h1>PLANAR GRAPHS</h1>

<section id="intro">

	<div class="centered">
		<canvas id="canvas-intersection-wobble" resize class="panorama"></canvas>
	</div>

	<p class="quote">A <b>planar graph</b> is a collection of <b>nodes</b> and <b>edges</b> in 2D space.</p>

	<div class="centered">
		<pre><code><key>let</key> planarGraph<key> = new</key> PlanarGraph()</code></pre>
	</div>

	<p>A planar graph is a union of a <a href="math.php">2D geometry library</a> and the <a href="graph.php">Graph</a> class.</p>

</section>

<h2><a href="#fragment">&sect;</a> Fragment</h2>

<section id="fragment">

	<p class="quote">Edges are not allowed to cross each other. This is resolved by <b>fragmenting</b> edges into shorter edges with a new node at their intersection.</p>

	<div class="centered">
		<canvas id="canvas-fragment" resize class="panorama"></canvas>
	</div>

	<div class="centered">
		<pre><code><span id="span-merge-result"></span>graph.<f>clean</f>()</code></pre>
	</div>

	<div class="centered">
		<canvas id="canvas-crane-1" resize></canvas><canvas id="canvas-crane-2" resize></canvas>
	</div>

	<p class="quote">The graph on the right has been <a href="library/fragment">fragmented</a>. The longer lines have been split at their crossings.</p>

	<div class="centered">
		<pre><code>graph.<f>fragment</f>()</code></pre>
	</div>

</section>


<h2><a href="#face">&sect;</a> Face</h2>

<section id="face">

	<div class="centered">
		<canvas id="canvas-faces-convex" resize></canvas>
		<canvas id="canvas-faces-non-convex" resize></canvas>
	</div>

	<div class="centered">
		<pre><code>cp.<f>flatten</f>()</code></pre>
	</div>
	
	<p class="quote">This algorithm, <b>flatten()</b>, calculates and stores all the faces, and ran once at the beginning</p>

	<p class="explain">The current state of the algorithm: a face won't be created if there is a stray edge poking into the polygon.</p>

</section>


<h2><a href="#junction">&sect;</a> Junction &amp; Sector</h2>

<section id="junction">

	<p>Perhaps this is forward looking, but origami crease patterns typically arrange themselves so that many edges are sharing the same node, leaving much to be said about the area around one node. We will call this area a <b>junction</b>.</p>

	<p class="quote"><strong>Junction</strong>: the area including one node, its adjacent edges, and the sectors formed between edges.</p>

	<div class="centered">
		<canvas id="canvas-radial-rainbow" resize></canvas>
	</div>

	<div class="centered">
		<pre><code>junction.<f>edges</f>[<n><span id="edge-angle-index"></span></n>]  <span id="edge-angle-div"></span></code></pre>
	</div>

	<p class="quote">Edges around a junction are sorted.</p>

<h3 id="sector">Sector</h3>

	<div class="centered">
		<canvas id="canvas-nearest-sector" resize></canvas>
	</div>

	<div class="centered">
		<pre><code>junction.<f>sectors</f>[<n id="sketch-nia-index"></n>]</code></pre>
	</div>

	<p>Junctions are made up of <b>sectors</b>, the number of sectors is equal to the number of edges.</p>

	<div class="centered">
		<canvas id="canvas-sector" resize></canvas>
	</div>

	<p class="quote"><strong>Sector</strong>: two adjacent ordered edges and the space that creates an angle between them.</p>

	<p>The angle between two vectors can be the smaller or the larger which is why it's important to order the vectors, and consider the clockwise space between them.</p>
	
</section>


<!-- <div class="nav">
	<div class="nav-back">
		<a href="/docs/graph.php">⇦ Back: Graphs</a>
	</div>
	<div class="nav-next">
		<a href="clean.php">Next: Clean ⇒</a>
	</div>
</div> -->

<script type="text/javascript" src="../tests/intersect_wobble.js"></script>
<script type="text/javascript" src="../tests/fragment.js"></script>
<script type="text/javascript" src="../tests/faces_convex.js"></script>
<script type="text/javascript" src="../tests/faces_non_convex.js"></script>
<script type="text/javascript" src="../tests/radial_rainbow.js"></script>
<script type="text/javascript" src="../tests/sector.js"></script>
<script type="text/javascript" src="../tests/nearest_sector.js"></script>

<script>
// wobble_intersections_callback = function(e){
// 	document.getElementById("span-intersection-results").innerHTML = "<v>Array</v>(<n>" + e.length + "</n>) ← ";
// }
fragment_sketch_callback = function(event){
	if(event !== undefined){
		document.getElementById("span-merge-result").innerHTML = "<v>Array</v>(<n>" + event.length + "</n>) ← ";
	}
}
fragmentSketch.reset();
nearSectorCallback = function(event){
	if(event.index != undefined){
		document.getElementById("sketch-nia-index").innerHTML = event.index;
	}
}
radial_rainbow_callback = function(event){
	var angleDegrees = event.angle * 180 / Math.PI;
	// if(angleDegrees < 0) angleDegrees += 360;
	document.getElementById("edge-angle-index").innerHTML = event.index;
	document.getElementById("edge-angle-div").innerHTML = 
		"<c> // " + angleDegrees.toFixed(1) + "°</c>";
}
</script>
<script>
var crane1CP = new OrigamiPaper("canvas-crane-1").blackAndWhite().setPadding(0.05);
crane1CP.loadRaw("/files/svg/crane-errors.svg");
crane1CP.onMouseMove = function(event){
	var point = {x:event.point.x, y:event.point.y};
	var edgeArray = this.cp.edges
		.map(function(edge){
			return {edge:edge, distance:edge.nearestPoint(point).distanceTo(point)};
		})
		.sort(function(a,b){
			return a.distance - b.distance;
		})[0];
	var edge = (edgeArray != undefined) ? edgeArray.edge : undefined;

	if(edge != undefined){
		this.updateStyles();
		this.edges[ edge.index ].strokeColor = this.styles.byrne.red;
		this.edges[ edge.index ].strokeWidth = this.style.mountain.strokeWidth*2;
	}

}

var crane2CP = new OrigamiPaper("canvas-crane-2").blackAndWhite().setPadding(0.05);
crane2CP.load("/files/svg/crane-errors.svg");
crane2CP.show.faces = false;
crane2CP.onMouseMove = function(event){
	var nearest = this.cp.nearest(event.point);
	this.updateStyles();
	if(nearest.edge){ 
		this.edges[ nearest.edge.index ].strokeColor = this.styles.byrne.red;
		this.edges[ nearest.edge.index ].strokeWidth = this.style.mountain.strokeWidth*2;
	}
}	
</script>

<?php include 'footer.php';?>