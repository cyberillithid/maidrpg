namespace ${
	$mol_test({
		'decode test'(){
			const a = new $ibid_maid_data_character('0000000000000000', $ibid_maid_data_setting.EclipseMaid);
			$mol_assert_equal(a.stats, [3,3,3,3,3,3]);
			$mol_assert_equal(a.main_colors, ['46', '46']);
			$mol_assert_equal(a.get_dices($ibid_maid_data_charsheet_section.Stats), [...Array(6)].flatMap(_=>[6,4]));
			$mol_assert_equal(a.stress_explosion, '64');
		}
	})
}
