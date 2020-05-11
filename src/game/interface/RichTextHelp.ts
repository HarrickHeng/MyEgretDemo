class RichTextHelp {
	
	public constructor() {
	}

	/**
	 * 获取颜色的文本
	 */
	public static getTextUseColor(text: string, color: number | string) {
		if (color as Number) //10进制转16进制
			color = '0x' + parseInt(color + '').toString(16).toUpperCase();
		return '<font color="' + <String>color + '">' + text + "</font>";
	}

	/**
	 * 获取带图片的文本
	 */
	public static getTextWithImg(url: string, width?: number, height?: number) {
		if (width && height) {
			return '<img src="' + url + '"width="' + width + '"height="' + height + '"!/>';
		}
		return '<img src="' + url + 'width="100%" height="100%" !/>';
	}

	/**
	 * 补全头
	 */
	public static padStart(target: string, targetLength: number, str: string = " ", double: boolean = true) {
		if (target.length > targetLength) {
			return target;
		}
		targetLength = targetLength - target.length;
		let pad: string = str;
		if (str == " " && double)
			targetLength *= 2;
		if (targetLength > str.length) {
			pad = RichTextHelp.repeat(str, targetLength / str.length);
		}
		return pad.slice(0, targetLength) + target;
	}

	/**
	 * 补全尾
	 */
	public static padEnd(target: string, targetLength: number, str: string = " ") {
		if (target.length > targetLength) {
			return target;
		}
		targetLength = targetLength - target.length;
		let pad: string = str;
		if (str == " ")
			targetLength *= 2;
		if (targetLength > str.length) {
			pad = RichTextHelp.repeat(str, targetLength / str.length);
		}

		return target + pad.slice(0, targetLength);
	}

	/**
	 * 重复
	 */
	public static repeat(target: string, count: number = 0) {
		if (target.length == 0 || count == 0)
			return "";
		count = Math.floor(count);
		if (count > 0) {
			var rpt: string = "";
			for (let i: number = 0; i < count; i++) {
				rpt += target;
			}
		}
		return rpt;
	}
}

