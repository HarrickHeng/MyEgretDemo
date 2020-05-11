var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var GlobalEvent = (function () {
    function GlobalEvent() {
    }
    GlobalEvent.TEST_EVENT = "TEST_EVENT";
    GlobalEvent.TOUCH_MAP_ITEM = "TOUCH_MAP_ITEM";
    return GlobalEvent;
}());
__reflect(GlobalEvent.prototype, "GlobalEvent");
//# sourceMappingURL=GlobalEvent.js.map