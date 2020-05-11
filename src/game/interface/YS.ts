/**方法函数接口 */
class YS {
	/**血量百分比显示 */
	static PercentToFixed(value: number, maximum: number, fixed = 2): string {
		let temp = 100 * value;
		if (temp % maximum == 0)
			return (temp / maximum) + "%";
		else
			return (temp / maximum).toFixed(fixed) + "%";
	}

	static getLang(key: string, value: string): string {
		return GameLanguage.instance().getLanguage(key, value);
	}

	/**计算两点坐标距离 */
	static distance(p1, p2): number {
		if (p1 && p2)
			return Math.sqrt((Math.pow(p1.x - p2.x, 2) + Math.pow(p2.y - p1.y, 2)));
		else
			return 0;
	}

	/**计算两地图块坐标距离 */
	static disMI(p1, p2): number {
		if (p1 && p2)
			return Math.sqrt((Math.pow(p1.row - p2.row, 2) + Math.pow(p2.col - p1.col, 2)));
		else
			return 0;
	}

	/**碰撞检测(shape对象) */
	static hitTest(obj1: egret.DisplayObject, obj2: egret.DisplayObject): boolean {
		var rect1: egret.Rectangle = obj1.getBounds();//获取显示对象的测量边界
		var rect2: egret.Rectangle = obj2.getBounds();
		rect1.x = obj1.x;
		rect1.y = obj1.y;
		rect2.x = obj2.x;
		rect2.y = obj2.y;
		return rect1.intersects(rect2);
	}

	/**
	 * 混合文本溢出
	 * @param text 字符串
	 * @param length  截取长度
	 * @param lastinfo 溢出内容
	 */
	static mixTextOverflow(text, length, lastinfo = '...'): string {
		if (text.replace(/[\u4e00-\u9fa5]/g, 'aa').length <= length) {
			return text
		} else {
			let _length = 0
			let outputText = ''
			for (let i = 0; i < text.length; i++) {
				if (/[\u4e00-\u9fa5]/.test(text[i])) {
					_length += 2
				} else {
					_length += 1
				}
				if (_length > length) {
					break
				} else {
					outputText += text[i]
				}
			}
			return outputText + lastinfo;
		}
	}

	/**获取字符串长度 */
	static getstrlen(str): number {
		let len = 0;
		for (let i = 0; i < str.length; i++) {
			let c = str.charCodeAt(i);
			if ((c >= 0x0001 && c <= 0x007e) || (0xff60 <= c && c <= 0xff9f))
				len++;
			else
				len += 2;
		}
		return len;
	}

	static copyToImg(target, Bitmap): void {
		let rt: egret.RenderTexture = new egret.RenderTexture;
		rt.drawToTexture(target);
		Bitmap.texture = rt;
	}

	/**
	 * 更新滚动条，拉到最下一页显示（竖滚动，暂不支持横滚动）
	 */
	static updateScrollV(s: eui.Scroller): void {
		s.validateNow();
		s.viewport.scrollV = 0;
		if (s.viewport.contentHeight > s.viewport.height) {
			s.viewport.scrollV = s.viewport.contentHeight - s.viewport.height;
		}
	}

	/**
	 * 横拉滚动条
	 * @param s 滚动条
	 * @param selectID 页签 0 开始
	 * @param _w 每页签按钮占用宽度
	 * @param num 每屏可容纳按钮数 - 1
	 */
	static updateScrollH(s: eui.Scroller, selectID, _w, num): void {
		let nx = selectID * _w;
		let nh = s.viewport.scrollH;
		let minx = Math.max(nx - num * _w, 0);
		let maxx = nx + num * _w;
		if (nh < nx && (nh >= minx && nh <= maxx)) {
		} else {
			if (nx > (s.viewport.contentWidth - (num + 1) * _w)) {
				s.viewport.scrollH = s.viewport.contentWidth - (num + 1) * _w;
			} else {
				s.viewport.scrollH = nx;
			}
			s.validateNow();
		}
	}

	/**是否为超文本语言 */
	static checkHtml(htmlStr): boolean {
		let reg = /<[^>]+>/g;
		return reg.test(htmlStr);
	}

	static checkBQ(htmlStr): boolean {
		if (htmlStr.indexOf("&_") != -1)
			return true;
		if (htmlStr.indexOf("&-") != -1)
			return true;
		return false
	}

	/**
	 * 文本变色(返回html格式)
	 * @param color 十六进制颜色
	 * @param info 文本内容
	 */
	static getColorText(color, info): string {
		let str = "<font color = '" + color + "'>" + info + "</font>";
		return str;
	}

	public static VJX = 0;
	public static VJY = 0;
	public static VJTime = 0;

	static get VJcontrol(): boolean {
		return YS.VJX == 0 && YS.VJY == 0 && YS.VJTime == 0
	}

	static get VJPointX(): number {
		if (this.VJX < 3 && this.VJX > -3) {
			return 0;
		}
		return this.VJX > 0 ? 1 : -1;
	}

	static get VJPointY(): number {
		if (this.VJY < 3 && this.VJY > -3) {
			return 0;
		}
		return this.VJY > 0 ? 1 : -1;
	}

	private static _textParser: egret.HtmlTextParser;
	public static parse(str: string): egret.ITextElement[] {
		if (!YS._textParser) {
			YS._textParser = new egret.HtmlTextParser();
		}
		return YS._textParser.parser(str)
	}

	/**数组内元素相减(final = arr - value_array) */
	static removeByValue(arr: Array<any>, value_array: Array<any>): Array<any> {
		if (value_array.length == 0) return arr
		let self = this;
		let indexs = [];
		let final = [];
		for (let i = 0; i < arr.length; i++) {
			let toBeExist = value_array.indexOf(arr[i]);
			if (toBeExist === -1) {
				final.push(arr[i]);
			}
		}
		return final;
	}

	/**
	 * 创建二维数组 
	 * @param row 行数
	 * @param col 列数
	 * */
	static create2DArray(row: number, col: number): Array<Array<any>> {
		let self = this;
		let colArr: Array<any> = [];
		let count: number = 0;
		for (let i = 0; i < col; i++) {
			let rowArr: Array<any> = [];
			for (let j = 0; j < row; j++) {
				rowArr.push(count);
				count++;
			}
			colArr.push(rowArr);
		}
		return colArr
	}

	/**
	 * 获取元素在二维数组中的行列数 
	 * @param value 元素索引
	 * @param arr 二维数组
	 * */
	static get2DArrRC(value: any, arr: Array<Array<any>>, data?: any[]): Object {
		for (let i = 0; i < arr.length; i++) {
			for (let j = 0; j < arr[i].length; j++) {
				if (arr[i][j] == value)
					return { row: i + 1, col: j + 1, data: data };
			}
		}
	}

	/**是否含有空字符 */
	static isHasSpace(str): boolean {
		for (let i = 0; i < str.length - 1; i++) {
			if (str.charAt(i) != ' ') {
				if (str.charAt(i) != 0xa1 || str.chatAt(i + 1) != 0xa1)
					return false;
				else
					i++;
			}
		}
		return true;
	}

	/**数组合并去重(单数组去重不传入b) */
	static meshArray(a: Array<any>, b: Array<any> = null): Array<any> {
		let arr = [];
		let result = [];
		let obj = {};
		arr == b ? a.concat(b) : a;
		for (let i of arr) {
			if (!obj[i]) {
				result.push(i);
				obj[i] = 1;
			}
		}
		return result;
	}

	static sendTouchTap(value): void {
		value.dispatchEventWith(egret.TouchEvent.TOUCH_TAP);
	}

	static MDE(type: string, data?: any, ...param: any[]): void {
		DataEventDispatcher.dispatchEventWith(type, data, ...param);
	}

	static MDE1(e): void {
		DataEventDispatcher.dispatcher.dispatchEvent(e);
	}

	/**
	 * @param type
	 * @param listener
	 * @param thisObject
	 * @param useCapture
	 * @param priority
	 */
	static MAddE(type: string, listener: Function, thisObject: any, useCapture?: boolean, priority?: number): void {
		DataEventDispatcher.dispatcher.addEventListener(type, listener, thisObject, useCapture, priority);
	}

	static MReE(type: string, listener: Function, thisObject: any, useCapture?: boolean): void {
		DataEventDispatcher.dispatcher.removeEventListener(type, listener, thisObject, useCapture);
	}

	static once(type: string, listener: Function, thisObj: any): void {
		DataEventDispatcher.dispatcher.once(type, listener, thisObj);
	}

	/**
	 * 窗口箭头红点
	 */
	static updateJTRED(e: egret.Event, _this, sw = 143) {
		let self = this;
		if (e) {
			if (_this.systemIdList.indexOf(e.data) == -1) {
				return;
			}
		}
		if (!_this.jtRed) {
			return;
		}
		let scrollH = _this.Sc.viewport.scrollH;
		let w = _this.Sc.width;

		let starid = Math.max(Math.floor(scrollH / sw), 0) + 1
		let showData = [];//[starid, starid + 1, starid + 2, starid + 3]

		let len = 0;
		for (let i = starid; len < 4; i++) {
			if (!_this.btnList[i - 1]) {
				break;
			}
			if (_this.btnList[i - 1].visible) {
				showData.push(i);
				len++;
			}
		}

		_this.jtRed.visible = false;
		for (let i = 0; i < _this.btnList.length; i++) {
			let id = i + 1;
			if (showData.indexOf(id) == -1) {
				if (_this["redPoint" + id] && _this["redPoint" + id].visible) {
					_this.jtRed.visible = true;
				}
			}
		}
	}
}
