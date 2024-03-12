namespace $.$$ {
	export class $ibid_maid_common_reroll extends $.$ibid_maid_common_reroll {
		override run(e: any) {
			// console.log(e);
			this.rerolled(this.reroll_key());
			e.preventDefault();
		}

		@$mol_mem
		override submit_label(): string {
			return this.show_text() ? super.submit_label() : '';
		}
	}

	export class $ibid_maid_common_section extends $.$ibid_maid_common_section {
		@$mol_mem
		override wrappers() {
			return this.datum().dices.map((_, i) => this.Wrapper(i));
		}
		@$mol_mem
		override reroll_key(): number[] {
			return this.datum().rerollkey;
		}
		@$mol_mem_key
		override dices(i: number) {
			return this.datum().dices[i];
		}
		@$mol_mem_key
		override titled(i: number) {
			const s = this.datum().titles[i];
			const arr = s.split(' ');
			return arr.map(v => (v[0]==='$') ? this.$.$mol_locale.text(v) : v).join(' ');
		}
		@$mol_mem_key
		override lines(i: number) {
			return this.datum().lines[i];
		}
		@$mol_mem_key
		override keys(i: number) {
			return this.datum().rollkeys[i];
		}
	}

	export class $ibid_maid_common_wrapper extends $.$ibid_maid_common_wrapper {
		@$mol_mem
		override dicebox() {
			return [...this.dices().map((_, i) => this.Statdice(i)), this.Reroll()];
		}
		@$mol_mem_key
		override dice(i: number){
			return this.dices()[i];
		}
		@$mol_mem
		override paragraphs() {
			return this.lines().length ? [...this.lines().map((v)=>this.Textbox(v))]: [];
		}
		@$mol_mem_key
		override line(s: string) {
			const arr = s.split(' ');
			return arr.map(v => (v[0]==='$') ? this.$.$mol_locale.text(v) : v).join(' ');
		}
	}
}
