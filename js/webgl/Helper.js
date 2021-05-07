function degToRad (deg) { return deg / 180 * Math.PI; }

function radToDeg (rad) { return rad / Math.PI * 180; }

function cross(a, b) {
	return [a[1] * b[2] - a[2] * b[1],
			a[2] * b[0] - a[0] * b[2],
			a[0] * b[1] - a[1] * b[0]];
}

function addVectors(a, b) {
	return [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
}

function subtractVectors(a, b) {
	return [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
}

function normalize(v) {
	var length = Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
	if (length > 0.00001) {
		return [v[0] / length, v[1] / length, v[2] / length];
	} 
	else {
		return [0, 0, 0];
	}
}

function lookAt(camPs, target, up) {
	var zAxis = normalize(subtractVectors(camPs, target));
	var xAxis = normalize(cross(up, zAxis));
	var yAxis = normalize(cross(zAxis, xAxis));
	return new Float32Array([
		xAxis[0], xAxis[1], xAxis[2], 0,
		yAxis[0], yAxis[1],	yAxis[2], 0,
		zAxis[0], zAxis[1],	zAxis[2], 0,
		camPs[0], camPs[1], camPs[2], 1,
	]);
}

function norm(OldValue, OldMin, OldMax, NewMin = 0.0, NewMax = 1.0) {
	var newValue = (((OldValue - OldMin) * (NewMax - NewMin)) / (OldMax - OldMin)) + NewMin;
	return newValue;
}

function RectCircleColliding(rect, circle){
    var distX = Math.abs(circle.x - rect.x-rect.w/2);
    var distY = Math.abs(circle.y - rect.y-rect.h/2);

    if (distX > (rect.w/2 + circle.w)) { return false; }
    if (distY > (rect.h/2 + circle.h)) { return false; }

    if (distX <= (rect.w/2)) { return true; } 
    if (distY <= (rect.h/2)) { return true; }

    var dx=distX-rect.w/2;
    var dy=distY-rect.h/2;
    return (dx*dx+dy*dy<=(circle.w * circle.h));
}

function RectCircleCollidingX(rect, circle){
    var distX = Math.abs(circle.x - rect.x-rect.w/2);
    if (distX > (rect.w/2 + circle.w)) { return false; }
    if (distX <= (rect.w/2)) { return true; } 
}

function RectCircleCollidingY(rect, circle){
    var distY = Math.abs(circle.y - rect.y-rect.h/2);
    if (distY > (rect.h/2 + circle.h)) { return false; }
    if (distY <= (rect.h/2)) { return true; }	
}

function RectCircleCollidingCorner(rect, circle){
    var distX = Math.abs(circle.x - rect.x-rect.w/2);
    var distY = Math.abs(circle.y - rect.y-rect.h/2);

    var dx=distX-rect.w/2;
    var dy=distY-rect.h/2;
    return (dx*dx+dy*dy<=(circle.w * circle.h));
}
