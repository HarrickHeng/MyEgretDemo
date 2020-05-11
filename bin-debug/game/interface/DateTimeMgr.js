var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var DateTimeMgr = (function () {
    function DateTimeMgr() {
    }
    /**
     * 转换成utc毫秒数
     */
    DateTimeMgr.FormatUTCTimes = function (shotTime) {
        return Number(shotTime * 1000 + DateTimeMgr.MiniDateTimeBase);
    };
    /**
     * 获取日期
     * 年月日时分
     */
    DateTimeMgr.getTime = function (time) {
        var date = new Date(time);
        return (date.getUTCFullYear() + GameLanguage.instance().getLanguage(LanguagePack.DATE, "nian") + String(date.getUTCMonth() + 1) + GameLanguage.instance().getLanguage("date", "yue") + (date.getUTCDate()) + GameLanguage.instance().getLanguage(LanguagePack.DATE, "ri") + DateTimeMgr.getHourAndMinute(time));
    };
    /**
     * 获取几时几分
     */
    DateTimeMgr.getHourAndMinute = function (time, type) {
        if (type === void 0) { type = 1; }
        var date = new Date(time);
        var str = "";
        switch (type) {
            case 1:
                str = (date.getHours() + GameLanguage.instance().getLanguage(LanguagePack.DATE, "shi") + date.getMinutes() + GameLanguage.instance().getLanguage(LanguagePack.DATE, "fen"));
                break;
            case 2:
                var dateMin = date.getMinutes() > 9 ? date.getMinutes() : "0" + date.getMinutes();
                str = date.getHours() + ":" + dateMin;
                break;
        }
        return str;
    };
    /*
    * 获取时间
    * time 毫秒
    * type 1: 00:00:00(时分秒) ; 2:转换成字符串 00:00（分秒）; 3:转换成字符串 00(秒)
    * type 4: 2017年1月1日(年月日) type 5:2017年1月1日00:00:00 (年月日时分秒) type 6:xx年-xx月-xx日00:00:00
    * type 7: 分秒毫秒 type 8:2019/7/26 12:00:00
    */
    DateTimeMgr.getTimeString = function (time, type) {
        if (type === void 0) { type = 1; }
        var date = new Date(time);
        var backStr;
        var year = date.getUTCFullYear(); //年
        var month = date.getUTCMonth() + 1; //月份加1
        var day = date.getUTCDate(); //日
        var hours = date.getUTCHours();
        var minutes = date.getMinutes();
        var second = date.getSeconds();
        var Milliseconds = date.getMilliseconds();
        switch (type) {
            case 1:
                if (time > 0) {
                    backStr = this.formatTime(hours) + Sign.COLON + this.formatTime(minutes) + Sign.COLON + this.formatTime(second);
                }
                else {
                    backStr = "00:00:00";
                }
                break;
            case 2:
                if (time > 0) {
                    backStr = this.formatTime(minutes) + Sign.COLON + this.formatTime(second);
                }
                else {
                    backStr = "00:00";
                }
                break;
            case 3:
                if (time > 0) {
                    backStr = this.formatTime(second);
                }
                else {
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
                }
                else {
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
                }
                else {
                    backStr = "00秒";
                }
                break;
        }
        return backStr;
    };
    /**
     * 转换时间格式，例如 1:1 转换为 01:01
     * @param num
     * @return
     *
     */
    DateTimeMgr.formatTime = function (num) {
        return num < 10 ? "0" + num : "" + num;
    };
    /**
     * 几天几时几分
     */
    DateTimeMgr.getOpenServerTimeDsc = function (time) {
        var day = Math.floor(time / 86400);
        var h = Math.floor((time - day * 86400) / 3600);
        var m = Math.floor((time - day * 86400 - h * 3600) / 60);
        var s = Math.floor(time % 60);
        var dsc = "";
        if (day > 0) {
            dsc = day + "天" + h + "小时";
        }
        else if (h > 0) {
            dsc = h + "小时" + m + "分";
        }
        else if (m > 0) {
            dsc = m + "分";
        }
        else {
            dsc = "1分";
        }
        return dsc;
    };
    /**
     * 00:00:00
     */
    DateTimeMgr.getTimeDsc = function (time, showH) {
        if (showH === void 0) { showH = true; }
        var dsc = "";
        var h = Math.floor(time / 3600);
        var m = Math.floor((time - h * 3600) / 60);
        var s = Math.floor(time % 60);
        dsc += showH ? RichTextHelp.padStart(h.toString(), 2, "0") + Sign.COLON : "";
        dsc += RichTextHelp.padStart(m.toString(), 2, "0") + Sign.COLON + RichTextHelp.padStart(s.toString(), 2, "0");
        return dsc;
    };
    /**
     * 获取当天指定时间的时间戳 "00:00" 格式 时:分
     * @param str "00:00:00" 格式
     */
    DateTimeMgr.getTimeStampBystr = function (str) {
        var data = new Date(FsmSet.timeFsm.utcTime);
        data.setHours(0, 0, 0, 0);
        var strl = str.split(":");
        data.setHours(parseInt(strl[0]));
        data.setMinutes(parseInt(strl[1]));
        return data.getTime();
    };
    DateTimeMgr.getRemainingTime = function (value) {
        var data = new Date();
        var datatime = FsmSet.timeFsm.utcTime / 1000;
        var datatime1 = this.FormatUTCTimes(value) / 1000;
        var sytime = datatime1 - datatime;
        return Math.max(Math.floor(sytime), 0);
    };
    DateTimeMgr.MiniDateTimeBase = 1262275200000; //短时间戳
    return DateTimeMgr;
}());
__reflect(DateTimeMgr.prototype, "DateTimeMgr");
//# sourceMappingURL=DateTimeMgr.js.map