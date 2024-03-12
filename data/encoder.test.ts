namespace ${
	$mol_test({
		'decode-encode'(){
			const arr = [0,1,2,3,4,5,6];
			const s = $ibid_maid_data_encoder.encode(arr);
			$mol_assert_equal(arr, $ibid_maid_data_encoder.decode(s))
		}
	})
}
