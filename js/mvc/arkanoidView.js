function rgb2hex(rgb) {
	var input = /^rgb\(([a-f\d]+)\,([a-f\d]+)\,([a-f\d]+)\)$/.exec(rgb);
	var r = parseInt(input[1], 10);
	var g = parseInt(input[2], 10);
	var b = parseInt(input[3], 10);
	var res = `#${r.toString(16).padStart(2,'0')}${g.toString(16).padStart(2,'0')}${b.toString(16).padStart(2,'0')}`;
	return res;
}

var View = function () {
	this.onKeyDownEvent = null;
	this.onMouseMoveEvent = null;
	this.gl = null;
	this.camera = new CameraObject(75, 0.1, 100.0);
	this.block = new Block();
	this.blockWireframe = new BlockWireframe();
	this.cylinder = new Cylinder();
	this.graphicObject = new GraphicObject(this.block); 
	this.viewport = null;
	this.shader = null;
	this.ballSize = {w : norm(INIT_BALL_W, LEFT_BORDER, RIGHT_BORDER, 0.0, 1.0), h : norm(INIT_BALL_H, LEFT_BORDER, RIGHT_BORDER, 0.0, 1.0)};
	this.brickSize = {w : norm(INIT_BRICK_W, LEFT_BORDER, RIGHT_BORDER, 0.0, 1.0), h : norm(INIT_BRICK_H, LEFT_BORDER, RIGHT_BORDER, 0.0, 1.0)};
	this.platformSize = {w : norm(INIT_PLATFORM_W, LEFT_BORDER, RIGHT_BORDER, 0.0, 1.0), h : norm(INIT_PLATFORM_H, LEFT_BORDER, RIGHT_BORDER, 0.0, 1.0)};
};

View.prototype.init = function (objs) {
	document.addEventListener('keydown', this.onKeyDownEvent);
	document.addEventListener('mousemove', this.onMouseMoveEvent);

	var canvas = document.getElementById("field");
	canvas.width = objs.field.w;
	canvas.height = objs.field.h;
	
	this.gl = canvas.getContext('webgl');
	if (!this.gl) console.error('webgl сломался');
	
	this.gl.viewportWidth = canvas.width;
	this.gl.viewportHeight = canvas.height;
	this.gl.viewport(0, 0, this.gl.viewportWidth, this.gl.viewportHeight);
	this.gl.clearColor(1.0, 1.0, 1.0, 1.0);
	this.gl.enable(this.gl.DEPTH_TEST);
	this.gl.disable(this.gl.CULL_FACE);
	this.viewport = new ViewportObject(this.gl.viewportWidth, this.gl.viewportHeight);
	var ratio = this.viewport.GetRatio();
	this.brickSize = {w : norm(INIT_BRICK_W, LEFT_BORDER, RIGHT_BORDER, 0.0, 1.0), h : norm(INIT_BRICK_H, LEFT_BORDER, RIGHT_BORDER, 0.0, 1.0)};
	this.platformSize = {w : norm(INIT_PLATFORM_W, LEFT_BORDER, RIGHT_BORDER, 0.0, 1.0), h : norm(INIT_PLATFORM_H, LEFT_BORDER, RIGHT_BORDER, 0.0, 1.0)};

	this.graphicObject.transform.SetPosition(0.0, 0.0, 5.0);
	this.graphicObject.transform.SetScale(0.1, 0.05, 0.1);
	this.camera.transform.SetPosition(-0.5,  0.281, -0.715);
	this.camera.transform.SetRotation(0, 180, 180);
	
	this.shader = new Shader('standartShader', this.gl);

	this.shader.SetVertexShader(this.gl, document.querySelector('[id="standartV"][type="x-shader/x-vertex"]').textContent);
	this.shader.SetFragmentShader(this.gl, document.querySelector('[id="standartF"][type="x-shader/x-fragment"]').textContent);
	this.shader.Compile(this.gl);
	this.shader.Use(this.gl);
	
	this.shader.TransferMatrices(this.gl, null, null, this.camera.GetProjectionMatrix(this.viewport));
};

View.prototype.render = function (objs) {
	this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
	this.graphicObject.SetPrimitive(this.block);	
	this.shader.TransferMatrices(this.gl, null, this.camera.transform.GetModelRotationMatrix(), null);
	var ratio = this.viewport.GetRatio();
	this.graphicObject.transform.SetScale(this.brickSize.w, this.brickSize.h, this.brickSize.h / 2);
	this.gl.disable(this.gl.DEPTH_TEST);
	objs.bricks.forEach((brick, i) => {
		if (brick.alive)
		{		
			var brickX = norm(brick.x, LEFT_BORDER, RIGHT_BORDER, 0.0, 1.0);
			var brickY = norm(brick.y, LEFT_BORDER, RIGHT_BORDER, 0.0, 1.0);
			
			this.graphicObject.transform.SetPosition(brickX, brickY, 0);
			this.shader.TransferMatrices(this.gl, this.graphicObject.transform.GetModelRotationMatrix(), null, null, 0);
			this.graphicObject.Draw(this.gl, this.shader);
		}
	});

	this.graphicObject.SetPrimitive(this.blockWireframe);
	objs.bricks.forEach((brick, i) => {
		if (brick.alive)
		{		
			var brickX = norm(brick.x, LEFT_BORDER, RIGHT_BORDER, 0.0, 1.0);
			var brickY = norm(brick.y, LEFT_BORDER, RIGHT_BORDER, 0.0, 1.0);
			
			this.graphicObject.transform.SetPosition(brickX, brickY, 0);
			this.shader.TransferMatrices(this.gl, this.graphicObject.transform.GetModelRotationMatrix(), null, null, 1);

			this.graphicObject.DrawLines(this.gl, this.shader);
		}
	});
		
	this.graphicObject.transform.SetScale(this.platformSize.w, this.platformSize.h, this.platformSize.h / 2);

	var platformX = norm(objs.platform.x, LEFT_BORDER, RIGHT_BORDER, 0.0, 1.0);
	var platformY = norm(objs.platform.y, LEFT_BORDER, RIGHT_BORDER, 0.0, 1.0);
	
	this.graphicObject.transform.SetPosition(platformX, platformY, 0);
	this.shader.TransferMatrices(this.gl, this.graphicObject.transform.GetModelRotationMatrix(), null, null, 0);
	this.graphicObject.SetPrimitive(this.block);
	this.graphicObject.Draw(this.gl, this.shader);	
	this.graphicObject.SetPrimitive(this.blockWireframe);
	this.shader.TransferMatrices(this.gl, this.graphicObject.transform.GetModelRotationMatrix(), null, null, 1);
	this.graphicObject.DrawLines(this.gl, this.shader);	
	this.graphicObject.SetPrimitive(this.cylinder);
	this.graphicObject.transform.SetScale(this.ballSize.w, this.ballSize.h, this.ballSize.h / 2);
	this.gl.enable(this.gl.DEPTH_TEST);
	var ballX = norm(objs.ball.x + objs.ball.w / 2, LEFT_BORDER, RIGHT_BORDER, 0.0, 1.0);
	var ballY = norm(objs.ball.y + objs.ball.h / 2, LEFT_BORDER, RIGHT_BORDER, 0.0, 1.0);
	
	this.graphicObject.transform.SetPosition(ballX, ballY, 0);
	this.shader.TransferMatrices(this.gl, this.graphicObject.transform.GetModelRotationMatrix(), null, null, 1);
	this.graphicObject.Draw(this.gl, this.shader);
};

var arkanoidView = new View();