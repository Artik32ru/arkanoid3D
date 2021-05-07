var isDebug = false;

var Shader = function(shaderName, gl)
{
	this.name = shaderName;
	
	this.vertexObj = null;
	this.vertexBinded = false;
	this.fragmentObj = null;
	this.fragmentBinded = false;
	this.isComplied = true;
	
	this.positionAttribute = null;
	
	this.isBlackUniform = null;
	this.viewMatrixUniform = null;
	this.modelMatrixUniform = null;
	this.projectionMatrixUniform = null;
	
	if (isDebug === true) {
		console.log('constructor');
		console.log(this);
	}
}

Shader.CreateShader = function(gl, type, text) {
	try {
		var shader = gl.createShader(type);		
		gl.shaderSource(shader, text);		
		gl.compileShader(shader);
		if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) throw new Error("Could not compile shader: " + gl.getShaderInfoLog(shader));	
		return shader;
	}
	catch(e) {
		console.log(e);
	}
}
Shader.prototype.SetVertexShader = function(gl,text) {
	this.isComplied = false;
	this.vertexObj = Shader.CreateShader(gl, gl.VERTEX_SHADER, text);
	this.vertexBinded = true;
	
	if (isDebug === true) {
		console.log('SetVertexShader');
		console.log(this);
		console.log(text);	
	}
}

Shader.prototype.SetFragmentShader = function(gl, text) {
	this.isComplied = false;
	this.fragmentObj = Shader.CreateShader(gl, gl.FRAGMENT_SHADER, text);
	this.fragmentBinded = true;
	
	if (isDebug === true) {
		console.log('SetFragmentShader');
		console.log(this);
		console.log(text);
	}
}

Shader.prototype.Compile = function(gl) {
	try {
		this.program = gl.createProgram();
		
		gl.attachShader(this.program, this.vertexObj);
		gl.attachShader(this.program, this.fragmentObj);

		gl.linkProgram(this.program);

        if (!gl.getProgramParameter(this.program, gl.LINK_STATUS))  throw new Error("Could not initialise shaders");
        
		this.isComplied = true;
		
		this.positionAttribute = gl.getAttribLocation(this.program, "a_position");	
		
		this.isBlackUniform = gl.getUniformLocation(this.program, "isBlack");
		this.viewMatrixUniform = gl.getUniformLocation(this.program, "ViewMatrix");
		this.modelMatrixUniform = gl.getUniformLocation(this.program, "ModelMatrix");
		this.projectionMatrixUniform = gl.getUniformLocation(this.program, "ProjectionMatrix");

	} 
	catch(e) {
		console.log(e);
		console.log(e.stack);
	}

	if (isDebug === true) {
		console.log('Compile');
		console.log(this);
	}
}

Shader.prototype.Use = function(gl) {
	gl.useProgram(this.program);
}

Shader.prototype.GetProgram = function() {
	return this.program;
}

Shader.prototype.TransferMatrices = function(gl, ModelMatrix, ViewMatrix, ProjectionMatrix, isBlack) {
	if (isBlack != (undefined || null)) gl.uniform1i(this.isBlackUniform, isBlack);
	if (ViewMatrix != (undefined || null)) gl.uniformMatrix4fv(this.viewMatrixUniform, false, ViewMatrix);
	if (ModelMatrix != (undefined || null)) gl.uniformMatrix4fv(this.modelMatrixUniform, false, ModelMatrix);
	if (ProjectionMatrix != (undefined || null)) gl.uniformMatrix4fv(this.projectionMatrixUniform, false, ProjectionMatrix);	
}