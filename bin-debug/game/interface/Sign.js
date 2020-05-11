var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
/**
 * 符号
 *
 * @author liucheng
 *
 */
var Sign = (function () {
    function Sign() {
    }
    /**
     * 点
     */
    Sign.DOT = ".";
    /**
     * 下划线 "_"
     */
    Sign.UNDERLINE = "_";
    /**
     * 百分号 "%"
     */
    Sign.PERCENT = "%";
    /**
     * 竖线 "|"
     */
    Sign.VLINE = "|";
    /**
     * 换行符 "\n"
     */
    Sign.WRAP = "\n";
    /**
     * 冒号 ":"
     */
    Sign.COLON = ":";
    /**
     * 冒号 "："
     */
    Sign.COLON2 = "：";
    /**
     * 中划线 "-"
     */
    Sign.MLINE = "-";
    /**
     * 顿号 "、"
     */
    Sign.CHINESE_DIVISION = "、";
    /**
     * 分号 ";"
     */
    Sign.COLON_SIGN = ";";
    /**
     * 间隔 "/"
     */
    Sign.JIANGE_SIGN = "/";
    /**
     * 换行 "&#13;"
     */
    Sign.NEW_LINE = "&#13;";
    /**
     * 井号 "#"
     */
    Sign.WELL = "#";
    /**
     * 连接号 "@"
     */
    Sign.LINK = "@";
    /**
     * 加号 "+"
     */
    Sign.ADD = "+";
    /**
     *减号
     */
    Sign.MINUS = "-";
    /**
     * 逗号 ","
     */
    Sign.COMMA = ",";
    /**
     *  $
     */
    Sign.JINGBI = "$";
    /**
     *  &
     */
    Sign.AND = "&";
    /**
     * 乘法符号
     */
    Sign.CHENG = "x";
    /**
     * 左括号
     */
    Sign.LEFTBRACKET = "【";
    /**
     * 右括号
     */
    Sign.RIGHTBRACKET = "】";
    /**
     * 左括号 "("
     */
    Sign.LEFTBRACKET_1 = "(";
    /**
     *  右括号 ")"
     */
    Sign.RIGHTBRACKET_1 = ")";
    /**
     *波浪符号  ～
     */
    Sign.BOLANG = "～";
    /**
     * 星号 *
     */
    Sign.XING = "*";
    /**
     * 感叹号
     */
    Sign.TAN = "!";
    /**
     * 大于等于号
     */
    Sign.DAYUDENGYU = "≥";
    /**
     * "~"线
     */
    Sign.NIU_NIU = "~";
    /**
     * ^号
     */
    Sign.XOR = "^";
    /**
     *  箭头
     */
    Sign.ARROW = "→";
    /**
     * 英文左括号
     */
    Sign.E_LEFTBRACKET = "[";
    /**
     * 英文右括号
     */
    Sign.E_RIGHTBRACKET = "]";
    /**
     * 大点
     */
    Sign.BIG_DOT = "•";
    /*
    * 等级
    */
    Sign.LEVEL = "Lv.";
    /*
    * 空格
    */
    Sign.SPACE = " ";
    return Sign;
}());
__reflect(Sign.prototype, "Sign");
//# sourceMappingURL=Sign.js.map