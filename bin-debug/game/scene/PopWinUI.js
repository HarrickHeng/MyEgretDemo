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
var PopWinUI = (function (_super) {
    __extends(PopWinUI, _super);
    function PopWinUI() {
        var _this = _super.call(this) || this;
        _this.skinName = PopWinSkin;
        return _this;
    }
    PopWinUI.prototype.onComplete = function () {
        egret.log("弹窗加载完成");
    };
    PopWinUI.prototype.onAdd = function () {
        this.addE(this.closeBtn, this.touchHander, this);
    };
    PopWinUI.prototype.onExit = function () {
    };
    PopWinUI.prototype.touchHander = function (evt) {
        var sceneManager = SceneManager.Instance;
        YS.MDE(GlobalEvent.TEST_EVENT);
        sceneManager.popScene();
    };
    return PopWinUI;
}(Scene));
__reflect(PopWinUI.prototype, "PopWinUI");
//# sourceMappingURL=PopWinUI.js.map