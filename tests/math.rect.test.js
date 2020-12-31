const ear = require("../rabbit-ear");

// static
test("static fromPoints", () => {
	const r = ear.rect.fromPoints([1,1], [3,2]);
	expect(r.width).toBe(2);
	expect(r.height).toBe(1);
});

// native
test("area", () => {
  const r = ear.rect(2, 3, 4, 5);
  expect(r.area()).toBe(4 * 5);
});

test("scale", () => {
  const r = ear.rect(2, 3, 4, 5);
  expect(r.scale(2).area()).toBe((4 * 2) * (5 * 2));
});

test("segments", () => {
  const r = ear.rect(2, 3, 4, 5);
  const seg = r.segments();
  expect(seg.length).toBe(4);
});

test("center", () => {
	const r = ear.rect(2, 3, 4, 5);
	expect(r.center.x).toBe(2 + 4 / 2);
	expect(r.center.y).toBe(3 + 5 / 2);
});

test("centroid", () => {
  const r = ear.rect(1, 2, 3, 4);
  const centroid = r.centroid();
  expect(centroid.x).toBe(1 + 3 / 2);
  expect(centroid.y).toBe(2 + 4 / 2);
});

test("enclosingRectangle", () => {
  const r = ear.rect(1, 2, 3, 4);
  const bounds = r.enclosingRectangle();
  expect(bounds.x).toBe(1);
  expect(bounds.y).toBe(2);
  expect(bounds.width).toBe(3);
  expect(bounds.height).toBe(4);
});

test("contains", () => {
  const r = ear.rect(1, 2, 3, 4);
  expect(r.contains(0, 0)).toBe(false);
  expect(r.contains(1.5, 3)).toBe(true);
});

test("svg", () => {
	const r = ear.rect(1,2,3,4);
	expect(r.svgPath()).toBe("M1 2h3v4h-3Z");
});

// test("rotate", () => {
//   const r = ear.rect(1, 2, 3, 4);
//   r.rotate();
// });

// test("translate", () => {
//   const r = ear.rect(1, 2, 3, 4);
//   r.translate();
// });

// test("transform", () => {
//   const r = ear.rect(1, 2, 3, 4);
//   r.transform();
// });

// test("sectors", () => {
//   const r = ear.rect(1, 2, 3, 4);
//   r.sectors();
// });

// test("nearest", () => {
//   const r = ear.rect(1, 2, 3, 4);
//   r.nearest();
// });

// test("clipSegment", () => {
//   const r = ear.rect(1, 2, 3, 4);
//   r.clipSegment();
// });

// test("clipLine", () => {
//   const r = ear.rect(1, 2, 3, 4);
//   r.clipLine();
// });

// test("clipRay", () => {
//   const r = ear.rect(1, 2, 3, 4);
//   r.clipRay();
// });

// test("split", () => {
//   const r = ear.rect(1, 2, 3, 4);
//   r.split();
// });
