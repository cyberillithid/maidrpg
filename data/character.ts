namespace ${
	export enum $ibid_maid_data_charsheet_section {
		Stats, //6 x 2d6 for maids, 5 x 2d6 for master
		Types, // type+appearance = 2d6 for master, 2d6 for maids
		Colors, // 2 x 2d6
		Perks, // 2 x 2d6 + bonus max 2*(3d6)
		Roots, // 2d6 for maids,
		Stress, // 2d6
		Super, // 1d6:  `favourite maid type` for master
		Costume, // 1d66 / morph / ...
		CostumeProps, // 1d66 
		Weapon, // 1d66 // hide in power sources
		PowerSources, // `power sources` [2x2d6] for master
		Mood, // 1d6 // hide in 'stats'
		MansionColors, // 2 x 2d6
		Facilities, // 2x2d6
		Misc
	}

	enum $ibid_maid_data_die{
		D6, // 1d6
		D66, // d66 ordered
		D66_2, //d66 unordered, d66/2
		D63, //d66 with second dice /2 (11-12, ...)
		S2D6, //2d6
		DCPLX //??5d6? max
	}

	export class $ibid_maid_data_misc {
		constructor (public name: string,
			public age: number,
			public notes: string,
			public sel_max: number) {

			}
	}

	export class $ibid_maid_datum_section  {
		constructor( public dices: number[][],
		public titles: string[],
		public lines: string[][],
		public rollkeys: [number,number][],
		public rerollkey: [number,number],){}
	};

	export class $ibid_maid_data_character {
		static STAT_NAMES = [
			"athletics",
			"affection",
			"skill",
			"cunning",
			"luck",
			"will",
		];

		private raw_dices: number[];

		constructor(public base64: string,
					public setting: $ibid_maid_data_setting,
					public misc?: $ibid_maid_data_misc){
			this.raw_dices = $ibid_maid_data_encoder.decode(this.base64)
		}

		public get chartype(): $ibid_maid_data_chartype | null {
			return null
		}

		protected get_roll_type(section: $ibid_maid_data_charsheet_section) : $ibid_maid_data_die {
			switch(section) {
				case $ibid_maid_data_charsheet_section.Stats:
				case $ibid_maid_data_charsheet_section.PowerSources:
					return $ibid_maid_data_die.S2D6;

				case $ibid_maid_data_charsheet_section.Types:
				case $ibid_maid_data_charsheet_section.Super:
				case $ibid_maid_data_charsheet_section.Mood:
					return $ibid_maid_data_die.D6;

				case $ibid_maid_data_charsheet_section.Colors:
				case $ibid_maid_data_charsheet_section.MansionColors:
					return $ibid_maid_data_die.D66_2;
				
				case $ibid_maid_data_charsheet_section.Roots:
				case $ibid_maid_data_charsheet_section.Stress:
					return $ibid_maid_data_die.D63;

				case $ibid_maid_data_charsheet_section.Costume:
				case $ibid_maid_data_charsheet_section.Facilities:
				case $ibid_maid_data_charsheet_section.Weapon:
					return $ibid_maid_data_die.D66;
							
				case $ibid_maid_data_charsheet_section.CostumeProps:
				case $ibid_maid_data_charsheet_section.Perks:
				default: 
					return $ibid_maid_data_die.DCPLX;
			}
		}

		protected get_slice_ix(section: $ibid_maid_data_charsheet_section) {
			switch(section) {
				case $ibid_maid_data_charsheet_section.Stats:			return [0,  12];
				case $ibid_maid_data_charsheet_section.Types:			return [12, 14];
				case $ibid_maid_data_charsheet_section.Colors:			return [14, 18];
				case $ibid_maid_data_charsheet_section.Perks:			return [18, 28];
				case $ibid_maid_data_charsheet_section.Roots:			return [28, 30];
				case $ibid_maid_data_charsheet_section.Stress:			return [30, 32];
				case $ibid_maid_data_charsheet_section.Super:			return [32, 33];
				case $ibid_maid_data_charsheet_section.Costume:			return [33, 35];
				case $ibid_maid_data_charsheet_section.CostumeProps:	return [45, 48];
				case $ibid_maid_data_charsheet_section.Weapon:			return [48, 50];

				case $ibid_maid_data_charsheet_section.PowerSources:	return [38, 42];
				case $ibid_maid_data_charsheet_section.Mood:			return [11, 12];
				case $ibid_maid_data_charsheet_section.MansionColors:	return [42, 46];
				case $ibid_maid_data_charsheet_section.Facilities:		return [46, 50];
				default: return [0, 50];
			}
		}

		public list_sections() {
			return [
				$ibid_maid_data_charsheet_section.Stats,
				$ibid_maid_data_charsheet_section.Colors,
				$ibid_maid_data_charsheet_section.Stress
			]
		}

		public get_dices(section: $ibid_maid_data_charsheet_section) {
			const [start, stop] = this.get_slice_ix(section);
			return this.raw_dices.slice(start, stop);
		}

		public reroll_slice(start: number, stop: number): string {
			const newdice = [...Array(stop-start)].map((_) => Math.floor(Math.random()*6)+1);
			const dices = [...this.raw_dices.slice(0, start), ...newdice, ...this.raw_dices.slice(stop)];
			return $ibid_maid_data_encoder.encode(dices);
		}

		/** Rerolls a select section or everything on null */
		public reroll_section(section?: $ibid_maid_data_charsheet_section): string {
			const [start, stop] = section ? this.get_slice_ix(section) : [0, 50];
			return this.reroll_slice(start, stop);
		}

		public get raw_stats(): number[] {
			const arr = this.get_dices($ibid_maid_data_charsheet_section.Stats);
			return arr.flatMap((v, i) => i%2===0?[Math.floor((v+arr[i+1])/3)]:[]);
		}

		public get mods(): number[] {
			return [0,0,0 , 0,0,0];
		}

		public get stats(): number[] {
			const mods = this.mods;
			const arr = this.raw_stats;
			return arr.map((v, i) => v+mods[i]).map(v => v<0?0:v);
		}

		public get main_colors(): string[] {
			return this.get_sub_titles($ibid_maid_data_charsheet_section.Colors);
		}

		public get stress_explosion(): string {
			return this.get_sub_titles($ibid_maid_data_charsheet_section.Stress)[0];
		}

		public get start_favors(): number{
			return this.stats[1]*2;
		}
		public get spirit(): number{
			return this.stats[5]*10;
		}

		public get_dices_grouped(section: $ibid_maid_data_charsheet_section) {
			const rawdie = this.get_dices(section);
			const rtype = this.get_roll_type(section)
			let dies = rawdie.flatMap((v, i) => i%2===0?[[v, rawdie[i+1]]]:[]);
			switch (rtype) {
				case $ibid_maid_data_die.D6: 
					return rawdie.map(v=>[v]);
				case $ibid_maid_data_die.DCPLX: 
					return rawdie.flatMap((v, i) => i%5===0?[rawdie.slice(i, i+5)]:[]);
			}
			return dies;
		}

		protected reinterpert(dices: number[][], rtype: $ibid_maid_data_die): string[] {
			const grouped = dices;
			const diesort= rtype;
			switch(diesort) {
				case $ibid_maid_data_die.D6: 
					return (grouped as [number][]).map(([v]) => `${v}`); // 1d6
				case $ibid_maid_data_die.D66: 
					return (grouped as [number, number][]).map(([a, b]) => `${a}${b}`); // d66 ordered
				case $ibid_maid_data_die.D66_2: 
					return (grouped as [number, number][]).map(([a, b]) => (a>b)?`${b}${a}`:`${a}${b}`); // d66 unordered, d66/2
				case $ibid_maid_data_die.D63: 
					return (grouped as [number, number][]).map(([a, b]) => `${a}${b+(b%2)}`); //d66 with second dice /2 (11-12, ...)
				case $ibid_maid_data_die.S2D6: 
					return (grouped as [number, number][]).map(([a, b]) => `${a+b}`); //2d6
				case $ibid_maid_data_die.DCPLX: 
					return grouped.map(v=>`${[...v]}`);
			}
		}

		public get_sub_titles(section: $ibid_maid_data_charsheet_section) {
			const grouped = this.get_dices_grouped(section);
			const diesort = this.get_roll_type(section);
			return this.reinterpert(grouped, diesort);
		}

		public get_section_data(section: $ibid_maid_data_charsheet_section): $ibid_maid_datum_section {
			const dices = this.get_dices_grouped(section);
			let titles = this.get_sub_titles(section);
			let lines = titles.map(v => [v+"_desc"]);
			switch (section){
				case $ibid_maid_data_charsheet_section.Super:
					let maxarg = this.stats.reduce((iMax, x, i, arr) => x > arr[iMax] ? i : iMax, 0);
					let selmax = this.misc?.sel_max ?? maxarg;
					maxarg = (this.stats[maxarg] == this.stats[selmax]) ? selmax : maxarg;
					titles = titles.map(v => `$ibid_maid_data_Super_${maxarg+1}_${v}`);
					lines = [[titles[0]+"_desc"]];
					titles = [`$ibid_maid_data_stat_${$ibid_maid_data_character.STAT_NAMES[maxarg]}` + " : " +titles[0]]
					break;
				case $ibid_maid_data_charsheet_section.Stress:
				case $ibid_maid_data_charsheet_section.Weapon:
				case $ibid_maid_data_charsheet_section.Mood:
					// everything is strictly MAID
					titles = titles.map(v=>"$ibid_maid_data_"+$ibid_maid_data_charsheet_section[section]+"_"+v);
					lines = titles.map(v => [v+"_desc"]);
					break;

				case $ibid_maid_data_charsheet_section.Colors:
				case $ibid_maid_data_charsheet_section.MansionColors:
					// these are colors, no description needed
					titles = titles.map(v=>"$ibid_maid_data_color_"+v);
					lines = titles.map(v=>[]);
					break;
			}
			const [start, stop] = this.get_slice_ix(section);
			const rollkeys = dices.map<[number,number]>((v, i) => [start+i*v.length, start+(i+1)*v.length])
			return {
				dices, titles, lines,
				rollkeys, rerollkey: [start, stop]
			}
		}
	}
	
	export class $ibid_maid_data_master extends $ibid_maid_data_character  {
		public override get chartype(): $ibid_maid_data_chartype {
			return $ibid_maid_data_chartype.Master
		}
		protected override get_slice_ix(section: $ibid_maid_data_charsheet_section) {
			const ret = super.get_slice_ix(section);
			switch(section) {
				case $ibid_maid_data_charsheet_section.Stats: return [0,  10];
				default: return ret;
			}
		}

		// +1. Master Type 
		// +2. Master Special Qualities
		// ~3. Master Power Source
		// +4. Favourite Maid Type x1
		
		// +7. Master Attributes
		override get raw_stats() : number[] {
			const arr = this.get_dices($ibid_maid_data_charsheet_section.Stats);
			const ret = arr.flatMap((v, i) => i%2===0?[Math.ceil((v+arr[i+1])/4)]:[]);
			return [...ret, 2];
		}
		
		// 8. Name, age, gender, avatar
		// -- Mansion
		// -1. World: Posthuman
		// 2. Mood
		// +3. Appearance
		// 4. Colors x2
		// 5. Special Facilities x2
		// 6. Encounter Tables
		// 7. Name, age, ...
	}

	export class $ibid_maid_data_maid extends $ibid_maid_data_character  {
		public override get chartype(): $ibid_maid_data_chartype {
			return $ibid_maid_data_chartype.Maid
		}
		public override list_sections() {
			return [
				$ibid_maid_data_charsheet_section.Stats,
				$ibid_maid_data_charsheet_section.Types,
				$ibid_maid_data_charsheet_section.Colors,
				$ibid_maid_data_charsheet_section.Perks,
				$ibid_maid_data_charsheet_section.Roots,
				$ibid_maid_data_charsheet_section.Stress,
				$ibid_maid_data_charsheet_section.Super,
				$ibid_maid_data_charsheet_section.Misc,
				$ibid_maid_data_charsheet_section.Weapon,
				$ibid_maid_data_charsheet_section.Costume,
				... (this.setting === $ibid_maid_data_setting.EclipseMaid) ? [$ibid_maid_data_charsheet_section.CostumeProps] : [],
			]
		}
		static MODS_GROUPED = [
			// ath aff ski cun luk wil
			[   -1,  0,  0,  0,  1,  0],  // lolita
			[    0,  0,  0,  1,  0, -1], // sexy
			[    0,  1,  0, -1,  0,  0], // pure
			[    0, -1,  1,  0,  0,  0], // cool
			[    1,  0, -1,  0,  0,  0], // boyish
			[    0,  0,  0,  0, -1,  1], // heroine
		]
		public override get mods() {
			const dices = super.get_dices_grouped($ibid_maid_data_charsheet_section.Types);
			// console.log(dices);
			const modarr = dices.map(([v])=>$ibid_maid_data_maid.MODS_GROUPED[v-1]);
			// console.log(modarr);
			return modarr[0].map((v, i) => v + modarr[1][i]);
		}

		private transform_perk(dice: number[]): [number[], string, string[]] {
			let [a, b, c, d, e] = dice;
			let dices = (a<4)?[a,b]:[a,b,0,c];
			let ptr = a*10+b;
			let is_ecli = this.setting === $ibid_maid_data_setting.EclipseMaid;
			let ecli = is_ecli;
			switch (a) {
				case 1: ecli &&= (b<4); break;
				case 2: ecli &&= (b<3); break;
				case 4: ecli &&= (b != 3) && (b != 4); break;
				case 5: ecli &&= (b==3); break;
				case 6: ecli &&= (b>2); 
				default: break;
			}
			let infix=(ecli || (is_ecli && ptr===42))?'ecli':'maid';
			let infix2=ecli?'ecli':'maid';
			let maintitle = `$ibid_maid_perks_${infix}_${a}${b}`;
			let sectitle = `$ibid_maid_perks_${infix2}_${a}${b}_${c}`;
			let title = (a<4)?maintitle : `${maintitle} : ${sectitle}` ;
			let lines = (a<4)?[title+"_desc"] : [maintitle+"_desc", sectitle+"_desc"];
			if (is_ecli && (ptr == 63) && (c>=5)) {
				const val = this.reinterpert([[d, e]], (c==5)?$ibid_maid_data_die.S2D6:$ibid_maid_data_die.D66_2);
				const ret = (c==5)?val:`$ibid_maid_data_color_${val}`;
				title += " : " + ret;
				lines.push("$ibid_maid_ecli_roll : "+ret);
			}
			if (ptr == 51) {
				title += ` $ibid_maid_OR $ibid_maid_perks_${infix2}_${a}${b}b_${c}`;
				lines.push("$ibid_maid_OR");
				lines.push(`$ibid_maid_perks_${infix2}_${a}${b}b_${c}_desc`);
			}
			return [dices, title, lines]
		}

		private transform_morphperks([a, b, c]: [number, number, number]) : [number[], string, string[]] {
			let is_ecli = this.setting === $ibid_maid_data_setting.EclipseMaid;
			let ecli = is_ecli;
			switch (a) {
				case 1: ecli &&= b>2; break;
				case 4: ecli &&= b<5; break;
				case 5: ecli &&= b!=3;break;
			}
			let infix = ecli?'morph':'maid';
			let dices = (a<4)?[a, b]:[a, b, 0, c]
			let maintitle = `$ibid_maid_perks_${infix}_${a}${b}`;
			let sectitle =  `$ibid_maid_perks_${infix}_${a}${b}_${c}`;
			let title = (a<4)?maintitle : `${maintitle} : ${sectitle}` ;
			let lines = (a<4)?[title+"_desc"] : [maintitle+"_desc", sectitle+"_desc"];
			return [dices, title, lines];
		}

		public override get_section_data( section: $ibid_maid_data_charsheet_section ): $ibid_maid_datum_section {
			const data = super.get_section_data(section);
			let {dices, titles, lines} = data;
			const is_ecli = this.setting === $ibid_maid_data_setting.EclipseMaid;
			switch (section) {
				case $ibid_maid_data_charsheet_section.Types:
					// everything is strictly MAID
					titles = titles.map(v=>"$ibid_maid_type_maid_"+v);
					lines = titles.map((v, i) => [v+"_desc", $ibid_maid_data_maid.MODS_GROUPED[dices[i][0]-1].flatMap(
							(mod, ix) => (mod===0)?[]:['$ibid_maid_data_stat_'+$ibid_maid_data_character.STAT_NAMES[ix]+' '+((mod>0)?' + 1':' - 1')
						]).join(', ')]);
					break;
				case $ibid_maid_data_charsheet_section.Perks:
					for (let i in dices){
						let [d, t, l] = this.transform_perk(dices[i]);
						dices[i] = d;
						titles[i] = t;
						lines[i] = l;
					}
					break;
				case $ibid_maid_data_charsheet_section.Roots:
					titles = titles.map(v=>"$ibid_maid_origin_"+(is_ecli?'ecli':'maid')+v);
					lines = titles.map((v, i) => [v+"_desc"]);
					break;
				case $ibid_maid_data_charsheet_section.Costume:
					titles = titles.map(v=>"$ibid_maid_"+(is_ecli?'morph_':'costume_')+v);
					lines = titles.map((v, i) => [v+"_desc"]);
					break;
				case $ibid_maid_data_charsheet_section.CostumeProps:
					let [d, t, l] = this.transform_morphperks(dices[0] as any)
					dices = [d];
					titles = [t];
					lines = [l];
					break;
			}
			return {...data, dices, titles, lines};
		}
	}
}
