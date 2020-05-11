/**系统状态机 */
class FsmSet {
	public static MapFsm: MapFsm;
	public static BusinessFsm: BusinessFsm;
	public static timeFsm: TimeFsm; //游戏时间

	public constructor() {
	}

	public static init() {
		this.timeFsm = new TimeFsm();
		this.MapFsm = new MapFsm();
		this.BusinessFsm = new BusinessFsm();
	}
}