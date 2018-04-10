<?php include 'header.php';?>

<h1>VORONOI</h1>

<section id="intro">

	<div class="centered">
		<canvas id="canvas-voronoi-many" resize class="panorama"></canvas>
	</div>

	<p>The Voronoi algorithm repeatedly appears in origami algorithms and research. The algorithm itself is an implementation of <a href="axioms.php">origami axiom #2</a>.</p>

<h2>Gussets</h2>

	<p>Gussets are channels inserted between cells that run parallel to the cell edges. This specific implementation explores a global crease pattern where every gusset's thickness is relative to the distance between the Voronoi sites.</p>

	<div class="centered">
		<canvas id="canvas-voronoi-interpolate" resize></canvas>
	</div>

	<div class="centered">
		<pre><code><v>cp</v>.<f>creaseVoronoi</f>(<n id="interp-value"></n>)</code></pre>
	</div>

	<p>It's easy to crease a gusset by hand that sits halfway between cells. With a computer we can parameterize this value to be anywhere between 0.0 and 1.0.</p>
	
<h2>Molecules</h2>

	<div class="centered">
		<canvas id="canvas-voronoi-animate-2" resize></canvas>
		<canvas id="canvas-voronoi-animate-1" resize></canvas>
	</div>

	<p>A molecule is the area around where 3 points come together. If the 3 Voronoi sites form an acute or right triangle the boundary of the molecule is a triangle; if the 3 sites form an obtuse triangle the boundary is a quadrilateral.</p>


<!-- 	<div class="centered">
		<canvas id="canvas-voronoi-edit" resize></canvas>
	</div> -->


</section>

<script src="../lib/d3.min.js"></script>
<script src="../tests/voronoi_many.js"></script>
<script src="../tests/voronoi_anim2.js"></script>
<script src="../tests/voronoi_anim1.js"></script>
<script src="../tests/voronoi_interp.js"></script>
<!-- <script src="../tests/voronoi_edit.js"></script> -->

<script type="text/javascript">

voronoiInterpCallback = function(e){
	if(e !== undefined){
		document.getElementById("interp-value").innerHTML = e.toFixed(2);
	}
}

</script>

<?php include 'footer.php';?>