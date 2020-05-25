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
var FirstScene = (function (_super) {
    __extends(FirstScene, _super);
    function FirstScene() {
        var _this = _super.call(this) || this;
        _this._touchStatus = false;
        _this._distance = new egret.Point();
        _this.skinName = FirstSceneSkin;
        return _this;
    }
    FirstScene.prototype.initSkin = function () {
        _super.prototype.initSkin.call(this);
    };
    FirstScene.prototype.onAdd = function () {
        this.addE(this.testPoint, this.down, this, egret.TouchEvent.TOUCH_BEGIN);
        this.addE(this.testPoint, this.up, this, egret.TouchEvent.TOUCH_END);
        this.addE2([this.gotoBtn, this.gotoBtn0, this.pushBtn], this.touchHander, this);
    };
    FirstScene.prototype.onExit = function () {
    };
    FirstScene.prototype.down = function (evt) {
        this._touchStatus = true;
        this._distance.x = evt.stageX - this.testPoint.x;
        this._distance.y = evt.stageY - this.testPoint.y;
        this.addE(this.testPoint, this.move, this, egret.TouchEvent.TOUCH_MOVE);
    };
    FirstScene.prototype.up = function (evt) {
        this._touchStatus = false;
        this.delE(this.testPoint, this.move, this, egret.TouchEvent.TOUCH_MOVE);
    };
    FirstScene.prototype.move = function (evt) {
        if (this._touchStatus) {
            this.testPoint.x = evt.stageX - this._distance.x;
            this.testPoint.y = evt.stageY - this._distance.y;
            this.updateHit();
        }
    };
    FirstScene.prototype.updateHit = function () {
        var r1 = new egret.Rectangle(this.testPoint.x, this.testPoint.y, this.testPoint.width, this.testPoint.height);
        var r2 = new egret.Rectangle(this.testPoint_2.x, this.testPoint_2.y, this.testPoint_2.width, this.testPoint_2.height);
        this.isHit = r1.intersects(r2);
        this.hitRes.text = "碰撞结果为：" + this.isHit;
    };
    FirstScene.prototype.touchHander = function (evt) {
        var target = evt.target;
        var sceneManager = SceneManager.Instance;
        switch (target) {
            case this.gotoBtn:
                var secScene = new SecScene();
                sceneManager.changeScene(secScene);
                break;
            case this.gotoBtn0:
                var thiScene = new ThiScene();
                sceneManager.changeScene(thiScene);
                break;
            case this.pushBtn:
                var popwin = new PopWinUI();
                sceneManager.pushScene(popwin);
                break;
        }
    };
    return FirstScene;
}(Scene));
__reflect(FirstScene.prototype, "FirstScene");
//# sourceMappingURL=FirstScene.js.map