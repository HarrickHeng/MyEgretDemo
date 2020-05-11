class GameFlilter {
	/**
	 * 灰色滤镜
	 */
    public static GRAY_FLITER: egret.ColorMatrixFilter = new egret.ColorMatrixFilter([
        0.3, 0.4, 0, 0, 0,
        0.3, 0.4, 0, 0, 0,
        0.3, 0.4, 0, 0, 0,
        0, 0, 0, 1, 0
    ]);
	/**
	 * 黄色滤镜
	 */
    public static YELLOW_FILTER: egret.ColorMatrixFilter = new egret.ColorMatrixFilter([
        1, 0, 0, 0, 0,
        0, 1, 0, 0, 0,
        0, 0, 0, 0, 0,
        0, 0, 0, 1, 0
    ]);
	/**
	 * 白色滤镜
	 */
    public static WHITE_FILTER: egret.ColorMatrixFilter = new egret.ColorMatrixFilter([
        1, 1, 1, 0, 100,
        1, 1, 1, 0, 100,
        1, 1, 1, 0, 100,
        0, 0, 0, 0.6, 0
    ]);
	/**
	 * 紫色滤镜
	 */
    public static PURPLE_FILTER: egret.ColorMatrixFilter = new egret.ColorMatrixFilter([
        1, 0, 0, 0, 0,
        0, 0, 0, 0, 0,
        0, 0, 1, 0, 0,
        0, 0, 0, 1, 0
    ]);
	/**
	 * 黑色滤镜
	 */
    public static BLACK_FILTER: egret.ColorMatrixFilter = new egret.ColorMatrixFilter([
        0.1, 0, 0, 0, 0,
        0, 0.1, 0, 0, 0,
        0, 0, 0.1, 0, 0,
        0, 0, 0, 1, 0
    ]);
	/**
	 * 红色滤镜
	 */
    public static RED_FILTER: egret.ColorMatrixFilter = new egret.ColorMatrixFilter([
        1, 0, 0, 0, 0,
        0, 0, 0, 0, 0,
        0, 0, 0, 0, 0,
        0, 0, 0, 1, 0
    ]);
	/**
	 * 金色滤镜
	 */
    public static GOLD_FILTER: egret.ColorMatrixFilter = new egret.ColorMatrixFilter([
        1, 0, 0, 0, 40,
        0, 1, 0, 0, 40,
        0, 0, 0, 0, 0,
        0, 0, 0, 1, 0
    ]);
	/**
	 * 绿色滤镜
	 */
    public static GREEN_FILTER: egret.ColorMatrixFilter = new egret.ColorMatrixFilter([
        0, 0, 0, 0, 0,
        1, 0, 0, 0, 0,
        0, 0, 0, 0, 0,
        0, 0, 0, 1, 0
    ]);
	/**
	 * 蓝色滤镜
	 */
    public static BLUE_FILTER: egret.ColorMatrixFilter = new egret.ColorMatrixFilter([
        0, 0, 0, 0, 0,
        0, 0, 0, 0, 0,
        1, 0, 0, 0, 0,
        0, 0, 0, 1, 0
    ]);


    public constructor() {
    }
}