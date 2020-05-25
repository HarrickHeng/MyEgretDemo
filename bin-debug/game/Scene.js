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
    /**
     * @param changeXY  是否用最大的宽高来进行自适应
     * @param checkM    是否检查刘海改变位置  内嵌窗基本都为false
     */
    function Scene(changeXY, checkM) {
        if (changeXY === void 0) { changeXY = true; }
        if (checkM === void 0) { checkM = true; }
        var _this = _super.call(this) || this;
        _this._hasReceive = false; //是否已经清除
        _this.changeXY = true;
        _this._checkM = true; //本窗是否要检查是否有显示安全区逻辑
        _this.Edata = [];
        _this.changeXY = changeXY;
        _this._checkM = checkM;
        _this.hasInit = false;
        _this.hasInitSkin = false;
        _this.autoReceivels = new Array();
        _this.addEventListener(eui.UIEvent.ADDED_TO_STAGE, _this.onAddedToStage, _this);
        _this.addEventListener(eui.UIEvent.REMOVED_FROM_STAGE, _this.onRemoveFromStage, _this);
        _this.addEventListener(eui.UIEvent.COMPLETE, _this.onUICompelte, _this);
        _this._winInitTime = egret.getTimer();
        return _this;
    }
    Scene.prototype.onExit = function () {
        this.delE2();
    };
    Object.defineProperty(Scene.prototype, "hasReceive", {
        /**
         * 是否已经清除
         */
        get: function () {
            return this._hasReceive;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Scene.prototype, "winInitTime", {
        /**
         * 获取界面初始所用时间
         */
        get: function () {
            return this._winInitTime;
        },
        enumerable: true,
        configurable: true
    });
    Scene.prototype.checkM = function () {
        if (!this._checkM)
            return;
        if (window["isIpx"] == true) {
            var width = StageUtils.ins().getWidth();
            var height = StageUtils.ins().getHeight();
            this.top = 60;
            this.bottom = 60;
        }
    };
    /**
     * 加载完毕并且显示界面回调接口
     */
    Scene.prototype.onCompleteAndShow = function () {
        var self = this;
        if (!self.stage) {
            return;
        }
        // if (self.loadingView.parent) {
        //     self.loadingView.parent.removeChild(self.loadingView);
        // }
        self.initPosition();
        self.stage.addEventListener(egret.Event.RESIZE, self.onResize, self);
        self.dispatchEventWith("completeAndShow");
        self.onAdd();
    };
    /**
     * 移入接口
     */
    Scene.prototype.onAdd = function () {
    };
    Scene.prototype.onResAsync = function (value, key) {
        var _thisobj = this;
        _thisobj.texture = value;
    };
    /**
     * 添加到场景显示
     * @param evt
     */
    Scene.prototype.onAddedToStage = function (evt) {
        var self = this;
        if (!self.hasInit) {
            // self.addChild(self.loadingView);
            return;
        }
        else {
            for (var _i = 0, _a = self.autoReceivels; _i < _a.length; _i++) {
                var img = _a[_i];
                if (img && img.source) {
                    var url = String(img.source).concat();
                    img.source = null;
                    img.source = url;
                }
            }
        }
        TimeInstance.onceTick(self.onCompleteAndShow, 50, self);
        self.stage.addEventListener(egret.Event.RESIZE, self.onResize, self);
    };
    /**
     * 移出场景显示
     * @param evt
     */
    Scene.prototype.onRemoveFromStage = function (evt) {
        var self = this;
        // if (self.loadingView.parent) {
        //     self.loadingView.parent.removeChild(self.loadingView);
        // }
        YS.MDE(egret.Event.CLOSE, self);
        // YS.MReE(GameMap.MapComplete, self.onChangeMap, self);
        if (self.stage) {
            self.stage.removeEventListener(egret.Event.RESIZE, self.onResize, self);
        }
        var urls = new Object();
        for (var _i = 0, _a = self.autoReceivels; _i < _a.length; _i++) {
            var img = _a[_i];
            if (img && img.source) {
                if (!urls[String(img.source)]) {
                    urls[String(img.source)] = true;
                    img.filters = null;
                }
            }
        }
        for (var url in urls) {
            RES.destroyRes(url);
        }
        this.onExit();
    };
    Scene.prototype._initPosition = function () {
        var self = this;
        var scale = 1;
        if (!self.stage)
            return;
        self.checkM();
        var w = 720;
        var h = 1200;
        if (self.skin) {
            w = self.skin.width;
            h = self.skin.height;
        }
        if (self.changeXY) {
            self.x = (self.stage.stageWidth - w * scale) / 2;
            self.y = (self.stage.stageHeight - h * scale) / 2;
            if (self.huiBG) {
                self.huiBG.scaleX = self.stage.stageWidth / self.huiBG.width;
                self.huiBG.scaleY = self.stage.stageHeight / self.huiBG.height;
                var po = ToolInstance.changePoint(0, 0, self.stage, self.huiBG.parent);
                self.huiBG.x = po.x;
                self.huiBG.y = po.y;
            }
        }
        self.resetWH();
    };
    Scene.prototype.resetWH = function () {
        var self = this;
        if (!self.changeXY) {
            self.width = self.stage.stageWidth;
            self.height = self.stage.stageHeight;
        }
    };
    /**
     * 初始皮肤ui接口
     */
    Scene.prototype.initSkin = function () {
        var self = this;
        if (self.huiBG) {
            self.huiBG.touchEnabled = true;
        }
        if (Scene.autoReceiveImg) {
            var i = void 0, child = void 0, closels = new Object();
            var openlst = new Array();
            openlst.push(self);
            while (openlst.length) {
                child = openlst.pop();
                if ((child instanceof eui.Image) &&
                    egret.getQualifiedClassName(child) == "eui.Image" &&
                    child.name == "" && !closels[String(child.hashCode)] &&
                    child.source &&
                    Scene.isAutoImg(child)) {
                    self.autoReceivels.push(child);
                    closels[String(child.hashCode)] = true;
                }
                else if ((child instanceof eui.Group) || (child instanceof Scene)) {
                    for (i = 0; i < child.numChildren; i++) {
                        openlst.push(child.getChildAt(i));
                    }
                }
            }
        }
        self.hasInitSkin = true;
    };
    /**
     * 初始完所有子组件
     */
    Scene.prototype.onUICompelte = function (evt) {
        var self = this;
        self.touchEnabled = true;
        var thisObj = self;
        thisObj._delayHandle = setTimeout(function () {
            thisObj.hasInit = true;
            clearTimeout(thisObj._delayHandle);
            if (thisObj.stage) {
                thisObj._delayHandle = setTimeout(function () {
                    thisObj.initSkin();
                    thisObj.onCompleteAndShow();
                    clearTimeout(thisObj._delayHandle);
                }, 100);
            }
            else
                thisObj.initSkin();
        }, 100);
        self._winInitTime = egret.getTimer() - self._winInitTime;
    };
    /**
     * 重置舞台
     */
    Scene.prototype.onResize = function (evt) {
        // this.loadingView.resize();
        if (this.hasInit) {
            this.initPosition();
        }
    };
    /**
     * 初始位置
     */
    Scene.prototype.initPosition = function () {
        var self = this;
        if (self.stage && self.stage.stageWidth && self.stage.stageHeight) {
            self._initPosition();
        }
        else {
            TimeInstance.onceTick(self._initPosition, 20, self);
        }
    };
    /**
     * 关闭接口
     */
    Scene.prototype.close = function () {
        var self = this;
        if (this.parent) {
            this.parent.removeChild(this);
        }
    };
    /**
     * 回收
     */
    Scene.prototype.receive = function () {
        var self = this;
        self._hasReceive = true;
        self.skinName = undefined;
        if (self.stage) {
            self.stage.removeEventListener(egret.Event.RESIZE, self.onResize, self);
        }
        self.removeEventListener(egret.Event.ADDED_TO_STAGE, self.onAddedToStage, self);
        self.removeEventListener(egret.Event.REMOVED_FROM_STAGE, self.onRemoveFromStage, self);
        self.removeEventListener(eui.UIEvent.COMPLETE, self.onUICompelte, self);
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
    Scene.autoReceiveImg = true;
    return Scene;
}(eui.Component));
__reflect(Scene.prototype, "Scene");
//# sourceMappingURL=Scene.js.map