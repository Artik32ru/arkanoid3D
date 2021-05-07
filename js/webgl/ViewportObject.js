var ViewportObject = function(w, h)
{
	this.size = {
		w: 0.0, 
		h: 0.0, 
	};
	
	this.size.w = w == (undefined || null) ? this.size.w : w;
	this.size.h = h == (undefined || null) ? this.size.h : h;
}

ViewportObject.prototype.SetSize = function(w, h)
{
	this.size.w = w == (undefined || null) ? this.size.w : w;
	this.size.h = h == (undefined || null) ? this.size.h : h;
}

ViewportObject.prototype.GetSize = function()
{
	return this.size;
}

ViewportObject.prototype.GetRatio = function()
{
	return (this.size.w / this.size.h);
}