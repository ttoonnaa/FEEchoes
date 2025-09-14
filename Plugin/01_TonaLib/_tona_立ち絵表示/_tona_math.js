
// *****************************************************************************************************************************
// _tona_Math
// -----------------------------------------------------------------------------------------------------------------------------

var tona_Math = {};

tona_Math.linearLimit = function(x, x1, y1, x2, y2) {

	if (x1 === x2) {
		return y2;
	}

	if (x1 > x2) {
		return this.linearLimit(x, x2, y2, x1, y1);
	}

	x = Math.min(Math.max(x, x1), x2);

	var t = (x - x1) / (x2 - x1);

	return y1 + (y2 - y1) * t;
};

tona_Math.inQuadLimit = function(x, x1, y1, x2, y2) {

	if (x1 === x2) {
		return y2;
	}

	if (x1 > x2) {
		return this.inQuadLimit(x, x2, y2, x1, y1);
	}

	x = Math.min(Math.max(x, x1), x2);

	var t = (x - x1) / (x2 - x1);

	return y1 + (y2 - y1) * t * t;
};

tona_Math.outQuadLimit = function(x, x1, y1, x2, y2) {

	if (x1 === x2) {
		return y2;
	}

	if (x1 > x2) {
		return this.outQuadLimit(x, x2, y2, x1, y1);
	}

	x = Math.min(Math.max(x, x1), x2);

	var t = (x - x1) / (x2 - x1);

	return y1 + (y2 - y1) * (1 - (1 - t) * (1 - t));
};




