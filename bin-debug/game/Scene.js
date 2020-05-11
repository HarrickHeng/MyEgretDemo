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
var Scene = (function (_super) {
    __extends(Scene, _super);
    function Scene() {
        var _this = _super.call(this) || this;
        _this.Edata = [];
        _this.addEventListener(eui.UIEvent.ADDED_TO_STAGE, _this.onAdd, _this);
        _this.addEventListener(eui.UIEvent.REMOVED_FROM_STAGE, _this.onExit, _this);
        _this.addEventListener(eui.UIEvent.COMPLETE, _this.onComplete, _this);
        return _this;
    }
    Scene.prototype.onExit = function () {
        this.delE2();
    };
    Scene.prototype.addE = function (target, f, t, e) {
        if (e === void 0) { e = egret.TouchEvent.TOUCH_TAP; }
        target.addEventListener(e, f, t);
        this.Edata.push([target, e, f, t]);
    };
    Scene.prototype.addE2 = function (target, f, t, e) {
        if (e === void 0) { e = egret.TouchEvent.TOUCH_TAP; }
        for (var i = 0; i < target.length; i++) {
            this.addE(target[i], f, t, e);
        }
    };
    Scene.prototype.delE = function (target, f, t, e) {
        if (e === void 0) { e = egret.TouchEvent.TOUCH_TAP; }
        target.removeEventListener(e, f, t);
        // let index: number;
        // for (let i = 0; i < this.Edata.length; i++) {
        // 	if (this.Edata[i][0] == target && this.Edata[i][1] == e && this.Edata[i][2] == f && this.Edata[i][3] == t)
        // 		index = i;
        // }
        // if (index != -1)
        // 	this.Edata.splice(index);
    };
    Scene.prototype.delE2 = function () {
        while (this.Edata.length) {
            var data = this.Edata.pop();
            data[0].removeEventListener(data[1], data[2], data[3]);
        }
    };
    Scene.prototype.setListFun = function (list, funClass, ListData) {
        if (!list) {
            return;
        }
        if (!ListData) {
            ListData = new eui.ArrayCollection();
        }
        list.itemRenderer = funClass;
        list.dataProvider = ListData;
        return ListData;
    };
    return Scene;
}(eui.Component));
__reflect(Scene.prototype, "Scene");
//# sourceMappingURL=Scene.js.map