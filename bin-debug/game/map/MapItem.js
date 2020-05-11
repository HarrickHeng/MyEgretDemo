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
var MapItem = (function (_super) {
    __extends(MapItem, _super);
    function MapItem() {
        var _this = _super.call(this) || this;
        _this.skinName = MapItemSkin;
        return _this;
    }
    MapItem.prototype.dataChanged = function () {
        this.clearData();
        if (this.data) {
            var fsm = FsmSet.MapFsm;
            this.mdata = this.data;
            this.currentState = this.mdata.selected ? "selected" : "unselect";
            this.posLab.textFlow = fsm.showInfo ? YS.parse(this.mdata.row + "," + this.mdata.col) : YS.parse("");
            this.FLab.text = (this.mdata.F && fsm.showInfo) ? this.mdata.F.toString() : "";
            this.GLab.text = (this.mdata.G && fsm.showInfo) ? this.mdata.G.toString() : "";
            this.HLab.text = (this.mdata.H && fsm.showInfo) ? this.mdata.H.toString() : "";
            this.doItemByStatus(this.mdata.status);
        }
    };
    MapItem.prototype.doItemByStatus = function (status) {
        switch (status) {
            case MI_STATUS.START:
                this.bgColor.fillColor = 0x0076FF;
                this.posLab.text = "S";
                break;
            case MI_STATUS.END:
                this.bgColor.fillColor = 0x0076FF;
                this.posLab.text = "E";
                break;
            case MI_STATUS.OPENED:
                this.bgColor.fillColor = 0x37F900;
                break;
            case MI_STATUS.CLOSED:
                this.bgColor.fillColor = 0xFF0000;
                break;
            case MI_STATUS.STONE:
                this.bgColor.fillColor = 0x000000;
                break;
            case MI_STATUS.LINED:
                this.bgColor.fillColor = 0x0076FF;
                break;
            default:
                this.bgColor.fillColor = 0xFFFFFF;
        }
    };
    MapItem.prototype.clearData = function () {
        this.FLab.text = '';
        this.GLab.text = '';
        this.HLab.text = '';
        this.selected = false;
    };
    return MapItem;
}(eui.ItemRenderer));
__reflect(MapItem.prototype, "MapItem");
var MI_STATUS;
(function (MI_STATUS) {
    MI_STATUS[MI_STATUS["DEFAULT"] = 0] = "DEFAULT";
    MI_STATUS[MI_STATUS["START"] = 1] = "START";
    MI_STATUS[MI_STATUS["END"] = 2] = "END";
    MI_STATUS[MI_STATUS["OPENED"] = 3] = "OPENED";
    MI_STATUS[MI_STATUS["CLOSED"] = 4] = "CLOSED";
    MI_STATUS[MI_STATUS["STONE"] = 5] = "STONE";
    MI_STATUS[MI_STATUS["LINED"] = 6] = "LINED";
})(MI_STATUS || (MI_STATUS = {}));
//# sourceMappingURL=MapItem.js.map