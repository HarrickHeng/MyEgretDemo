class FirstScene extends Scene {
    public group: eui.Group;
    public back: eui.Rect;
    public topLabel: eui.Label;
    public gotoBtn: eui.Button;
    public gotoBtn0: eui.Button;
    public pushBtn: eui.Button;
    public testPoint: eui.Rect;
    public testPoint_2: eui.Rect;
    public isHit: boolean;
    public hitRes: eui.Label;

    private _touchStatus: boolean = false;
    private _distance: egret.Point = new egret.Point();

    public constructor() {
        super();
        this.skinName = FirstSceneSkin;
    }

    public onComplete() {
        egret.log("第一个场景加载完成");
    }

    public onAdd() {
        this.addE(this.testPoint, this.down, this, egret.TouchEvent.TOUCH_BEGIN);
        this.addE(this.testPoint, this.up, this, egret.TouchEvent.TOUCH_END);
        this.addE2([this.gotoBtn, this.gotoBtn0, this.pushBtn], this.touchHander, this);
    }

    public onExit() {
    }

    private down(evt: egret.TouchEvent): void {
        this._touchStatus = true;
        this._distance.x = evt.stageX - this.testPoint.x;
        this._distance.y = evt.stageY - this.testPoint.y;
        this.addE(this.testPoint, this.move, this, egret.TouchEvent.TOUCH_MOVE);
    }

    private up(evt: egret.TouchEvent): void {
        this._touchStatus = false;
        this.delE(this.testPoint, this.move, this, egret.TouchEvent.TOUCH_MOVE);
    }

    private move(evt: egret.TouchEvent): void {
        if (this._touchStatus) {
            this.testPoint.x = evt.stageX - this._distance.x;
            this.testPoint.y = evt.stageY - this._distance.y;
            this.updateHit();
        }
    }

    private updateHit(): void {
        let r1 = new egret.Rectangle(this.testPoint.x, this.testPoint.y, this.testPoint.width, this.testPoint.height);
        let r2 = new egret.Rectangle(this.testPoint_2.x, this.testPoint_2.y, this.testPoint_2.width, this.testPoint_2.height);
        this.isHit = r1.intersects(r2);
        this.hitRes.text = "碰撞结果为：" + this.isHit;
    }

    private touchHander(evt: egret.Event): void {
        let target = evt.target;
        let sceneManager = SceneManager.Instance;
        switch (target) {
            case this.gotoBtn:
                let secScene = new SecScene();
                sceneManager.changeScene(secScene);
                break;
            case this.gotoBtn0:
                let thiScene = new ThiScene();
                sceneManager.changeScene(thiScene);
                break;
            case this.pushBtn:
                let popwin = new PopWinUI();
                sceneManager.pushScene(popwin);
                break;
        }
    }
}