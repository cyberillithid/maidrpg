namespace ${
	/** Encodes and decodes dice array to b64 string
	*
	* Reasoning: cf https://perf.js.hyoo.ru/#!bench=rh2ltk_m6uw15
	 */
	export class $ibid_maid_data_encoder {

		static B64 = [...'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/='];
		static B64MAP = Object.fromEntries($ibid_maid_data_encoder.B64.map((v, i) => [v, i]));

		static decode(s: string): number[] {
			const bmap = $ibid_maid_data_encoder.B64MAP;
			let fn = (v: string) => [bmap[v]>>3, bmap[v]&7];
			return [...s].flatMap(fn);
		}

		static encode(l: number[]): string {
			if (l.length % 2 == 1) {
				l.push(0);
			}
			const pairs = l.flatMap((_, i, a) => i % 2 ? [] : [a.slice(i, i + 2)]);
			return pairs.map(([a, b])=>$ibid_maid_data_encoder.B64[a<<3|b]).join('');
		}
	}
}
