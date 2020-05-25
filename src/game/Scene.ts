abstract class Scene extends eui.Component {
	private _winInitTime: number;
	private _hasReceive: boolean = false;//是否已经清除
	protected hasInit: boolean;//是否已经初始完毕
	protected hasInitSkin: boolean;//是否已经执行完initSkin
	protected autoReceivels: Array<eui.Image>;//自动回收列表
	protected huiBG: egret.DisplayObject;
	protected changeXY: boolean = true;
	protected _checkM: boolean = true;//本窗是否要检查是否有显示安全区逻辑

	/**
     * @param changeXY  是否用最大的宽高来进行自适应
     * @param checkM    是否检查刘海改变位置  内嵌窗基本都为false
     */
	public constructor(changeXY = true, checkM = true) {
		super();
		this.changeXY = changeXY;
		this._checkM = checkM;
		this.hasInit = false;
		this.hasInitSkin = false;
		this.autoReceivels = new Array<eui.Image>();
		this.addEventListener(eui.UIEvent.ADDED_TO_STAGE, this.onAddedToStage, this);
		this.addEventListener(eui.UIEvent.REMOVED_FROM_STAGE, this.onRemoveFromStage, this);
		this.addEventListener(eui.UIEvent.COMPLETE, this.onUICompelte, this);
		this._winInitTime = egret.getTimer();
	}

	protected onExit(): void {
		this.delE2();
	}

	/**
     * 是否已经清除
     */
	public get hasReceive(): boolean {
		return this._hasReceive;
	}

    /**
     * 获取界面初始所用时间
     */
	public get winInitTime(): number {
		return this._winInitTime;
	}

	public static autoReceiveImg: boolean = true;
	public static isAutoImg: (img: eui.Image) => boolean;
	private _delayHandle: number;

	private checkM(): void {
		if (!this._checkM) return;
		if (window["isIpx"] == true) {
			let width: number = StageUtils.ins().getWidth();
			let height: number = StageUtils.ins().getHeight();
			this.top = 60;
			this.bottom = 60;
		}
	}

    /**
     * 加载完毕并且显示界面回调接口
     */
	protected onCompleteAndShow(): void {
		let self = this;
		if (!self.stage) {
			return;
		}
		// if (self.loadingView.parent) {
		//     self.loadingView.parent.removeChild(self.loadingView);
		// }
		self.initPosition();
		self.stage.addEventListener(egret.Event.RESIZE, self.onResize, self);
		self.dispatchEventWith("completeAndShow");
		self.onAdd();
	}

	/**
     * 移入接口
     */
	public onAdd(): void {

	}

	protected onResAsync(value?: any, key?: string): any {
		let _thisobj: any = this;
		_thisobj.texture = <egret.Texture>value;
	}

    /**
     * 添加到场景显示
     * @param evt
     */
	protected onAddedToStage(evt: egret.Event): void {
		let self = this;
		if (!self.hasInit) {
			// self.addChild(self.loadingView);
			return;
		} else {
			for (let img of self.autoReceivels) {
				if (img && img.source) {
					let url = String(img.source).concat();
					img.source = null;
					img.source = url;
				}
			}
		}
		TimeInstance.onceTick(self.onCompleteAndShow, 50, self);
		self.stage.addEventListener(egret.Event.RESIZE, self.onResize, self);
	}

	/**
     * 移出场景显示
     * @param evt
     */
	protected onRemoveFromStage(evt: egret.Event): void {
		let self = this;
		// if (self.loadingView.parent) {
		//     self.loadingView.parent.removeChild(self.loadingView);
		// }
		YS.MDE(egret.Event.CLOSE, self);
		// YS.MReE(GameMap.MapComplete, self.onChangeMap, self);
		if (self.stage) {
			self.stage.removeEventListener(egret.Event.RESIZE, self.onResize, self);
		}
		let urls: Object = new Object();
		for (let img of self.autoReceivels) {
			if (img && img.source) {
				if (!urls[String(img.source)]) {
					urls[String(img.source)] = true;
					img.filters = null;
				}
			}
		}
		for (let url in urls) {
			RES.destroyRes(url);
		}
		this.onExit();
	}

	protected _initPosition(): void {
		let self = this;
		let scale: number = 1;
		if (!self.stage) return;
		self.checkM();
		let w = 720;
		let h = 1200;
		if (self.skin) {
			w = self.skin.width;
			h = self.skin.height;
		}
		if (self.changeXY) {
			self.x = (self.stage.stageWidth - w * scale) / 2;
			self.y = (self.stage.stageHeight - h * scale) / 2;
			if (self.huiBG) {
				self.huiBG.scaleX = self.stage.stageWidth / self.huiBG.width;
				self.huiBG.scaleY = self.stage.stageHeight / self.huiBG.height;
				let po: egret.Point = ToolInstance.changePoint(0, 0, self.stage, self.huiBG.parent);
				self.huiBG.x = po.x;
				self.huiBG.y = po.y;
			}
		}
		self.resetWH();
	}

	public resetWH(): void {
		let self = this;
		if (!self.changeXY) {
			self.width = self.stage.stageWidth;
			self.height = self.stage.stageHeight;
		}
	}

    /**
     * 初始皮肤ui接口
     */
	protected initSkin(): void {
		let self = this;
		if (self.huiBG) {
			self.huiBG.touchEnabled = true;
		}
		if (Scene.autoReceiveImg) {
			let i: number, child: egret.DisplayObject, closels: Object = new Object();
			let openlst: Array<egret.DisplayObject> = new Array<egret.DisplayObject>();
			openlst.push(self);
			while (openlst.length) {
				child = openlst.pop();
				if ((child instanceof eui.Image) &&
					egret.getQualifiedClassName(child) == "eui.Image" &&
					child.name == "" && !closels[String(child.hashCode)] &&
					child.source &&
					Scene.isAutoImg(child)) {
					self.autoReceivels.push(<eui.Image>child);
					closels[String(child.hashCode)] = true;
				} else if ((child instanceof eui.Group) || (child instanceof Scene)) {
					for (i = 0; i < child.numChildren; i++) {
						openlst.push(child.getChildAt(i));
					}
				}
			}
		}
		self.hasInitSkin = true;
	}

	/**
     * 初始完所有子组件
     */
	private onUICompelte(evt: eui.UIEvent): void {
		let self = this;
		self.touchEnabled = true;
		let thisObj: any = self;
		thisObj._delayHandle = setTimeout(function (): void {
			thisObj.hasInit = true;
			clearTimeout(thisObj._delayHandle);
			if (thisObj.stage) {
				thisObj._delayHandle = setTimeout(function (): void {
					thisObj.initSkin();
					thisObj.onCompleteAndShow();
					clearTimeout(thisObj._delayHandle);
				}, 100);
			} else
				thisObj.initSkin();
		}, 100);
		self._winInitTime = egret.getTimer() - self._winInitTime;
	}

	/**
     * 重置舞台
     */
	protected onResize(evt: egret.Event): void {
		// this.loadingView.resize();
		if (this.hasInit) {
			this.initPosition();
		}
	}

	/**
     * 初始位置
     */
	protected initPosition(): void {
		let self = this;
		if (self.stage && self.stage.stageWidth && self.stage.stageHeight) {
			self._initPosition();
		} else {
			TimeInstance.onceTick(self._initPosition, 20, self);
		}
	}

	/**
     * 关闭接口
     */
	public close(): void {
		let self = this;
		if (this.parent) {
			this.parent.removeChild(this);
		}
	}

    /**
     * 回收
     */
	public receive(): void {
		let self = this;
		self._hasReceive = true;
		self.skinName = undefined;
		if (self.stage) {
			self.stage.removeEventListener(egret.Event.RESIZE, self.onResize, self);
		}
		self.removeEventListener(egret.Event.ADDED_TO_STAGE, self.onAddedToStage, self);
		self.removeEventListener(egret.Event.REMOVED_FROM_STAGE, self.onRemoveFromStage, self);
		self.removeEventListener(eui.UIEvent.COMPLETE, self.onUICompelte, self);
	}

	private Edata = [];
	public addE(target, f, t, e: string = egret.TouchEvent.TOUCH_TAP): void {
		target.addEventListener(e, f, t);
		this.Edata.push([target, e, f, t]);
	}

	public addE2(target, f, t, e: string = egret.TouchEvent.TOUCH_TAP): void {
		for (let i = 0; i < target.length; i++) {
			this.addE(target[i], f, t, e);
		}
	}

	public delE(target, f, t, e: string = egret.TouchEvent.TOUCH_TAP): void {
		target.removeEventListener(e, f, t);
	}

	public delE2(): void {
		while (this.Edata.length) {
			let data = this.Edata.pop();
			data[0].removeEventListener(data[1], data[2], data[3]);
		}
	}

	public setListFun(list: eui.List, funClass, ListData: eui.ArrayCollection): eui.ArrayCollection {
		if (!list) {
			return;
		}
		if (!ListData) {
			ListData = new eui.ArrayCollection();
		}
		list.itemRenderer = funClass;
		list.dataProvider = ListData
		return ListData
	}
}