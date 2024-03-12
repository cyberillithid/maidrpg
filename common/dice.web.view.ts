namespace $.$${
	export class $ibid_maid_common_dice extends $.$ibid_maid_common_dice {
		@$mol_wire_solo
		override Icon(): $mol_icon {
			// console.log('update icon', this.diceval());
			switch (this.diceval()) {
				case 1:
					return new this.$.$mol_icon_dice_1;
				case 2:
					return new this.$.$mol_icon_dice_2;
				case 3:
					return new this.$.$mol_icon_dice_3;
				case 4:
					return new this.$.$mol_icon_dice_4;
				case 5:
					return new this.$.$mol_icon_dice_5;
				case 6:
					return new this.$.$mol_icon_dice_6;
				case 0:
					return new this.$.$mol_icon_arrow_right_bold;
				default: 
					return new this.$.$mol_icon_dice_multiple;
			}
		}
	}
}
