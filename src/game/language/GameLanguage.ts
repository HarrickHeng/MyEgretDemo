class GameLanguage {

	private static _instance: GameLanguage;

	private _langObj: Object;

	/*
	* 需要把属性转化为百分比显示的类型，
	* 新加属性如果需要显示为百分比格式，在这里添加
	*/
	// private percentType = [2, 5, 8, 11, 14, 17, 20, 23, 26, 28, 29, 32, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51];
	private percentType = [5, 6, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 63];

	public constructor() {
		this._langObj = RES.getRes("language_json");
	}

	/**
	 * 语言包单例
	*/
	public static instance(): GameLanguage {
		if (!this._instance) {
			this._instance = new GameLanguage();
		}
		return this._instance
	}

	/*
	* pack 包名
	* key key名
	* 传入包名和key名获取语言包
	*/
	public getLanguage(pack: string, key: string): string {
		var arr: Array<Object> = new Array();
		if (this._langObj.hasOwnProperty(pack)) {
			arr = this._langObj[pack];
		} else {
			egret.error(pack + "包名不存在");
			return "";
		}

		for (var obj of arr) {
			if (obj["key"] == key) {
				return obj["value"];
			}
		}
		throw new Error(pack + key);
	}

	public getTip(key: number): string {
		return GameLanguage.instance().getLanguage(LanguagePack.TIP, key.toString());
	}
	
	/*
	* 通过类型获取属性名称语言包
	*/
	public getPropertyNameByType(type: number): string {
		return GameLanguage.instance().getLanguage(LanguagePack.EQUIP, "ComAttribute" + type);
	}


	//阿拉伯数字转换为简写汉字
	public getStringByNum(num: number) {
		let Num: string = num.toString();
		for (let i: number = Num.length - 1; i >= 0; i--) {
			Num = Num.replace(",", "")//替换Num中的“,”
			Num = Num.replace(" ", "")//替换Num中的空格
		}
		// if (isNaN(Num)) { //验证输入的字符是否为数字
		// 	//alert("请检查小写金额是否正确");
		// 	return;
		// }
		//字符处理完毕后开始转换，采用前后两部分分别转换
		let part: Array<string> = String(Num).split(".");
		let newchar: string = "";
		//小数点前进行转化
		for (let i: number = part[0].length - 1; i >= 0; i--) {
			if (part[0].length > 10) {
				//alert("位数过大，无法计算");
				return "";
			}//若数量超过拾亿单位，提示
			let tmpnewchar: string = ""
			let perchar: string = part[0].charAt(i);
			switch (perchar) {
				case "0":
					tmpnewchar = "零" + tmpnewchar; break;
				case "1":
					tmpnewchar = "一" + tmpnewchar; break;
				case "2":
					tmpnewchar = "二" + tmpnewchar; break;
				case "3":
					tmpnewchar = "三" + tmpnewchar; break;
				case "4":
					tmpnewchar = "四" + tmpnewchar; break;
				case "5":
					tmpnewchar = "五" + tmpnewchar; break;
				case "6":
					tmpnewchar = "六" + tmpnewchar; break;
				case "7":
					tmpnewchar = "七" + tmpnewchar; break;
				case "8":
					tmpnewchar = "八" + tmpnewchar; break;
				case "9":
					tmpnewchar = "九" + tmpnewchar; break;
			}
			switch (part[0].length - i - 1) {
				case 0:
					tmpnewchar = tmpnewchar;
					break;
				case 1:
					if (perchar != "0")
						tmpnewchar = tmpnewchar + "十";
					break;
				case 2:
					if (perchar != "0")
						tmpnewchar = tmpnewchar + "百";
					break;
				case 3:
					if (perchar != "0")
						tmpnewchar = tmpnewchar + "千";
					break;
				case 4:
					tmpnewchar = tmpnewchar + "万";
					break;
				case 5:
					if (perchar != "0")
						tmpnewchar = tmpnewchar + "十";
					break;
				case 6:
					if (perchar != "0")
						tmpnewchar = tmpnewchar + "百";
					break;
				case 7:
					if (perchar != "0")
						tmpnewchar = tmpnewchar + "千";
					break;
				case 8:
					tmpnewchar = tmpnewchar + "亿";
					break;
				case 9:
					tmpnewchar = tmpnewchar + "十";
					break;
			}
			newchar = tmpnewchar + newchar;
		}
		//替换所有无用汉字，直到没有此类无用的数字为止
		while (newchar.search("零零") != -1 || newchar.search("零亿") != -1 || newchar.search("亿万") != -1 || newchar.search("零万") != -1) {
			newchar = newchar.replace("零亿", "亿");
			newchar = newchar.replace("亿万", "亿");
			newchar = newchar.replace("零万", "万");
			newchar = newchar.replace("零零", "零");
		}
		//替换以“一十”开头的，为“十”
		if (newchar.indexOf("一十") == 0) {
			newchar = newchar.substr(1);
		}
		//替换以“零”结尾的，为“”
		if (newchar.lastIndexOf("零") == newchar.length - 1 && newchar.length > 1) {
			newchar = newchar.substr(0, newchar.length - 1);
		}
		return newchar;
	}

	/*
	* 数字转化中文格式
	* test 123456789
	* type 1： 12345.6万(默认格式) ; 2: 12345万; 3: 123,456,789
	*/
	public numToChinese(num: number, type: number = 1): string {
		var backStr: string = "";
		if (type == 1 || type == 2) {
			if (num < 100000)//小于10万直接返回数字
				return num.toString();
			if (num < 100000000) {
				backStr += Math.floor(num / 10000) + "万";
			}
			else {
				backStr += Math.floor(num / 100000000) + "亿";
			}
			// if (Math.floor(num / 10000) > 0) {
			// 	backStr += Math.floor(num / 10000);
			// }
			// if (type == 1) {
			// 	var QIAN: number = num % 10000;
			// 	if (QIAN > 1000) {
			// 		backStr += Sign.DOT + Math.floor(QIAN / 1000).toString();
			// 	}
			// }
			// backStr += this.getLanguage(LanguagePack.NUMBER, "wan");
		} else if (type == 3) {
			var QIAN: number = 1000;
			var numStr: string = num.toString();
			var len: number = numStr.length % 3;
			var numStrArr: Array<string> = [];
			for (var i: number = 0; i < Math.ceil(numStr.length / 3); i++) {
				var tempStr: string;
				if (i == Math.ceil(numStr.length / 3) - 1) {
					tempStr = numStr.substr(0, len);
				} else {

					tempStr = numStr.substr(numStr.length - (i + 1) * 3, 3);
				}
				numStrArr.push(tempStr);
			}
			numStrArr = numStrArr.reverse();
			for (var i: number = 0; i < numStrArr.length; i++) {
				if (i == numStrArr.length - 1) {
					backStr += numStrArr[i];
				} else {
					backStr += numStrArr[i] + Sign.COMMA;
				}
			}
		} else if (type == 4) {
			if (num < 100000)//小于10万直接返回数字
				return num.toString();
			if (num < 100000000) {
				backStr += Math.floor(num / 10000) + "万";
			}
			else {
				// backStr += Math.floor(num / 100000000) + "亿";
				backStr += (num / 100000000).toFixed(4) + "亿";
			}
		}
		return backStr;
	}

}

class LanguagePack {
	/*
	* 装备
	*/
	public static EQUIP: string = "equip";
	/**
	 * 角色
	 */
	public static ROLE: string = "role";
	/**
	 * 日期
	 */
	public static DATE: string = "date";
	/**
	 * 提示
	 */
	public static TIP: string = "tip";
	/*
	* 数字
	*/
	public static NUMBER: string = "number";
}