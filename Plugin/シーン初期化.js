
// *****************************************************************************************************************************
// シーンコントロール
// -----------------------------------------------------------------------------------------------------------------------------

game_SceneControl = { __dummy: null

	// *****************************************************************************************************************************
	// 拠点をセットアップする
	// -----------------------------------------------------------------------------------------------------------------------------

	, setupRest: function() {

		// 拠点用のプレイヤーセットアップを作るべき
	}

	// *****************************************************************************************************************************
	// ステージをセットアップする
	// -----------------------------------------------------------------------------------------------------------------------------

	, setupStage: function() {

		this.setupStageUnit();
	}

	// *****************************************************************************************************************************
	// ステージの全てのユニットをセットアップする
	// -----------------------------------------------------------------------------------------------------------------------------

	, setupStageUnit: function() {
		var playerList = root.getCurrentSession().getPlayerList();
		var playerCount = playerList.getCount();
		var enemyList = root.getCurrentSession().getEnemyList();
		var enemyCount = enemyList.getCount();
		var allyList = root.getCurrentSession().getAllyList();
		var allyCount = allyList.getCount();

		// プレイヤーをセットアップ
		for (var i = 0; i < playerCount; i++) {
			this._setupPlayer(playerList.getData(i));
		}

		// エネミーをセットアップ
		for (var i = 0; i < enemyCount; i++) {
			this._setupEnemy(enemyList.getData(i));
		}

		// 同盟をセットアップ
		for (var i = 0; i < allyCount; i++) {
			this._setupAlly(allyList.getData(i));
		}
	}

	// *****************************************************************************************************************************
	// ステージのプレイヤーをセットアップする
	// -----------------------------------------------------------------------------------------------------------------------------
	, _setupPlayer: function(unit) {

		// セットアップ済みなら何もしない
		if (unit.custom.tona_isSetupDone > 0) { return; }

		root.log('セットアップ: ' + unit.getName());

		// プレイヤー情報を取得
		var unitId = tona_UnitControl.getPlayerId(unit);
		var masterPlayer = Master.playerById[unitId];

		// クラス情報を取得
		var klassId = unit.getClass().getId();
		var masterKlass = Master.klassById[klassId];

		// エディターで設定されたレベルを取得
		var srcLevel = unit.getLv();

		// 初期レベルを設定
		unit.setLv(masterPlayer.level);

	    // 初期パラメーターを設定
	    for (var pi = 0; pi < 8; pi++) {
			unit.setParamValue(pi, masterPlayer.params[pi]);
	    }

	    // レベルが低い場合は成長
		if (unit.getLv() < srcLevel) {

			// 固定成長
		    for (var pi = 0; pi < 8; pi++) {
				var value = unit.getParamValue(pi);
				value += Math.floor((masterPlayer.growths[pi] + masterKlass.growths[pi]) * (srcLevel - unit.getLv()) / 100 + 0.5);
				unit.setParamValue(pi, value);
			}
		}

		// セットアップ済みにする
		unit.custom.tona_isSetupDone = 1;
	}

	// *****************************************************************************************************************************
	// ステージのエネミーをセットアップする
	// -----------------------------------------------------------------------------------------------------------------------------
	, _setupEnemy: function(unit) {

		// セットアップ済みなら何もしない
		if (unit.custom.tona_isSetupDone > 0) { return; }

		root.log('セットアップ: ' + unit.getName());

		// セットアップ済みにする
		unit.custom.tona_isSetupDone = 1;
	}

	// *****************************************************************************************************************************
	// ステージの同盟をセットアップする
	// -----------------------------------------------------------------------------------------------------------------------------
	, _setupAlly: function(unit) {

		// セットアップ済みなら何もしない
		if (unit.custom.tona_isSetupDone > 0) { return; }

		root.log('セットアップ: ' + unit.getName());

		// セットアップ済みにする
		unit.custom.tona_isSetupDone = 1;
	}
};

















