var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var GameFlilter = (function () {
    function GameFlilter() {
    }
    /**
     * 灰色滤镜
     */
    GameFlilter.GRAY_FLITER = new egret.ColorMatrixFilter([
        0.3, 0.4, 0, 0, 0,
        0.3, 0.4, 0, 0, 0,
        0.3, 0.4, 0, 0, 0,
        0, 0, 0, 1, 0
    ]);
    /**
     * 黄色滤镜
     */
    GameFlilter.YELLOW_FILTER = new egret.ColorMatrixFilter([
        1, 0, 0, 0, 0,
        0, 1, 0, 0, 0,
        0, 0, 0, 0, 0,
        0, 0, 0, 1, 0
    ]);
    /**
     * 白色滤镜
     */
    GameFlilter.WHITE_FILTER = new egret.ColorMatrixFilter([
        1, 1, 1, 0, 100,
        1, 1, 1, 0, 100,
        1, 1, 1, 0, 100,
        0, 0, 0, 0.6, 0
    ]);
    /**
     * 紫色滤镜
     */
    GameFlilter.PURPLE_FILTER = new egret.ColorMatrixFilter([
        1, 0, 0, 0, 0,
        0, 0, 0, 0, 0,
        0, 0, 1, 0, 0,
        0, 0, 0, 1, 0
    ]);
    /**
     * 黑色滤镜
     */
    GameFlilter.BLACK_FILTER = new egret.ColorMatrixFilter([
        0.1, 0, 0, 0, 0,
        0, 0.1, 0, 0, 0,
        0, 0, 0.1, 0, 0,
        0, 0, 0, 1, 0
    ]);
    /**
     * 红色滤镜
     */
    GameFlilter.RED_FILTER = new egret.ColorMatrixFilter([
        1, 0, 0, 0, 0,
        0, 0, 0, 0, 0,
        0, 0, 0, 0, 0,
        0, 0, 0, 1, 0
    ]);
    /**
     * 金色滤镜
     */
    GameFlilter.GOLD_FILTER = new egret.ColorMatrixFilter([
        1, 0, 0, 0, 40,
        0, 1, 0, 0, 40,
        0, 0, 0, 0, 0,
        0, 0, 0, 1, 0
    ]);
    /**
     * 绿色滤镜
     */
    GameFlilter.GREEN_FILTER = new egret.ColorMatrixFilter([
        0, 0, 0, 0, 0,
        1, 0, 0, 0, 0,
        0, 0, 0, 0, 0,
        0, 0, 0, 1, 0
    ]);
    /**
     * 蓝色滤镜
     */
    GameFlilter.BLUE_FILTER = new egret.ColorMatrixFilter([
        0, 0, 0, 0, 0,
        0, 0, 0, 0, 0,
        1, 0, 0, 0, 0,
        0, 0, 0, 1, 0
    ]);
    return GameFlilter;
}());
__reflect(GameFlilter.prototype, "GameFlilter");
//# sourceMappingURL=GameFlilter.js.map