interface IDistributor {
	distribution(val: IBall): void; //分配
	addVO(val: IBall): void; //添加元素
	getVO(type: number): IBall; //获取元素
	clear(): void; //清除所有未使用的对象
	look(): void;
}

/**分配器 */
class Distributor implements IDistributor {
	private _UsedPool: Object = null; //使用中的对象
	private _IdlePool: Object = null; //未使用的对象

	public constructor() {
		this._IdlePool = {};
		this._UsedPool = {};
	}
	
	public distribution(val: IBall): void {
		if (val.isIdle) {
			this._IdlePool[val.hashc] = val;
			delete this._UsedPool[val.hashc];
		} else {
			this._UsedPool[val.hashc] = val;
			delete this._IdlePool[val.hashc];
		}
	}

	public addVO(val: IBall): void {
		val.setProtocol(this);
		if (val.isIdle) {
			this._IdlePool[val.hashc] = val;
		} else {
			this._UsedPool[val.hashc] = val;
		}
	}

	public getVO(type: number): IBall {
		let obj: IBall = null;
		for (let key in this._IdlePool) {
			obj = this._IdlePool[key] as IBall;
			if (obj.type == type) {
				obj.reset();
				return obj;
			}
		}
		return null;
	}

	public clear(): void {
		let obj: IBall = null;
		for (let key in this._IdlePool) {
			obj = this._IdlePool[key] as IBall;
			obj.del();
		}
		this._IdlePool = null;
		this._IdlePool = {};
	}

	public look(): void {
		console.log("[LOOK]");
		console.log("-----------IdlePool 空闲对象------------");
		let num = 0;
		for (let key in this._IdlePool) {
			num++;
			console.log("KEY:" + key + " ,type: " + (this._IdlePool[key] as IBall).type);
		}
		console.log("共" + num + "个空闲对象");
		console.log("-----------UsedPool 使用对象------------");
		num = 0;
		for (let key in this._UsedPool) {
			num++;
			console.log("KEY:" + key + " ,type: " + (this._UsedPool[key] as IBall).type);
		}
		console.log("共" + num + "个使用对象");
		console.log("\n\n");
	}
}