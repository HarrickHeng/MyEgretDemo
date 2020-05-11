abstract class Scene extends eui.Component {
	public constructor() {
		super();
		this.addEventListener(eui.UIEvent.ADDED_TO_STAGE, this.onAdd, this);
		this.addEventListener(eui.UIEvent.REMOVED_FROM_STAGE, this.onExit, this);
		this.addEventListener(eui.UIEvent.COMPLETE, this.onComplete, this);
	}

	protected abstract onComplete();
	protected abstract onAdd();
	protected onExit(): void {
		this.delE2();
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
		// let index: number;
		// for (let i = 0; i < this.Edata.length; i++) {
		// 	if (this.Edata[i][0] == target && this.Edata[i][1] == e && this.Edata[i][2] == f && this.Edata[i][3] == t)
		// 		index = i;
		// }
		// if (index != -1)
		// 	this.Edata.splice(index);
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