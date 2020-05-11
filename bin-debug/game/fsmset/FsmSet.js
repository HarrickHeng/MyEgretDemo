var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
/**系统状态机 */
var FsmSet = (function () {
    function FsmSet() {
    }
    FsmSet.init = function () {
        this.timeFsm = new TimeFsm();
        this.MapFsm = new MapFsm();
        this.BusinessFsm = new BusinessFsm();
    };
    return FsmSet;
}());
__reflect(FsmSet.prototype, "FsmSet");
//# sourceMappingURL=FsmSet.js.map