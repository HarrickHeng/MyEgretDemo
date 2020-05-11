class DateTimeMgr {
	public static MiniDateTimeBase: number = 1262275200000;//短时间戳
	public constructor() {
	}

	/**
	 * 转换成utc毫秒数
	 */
	public static FormatUTCTimes(shotTime: number): number {
		return Number(shotTime * 1000 + DateTimeMgr.MiniDateTimeBase);
	}
	
	/**
	 * 获取日期
	 * 年月日时分
	 */
	public static getTime(time: number): string {
		var date: Date = new Date(time);
		return (date.getUTCFullYear() + GameLanguage.instance().getLanguage(LanguagePack.DATE, "nian") + String(date.getUTCMonth() + 1) + GameLanguage.instance().getLanguage("date", "yue") + (date.getUTCDate()) + GameLanguage.instance().getLanguage(LanguagePack.DATE, "ri") + DateTimeMgr.getHourAndMinute(time));
	}

	/**
	 * 获取几时几分
	 */
	public static getHourAndMinute(time: number, type: number = 1) {
		var date: Date = new Date(time);
		let str: string = "";
		switch (type) {
			case 1:
				str = (date.getHours() + GameLanguage.instance().getLanguage(LanguagePack.DATE, "shi") + date.getMinutes() + GameLanguage.instance().getLanguage(LanguagePack.DATE, "fen"));
				break;
			case 2:
				let dateMin = date.getMinutes() > 9 ? date.getMinutes() : "0" + date.getMinutes();
				str = date.getHours() + ":" + dateMin;
				break;
		}
		return str;
	}

	/*
	* 获取时间
	* time 毫秒 
	* type 1: 00:00:00(时分秒) ; 2:转换成字符串 00:00（分秒）; 3:转换成字符串 00(秒)
	* type 4: 2017年1月1日(年月日) type 5:2017年1月1日00:00:00 (年月日时分秒) type 6:xx年-xx月-xx日00:00:00
	* type 7: 分秒毫秒 type 8:2019/7/26 12:00:00
	*/
	public static getTimeString(time: number, type: number = 1): string {
		var date: Date = new Date(time);
		var backStr: string;
		var year: number = date.getUTCFullYear();   //年
		var month: number = date.getUTCMonth() + 1;  //月份加1
		var day: number = date.getUTCDate();      //日
		var hours: number = date.getUTCHours();
		var minutes: number = date.getMinutes();
		var second: number = date.getSeconds();
		var Milliseconds = date.getMilliseconds();
		switch (type) {
			case 1:
				if (time > 0) {
					backStr = this.formatTime(hours) + Sign.COLON + this.formatTime(minutes) + Sign.COLON + this.formatTime(second);
				} else {
					backStr = "00:00:00";
				}
				break;
			case 2:
				if (time > 0) {
					backStr = this.formatTime(minutes) + Sign.COLON + this.formatTime(second);
				} else {
					backStr = "00:00";
				}
				break;
			case 3:
				if (time > 0) {
					backStr = this.formatTime(second);
				} else {
					backStr = "00";
				}
				break;
			case 4:
				backStr = year + GameLanguage.instance().getLanguage(LanguagePack.DATE, "nian") + month + GameLanguage.instance().getLanguage(LanguagePack.DATE, "yue") + day + GameLanguage.instance().getLanguage(LanguagePack.DATE, "ri");
				break;
			case 5:
				backStr = this.getTimeString(time, 4) + this.getTimeString(time, 1);
				break;
			case 6:
				backStr = year.toString() + Sign.MLINE + month + Sign.MLINE + day + " " + this.getHourAndMinute(time, 2);
				break;
			case 7:
				if (time > 0) {
					backStr = this.formatTime(minutes) + Sign.COLON + this.formatTime(second) + Sign.COLON + this.formatTime(Math.floor(Milliseconds / 10));
				} else {
					backStr = "00:00:00";
				}
				break;
			case 8:
				backStr = year.toString() + Sign.JIANGE_SIGN + month + Sign.JIANGE_SIGN + day + " " + this.getHourAndMinute(time, 2);
				break;
			case 9:
				if (time > 0) {
					if (minutes)
						backStr = this.formatTime(minutes) + "分" + this.formatTime(second) + "秒";
					else
						backStr = this.formatTime(second) + "秒";
				} else {
					backStr = "00秒";
				}
				break;
		}
		return backStr;
	}

	/**
	 * 转换时间格式，例如 1:1 转换为 01:01
	 * @param num
	 * @return 
	 * 
	 */
	public static formatTime(num: number): string {
		return num < 10 ? "0" + num : "" + num;
	}

	/**
	 * 几天几时几分
	 */
	public static getOpenServerTimeDsc(time: number) {//316310400
		let day: number = Math.floor(time / 86400);
		let h: number = Math.floor((time - day * 86400) / 3600);
		let m: number = Math.floor((time - day * 86400 - h * 3600) / 60);
		let s: number = Math.floor(time % 60);
		let dsc: string = "";
		if (day > 0) {
			dsc = day + "天" + h + "小时";
		} else if (h > 0) {
			dsc = h + "小时" + m + "分";
		} else if (m > 0) {
			dsc = m + "分";
		} else {
			dsc = "1分";
		}
		return dsc;
	}
	/**
	 * 00:00:00
	 */
	public static getTimeDsc(time: number, showH: boolean = true): string {
		let dsc: string = "";
		var h: number = Math.floor(time / 3600);
		var m: number = Math.floor((time - h * 3600) / 60);
		var s: number = Math.floor(time % 60);
		dsc += showH ? RichTextHelp.padStart(h.toString(), 2, "0") + Sign.COLON : "";

		dsc += RichTextHelp.padStart(m.toString(), 2, "0") + Sign.COLON + RichTextHelp.padStart(s.toString(), 2, "0");

		return dsc;
	}
	/**
	 * 获取当天指定时间的时间戳 "00:00" 格式 时:分
	 * @param str "00:00:00" 格式
	 */
	public static getTimeStampBystr(str: string) {
		var data = new Date(FsmSet.timeFsm.utcTime);
		data.setHours(0, 0, 0, 0);
		var strl = str.split(":");
		data.setHours(parseInt(strl[0]));
		data.setMinutes(parseInt(strl[1]));
		return data.getTime();
	}

	public static getRemainingTime(value): number {
		var data = new Date();
		let datatime = FsmSet.timeFsm.utcTime / 1000;
		let datatime1 = this.FormatUTCTimes(value) / 1000;
		let sytime = datatime1 - datatime;
		return Math.max(Math.floor(sytime), 0);
	}
}