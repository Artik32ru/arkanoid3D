var Block = function() {
	this.itemSize = 3;
	this.itemsCount = 14;
    this.vertices = [
    0.0, 1.0, 1.0,     // Front-top-left
    1.0, 1.0, 1.0,      // Front-top-right
    0.0, 0.0, 1.0,    // Front-bottom-left
    1.0, 0.0, 1.0,     // Front-bottom-right
    1.0, 0.0, 0.0,    // Back-bottom-right
    1.0, 1.0, 1.0,      // Front-top-right
    1.0, 1.0, 0.0,     // Back-top-right
    0.0, 1.0, 1.0,     // Front-top-left
    0.0, 1.0, 0.0,    // Back-top-left
    0.0, 0.0, 1.0,    // Front-bottom-left
    0.0, 0.0, 0.0,   // Back-bottom-left
    1.0, 0.0, 0.0,    // Back-bottom-right
    0.0, 1.0, 0.0,    // Back-top-left
    1.0, 1.0, 0.0      // Back-top-right
    ];
}

var BlockWireframe = function() {
	this.itemSize = 3;
	this.itemsCount = 5;
    this.vertices = [
	0.0, 0.0, 1.0,
	1.0, 0.0, 1.0,
	1.0, 1.0, 1.0,
	0.0, 1.0, 1.0,
	0.0, 0.0, 1.0,
    ];
}

var Cylinder = function() {
	this.itemSize = 3;
	this.itemsCount = 18;
	this.vertices = [
		 0.0,  0.5, 0.0,
		 0.354,  0.354, 0.0,
		-0.354,  0.354, 0.0,
		
		 0.354,  0.354, 0.0,
		-0.354,  0.354, 0.0,
		-0.5,  0.0, 0.0,

		 0.354,  0.354, 0.0,
		-0.5,  0.0, 0.0,
		 0.5,  0.0, 0.0,
		 
		 0.5,  0.0, 0.0, 
		-0.5,  0.0, 0.0,
		-0.354, -0.354, 0.0,

		 0.5,  0.0, 0.0,
		-0.354, -0.354, 0.0,
		 0.354, -0.354, 0.0,
		 
		 0.354, -0.354, 0.0,
		-0.354, -0.354, 0.0,
		 0.0, -0.5, 0.0,
	];
}

var Sphere = function() {

	var vertices = [];
    var indices = [];
	var latitudeBands = 30;
    var longitudeBands = 30;
    var itemsCount = 30;
    var radius = 1;
	for (var latNumber = 0; latNumber <= latitudeBands; latNumber++) {
	  var theta = latNumber * Math.PI / latitudeBands;
	  var sinTheta = Math.sin(theta);
	  var cosTheta = Math.cos(theta);

	  for (var longNumber = 0; longNumber <= longitudeBands; longNumber++) {
		var phi = longNumber * 2 * Math.PI / longitudeBands;
		var sinPhi = Math.sin(phi);
		var cosPhi = Math.cos(phi);

		var x = cosPhi * sinTheta;
		var y = cosTheta;
		var z = sinPhi * sinTheta;
		var u = 1 - (longNumber / longitudeBands);
		var v = 1 - (latNumber / latitudeBands);

		vertices.push(radius * x);
		vertices.push(radius * y);
		vertices.push(radius * z);
	  }
	}

    for (var latNumber = 0; latNumber < latitudeBands; latNumber++) {
      for (var longNumber = 0; longNumber < longitudeBands; longNumber++) {
        var first = (latNumber * (longitudeBands + 1)) + longNumber;
        var second = first + longitudeBands + 1;
        indices.push(first);
        indices.push(second);
        indices.push(first + 1);

        indices.push(second);
        indices.push(second + 1);
        indices.push(first + 1);
      }
	}
}

