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
var SceneManager = (function (_super) {
    __extends(SceneManager, _super);
    function SceneManager() {
        return _super.call(this) || this;
    }
    Object.defineProperty(SceneManager, "Instance", {
        get: function () {
            SceneManager._manager = SceneManager._manager ? SceneManager._manager : new SceneManager();
            return SceneManager._manager;
        },
        enumerable: true,
        configurable: true
    });
    //切换场景
    SceneManager.prototype.changeScene = function (s) {
        if (this.currentScene) {
            this.rootLayer.removeChild(this.currentScene);
            this.currentScene = null;
        }
        this.popScene();
        this.rootLayer.addChild(s);
        this.currentScene = s;
    };
    //弹出场景层
    SceneManager.prototype.pushScene = function (s) {
        this.popScene();
        if (!this.pop_scene) {
            this.rootLayer.addChild(s);
            this.pop_scene = s;
        }
    };
    //关闭场景层
    SceneManager.prototype.popScene = function () {
        if (this.pop_scene) {
            this.rootLayer.removeChild(this.pop_scene);
            this.pop_scene = null;
        }
    };
    return SceneManager;
}(eui.Component));
__reflect(SceneManager.prototype, "SceneManager");
//# sourceMappingURL=SceneManager.js.map