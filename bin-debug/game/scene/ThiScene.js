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
var ThiScene = (function (_super) {
    __extends(ThiScene, _super);
    function ThiScene() {
        var _this = _super.call(this) || this;
        _this.timer = new egret.Timer(100);
        _this.stoneFlag = false;
        var fsm = FsmSet.MapFsm;
        _this.skinName = ThiSceneSkin;
        _this.btnArr = [_this.gotoBtn, _this.setSBtn, _this.setEBtn, _this.stoneBtn, _this.findBtn, _this.find2Btn, _this.find3Btn, _this.resetBtn, _this.viewBtn];
        //根据MapSC设置地图大小
        _this.mapData = _this.setListFun(_this.mapList, MapItem, _this.mapData);
        fsm.mapRow = Math.floor(_this.MapSC.width / _this.mapItemT.width);
        fsm.mapCol = Math.floor(_this.MapSC.height / _this.mapItemT.height);
        _this.setMapLayout();
        _this.createMap();
        console.log("group is ", _this.group);
        return _this;
    }
    ThiScene.prototype.onComplete = function () {
        egret.log("第三个场景加载完成");
    };
    ThiScene.prototype.onAdd = function () {
        this.addEvent();
        this.initPosInfo();
    };
    ThiScene.prototype.addEvent = function () {
        this.addE2(this.btnArr, this.touchHander, this);
        this.addE(this.timer, this.find2Fun, this, egret.TimerEvent.TIMER);
        this.addE(this.mapList, this.touchListHander, this, eui.ItemTapEvent.ITEM_TAP);
    };
    ThiScene.prototype.onExit = function () {
        this.removeEvent();
        this.mapData = null;
        FsmSet.MapFsm.clearData();
    };
    /**设置布局格式 */
    ThiScene.prototype.setMapLayout = function () {
        var fsm = FsmSet.MapFsm;
        var tly = new eui.TileLayout();
        tly.orientation = "row";
        tly.requestedRowCount = fsm.mapRow;
        tly.requestedColumnCount = fsm.mapCol;
        tly.horizontalGap = tly.verticalGap = 0;
        this.mapList.layout = tly;
    };
    /**初始化坐标信息 */
    ThiScene.prototype.initPosInfo = function () {
        this.touchPos.textFlow = YS.parse("\u6240\u9009\u5750\u6807:0,0");
        this.startPos.textFlow = YS.parse("\u8D77\u59CB\u5750\u6807:0,0");
        this.endPos.textFlow = YS.parse("\u8D77\u59CB\u5750\u6807:0,0");
    };
    /**更新坐标信息 */
    ThiScene.prototype.updatePosInfo = function () {
        var fsm = FsmSet.MapFsm;
        this.initPosInfo();
        if (fsm.curMapItem)
            this.touchPos.textFlow = YS.parse("\u6240\u9009\u5750\u6807:" + fsm.curMapItem.row + "," + fsm.curMapItem.col);
        if (fsm.endMapItem)
            this.endPos.textFlow = YS.parse("\u8D77\u59CB\u5750\u6807:" + fsm.endMapItem.row + "," + fsm.endMapItem.col);
        if (fsm.startMapItem)
            this.startPos.textFlow = YS.parse("\u8D77\u59CB\u5750\u6807:" + fsm.startMapItem.row + "," + fsm.startMapItem.col);
    };
    ThiScene.prototype.removeEvent = function () {
    };
    /**选中地图块 */
    ThiScene.prototype.touchListHander = function (evt) {
        var item = evt.item;
        var fsm = FsmSet.MapFsm;
        if (fsm.lastMapItem) {
            fsm.lastMapItem.selected = false;
            this.mapData.itemUpdated(fsm.lastMapItem);
        }
        fsm.lastMapItem = fsm.curMapItem = item;
        fsm.curMapItem.selected = true;
        this.mapData.itemUpdated(fsm.curMapItem);
        this.updatePosInfo();
        if (this.stoneFlag)
            fsm.curMapItem = fsm.MIS(fsm.curMapItem, MI_STATUS.STONE);
        else
            fsm.curMapItem = fsm.MIS(fsm.curMapItem, MI_STATUS.DEFAULT);
    };
    ThiScene.prototype.touchHander = function (evt) {
        var target = evt.target;
        var sceneManager = SceneManager.Instance;
        var fsm = FsmSet.MapFsm;
        switch (target) {
            case this.gotoBtn:
                var firstScene = new FirstScene();
                sceneManager.changeScene(firstScene);
                break;
            case this.setSBtn:
                if (fsm.startMapItem)
                    fsm.MIS(fsm.startMapItem, MI_STATUS.DEFAULT);
                fsm.startMapItem = fsm.MIS(fsm.curMapItem, MI_STATUS.START);
                break;
            case this.setEBtn:
                if (!fsm.startMapItem)
                    return;
                if (fsm.endMapItem)
                    fsm.endMapItem = fsm.MIS(fsm.endMapItem, MI_STATUS.DEFAULT);
                fsm.endMapItem = fsm.MIS(fsm.curMapItem, MI_STATUS.END);
                break;
            case this.stoneBtn:
                this.stoneFlag = !this.stoneFlag;
                break;
            case this.findBtn:
                //直接演示
                if (fsm.startMapItem && fsm.endMapItem)
                    this.findFun();
                break;
            case this.find2Btn:
                //连续演示
                if (fsm.startMapItem && fsm.endMapItem)
                    this.timer.start();
                break;
            case this.find3Btn:
                //逐步演示
                if (fsm.startMapItem && fsm.endMapItem)
                    this.find3Fun();
                break;
            case this.resetBtn:
                this.mapData = null;
                fsm.clearData();
                this.initPosInfo();
                this.createMap();
                break;
            case this.viewBtn:
                fsm.showInfo = !fsm.showInfo;
                this.mapData.source = fsm.mapData.source;
                break;
        }
        this.updatePosInfo();
    };
    //直接演示
    ThiScene.prototype.findFun = function () {
        var fsm = FsmSet.MapFsm;
        var resMI = fsm.aStar();
        var path = [];
        while (resMI != null) {
            path.push(resMI);
            fsm.MIS(resMI, MI_STATUS.LINED);
            resMI = resMI.parent;
        }
        // fsm.bresenHamLine();
        fsm.startMapItem = fsm.endMapItem = null;
    };
    //连续演示
    ThiScene.prototype.find2Fun = function () {
        var fsm = FsmSet.MapFsm;
        var resMI = fsm.aStarSub();
        if (resMI && resMI == fsm.endMapItem) {
            this.timer.stop();
            var path = [];
            while (resMI != null) {
                path.push(resMI);
                fsm.MIS(resMI, MI_STATUS.LINED);
                resMI = resMI.parent;
            }
            fsm.startMapItem = fsm.endMapItem = null;
        }
    };
    //逐步演示
    ThiScene.prototype.find3Fun = function () {
        var fsm = FsmSet.MapFsm;
        var resMI = fsm.aStarSub();
        if (resMI && resMI == fsm.endMapItem) {
            var path = [];
            while (resMI != null) {
                path.push(resMI);
                fsm.MIS(resMI, MI_STATUS.LINED);
                resMI = resMI.parent;
            }
            fsm.startMapItem = fsm.endMapItem = null;
        }
    };
    /**创建地图 */
    ThiScene.prototype.createMap = function () {
        var fsm = FsmSet.MapFsm;
        if (fsm.mapRow && fsm.mapCol) {
            this.loadMapItem(fsm.mapRow, fsm.mapCol);
            fsm.mapData = this.mapData;
        }
    };
    /**载入地图块 */
    ThiScene.prototype.loadMapItem = function (row, col) {
        var mapArr = [];
        var len = row * col;
        for (var i = 0; i < len; i++) {
            var rValue = Math.ceil((i + 1) / row);
            var cValue = i - (rValue - 1) * col + 1;
            var obj = {
                id: (i + 1),
                row: rValue, col: cValue,
                selected: false,
                status: MI_STATUS.DEFAULT
            }; //TODO...
            mapArr.push(obj);
        }
        if (!this.mapData)
            this.mapData = this.setListFun(this.mapList, MapItem, this.mapData);
        this.mapData.replaceAll(mapArr);
    };
    return ThiScene;
}(Scene));
__reflect(ThiScene.prototype, "ThiScene");
//# sourceMappingURL=ThiScene.js.map