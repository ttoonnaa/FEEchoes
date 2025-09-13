
// *****************************************************************************************************************************
// 表示補正
// -----------------------------------------------------------------------------------------------------------------------------

_tona_unitStatusPicture_hoseiX = 512 + 56;
_tona_unitStatusPicture_hoseiY = 50;

_tona_unitLeftAttackPicture_hoseiX = 0;
_tona_unitLeftAttackPicture_hoseiY = 50;

_tona_unitRightAttackPicture_hoseiX = 512;
_tona_unitRightAttackPicture_hoseiY = 50;


(function() {

// *****************************************************************************************************************************
// ContentRenderer
// -----------------------------------------------------------------------------------------------------------------------------

ContentRenderer.tona_drawUnitImage = function(x, y, unit, id, isReverse, alpha) {
	var image = unit.getCharIllustImage(id);

	if (image !== null) {
	    image.setReverse(isReverse);
	    image.setAlpha(alpha);
	    image.draw(x, y);
	}
};

// *****************************************************************************************************************************
// UnitMenuScreen
// -----------------------------------------------------------------------------------------------------------------------------

UnitMenuScreen.tona_hoseiX = -160;
UnitMenuScreen.tona_hoseiY = 0;
UnitMenuScreen.tona_frame = 0;

var UnitMenuScreen_moveScreenCycle = UnitMenuScreen.moveScreenCycle;

UnitMenuScreen.moveScreenCycle = function() {
	this.tona_frame++;

	return UnitMenuScreen_moveScreenCycle.call(this);
};

UnitMenuScreen.drawScreenCycle = function() {
	var x, y;
	var index = this._activePageIndex;
	var width = this._topWindow.getWindowWidth();
	var topHeight = this._topWindow.getWindowHeight();
	var bottomHeight = this._bottomWindowArray[index].getWindowHeight();
	var interval = DefineControl.getWindowInterval();

	if (this._isUnitSentenceVisible()) {
		x = LayoutControl.getCenterX(-1, width + this._unitSentenceWindow.getWindowWidth());
	}
	else {
		x = LayoutControl.getCenterX(-1, width);
	}
	y = LayoutControl.getCenterY(-1, topHeight + bottomHeight + interval);

	// ユニットメニューウィンドウの表示X座標補正値分、ウィンドウのX座標をずらす
	x += this.tona_hoseiX;
	y += this.tona_hoseiY;

	this._topWindow.drawWindow(x, y);
	if (this._isUnitSentenceVisible()) {
		this._unitSentenceWindow.drawWindow(x + width, y);
	}
	this._bottomWindowArray[index].drawWindow(x, y + topHeight + interval);

	// drawWindowの後のthis._pageChanger.drawPageは、
	// スクロールカーソルがアイテムウインドウの上に表示されてしまう。
	// 予めsetDrawingMethodを呼び出すことで、drawWindowContentの前にカーソルが描画されるようにする。

};


linear_limit = function(x, x1, y1, x2, y2) {

	if (x1 == x2) {
		return y2;
	}

	if (x1 < x2) {
		x = Math.min(Math.max(x, x1), x2);
		return (y2 - y1) / (x2 - x1) * (x - x1) + y1;
	}

	if (x1 > x2) {
		x = Math.min(Math.max(x, x2), x1);
		return (y2 - y1) / (x2 - x1) * (x - x1) + y1;
	}
}


UnitMenuScreen.drawScreenBottomText = function(textui) {
	var text;
	var index = this._activePageIndex;

	var x_rep = linear_limit(this.tona_frame, 0, 200, 10, 0);

	// 立ち絵の描画処理
	ContentRenderer.tona_drawUnitImage(_tona_unitStatusPicture_hoseiX + x_rep, _tona_unitStatusPicture_hoseiY, this._unit, 0, false, 255);

	//
	// 以下、元の処理
	//

	if (this._topWindow.isTracingHelp()) {
		text = this._topWindow.getHelpText();
	}
	else if (this._bottomWindowArray[index].isHelpMode() || this._bottomWindowArray[index].isTracingHelp()) { // isInteraction
		text = this._bottomWindowArray[index].getHelpText();
	}
	else {
		text = this._unit.getDescription();
	}

	TextRenderer.drawScreenBottomText(text, textui);
};

// *****************************************************************************************************************************
// PosAttackWindow.drawWindow
// -----------------------------------------------------------------------------------------------------------------------------
//		ここで立ち絵を一緒に描画します
// -----------------------------------------------------------------------------------------------------------------------------

PosAttackWindow.drawWindow = function(x, y) {

	// 立ち絵描画処理
	var half_screen_w = Math.floor(root.getGameAreaWidth() / 2);

	// ウィンドウ座標が画面中央より左にある場合
	if (x < half_screen_w) {

		// 左右反転して描画
		ContentRenderer.tona_drawUnitImage(_tona_unitLeftAttackPicture_hoseiX, _tona_unitLeftAttackPicture_hoseiY, this._unit, 12, true, 255);
	}
	else {

		ContentRenderer.tona_drawUnitImage(_tona_unitRightAttackPicture_hoseiX, _tona_unitRightAttackPicture_hoseiY, this._unit, 12, false, 255);
	}

	//
	// 以下、元の処理
	//

	var width = this.getWindowWidth();
	var height = this.getWindowHeight();
	var textui = this.getWindowTextUI();
	var pic = textui.getUIImage();

	if (!this._isWindowEnabled) {
		return;
	}

	// ウィンドウの描画
	if (pic !== null) {
		WindowRenderer.drawStretchWindow(x, y, width, height, pic);
	}

	this.drawWindowContent(x + this.getWindowXPadding(), y + this.getWindowYPadding());

	this.drawWindowTitle(x, y, width, height, pic);
};

})();




















