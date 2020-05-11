/**
 * 时间
 */
class TimeFsm {
	private _sysFocus: boolean = true;
	private _mode: number;//0时间，1帧
	private _pauseGame: boolean = false;
	private _tick: number;//短时间
	private _seed: number;//登录时间
	private _hasInit: boolean = false;

	private _receiveTick: number = 0;

	private _frameRate: number = 60;
	private _loop: number;
	private _frameTick: number = 0;
	private _enterGameTime;

	public constructor() {
		this._tick = (new Date()).getTime() - DateTimeMgr.MiniDateTimeBase;
		this._seed = egret.getTimer();
	}

	public initEnterGameTime(){
		if(!this._enterGameTime){
			this._enterGameTime = egret.getTimer();
		}
	}

	public getRunGameTime():number
	{
		return egret.getTimer() - this._enterGameTime;
	}

	public get sysFocus(): boolean {
		return this._sysFocus;
	}
	public get uiReceiveTick(): number {
		return this._receiveTick;
	}

	public get frameRate(): number {
		return this._frameRate;
	}
	
	private _tickHandle: (timeStamp: number) => boolean;
	private _frameHandle(evt: egret.Event): void {
		this._tickHandle(egret.getTimer());
	}

	/**	
	 * 获取游戏短时间
	 */
	public get shortTime(): number {
		return this._tick;
	}

	/*
	* 时间seed
	*/
	public get seed(): number {
		return this._seed;
	}

	/*
	* 获取当前服务器时间
	*/
	public get utcTime(): number {
		return this._tick + DateTimeMgr.MiniDateTimeBase;
	}
}