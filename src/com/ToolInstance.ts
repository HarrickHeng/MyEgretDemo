class ToolInstance {
	public static version: string = "1.3";

	public constructor() {
	}

	/**
	 * 停止鼠标冒泡事件
	 */
	public static stopTouchEvent(...childs: Array<egret.DisplayObject>): void {
		for (let child of childs) {
			child.addEventListener(egret.TouchEvent.TOUCH_TAP, ToolInstance.stopTouch, child);
			child.addEventListener(egret.TouchEvent.TOUCH_BEGIN, ToolInstance.stopTouch, child);
			child.addEventListener(egret.TouchEvent.TOUCH_END, ToolInstance.stopTouch, child);
			child.addEventListener(egret.TouchEvent.TOUCH_MOVE, ToolInstance.stopTouch, child);
			child.addEventListener(egret.TouchEvent.TOUCH_CANCEL, ToolInstance.stopTouch, child);
			child.addEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, ToolInstance.stopTouch, child);
		}
	}
	public static removeStopTouch(...childs: Array<egret.DisplayObject>): void {
		for (let child of childs) {
			child.removeEventListener(egret.TouchEvent.TOUCH_TAP, ToolInstance.stopTouch, child);
			child.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, ToolInstance.stopTouch, child);
			child.removeEventListener(egret.TouchEvent.TOUCH_END, ToolInstance.stopTouch, child);
			child.removeEventListener(egret.TouchEvent.TOUCH_MOVE, ToolInstance.stopTouch, child);
			child.removeEventListener(egret.TouchEvent.TOUCH_CANCEL, ToolInstance.stopTouch, child);
			child.addEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, ToolInstance.stopTouch, child);
		}
	}

	public static stopTouch(evt: egret.TouchEvent): void {
		evt.stopPropagation();
		evt.stopImmediatePropagation();
	}

    /**
     * 转换不同容器之间的点
     */
	public static changePoint(x: number, y: number, localContainer: egret.DisplayObjectContainer, targetContainer: egret.DisplayObjectContainer): egret.Point {
		let po: egret.Point = localContainer.localToGlobal(x, y);
		let po1: egret.Point = targetContainer.globalToLocal(po.x, po.y);
		return po1;
	}


	/**
	 * 计算两点长度
	 */
	public static distance(sx: number, sy: number, ex: number, ey: number): number {
		let dx: number = Math.abs(ex - sx);
		let dy: number = Math.abs(ey - sy);
		return Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
	}

	/**
	 * 计算固定距离的值
	 */
	public static countDistanceTarget(orgin: number, target: number, dis: number): number {
		let _dis: number = target - orgin;
		if (Math.abs(_dis) > dis) {
			if (_dis > 0) {
				return orgin + dis;
			} else {
				return orgin - dis;
			}
		}
		return target;
	}

	/**
	 * 判断显示对象是否可见
	 */
	public static checkVisible(displayObj: egret.DisplayObject): boolean {
		if (!displayObj.stage || !displayObj.visible || displayObj.alpha == 0) {
			return false;
		}
		let parent: egret.DisplayObjectContainer = displayObj.parent;
		while (parent && parent != egret.MainContext.instance.stage) {
			if (!parent.visible || parent.alpha == 0) {
				return false;
			}
			parent = parent.parent;
		}
		return true;
	}

	/**
	 * 一元二次方程求解
	 */
	public static sqrtRoot(a: number, b: number, c: number): Object {
		let result: Object = new Object();
		let res1: number = (-b + Math.sqrt(Math.pow(b, 2) - 4 * a * c)) / (2 * a);
		let res2: number = (-b - Math.sqrt(Math.pow(b, 2) - 4 * a * c)) / (2 * a);
		result["plus"] = res1;
		result["Less"] = res2;
		let res: number = Math.max(res1, res2);
		result["uint"] = res > 0 ? res : undefined;
		res = Math.min(res1, res2);
		result["negt"] = res < 0 ? res : undefined;
		return result;
	}

	/**计算勾股c */
	public static countC(a: number, b: number): number {
		return Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2));
	}

	/**
	 * 检测矩形是否包含指定点
	 */
	public static checkContains(rect: egret.Rectangle, x: number, y: number): boolean {
		let w: number = rect.width > 0 ? rect.width : 1;
		let h: number = rect.height > 0 ? rect.height : 1;
		if (rect.x <= x && rect.y <= y && x < rect.x + w && y < rect.y + h) {
			return true;
		}
		return false;
	}

	/**
	 * 移除所有子对象
	 */
	public static removeAllChild(...containers: Array<egret.DisplayObjectContainer>): void {
		for (let target of containers) {
			while (target.numChildren) {
				target.removeChildAt(0);
			}
		}
	}

	public static checkArray(ary1: Array<Object>, ary2: Array<Object>, value?: string): boolean {
		if (!ary1 || !ary2) {
			return false;
		}
		if (value) {
			ary1.sort((a: Object, b: Object) => {
				if (a[value] > b[value]) {
					return 1
				} else {
					return -1;
				}
			})

			ary2.sort((a: Object, b: Object) => {
				if (a[value] > b[value]) {
					return 1
				} else {
					return -1;
				}
			})

			if (JSON.stringify(ary1) == JSON.stringify(ary2)) {
				return true;
			} else {
				return false;
			}
		}
		for (let obj of ary1) {
			if (ary2.indexOf(obj) == -1) {
				return false;
			}
		}
		return true;
	}


	/**
	 * 获取点击的子对象
	 */
	public static getTouchItem(group: egret.DisplayObjectContainer, stageX: number, stageY: number, classType?: any, childx?: number, childy?: number): egret.DisplayObject {
		let i: number, child: egret.DisplayObject, ds: number = Number.MAX_VALUE, target: egret.DisplayObject, midx: number, midy: number;
		let point: egret.Point = group.globalToLocal(stageX, stageY);
		for (i = 0; i < group.numChildren; i++) {
			child = group.getChildAt(i);
			if (classType == undefined || child instanceof classType) {
				if (childx != undefined && childy != undefined) {
					midx = childx;
					midy = childy;
				} else if (child instanceof eui.Component) {
					midx = child.x + (child.skin.width ? child.skin.width : child.width) / 2;
					midy = child.y + (child.skin.height ? child.skin.height : child.height) / 2;
				} else {
					midx = child.x + child.width / 2;
					midy = child.y + child.height / 2;
				}
				let _d: number = ToolInstance.distance(midx, midy, point.x, point.y);
				if (ds > _d) {
					ds = _d;
					target = child;
				}
			}
		}
		return target;
	}

}