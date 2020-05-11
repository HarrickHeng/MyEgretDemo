var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
/**方法函数接口 */
var YS = (function () {
    function YS() {
    }
    /**血量百分比显示 */
    YS.PercentToFixed = function (value, maximum, fixed) {
        if (fixed === void 0) { fixed = 2; }
        var temp = 100 * value;
        if (temp % maximum == 0)
            return (temp / maximum) + "%";
        else
            return (temp / maximum).toFixed(fixed) + "%";
    };
    YS.getLang = function (key, value) {
        return GameLanguage.instance().getLanguage(key, value);
    };
    /**计算两点坐标距离 */
    YS.distance = function (p1, p2) {
        if (p1 && p2)
            return Math.sqrt((Math.pow(p1.x - p2.x, 2) + Math.pow(p2.y - p1.y, 2)));
        else
            return 0;
    };
    /**计算两地图块坐标距离 */
    YS.disMI = function (p1, p2) {
        if (p1 && p2)
            return Math.sqrt((Math.pow(p1.row - p2.row, 2) + Math.pow(p2.col - p1.col, 2)));
        else
            return 0;
    };
    /**碰撞检测(shape对象) */
    YS.hitTest = function (obj1, obj2) {
        var rect1 = obj1.getBounds(); //获取显示对象的测量边界
        var rect2 = obj2.getBounds();
        rect1.x = obj1.x;
        rect1.y = obj1.y;
        rect2.x = obj2.x;
        rect2.y = obj2.y;
        return rect1.intersects(rect2);
    };
    /**
     * 混合文本溢出
     * @param text 字符串
     * @param length  截取长度
     * @param lastinfo 溢出内容
     */
    YS.mixTextOverflow = function (text, length, lastinfo) {
        if (lastinfo === void 0) { lastinfo = '...'; }
        if (text.replace(/[\u4e00-\u9fa5]/g, 'aa').length <= length) {
            return text;
        }
        else {
            var _length = 0;
            var outputText = '';
            for (var i = 0; i < text.length; i++) {
                if (/[\u4e00-\u9fa5]/.test(text[i])) {
                    _length += 2;
                }
                else {
                    _length += 1;
                }
                if (_length > length) {
                    break;
                }
                else {
                    outputText += text[i];
                }
            }
            return outputText + lastinfo;
        }
    };
    /**获取字符串长度 */
    YS.getstrlen = function (str) {
        var len = 0;
        for (var i = 0; i < str.length; i++) {
            var c = str.charCodeAt(i);
            if ((c >= 0x0001 && c <= 0x007e) || (0xff60 <= c && c <= 0xff9f))
                len++;
            else
                len += 2;
        }
        return len;
    };
    YS.copyToImg = function (target, Bitmap) {
        var rt = new egret.RenderTexture;
        rt.drawToTexture(target);
        Bitmap.texture = rt;
    };
    /**
     * 更新滚动条，拉到最下一页显示（竖滚动，暂不支持横滚动）
     */
    YS.updateScrollV = function (s) {
        s.validateNow();
        s.viewport.scrollV = 0;
        if (s.viewport.contentHeight > s.viewport.height) {
            s.viewport.scrollV = s.viewport.contentHeight - s.viewport.height;
        }
    };
    /**
     * 横拉滚动条
     * @param s 滚动条
     * @param selectID 页签 0 开始
     * @param _w 每页签按钮占用宽度
     * @param num 每屏可容纳按钮数 - 1
     */
    YS.updateScrollH = function (s, selectID, _w, num) {
        var nx = selectID * _w;
        var nh = s.viewport.scrollH;
        var minx = Math.max(nx - num * _w, 0);
        var maxx = nx + num * _w;
        if (nh < nx && (nh >= minx && nh <= maxx)) {
        }
        else {
            if (nx > (s.viewport.contentWidth - (num + 1) * _w)) {
                s.viewport.scrollH = s.viewport.contentWidth - (num + 1) * _w;
            }
            else {
                s.viewport.scrollH = nx;
            }
            s.validateNow();
        }
    };
    /**是否为超文本语言 */
    YS.checkHtml = function (htmlStr) {
        var reg = /<[^>]+>/g;
        return reg.test(htmlStr);
    };
    YS.checkBQ = function (htmlStr) {
        if (htmlStr.indexOf("&_") != -1)
            return true;
        if (htmlStr.indexOf("&-") != -1)
            return true;
        return false;
    };
    /**
     * 文本变色(返回html格式)
     * @param color 十六进制颜色
     * @param info 文本内容
     */
    YS.getColorText = function (color, info) {
        var str = "<font color = '" + color + "'>" + info + "</font>";
        return str;
    };
    Object.defineProperty(YS, "VJcontrol", {
        get: function () {
            return YS.VJX == 0 && YS.VJY == 0 && YS.VJTime == 0;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(YS, "VJPointX", {
        get: function () {
            if (this.VJX < 3 && this.VJX > -3) {
                return 0;
            }
            return this.VJX > 0 ? 1 : -1;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(YS, "VJPointY", {
        get: function () {
            if (this.VJY < 3 && this.VJY > -3) {
                return 0;
            }
            return this.VJY > 0 ? 1 : -1;
        },
        enumerable: true,
        configurable: true
    });
    YS.parse = function (str) {
        if (!YS._textParser) {
            YS._textParser = new egret.HtmlTextParser();
        }
        return YS._textParser.parser(str);
    };
    /**数组内元素相减(final = arr - value_array) */
    YS.removeByValue = function (arr, value_array) {
        if (value_array.length == 0)
            return arr;
        var self = this;
        var indexs = [];
        var final = [];
        for (var i = 0; i < arr.length; i++) {
            var toBeExist = value_array.indexOf(arr[i]);
            if (toBeExist === -1) {
                final.push(arr[i]);
            }
        }
        return final;
    };
    /**
     * 创建二维数组
     * @param row 行数
     * @param col 列数
     * */
    YS.create2DArray = function (row, col) {
        var self = this;
        var colArr = [];
        var count = 0;
        for (var i = 0; i < col; i++) {
            var rowArr = [];
            for (var j = 0; j < row; j++) {
                rowArr.push(count);
                count++;
            }
            colArr.push(rowArr);
        }
        return colArr;
    };
    /**
     * 获取元素在二维数组中的行列数
     * @param value 元素索引
     * @param arr 二维数组
     * */
    YS.get2DArrRC = function (value, arr, data) {
        for (var i = 0; i < arr.length; i++) {
            for (var j = 0; j < arr[i].length; j++) {
                if (arr[i][j] == value)
                    return { row: i + 1, col: j + 1, data: data };
            }
        }
    };
    /**是否含有空字符 */
    YS.isHasSpace = function (str) {
        for (var i = 0; i < str.length - 1; i++) {
            if (str.charAt(i) != ' ') {
                if (str.charAt(i) != 0xa1 || str.chatAt(i + 1) != 0xa1)
                    return false;
                else
                    i++;
            }
        }
        return true;
    };
    /**数组合并去重(单数组去重不传入b) */
    YS.meshArray = function (a, b) {
        if (b === void 0) { b = null; }
        var arr = [];
        var result = [];
        var obj = {};
        arr == b ? a.concat(b) : a;
        for (var _i = 0, arr_1 = arr; _i < arr_1.length; _i++) {
            var i = arr_1[_i];
            if (!obj[i]) {
                result.push(i);
                obj[i] = 1;
            }
        }
        return result;
    };
    YS.sendTouchTap = function (value) {
        value.dispatchEventWith(egret.TouchEvent.TOUCH_TAP);
    };
    YS.MDE = function (type, data) {
        var param = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            param[_i - 2] = arguments[_i];
        }
        DataEventDispatcher.dispatchEventWith.apply(DataEventDispatcher, [type, data].concat(param));
    };
    YS.MDE1 = function (e) {
        DataEventDispatcher.dispatcher.dispatchEvent(e);
    };
    /**
     * @param type
     * @param listener
     * @param thisObject
     * @param useCapture
     * @param priority
     */
    YS.MAddE = function (type, listener, thisObject, useCapture, priority) {
        DataEventDispatcher.dispatcher.addEventListener(type, listener, thisObject, useCapture, priority);
    };
    YS.MReE = function (type, listener, thisObject, useCapture) {
        DataEventDispatcher.dispatcher.removeEventListener(type, listener, thisObject, useCapture);
    };
    YS.once = function (type, listener, thisObj) {
        DataEventDispatcher.dispatcher.once(type, listener, thisObj);
    };
    /**
     * 窗口箭头红点
     */
    YS.updateJTRED = function (e, _this, sw) {
        if (sw === void 0) { sw = 143; }
        var self = this;
        if (e) {
            if (_this.systemIdList.indexOf(e.data) == -1) {
                return;
            }
        }
        if (!_this.jtRed) {
            return;
        }
        var scrollH = _this.Sc.viewport.scrollH;
        var w = _this.Sc.width;
        var starid = Math.max(Math.floor(scrollH / sw), 0) + 1;
        var showData = []; //[starid, starid + 1, starid + 2, starid + 3]
        var len = 0;
        for (var i = starid; len < 4; i++) {
            if (!_this.btnList[i - 1]) {
                break;
            }
            if (_this.btnList[i - 1].visible) {
                showData.push(i);
                len++;
            }
        }
        _this.jtRed.visible = false;
        for (var i = 0; i < _this.btnList.length; i++) {
            var id = i + 1;
            if (showData.indexOf(id) == -1) {
                if (_this["redPoint" + id] && _this["redPoint" + id].visible) {
                    _this.jtRed.visible = true;
                }
            }
        }
    };
    YS.VJX = 0;
    YS.VJY = 0;
    YS.VJTime = 0;
    return YS;
}());
__reflect(YS.prototype, "YS");
//# sourceMappingURL=YS.js.map