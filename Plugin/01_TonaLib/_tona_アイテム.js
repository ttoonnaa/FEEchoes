
(function() {

	// *****************************************************************************************************************************
	// ItemControl：ベース武器を取得する
	// -----------------------------------------------------------------------------------------------------------------------------

	ItemControl.tona_getBaseWeapon = function(unit) {

		// 先頭の武器をベース武器とする
		var weaponId = tona_UnitControl.getBaseWeaponIds(unit)[0];
		var weapon = root.getBaseData().getWeaponList().getDataFromId(weaponId);
		var weaponCategoryType = weapon.getWeaponCategoryType();

		// もし魔法武器が設定されていればデフォルト魔法に変更する
		if (weaponCategoryType == WeaponCategoryType.MAGIC) {
			weaponId = tona_Setting.defaultMagicWeaponId;
			weapon = root.getBaseData().getWeaponList().getDataFromId(weaponId);
		}

		// duplicate せずに呼ぶ
		// 武器は消費しないのでこれが可能
		return weapon;
	}

	// *****************************************************************************************************************************
	// ItemControl：装備中の武器を返す
	// -----------------------------------------------------------------------------------------------------------------------------

	var _ItemControl_getEquippedWeapon = ItemControl.getEquippedWeapon;

	ItemControl.getEquippedWeapon = function(unit) {

		// 標準ではアイテム欄から探す
		var weapon = _ItemControl_getEquippedWeapon.call(this, unit);
		if (weapon != null) {
			return weapon;
		}

		// 武器が無ければベース武器を返す
		// ベース武器は装備できる前提なのでチェックしない
		return this.tona_getBaseWeapon(unit);
	};


})();




