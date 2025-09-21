
// *****************************************************************************************************************************
// AbilityCalculator
// -----------------------------------------------------------------------------------------------------------------------------
//		エコーズの計算式を使います
// -----------------------------------------------------------------------------------------------------------------------------

AbilityCalculator.getPower = function(unit, weapon) {

	// 武器の威力 + 力（魔力は使わない）
	return weapon.getPow() + RealBonus.getStr(unit);
};

AbilityCalculator.getAgility = function(unit, weapon) {

	// 敏捷 = 速さ - 武器の重さ
	var agility = RealBonus.getSpd(unit);

	if (weapon === null) {
		return agility;
	}

	return agility - weapon.getWeight();
}

AbilityCalculator.getHit = function(unit, weapon) {

	if (Miscellaneous.isPhysicsBattle(weapon)) {

		// 物理武器 = 武器の命中率 + 技
		return weapon.getHit() + RealBonus.getSki(unit);
	}
	else {

		// 魔法武器 = 武器の命中率
		return weapon.getHit();
	}
};

AbilityCalculator.getAvoid = function(unit, weapon) {

	// ここは「物理回避」です
	// 引数に weapon を追加しています

	// 物理回避 = 敏捷 + 地形効果

	var cls = unit.getClass();
	var avoid = this.getAgility(unit, weapon);

	// クラスタイプが地形ボーナスを考慮する場合は、「地形効果」の回避率を加算する
	if (cls.getClassType().isTerrainBonusEnabled()) {
		var terrain = PosChecker.getTerrainFromPos(unit.getMapX(), unit.getMapY());
		if (terrain !== null) {
			avoid += terrain.getAvoid();
		}
	}

	return avoid;
};

AbilityCalculator.getMagicAvoid = function(unit) {

	// ここは「魔法回避」です

	// 速さ + 運 * 0.5
	return RealBonus.getSpd(unit) + Math.floor(RealBonus.getLuk(unit) * 0.5);
}

AbilityCalculator.getMagicAvoidReduction = function(unit) {

	// ここは「魔法回避抑制」です

	// 技 + 運 * 0.5
	return RealBonus.getSki(unit) + Math.floor(RealBonus.getLuk(unit) * 0.5);
}

AbilityCalculator.getCritical = function(unit, weapon) {

	// 武器のクリティカル率 + (技 + 運) * 0.5
	return weapon.getCritical() + Math.floor((RealBonus.getSki(unit) + RealBonus.getLuk(unit)) * 0.5);
};

AbilityCalculator.getCriticalAvoid = function(unit, weapon) {

	// (運 * 0.5)
	return Math.floor(RealBonus.getLuk(unit) * 0.5);
};

// *****************************************************************************************************************************
// HitCalculator
// -----------------------------------------------------------------------------------------------------------------------------

HitCalculator.calculateHit = function(active, passive, weapon, activeTotalStatus, passiveTotalStatus) {

	// 物理攻撃の場合
	if (Miscellaneous.isPhysicsBattle(weapon)) {

		// ここは元の計算式と一緒

		var hit = this.calculateSingleHit(active, passive, weapon, activeTotalStatus);
		var avoid = this.calculateAvoid(active, passive, weapon, passiveTotalStatus);
		var percent = hit - avoid;
		return this.validValue(active, passive, weapon, percent);
	}

	// 魔法攻撃の場合
	else {

		// 「魔法回避」および「魔法回避抑制」を使うように改造

		var hit = this.calculateSingleHit(active, passive, weapon, activeTotalStatus);
		var avoid = this.calculateMagicAvoid(active, passive, weapon, passiveTotalStatus);
		var reduction = AbilityCalculator.getMagicAvoidReduction(active);
		var percent = hit - Math.max(avoid - reduction, 0);
		return this.validValue(active, passive, weapon, percent);
	}
};

HitCalculator.calculateAvoid = function(active, passive, weapon, totalStatus) {

	// getAvoid に weapon を渡すように改造

	var passiveWeapon = ItemControl.getEquippedWeapon(passive);

	return AbilityCalculator.getAvoid(passive, passiveWeapon)
		+ CompatibleCalculator.getAvoid(passive, active, passiveWeapon)
		+ SupportCalculator.getAvoid(totalStatus)
		;
};

HitCalculator.calculateMagicAvoid = function(active, passive, weapon, totalStatus) {

	// getMagicAvoid を使うように改造

	var passiveWeapon = ItemControl.getEquippedWeapon(passive);

	return AbilityCalculator.getMagicAvoid(passive)
		+ CompatibleCalculator.getAvoid(passive, active, passiveWeapon)
		+ SupportCalculator.getAvoid(totalStatus)
		;
}

// 以下を修正しないといけない

//map\map-enemyturnai.js(1217,28)  [UTF-8]: 		return AbilityCalculator.getAvoid(unit);
//singleton\singleton-calculator.js(260,28)  [UTF-8]: 		return AbilityCalculator.getAvoid(passive) + CompatibleCalculator.getAvoid(passive, active, ItemControl.getEquippedWeapon(passive)) + SupportCalculator.getAvoid(totalStatus);
//window\window-unitsentence.js(234,35)  [UTF-8]: 		this._value = AbilityCalculator.getAvoid(unit) + totalStatus.avoidTotal;

// さらに getMagicAvoidReduction をどこかに入れないといけない












