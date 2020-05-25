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
var DataEventDispatcher = (function () {
    function DataEventDispatcher() {
    }
    /**
     * 派发全局事件
     */
    DataEventDispatcher.dispatchEventWith = function (type, data) {
        var param = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            param[_i - 2] = arguments[_i];
        }
        var dataEvt = new DataEvent(type, data);
        if (param)
            dataEvt.param = param;
        DataEventDispatcher.dispatcher.dispatchEvent(dataEvt);
    };
    DataEventDispatcher.dispatcher = new egret.EventDispatcher();
    return DataEventDispatcher;
}());
__reflect(DataEventDispatcher.prototype, "DataEventDispatcher");
/**
 * 数据事件
 */
var DataEvent = (function (_super) {
    __extends(DataEvent, _super);
    function DataEvent(type, data) {
        var param = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            param[_i - 2] = arguments[_i];
        }
        var _this = _super.call(this, type) || this;
        _this.data = data;
        _this.param = param;
        if (!_this.param) {
            _this.param = [];
        }
        return _this;
    }
    return DataEvent;
}(egret.Event));
__reflect(DataEvent.prototype, "DataEvent");
//# sourceMappingURL=DataEventDispatcher.js.map