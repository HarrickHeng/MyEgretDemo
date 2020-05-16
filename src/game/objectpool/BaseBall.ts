class BaseBall extends egret.HashObject implements IBall {
	private _isIdle: boolean = true;
	private _type: number = BallType.base;
	private _dis: IDistributor = null;

	private _message: string = "";

	public constructor() {
		super();
	}

	public reset(): void {
		this._isIdle = false;
		this._dis.distribution(this);
		this._message = "this is a baseball,swap it!";
	}

	public dispose(): void {
		this._isIdle = true;
		this._dis.distribution(this);

		//other code
	}

	public del(): void {
		this.dispose();
		this._dis = null;
	}

	public setProtocol(val: IDistributor): void {
		this._dis = val;
	}

	public get type(): number {
		return this._type;
	}

	public get hashc(): number {
		return this.hashCode;
	}

	public get isIdle(): boolean {
		return this._isIdle;
	}

	public action(): void {
		console.log(this._message);
	}
}