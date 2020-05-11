var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var RichTextHelp = (function () {
    function RichTextHelp() {
    }
    /**
     * 获取颜色的文本
     */
    RichTextHelp.getTextUseColor = function (text, color) {
        if (color)
            color = '0x' + parseInt(color + '').toString(16).toUpperCase();
        return '<font color="' + color + '">' + text + "</font>";
    };
    /**
     * 获取带图片的文本
     */
    RichTextHelp.getTextWithImg = function (url, width, height) {
        if (width && height) {
            return '<img src="' + url + '"width="' + width + '"height="' + height + '"!/>';
        }
        return '<img src="' + url + 'width="100%" height="100%" !/>';
    };
    /**
     * 补全头
     */
    RichTextHelp.padStart = function (target, targetLength, str, double) {
        if (str === void 0) { str = " "; }
        if (double === void 0) { double = true; }
        if (target.length > targetLength) {
            return target;
        }
        targetLength = targetLength - target.length;
        var pad = str;
        if (str == " " && double)
            targetLength *= 2;
        if (targetLength > str.length) {
            pad = RichTextHelp.repeat(str, targetLength / str.length);
        }
        return pad.slice(0, targetLength) + target;
    };
    /**
     * 补全尾
     */
    RichTextHelp.padEnd = function (target, targetLength, str) {
        if (str === void 0) { str = " "; }
        if (target.length > targetLength) {
            return target;
        }
        targetLength = targetLength - target.length;
        var pad = str;
        if (str == " ")
            targetLength *= 2;
        if (targetLength > str.length) {
            pad = RichTextHelp.repeat(str, targetLength / str.length);
        }
        return target + pad.slice(0, targetLength);
    };
    /**
     * 重复
     */
    RichTextHelp.repeat = function (target, count) {
        if (count === void 0) { count = 0; }
        if (target.length == 0 || count == 0)
            return "";
        count = Math.floor(count);
        if (count > 0) {
            var rpt = "";
            for (var i = 0; i < count; i++) {
                rpt += target;
            }
        }
        return rpt;
    };
    return RichTextHelp;
}());
__reflect(RichTextHelp.prototype, "RichTextHelp");
//# sourceMappingURL=RichTextHelp.js.map