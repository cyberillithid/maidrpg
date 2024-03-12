namespace ${
	export enum $ibid_maid_data_setting {
		MaidRPG = 'main',
		EclipseMaid = 'ecli',
	}
	export enum $ibid_maid_data_chartype {
		Maid = 'maid',
		Butler = 'butl',
		Master = 'mast',
	}

	export class $ibid_maid_data {
		setting: $ibid_maid_data_setting;
		chartype: $ibid_maid_data_chartype;
		static Setting = $mol_data_enum('Setting', $ibid_maid_data_setting);
		static Chartype = $mol_data_enum('Chartype', $ibid_maid_data_chartype);
		constructor(set: string,
			char: string,
			public data: string) 
		{
			this.setting = $ibid_maid_data.Setting(set as any);
			this.chartype = $ibid_maid_data.Chartype(char as any);
		}

		gen_setting_links() {
			
		}
	}
}
