class OpMain extends egret.DisplayObjectContainer {
	public constructor() {
		super();

		this.init();
	}

	private _gen: BallGenerator = null;
	private init() {
		this._gen = new BallGenerator(new Distributor());

		let fb: FootBall = this._gen.getBall(BallType.foot) as FootBall;
		fb.action();

		this._gen.look();
		
		fb.dispose();
		fb = null;

		this._gen.look();
	}
}