
(function() {

	// *****************************************************************************************************************************
	// AttackChecker
	// -----------------------------------------------------------------------------------------------------------------------------

	var _AttackChecker_isUnitAttackable = AttackChecker.isUnitAttackable;

	AttackChecker.isUnitAttackable = function(unit) {

		if (_AttackChecker_isUnitAttackable.call(this, unit))
			return true;

		// ベース武器を調べる
		var weaponIds = tona_UnitControl.getBaseWeaponIds(unit);
		for (var i = 0; i < weaponIds.length; i++) {
			var weaponId = weaponIds[i];
			var weapon = root.getBaseData().getWeaponList().getDataFromId(weaponId);

			// ここの判定は元の isUnitAttackable を参考にした
			if (weapon !== null && ItemControl.isWeaponAvailable(unit, weapon) && this._isWeaponEnabled(weapon)) {
				indexArray = this.getAttackIndexArray(unit, weapon, true);
				if (indexArray.length !== 0) {
					return true;
				}
			}
		}
	};

	// *****************************************************************************************************************************
	// AttackChecker：攻撃武器のリストを取得する
	// -----------------------------------------------------------------------------------------------------------------------------

	AttackChecker.tona_getAttackWeapons = function(unit) {

		var weaponArray = [];

		// まずは物理武器を設定する
		// 物理武器は最大１つまで設定できる
		// これの取得を別関数にするべきかも

		var physicsWeapon = null;
		var count = DataConfig.getMaxUnitItemCount();

		// 所持武器から探す

		for (var i = 0; i < count; i++) {
			var item = unit.getItem(i);
			if (ItemControl.isWeaponAvailable(unit, item)) {
				physicsWeapon = item;
				break;
			}
		}

		// ベース武器から探す

		if (physicsWeapon == null) {
			var weaponIds = tona_UnitControl.getBaseWeaponIds(unit);
			for (var i = 0; i < weaponIds; i++) {
				var weaponId = weaponIds[i];
				var weapon = root.getBaseData().getWeaponList().getDataFromId(weaponId);
				var weaponCategoryType = weapon.getWeaponCategoryType();

				if (weaponCategoryType == WeaponCategoryType.PHYSICS || weaponCategoryType == WeaponCategoryType.SHOOT) {
					physicsWeapon = item;
					break;
				}
			}
		}

		// 物理武器が決まったので配列に追加

		if (physicsWeapon != null) {
			weaponArray.push(physicsWeapon);
		}

		// 次に魔法武器を設定する
		// 魔法武器はスキルによってのみ決まる

		var skillEntryArray = SkillControl.getDirectSkillArray(unit, SkillType.CUSTOM, 'tona_スキル：攻撃魔法');
		for (var i = 0; i < skillEntryArray.length; i++) {
			var skill = skillEntryArray[i].skill;
			var weaponId = skill.custom.tona_weaponId;
			var weapon = root.getBaseData().getWeaponList().getDataFromId(weaponId);
			weaponArray.push(weapon);
		}

		return weaponArray;
	};

	// *****************************************************************************************************************************
	// AttackChecker：反撃武器を取得する
	// -----------------------------------------------------------------------------------------------------------------------------

	AttackChecker.tona_getCounterWeapon = function(unit, targetUnit) {

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

	// *****************************************************************************************************************************
	// WeaponSelectMenu
	// -----------------------------------------------------------------------------------------------------------------------------

	WeaponSelectMenu.getWeaponCount = function() {

		var unit = this._unit;
		var weaponArray = AttackChecker.tona_getAttackWeapons(unit);
		var weaponCount = 0;

		for (var i = 0; i < weaponArray.length; i++) {
			var weapon = weaponArray[i];
			if (this._isWeaponAllowed(unit, weapon)) {
				weaponCount++;
			}
		}

		return weaponCount;
	};

	WeaponSelectMenu._setWeaponbar = function(unit) {

		var weaponArray = AttackChecker.tona_getAttackWeapons(unit);
		var scrollbar = this._itemListWindow.getItemScrollbar();

		scrollbar.resetScrollData();

		for (var i = 0; i < weaponArray.length; i++) {
			var weapon = weaponArray[i];
			if (this._isWeaponAllowed(unit, weapon)) {
				scrollbar.objectSet(weapon);
			}
		}

		scrollbar.objectSetEnd();
	};
})();





















