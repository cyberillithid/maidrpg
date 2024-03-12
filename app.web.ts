namespace $.$$ {
	export class $ibid_maid extends $.$ibid_maid {
	}
	export class $ibid_maid_menu extends $.$ibid_maid_menu {
		@$mol_mem
		override settings() {
			return this.store().settings().map(v=>this.SettingLink(v));
		}

		@$mol_mem
		override chartypes() {
			return this.store().chartypes().map(v=>this.ChartypeLink(v));
		}

		@$mol_mem_key
		override settingarg(key: $ibid_maid_data_setting) {
			return this.store().mkarg({'ref': key.toString()})
		}
		@$mol_mem_key
		override chararg(key: $ibid_maid_data_chartype) {
			return this.store().mkarg({'char': key})
		}
		@$mol_mem_key
		override settingname(key: $ibid_maid_data_setting) {
			return this.$.$mol_locale.text('$ibid_maid_data_setting_'+key);
		}
		@$mol_mem_key
		override charname(key: $ibid_maid_data_chartype) {
			return this.$.$mol_locale.text('$ibid_maid_data_chartype_'+key);
		}
	}
	export class $ibid_maid_main extends $.$ibid_maid_main {
		@$mol_mem
		override titlegen () {
			let char = this.$.$mol_locale.text("$ibid_maid_main_char_" + this.store().current_chartype());
			let setting = this.$.$mol_locale.text("$ibid_maid_main_setting_" + this.store().current_setting());
			return eval(this.$.$mol_locale.text("$ibid_maid_main_curtitle"))
		}

		@$mol_mem
		override subsecs() {
			const char = this.store().current_char();
			const secs = char.list_sections();
			return secs.map(v => (v==$ibid_maid_data_charsheet_section.Stats) ? this.Attributes() : (
				(v==$ibid_maid_data_charsheet_section.Misc) ? this.Misc() : this.Section(v)));
		}

		@$mol_mem_key
		override datum(k: $ibid_maid_data_charsheet_section) {
			const char = this.store().current_char();
			return char.get_section_data(k);
		}

		override titles(k: $ibid_maid_data_charsheet_section) {
			let infix = '';
			switch (k) {
				case $ibid_maid_data_charsheet_section.Costume:
				case $ibid_maid_data_charsheet_section.CostumeProps:
				case $ibid_maid_data_charsheet_section.Roots:
				case $ibid_maid_data_charsheet_section.Perks:
					infix = this.store().current_setting() + '_';
			}
			return this.$.$mol_locale.text("$ibid_maid_section_" + infix + $ibid_maid_data_charsheet_section[k]);
		}
	}

	export class $ibid_maid_misc extends $.$ibid_maid_misc {
		@$mol_mem
		override start_favors() {
			return `${this.char().start_favors}`;
		}
		@$mol_mem
		override start_spirit() {
			return `${this.char().spirit}`;
		}
		@$mol_mem
		is_mast() {
			return this.char().chartype===$ibid_maid_data_chartype.Master
		}
		@$mol_mem
		override MiscGen() {
			const valmax = this.char().stats.reduce((max, x, i, arr) => x > max ? x : max, 0);
			const opts = this.char().stats.flatMap((v, i)=>v==valmax?[i]:[])
			return [
				...(this.is_mast()?[]:[this.Favors()]),
				this.Spirit(),
				...(this.is_mast()?[]:opts.map(v=>this.SelMaxVal(v))),
			];
		}
		@$mol_mem_key
		override selmaxtitle(i: number) {
			return  this.$.$mol_locale.text("$ibid_maid_section_Super") + " " + this.$.$mol_locale.text(`$ibid_maid_data_stat_${$ibid_maid_data_character.STAT_NAMES[i]}`)
		}
		@$mol_mem_key
		override selmaxval(i: number) {
			return i
		}
	}

	export class $ibid_maid_attrs extends $.$ibid_maid_attrs{
		@$mol_mem
		override stats() {
			return [...Array(6)].map((_, i) => this.Stat(i));
		}

		@$mol_mem_key
		override key(key: number) {return key;}

		@$mol_mem
		raw_dices(){
			const rawest = this.char().get_dices($ibid_maid_data_charsheet_section.Stats);
			return rawest.flatMap((v, i) => (i%2==0)?[[v, rawest[i+1]]]:[]);
		}

		@$mol_mem_key
		override dices(key: number) {return this.raw_dices()[key];}

		@$mol_mem_key
		override mod(key: number) {return this.char().mods[key];}

		@$mol_mem_key
		override modded(key: number) {return this.char().stats[key];}

		@$mol_mem_key
		override raw(key: number) {return this.char().raw_stats[key];}
		
	}

	export class $ibid_maid_stat extends $.$ibid_maid_stat {
		@$mol_mem
		override title() {
			return this.$.$mol_locale.text('$ibid_maid_data_stat_'+$ibid_maid_data_character.STAT_NAMES[this.statix()]);
		}

		@$mol_mem_key
		override dice(id: number) {
			return (this.dices()?? [-1, -1]) [id];
		}

		@$mol_mem
		override stat() {
			const v = this.result();
			if (!Number.isFinite(v)){
				return '—';
			}
			const m = this.mod();
			if (m == 0) {
				return `${v}`;
			}
			return `${this.value()}${m>0?'+':''}${m} = ${v}`
		}
	}
}
