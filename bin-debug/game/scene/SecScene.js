var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = this && this.__extends || function __extends(t, e) { 
 function r() { 
 this.constructor = t;
}
for (var i in e) e.hasOwnProperty(i) && (t[i] = e[i]);
r.prototype = e.prototype, t.prototype = new r();
};
var SecScene = (function (_super) {
    __extends(SecScene, _super);
    function SecScene() {
        var _this = _super.call(this) || this;
        _this.skinName = SecSceneSkin;
        console.log("group is ", _this.group);
        return _this;
    }
    SecScene.prototype.onComplete = function () {
        egret.log("第二个场景加载完成");
    };
    SecScene.prototype.onAdd = function () {
        this.addE(this, this.update, this, egret.Event.ENTER_FRAME);
        this.addE(this.gotoBtn, this.touchHander, this);
        this.addE(this.back, this.onButtonClick, this);
        this.CreateWorld();
        this.CreatePlane();
    };
    SecScene.prototype.onExit = function () {
    };
    SecScene.prototype.CreateWorld = function () {
        this.world = new p2.World();
        this.world.sleepMode = p2.World.BODY_SLEEPING;
        this.world.gravity = [0, 9.8];
    };
    SecScene.prototype.CreatePlane = function () {
        //创建一个shape形状
        var planeShape = new p2.Plane();
        //创建body刚体
        this.planeBody = new p2.Body({ position: [0, this.stage.stageHeight] });
        this.planeBody.type = p2.Body.STATIC;
        this.planeBody.angle = Math.PI;
        this.planeBody.displays = [];
        this.planeBody.addShape(planeShape);
        this.world.addBody(this.planeBody);
    };
    SecScene.prototype.createBitmapByName = function (name) {
        var result = new egret.Bitmap();
        var texture = RES.getRes(name);
        result.texture = texture;
        return result;
    };
    SecScene.prototype.createBoxShape = function (width, height) {
        var shape = new eui.Rect(width, height, 0xFFFFFF);
        return shape;
    };
    SecScene.prototype.onButtonClick = function (e) {
        if (Math.random() > 0) {
            //添加方形刚体 
            var width = Math.floor(Math.random() * 100 + 10);
            var height = Math.floor(Math.random() * 100 + 10);
            var boxShape = new p2.Box({ width: width, height: height });
            this.shpeBody = new p2.Body({ mass: 1, position: [e.stageX, e.stageY], angularVelocity: 1 });
            this.shpeBody.addShape(boxShape);
            this.world.addBody(this.shpeBody);
            this.display = this.createBoxShape(width, height); //this.createBitmapByName("rect_png");
            this.display.width = boxShape.width;
            this.display.height = boxShape.height;
        }
        else {
            //添加圆形刚体
            var circleShape = new p2.Circle({ radius: 60 });
            this.shpeBody = new p2.Body({ mass: 1, position: [e.stageX, e.stageY] });
            this.shpeBody.addShape(circleShape);
            this.world.addBody(this.shpeBody);
            this.display = this.createBitmapByName("circle_png");
            this.display.width = circleShape.radius * 2;
            this.display.height = circleShape.radius * 2;
        }
        this.display.anchorOffsetX = this.display.width / 2;
        this.display.anchorOffsetY = this.display.height / 2;
        this.display.x = -100;
        this.display.y = -100;
        this.display.rotation = 270;
        this.shpeBody.displays = [this.display];
        this.addChild(this.display);
    };
    SecScene.prototype.update = function () {
        this.world.step(2.5);
        var l = this.world.bodies.length;
        for (var i = 0; i < l; i++) {
            var boxBody = this.world.bodies[i];
            var box = boxBody.displays[0];
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
    };
    SecScene.prototype.touchHander = function (evt) {
        var sceneManager = SceneManager.Instance;
        var firstScene = new FirstScene();
        sceneManager.changeScene(firstScene);
    };
    return SecScene;
}(Scene));
__reflect(SecScene.prototype, "SecScene");
//# sourceMappingURL=SecScene.js.map