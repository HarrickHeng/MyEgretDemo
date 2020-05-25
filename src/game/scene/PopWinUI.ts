class PopWinUI extends Scene {
    private group: eui.Group;
    private closeBtn: eui.Button;

    public constructor() {
        super();
        this.skinName = PopWinSkin;
    }

    protected initSkin() {
        super.initSkin();
    }

    public onAdd() {
        super.onAdd();
        this.addE(this.closeBtn, this.touchHander, this);
    }

    public onExit() {
    }

    private touchHander(evt: egret.TouchEvent): void {
        let sceneManager = SceneManager.Instance;
        YS.MDE(GlobalEvent.TEST_EVENT);
        sceneManager.popScene();
    }
}