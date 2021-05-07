var CameraObject = function(angle, nearPlane, farPlane) {
	this.angle = angle;
	this.farPlane = farPlane;
	this.nearPlane = nearPlane;
	this.transform = new Transform();
}

CameraObject.prototype.GetProjectionMatrix = function(viewport) {
	var pMatrix = mat4.create();
	mat4.perspective(pMatrix, 0.75, viewport.GetRatio(), 0.1, 1000);
	return pMatrix;
}