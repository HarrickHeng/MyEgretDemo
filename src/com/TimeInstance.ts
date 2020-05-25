/**
 * 时间函数
 */
class TimeInstance {
	private static _instance: TimeInstance;

	private timerls: Object;

	public constructor() {
		if (TimeInstance._instance) {
			throw new Error("时间单例不可重复创建！");
		}
		this.timerls = new Object();
	}

	/**
	 * 获取单例
	 */
	public static getInstance(): TimeInstance {
		if (!TimeInstance._instance) {
			TimeInstance._instance = new TimeInstance();
		}
		return TimeInstance._instance;
	}

	////////////////////////////////////////////////
	//
	// 计时接口
	//
	////////////////////////////////////////////////
	private static _handles: Object = new Object();
	/**
	 * 单次触发
	 */
	public static onceTick(handle: Function, time: number, thisObj: any, ...arg: any[]): void {
		if (time <= 0 || !time) {
			handle.apply(thisObj, arg);
			return;
		}
		let handleId: number = setTimeout(function () {
			clearTimeout(handleId);
			delete TimeInstance._handles[handleId.toString()];
			handle.apply(thisObj, arg);
		}, time);
		TimeInstance._handles[handleId.toString()] = handle;
	}


	/**
	 * 获取触发数量
	 */
	public static getTickNum(): number {
		let num: number = 0;
		for (let k in TimeInstance._handles) {
			num++;
		}
		return num;
	}

	public static hasTick(handle: Function): boolean {
		let result: boolean = false;
		for (let k in TimeInstance._handles) {
			if (TimeInstance._handles[k] == handle) {
				result = true;
				return true;
			}
		}
		return result;
	}

	/**
	 * 移除触发
	 */
	public static removeTick(handle: Function): void {
		for (let k in TimeInstance._handles) {
			if (TimeInstance._handles[k] == handle) {
				clearTimeout(Number(k));
				delete TimeInstance._handles[k];
				return;
			}
		}
	}

	public static rcycle(handle: Function): void {
		let instance: TimeInstance = TimeInstance.getInstance();
		let k, timer: SyncTimer;
		for (k in instance.timerls) {
			timer = <SyncTimer>instance.timerls[k];
			if (timer.hasFunc(handle)) {
				timer.removeFunc(handle);
				return;
			}
		}
	}

	/**
	 * 轮询指定函数，忽略第一次触发的精确度
	 */
	public static cycle(handle: Function, loop: number, thisObj: any, ...arg): void {
		let instance: TimeInstance = TimeInstance.getInstance();
		let k, timer: SyncTimer;
		for (k in instance.timerls) {
			timer = <SyncTimer>instance.timerls[k];
			if (timer.hasFunc(handle)) {
				if (timer.delay == loop) {
					timer.addFunc(handle, thisObj, arg);
					return;
				} else {
					timer.removeFunc(handle);
				}
				break;
			}
		}
		timer = <SyncTimer>instance.timerls[loop.toString()];
		if (!timer) {
			timer = new SyncTimer(loop);
			instance.timerls[loop.toString()] = timer;
		}
		timer.addFunc(handle, thisObj, arg);
	}

	/**移除轮询函数 */
	public static removeCycleTick(loop: number, fun: Function): void {
		let instance: TimeInstance = TimeInstance.getInstance();
		let Timer: SyncTimer = instance.timerls[loop + ""];
		if (!Timer) return;
		Timer.removeFunc(fun);
	}
}

/**
 * 同步触发时间对象
 */
class SyncTimer extends egret.Timer {
	private handlels: Array<Function>;
	private thisObjls: Array<any>;
	private paramls: Array<any[]>;

	public constructor(delay: number, repeatCount?: number) {
		super(delay, repeatCount);
		let self = this;
		self.handlels = new Array<Function>();
		self.thisObjls = new Array<any>();
		self.paramls = new Array<any[]>();
	}

	/**
	 * 检测是否指定函数
	 */
	public hasFunc(func: Function): boolean {
		return this.handlels.indexOf(func) != -1;
	}

	/**
	 * 添加函数
	 */
	public addFunc(func: Function, thisObj: any, arg: any[]): void {
		let self = this;
		let index: number = self.handlels.indexOf(func);
		if (index == -1) {
			self.handlels.push(func);
			self.thisObjls.push(thisObj);
			self.paramls.push(arg);
		} else {
			self.thisObjls[index] = thisObj;
			self.paramls[index] = arg;
		}
		if (self.handlels.length && !self.hasEventListener(egret.TimerEvent.TIMER)) {
			self.addEventListener(egret.TimerEvent.TIMER, self.onTimer, self);
			self.start();
		}
	}
	private onTimer(evt: egret.TimerEvent): void {
		let i: number, func: Function;
		let self = this;
		for (i = self.handlels.length - 1; i >= 0; i--) {
			func = self.handlels[i];
			if (func.apply(self.thisObjls[i], self.paramls[i])) {
				self.handlels.splice(i, 1);
				self.thisObjls.splice(i, 1);
				self.paramls.splice(i, 1);
			}
		}
	}

	/**
	 * 移除轮询函数
	 */
	public removeFunc(func: Function): void {
		let self = this;
		let index: number = self.handlels.indexOf(func);
		if (index != -1) {
			self.handlels.splice(index, 1);
			self.thisObjls.splice(index, 1);
			self.paramls.splice(index, 1);
		}
		if (self.handlels.length <= 0 && self.hasEventListener(egret.TimerEvent.TIMER)) {
			self.removeEventListener(egret.TimerEvent.TIMER, self.onTimer, self);
			self.stop();
		}
	}
}