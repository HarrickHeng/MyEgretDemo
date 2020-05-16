class SecScene extends Scene {
    private group: eui.Group;
    private back: eui.Rect;
    private gotoBtn: eui.Button;
    private world: p2.World;
    private plane: egret.DisplayObject;
    private planeBody: p2.Body;

    public constructor() {
        super();
        this.skinName = SecSceneSkin;
    }

    public onComplete() {
        egret.log("第二个场景加载完成");
    }

    public onAdd() {
        this.addE(this, this.update, this, egret.Event.ENTER_FRAME);
        this.addE(this.gotoBtn, this.touchHander, this);
        this.addE(this.back, this.onButtonClick, this);
        this.CreateWorld();
        this.CreatePlane();
    }

    public onExit() {
    }

    private CreateWorld(): void {
        this.world = new p2.World();
        this.world.sleepMode = p2.World.BODY_SLEEPING;
        this.world.gravity = [0, 9.8];
    }

    private CreatePlane() {
        //创建一个shape形状
        let planeShape: p2.Plane = new p2.Plane();
        //创建body刚体
        this.planeBody = new p2.Body({ position: [0, this.stage.stageHeight] });
        this.planeBody.type = p2.Body.STATIC;
        this.planeBody.angle = Math.PI;
        this.planeBody.displays = [];
        this.planeBody.addShape(planeShape);
        this.world.addBody(this.planeBody);
    }

    private createBitmapByName(name: string): egret.Bitmap {
        let result = new egret.Bitmap();
        let texture: egret.Texture = RES.getRes(name);
        result.texture = texture;
        return result;
    }

    private createBoxShape(width: number, height: number): eui.Rect {
        let shape: eui.Rect = new eui.Rect(width, height, 0xFFFFFF);
        return shape;
    }

    //贴图显示对象
    private shpeBody: p2.Body;
    private display: egret.DisplayObject;
    private onButtonClick(e: egret.TouchEvent) {
        if (Math.random() > 0) {
            //添加方形刚体 
            let width: number = Math.floor(Math.random() * 100 + 10);
            let height: number = Math.floor(Math.random() * 100 + 10);
            var boxShape: p2.Shape = new p2.Box({ width: width, height: height });
            this.shpeBody = new p2.Body({ mass: 1, position: [e.stageX, e.stageY], angularVelocity: 1 });
            this.shpeBody.addShape(boxShape);
            this.world.addBody(this.shpeBody);
            this.display = this.createBoxShape(width, height);//this.createBitmapByName("rect_png");
            this.display.width = (<p2.Box>boxShape).width
            this.display.height = (<p2.Box>boxShape).height
        }
        else {
            //添加圆形刚体
            var circleShape: p2.Shape = new p2.Circle({ radius: 60 });
            this.shpeBody = new p2.Body({ mass: 1, position: [e.stageX, e.stageY] });
            this.shpeBody.addShape(circleShape);
            this.world.addBody(this.shpeBody);
            this.display = this.createBitmapByName("circle_png");
            this.display.width = (<p2.Circle>circleShape).radius * 2
            this.display.height = (<p2.Circle>circleShape).radius * 2
        }
        this.display.anchorOffsetX = this.display.width / 2
        this.display.anchorOffsetY = this.display.height / 2;
        this.display.x = -100;
        this.display.y = -100;
        this.display.rotation = 270
        this.shpeBody.displays = [this.display];
        this.addChild(this.display);
    }

    private update() {
        this.world.step(2.5);
        var l = this.world.bodies.length;
        for (var i: number = 0; i < l; i++) {
            var boxBody: p2.Body = this.world.bodies[i];
            var box: egret.DisplayObject = boxBody.displays[0];
            if (box) {
                //将刚体的坐标和角度赋值给显示对象
                box.x = boxBody.position[0];
                box.y = boxBody.position[1];
                box.rotation = boxBody.angle * 180 / Math.PI;
                //如果刚体当前状态为睡眠状态，将图片alpha设为0.5，否则为1
                if (boxBody.sleepState == p2.Body.SLEEPING) {
                    box.alpha = 0.5;
                }
                else {
                    box.alpha = 1;
                }
            }
        }
    }

    private touchHander(evt: egret.TouchEvent): void {
        let sceneManager = SceneManager.Instance;
        let firstScene = new FirstScene();
        sceneManager.changeScene(firstScene);
    }
}