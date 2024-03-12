namespace ${
	export class $ibid_maid_data_obj extends $mol_object2 {
		@$mol_mem
		current_setting(next?: $ibid_maid_data_setting) {
			const s = this.$.$mol_state_arg.value('ref', next) ?? 'ecli';
			const e = $ibid_maid_data.Setting(s as any);
			return e;
		}
		@$mol_mem
		current_chartype(next?: $ibid_maid_data_chartype) {
			const s = this.$.$mol_state_arg.value('char', next) ?? 'maid';
			const e = $ibid_maid_data.Chartype(s as any);
			return e;
		}
		@$mol_mem
		current_data(next?: string) {
			const s = this.$.$mol_state_arg.value('data', next) ?? '0000000000000000000000000';
			return s;
		}

		@$mol_mem
		settings() {
			return Object.values($ibid_maid_data_setting);
		}
		@$mol_mem
		chartypes() {
			if (this.current_setting() == $ibid_maid_data_setting.MaidRPG)
				return Object.values($ibid_maid_data_chartype);
			return [$ibid_maid_data_chartype.Maid, $ibid_maid_data_chartype.Master];
		}

		@$mol_mem_key
		mkarg(v: {[k: string]: string}) {
			return {
				...{
					'char': this.current_chartype(),
					'ref': this.current_setting(),
					'data': this.current_data(),
				},
				...v
			}
		}

		@$mol_mem
		data_misc() {
			return new $ibid_maid_data_misc(
				this.$.$mol_state_arg.value('name')??'',
				Number.parseInt(this.$.$mol_state_arg.value('age')??'0'),
				this.$.$mol_state_arg.value('notes')??'',
				Number.parseInt(this.$.$mol_state_arg.value('selmax')??'0')
			);
		}

		@$mol_mem
		current_char() {
			const b64 = this.current_data();
			if (this.current_chartype() == $ibid_maid_data_chartype.Master) {
				return new $ibid_maid_data_master(b64, this.current_setting(), this.data_misc());
			}
			if (this.current_chartype() == $ibid_maid_data_chartype.Maid) {
				return new $ibid_maid_data_maid(b64, this.current_setting(), this.data_misc());
			}
			return new $ibid_maid_data_character(b64, this.current_setting());
		}
	
		rerolled(key: number | [number, number] | undefined) {
			// console.log(key);
			const d = this.current_char();
			if (key === undefined) return undefined;
			if (typeof key === 'number') {
				if (key == -1) {
					this.current_data(d?.reroll_section());
					return undefined;
				}
			} else {
				this.current_data(d?.reroll_slice(...key));
				return undefined;
			}
		}
	}
}
