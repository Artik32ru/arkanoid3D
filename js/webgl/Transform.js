var Transform = function()
{
	this.scale = {
		x: 1.0, 
		y: 1.0, 
		z: 1.0
	};
	this.position = {
		x: 0.0, 
		y: 0.0, 
		z: 0.0
	};
	this.direction = {
		x: 0.0, 
		y: 0.0, 
		z: -1.0
	};
	this.rotation = {
		x: 0.0, 
		y: 0.0, 
		z: 0.0
	};
}

Transform.prototype.SetPosition = function(x, y, z) {
	this.position.x = x == (undefined || null) ? this.position.x : x;
	this.position.y = y == (undefined || null) ? this.position.y : y;
	this.position.z = z == (undefined || null) ? this.position.z : z;
}

Transform.prototype.SetDirection = function(x, y, z) {
	this.direction.x = x == (undefined || null) ? this.direction.x : x;
	this.direction.y = y == (undefined || null) ? this.direction.y : y;
	this.direction.z = z == (undefined || null) ? this.direction.z : z;
}

Transform.prototype.SetRotation = function(x, y, z) {
	this.rotation.x = x == (undefined || null) ? this.rotation.x : x;
	this.rotation.y = y == (undefined || null) ? this.rotation.y : y;
	this.rotation.z = z == (undefined || null) ? this.rotation.z : z;
}

Transform.prototype.SetScale = function(x, y, z) {
	this.scale.x = x == (undefined || null) ? this.scale.x : x;
	this.scale.y = y == (undefined || null) ? this.scale.y : y;
	this.scale.z = z == (undefined || null) ? this.scale.z : z;
}

Transform.prototype.GetPositionArray = function() {
	return Object.entries(this.position).map(([key, value]) => (value));;
}

Transform.prototype.GetPositionObject = function() {
	return this.position;
}

Transform.prototype.GetDirectionArray = function() {
	return Object.entries(this.direction).map(([key, value]) => (value));
}

Transform.prototype.GetDirectionObject = function() {
	return this.direction;
}

Transform.prototype.GetRotationArray = function() {
	return Object.entries(this.rotation).map(([key, value]) => (value));
}

Transform.prototype.GetRotationObject = function() {
	return this.rotation;
}

Transform.prototype.GetScaleArray = function() {
	return Object.entries(this.scale).map(([key, value]) => (value));
}

Transform.prototype.GetScaleObject = function() {
	return this.scale;
}

Transform.prototype.GetViewMatrix = function(target) {
	return lookAt(this.GetPositionArray(), addVectors(this.GetPositionArray(), this.GetDirectionArray()), [0.0, 1.0, 0.0]);
}

Transform.prototype.GetLookAtMatrix = function(target) {	
	var rMatrix = mat4.create();
	mat4.lookAt(rMatrix, this.GetPositionArray(), target, [0.0, 1.0, 0.0]);
	return rMatrix;
}

Transform.prototype.GetModelMatrix = function() {
	var tMatrix = mat4.create();
	mat4.translate(tMatrix, tMatrix, this.GetPositionArray());

	var rMatrix = this.GetLookAtMatrix(addVectors(this.GetPositionArray(), this.GetDirectionArray()));
	
	var sMatrix = mat4.create();
	mat4.scale(sMatrix, sMatrix, this.GetScaleArray());	
	
	var resMatrix = mat4.create();
	//mat4.multiply(resMatrix, sMatrix, rMatrix);
	//mat4.multiply(resMatrix, resMatrix, tMatrix);
	mat4.multiply(resMatrix, tMatrix, rMatrix);
	mat4.multiply(resMatrix, resMatrix, sMatrix);
	return resMatrix;
}

Transform.prototype.GetModelRotationMatrix = function() {
	var tMatrix = mat4.create();
	mat4.translate(tMatrix, tMatrix, this.GetPositionArray());
	
	var rMatrix = mat4.create();
	mat4.rotate(rMatrix, rMatrix, degToRad(-this.rotation.y),[0.0, 1.0, 0.0]);
	mat4.rotate(rMatrix, rMatrix, degToRad(this.rotation.x), [1.0, 0.0, 0.0]);
	mat4.rotate(rMatrix, rMatrix, degToRad(this.rotation.z), [0.0, 0.0, 1.0]);
	
	var sMatrix = mat4.create();
	mat4.scale(sMatrix, sMatrix, this.GetScaleArray());
	
	var resMatrix = mat4.create();
	//mat4.multiply(resMatrix, sMatrix, rMatrix);
	//mat4.multiply(resMatrix, resMatrix, tMatrix);
	mat4.multiply(resMatrix, tMatrix, rMatrix);
	mat4.multiply(resMatrix, resMatrix, sMatrix);
	return resMatrix;
}