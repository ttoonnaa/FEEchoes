

(function() {

	// *****************************************************************************************************************************
	// ItemControl
	// -----------------------------------------------------------------------------------------------------------------------------

	var _ItemControl_getEquippedWeapon = ItemControl.getEquippedWeapon;

	ItemControl.getEquippedWeapon = function(unit) {

		var weapon = _ItemControl_getEquippedWeapon.call(this, unit);
		if (weapon != null) {
			return weapon;
		}

		// 武器が無ければベース武器を返す
		return tona_UnitControl.getBaseWeapon(unit);
	};

	ItemControl.tona_getCounterWeapon = function(unit, targetUnit) {

		var weapon = _ItemControl_getEquippedWeapon.call(this, unit);
		if (weapon != null && 届く) {
			return weapon;
		}

		// 届かない場合、ベース武器を順に使うことができる
		var weapons = tona_UnitControl.getBaseWeapons(unit);
		for (var i = 0; i < weapons.length; i++) {
			weapon = weapons[i];
			if (届く) {
				return weapon;
			}
		}

		return null;
	}
})();




