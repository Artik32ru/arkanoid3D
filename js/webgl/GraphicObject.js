var GraphicObject = function(primitive) {
	this.primitive = primitive == (undefined || null) ? null : primitive;
	this.transform = new Transform();
}

GraphicObject.prototype.SetPrimitive = function(obj) {
	this.primitive = obj;
}

GraphicObject.prototype.GetPrimitive = function() {
	return this.primitive;
}

GraphicObject.prototype.Draw = function(gl, shader) {
	
	var buffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.primitive.vertices), gl.STATIC_DRAW);
	
	gl.enableVertexAttribArray(shader.positionAttribute);
    gl.vertexAttribPointer(shader.positionAttribute, this.primitive.itemSize, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, this.primitive.itemsCount);
}


GraphicObject.prototype.DrawLines = function(gl, shader) {
	
	var buffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.primitive.vertices), gl.STATIC_DRAW);
	
	gl.enableVertexAttribArray(shader.positionAttribute);
    gl.vertexAttribPointer(shader.positionAttribute, this.primitive.itemSize, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.LINE_STRIP, 0, this.primitive.itemsCount);
}
