const INIT_BRICK_W = 50;
const INIT_BRICK_H = 20;
const INIT_BRICK_X_COUNT = 9;
const INIT_BRICK_Y_COUNT = 5;
const INIT_BRICK_X_DIST = 10;
const INIT_BRICK_Y_DIST = 5;
const INIT_BRICK_Y_OFFSET = 30;

const TOP_BORDER = 0;
const BOTTOM_BORDER = 310;
const LEFT_BORDER = 0;
const RIGHT_BORDER = (INIT_BRICK_X_COUNT * INIT_BRICK_W) + INIT_BRICK_X_DIST * (INIT_BRICK_X_COUNT + 1);
const BOTTOM_BRICK_BORDER = (INIT_BRICK_Y_COUNT * INIT_BRICK_H) + INIT_BRICK_Y_DIST * (INIT_BRICK_Y_COUNT + 1);

const INIT_PLATFORM_W = 60;
const INIT_PLATFORM_H = 10;
const INIT_PLATFORM_X = (RIGHT_BORDER - INIT_PLATFORM_W) / 2;
const INIT_PLATFORM_Y = BOTTOM_BORDER - 20;
const INIT_PLATFORM_SPEED = 12;

const INIT_BALL_W = 10;
const INIT_BALL_H = 10;
const INIT_BALL_X = (RIGHT_BORDER - INIT_BALL_W) / 2;
const INIT_BALL_Y = INIT_PLATFORM_Y - 12;
const INIT_BALL_SPEED = 2;


const KEY_CODE_ESC = 27;
const KEY_CODE_LEFT = 37;
const KEY_CODE_RIGHT = 39;
const KEY_CODE_SPACE = 32;

var Model = function () {
	this.build();
};

Model.prototype.build = function () {
	this.objs = null;

	this.objs =
	{
		'info':
		{
			isStarted: false,
			count: 0,
		},
		'field':
		{
			x: 0,
			y: 0,
			w: RIGHT_BORDER,
			h: BOTTOM_BORDER,
		},
		'platform':
		{
			x: INIT_PLATFORM_X,
			y: INIT_PLATFORM_Y,
			w: INIT_PLATFORM_W,
			h: INIT_PLATFORM_H,
			dx: 1,
			dy: 0,
			speed: INIT_PLATFORM_SPEED,
			isReflecting: false,
		},
		'ball':
		{
			x: INIT_BALL_X,
			y: INIT_BALL_Y,
			w: INIT_BALL_W,
			h: INIT_BALL_H,
			dx: 0,
			dy: 0,
			speed: INIT_BALL_SPEED,
			color: 'rgb(128,0,128)',
			isReflecting: true,
		},
		'bricks':
			[
			]
	};

	for (let i = 0; i < INIT_BRICK_Y_COUNT; i++) {
		for (let j = 0; j < INIT_BRICK_X_COUNT; j++) {
			this.objs.bricks.push(
				{
					x: j * INIT_BRICK_W + (j + 1) * INIT_BRICK_X_DIST,
					y: i * INIT_BRICK_H + (i + 1) * INIT_BRICK_Y_DIST + INIT_BRICK_Y_OFFSET,
					w: INIT_BRICK_W,
					h: INIT_BRICK_H,
					alive: true,
				});
		}
	}
}

Model.prototype.init = function (renderFunction) {
	this.needRendering = renderFunction;
	requestAnimationFrame(arkanoidModel.Move);
};

Model.prototype.setCoords = function (obj, x, y) {
	obj.x = x == (undefined || null) ? obj.x : x;

	obj.y = y == (undefined || null) ? obj.y : y;

	this.needRendering();
};

Model.prototype.getCoords = function (obj) {
	return { x: obj.x, y: obj.y, };
};

Model.prototype.setDirection = function (obj, dx, dy) {
	obj.dx = dx == (undefined || null) ? obj.dx : dx;

	obj.dy = dy == (undefined || null) ? obj.dy : dy;
};

Model.prototype.getDirection = function (obj) {
	return { dx: obj.dx, dy: obj.dy, };
};

//Вариант с передвижением мышью
Model.prototype.platformMove = function (e) {

	var _this = this;
	var _thisObjs = _this.objs;
	
	var platfrom = _thisObjs.platform;
	var ball = _thisObjs.ball;

	var x = e.clientX;
	var w = platfrom.w;

	if (x + w >= RIGHT_BORDER)
		x = RIGHT_BORDER - w;
	else
		platfrom.x = x;


	if (x <= LEFT_BORDER)
		x = 0;
	else
		platfrom.x = x;


	_this.setCoords(_thisObjs.platform, x);

	if (_thisObjs.info.isStarted == false) {

		var x = platfrom.x + (platfrom.w / 2 - ball.w / 2);

		_this.setCoords(_thisObjs.ball, x);
	}

}

Model.prototype.OnKeyDown = function (e) {
	
	var _this = this;
	var _thisObjs = _this.objs;
	
	var keyCode = e.keyCode;

	var ball = _thisObjs.ball;

	if (keyCode == KEY_CODE_SPACE) {
		if (_thisObjs.info.isStarted == false) {
			_thisObjs.info.isStarted = true;

			var speed = ball.speed;

			var dx = norm(ball.x + ball.w / 2, LEFT_BORDER, RIGHT_BORDER, -speed, speed);
			var dy = -speed + dx;

			_this.setDirection(_thisObjs.ball, dx, dy);
		}
	}
}

Model.prototype.checkScreenBorders = function (obj, x, y) {
	
	var _this = this;
	var _thisObjs = _this.objs;

	if (!(x <= LEFT_BORDER || (x + obj.w) >= RIGHT_BORDER)) {
		obj.x = x;
	}
	else if (obj.isReflecting)
	{
		if (x <= LEFT_BORDER && obj.dx < 0) {
			obj.dx *= -1;
		}		
		else if ((x + obj.w) >= RIGHT_BORDER && obj.dx > 0)
		{
			obj.dx *= -1;
		}
	}

	if (!(y <= TOP_BORDER || (y + obj.h) >= BOTTOM_BORDER)) {
		obj.y = y;
	}
	else {
		if ((y + obj.h) >= BOTTOM_BORDER) {
			_thisObjs.info.isStarted = false;
			_this.setCoords(_thisObjs.platform, INIT_PLATFORM_X, INIT_PLATFORM_Y);
			_this.setCoords(_thisObjs.ball, INIT_BALL_X, INIT_BALL_Y);
			_this.setDirection(_thisObjs.ball, 0, 0);
		}
		else if (obj.isReflecting) {
			obj.dy *= -1;
		}
	}
}

Model.prototype.checkBricksBallCollision = function () {
	
	var _this = this;
	var _thisObjs = _this.objs;
	
	var ball = _thisObjs.ball;

	var innerOffsetX = 2;
	var innerOffsetY = 2;
	
	_thisObjs.bricks.forEach((brick, i) => {
		if (brick.alive == true && RectCircleColliding(brick, ball) == true) {
			if (ball.y < brick.y + brick.h && ball.y + ball.h > brick.y) {
				if ((ball.x + ball.w) >= brick.x && (ball.x + ball.w) <= (brick.x + innerOffsetX)) {
					ball.dx *= -1;
					brick.alive = false;
				}
				else
					if (ball.x <= (brick.x + brick.w) && ball.x >= (brick.x + brick.w - innerOffsetX)) {
						ball.dx *= -1;
						brick.alive = false;
					}
			}
			
			if (ball.x <= brick.x + brick.w && ball.x + ball.w >= brick.x) {
				if ((ball.y + ball.h) >= brick.y && (ball.y + ball.h) <= (brick.y + innerOffsetY)) {
					ball.dy *= -1;
					brick.alive = false;
				}

				else if (ball.y <= (brick.y + brick.h) && ball.y >= (brick.y + brick.h - innerOffsetY)) {
					ball.dy *= -1;
					brick.alive = false;
				}
			}
		}
	});
}

Model.prototype.checkPlatformBallCollision = function () {
	
	var _this = this;
	var _thisObjs = _this.objs;
	
	var ball = _thisObjs.ball;
	
	var platform = _thisObjs.platform;
	var innerOffset = 2;
	var speed = ball.speed;

	if ((ball.y + ball.h) >= platform.y && (ball.y + ball.h) < (platform.y + innerOffset)) {
		if (ball.x <= platform.x + platform.w && ball.x + ball.w >= platform.x) {
			var dx = norm(ball.x + ball.w / 2, platform.x, platform.x + platform.w, -speed, speed);
			var dy = -speed + Math.abs(dx);

			ball.dx = dx;
			ball.dy = dy;
		}
	}
	else
		if (ball.y < platform.y + platform.h && ball.y + ball.h > platform.y) {
			if ((ball.x + ball.w) >= platform.x && (ball.x + ball.w) <= (platform.x + innerOffset)) {
				ball.dx *= -1;
				ball.dy *= -1;
			}
			else if (ball.x <= (platform.x + platform.w) && ball.x >= (platform.x + platform.w - innerOffset)) {
				ball.dx *= -1;
				ball.dy *= -1;
			}
		}
}

Model.prototype.Move = function () {
	var _this = arkanoidModel;
	var _thisObjs = _this.objs;
	
	if (_thisObjs.info.isStarted == true) {
		var x = _this.getCoords(_thisObjs.ball).x;
		var y = _this.getCoords(_thisObjs.ball).y;

		var dx = _this.getDirection(_thisObjs.ball).dx;
		var dy = _this.getDirection(_thisObjs.ball).dy;

		x += dx;
		y += dy;

		_this.setCoords(_thisObjs.ball, x, y);
		_this.checkScreenBorders(_thisObjs.ball, x, y);
		_this.checkPlatformBallCollision();
		_this.checkBricksBallCollision();
	}
	requestAnimationFrame(_this.Move);
}


var arkanoidModel = new Model();