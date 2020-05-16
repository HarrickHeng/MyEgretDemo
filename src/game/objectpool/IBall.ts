interface IBall {
	hashc: number; //hashcode
	type: number; //类型标识
	isIdle: boolean; //标记是否空闲
	dispose(): void; //释放对象内部引用
	del(): void; //彻底释放对象
	reset(): void; //重置
	setProtocol(val: IDistributor): void; //设置协议
	action(): void; //动作
}

enum BallType {
	foot,
	basket,
	base
}

/**生成器 */
class BallGenerator {
	private _dis: IDistributor = null;
	public constructor(val: IDistributor) {
		this.init(val);
	}

	private init(val: IDistributor): void {
		this._dis = val;
	}

	public getBall(type: number): IBall {
		let vo: IBall = this._dis.getVO(type);
		if (vo == null) {
			//clear new HashObject
			vo = this.createVO(type);
			this._dis.addVO(vo);
			vo.reset();
		}
		return vo;
	}

	private createVO(type: number): IBall {
		switch (type) {
			case BallType.foot:
				return new FootBall();
			case BallType.basket:
				return new BasketBall();
			case BallType.base:
				return new BaseBall();
		}
	}

	public look():void{
		this._dis.look();
	}
}

