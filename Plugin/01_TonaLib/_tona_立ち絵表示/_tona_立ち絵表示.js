
// *****************************************************************************************************************************
// 立ち絵表示
// -----------------------------------------------------------------------------------------------------------------------------

tona_unitStatusPicture_hoseiX = 512 + 56;
tona_unitStatusPicture_hoseiY = 50;

tona_unitLeftAttackPicture_hoseiX = 0;
tona_unitLeftAttackPicture_hoseiY = 50;

tona_unitRightAttackPicture_hoseiX = 512;
tona_unitRightAttackPicture_hoseiY = 50;

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

	UnitMenuScreen._tona_hoseiX = -160;
	UnitMenuScreen._tona_hoseiY = 0;
	UnitMenuScreen._tona_frame = 0;

	var _UnitMenuScreen_moveScreenCycle = UnitMenuScreen.moveScreenCycle;

	UnitMenuScreen.moveScreenCycle = function() {
		this._tona_frame++;

		return _UnitMenuScreen_moveScreenCycle.call(this);
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
		x += this._tona_hoseiX;
		y += this._tona_hoseiY;

		this._topWindow.drawWindow(x, y);
		if (this._isUnitSentenceVisible()) {
			this._unitSentenceWindow.drawWindow(x + width, y);
		}
		this._bottomWindowArray[index].drawWindow(x, y + topHeight + interval);

		// drawWindowの後のthis._pageChanger.drawPageは、
		// スクロールカーソルがアイテムウインドウの上に表示されてしまう。
		// 予めsetDrawingMethodを呼び出すことで、drawWindowContentの前にカーソルが描画されるようにする。

	};

	UnitMenuScreen.drawScreenBottomText = function(textui) {
		var text;
		var index = this._activePageIndex;

		var anime_x = tona_Math.outQuadLimit(this._tona_frame, 0, 200, 10, 0);

		// 立ち絵の描画処理
		ContentRenderer.tona_drawUnitImage(tona_unitStatusPicture_hoseiX + anime_x, tona_unitStatusPicture_hoseiY, this._unit, 0, false, 255);

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
	// PosMenu
	// -----------------------------------------------------------------------------------------------------------------------------

	PosMenu.changePosTarget = function(targetUnit) {
		var targetItem, isLeft;

		if (this._unit === null || !this._isTargetAllowed(targetUnit)) {
			this._currentTarget = null;
			return;
		}

		this._currentTarget = targetUnit;
		targetItem = ItemControl.getEquippedWeapon(targetUnit);

		// ★追加：アニメをリセットする
		this._posWindowLeft._tona_frame = 0;
		this._posWindowRight._tona_frame = 0;

		// ★改造：srcを右側に入れ替えた
		isLeft = !Miscellaneous.isUnitSrcPriority(this._unit, targetUnit);

		// 自軍を左側に表示することを優先している(左側の方が見やすいと判断)
		// このため、自軍が仕掛けた場合は当然左側に表示されるが、
		// 自軍が仕掛けられた場合でも左側に表示される。
		// 両方、自軍である場合は仕掛けた方を左側に表示する。
		if (isLeft) {
			// 仕掛けたのは自軍であるため、これを_posWindowLeftに指定
			this._posWindowLeft.setPosTarget(this._unit, this._item, targetUnit, targetItem, true);
			this._posWindowRight.setPosTarget(targetUnit, targetItem, this._unit, this._item, false);
		}
		else {
			// 仕掛けたのは自軍ではない。
			// この場合、targetUnitが自軍であるため、これを_posWindowLeftに指定。
			this._posWindowLeft.setPosTarget(targetUnit, targetItem, this._unit, this._item, true);
			this._posWindowRight.setPosTarget(this._unit, this._item, targetUnit, targetItem, false);
		}
	}

	// *****************************************************************************************************************************
	// PosAttackWindow
	// -----------------------------------------------------------------------------------------------------------------------------

	PosAttackWindow._tona_frame = 0;

	PosAttackWindow.drawWindow = function(x, y) {

		// PosAttackWindow は moveWindows が毎フレーム呼ばれない（なんでや！）
		// しかたないので drawWindow でフレーム処理もするよ

		this._tona_frame++;

		var anime_x = tona_Math.outQuadLimit(this._tona_frame, 0, 200, 10, 0);

		// 立ち絵描画処理
		var half_screen_w = Math.floor(root.getGameAreaWidth() / 2);

		// ウィンドウ座標が画面中央より左にある場合
		if (x < half_screen_w) {

			// 左右反転して描画
			ContentRenderer.tona_drawUnitImage(tona_unitLeftAttackPicture_hoseiX - anime_x, tona_unitLeftAttackPicture_hoseiY, this._unit, 12, true, 255);
		}
		else {

			ContentRenderer.tona_drawUnitImage(tona_unitRightAttackPicture_hoseiX + anime_x, tona_unitRightAttackPicture_hoseiY, this._unit, 12, false, 255);
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




















