class ThiScene extends Scene {
    public group: eui.Group;
    public back: eui.Rect;
    public topLabel: eui.Label;

    public MapSC: eui.Scroller;
    public mapList: eui.List;
    public mapData: eui.ArrayCollection;
    public mapItemT: MapItem; //用于预读地图格子大小

    public gotoBtn: eui.Button;
    public setSBtn: eui.Button;
    public setEBtn: eui.Button;
    public stoneBtn: eui.Button;
    public findBtn: eui.Button;
    public find2Btn: eui.Button;
    public find3Btn: eui.Button;
    public resetBtn: eui.Button;
    public viewBtn: eui.Button;
    public primBtn: eui.Button;
    public breBtn: eui.Button;
    public btnArr: eui.Button[];

    public posLab: eui.Group;
    public startPos: eui.Label;
    public endPos: eui.Label;
    public touchPos: eui.Label;

    public constructor() {
        super();
        let fsm = FsmSet.MapFsm;
        this.skinName = ThiSceneSkin;
        this.btnArr = [this.gotoBtn, this.setSBtn, this.setEBtn, this.stoneBtn,
        this.findBtn, this.find2Btn, this.find3Btn, this.resetBtn, this.viewBtn,
        this.breBtn, this.primBtn];
        this.mapData = this.setListFun(this.mapList, MapItem, this.mapData);
        this.mapList.useVirtualLayout = true;
        //根据MapSC设置地图大小
        fsm.mapRow = Math.floor(this.MapSC.width / this.mapItemT.width);
        fsm.mapCol = Math.floor(this.MapSC.height / this.mapItemT.height);
        this.setMapLayout();
    }

    protected initSkin() {
        super.initSkin();
    }

    public onAdd() {
        this.addEvent();
        this.reset();
    }

    private addEvent() {
        this.addE2(this.btnArr, this.touchHander, this);
        this.addE(this.timer, this.find2Fun, this, egret.TimerEvent.TIMER);
        this.addE(this.mapList, this.touchListHander, this, eui.ItemTapEvent.ITEM_TAP);
    }

    public onExit() {
        this.removeEvent();
        this.mapData = null;
        FsmSet.MapFsm.clearData();
    }

    /**设置布局格式 */
    private setMapLayout(): void {
        let fsm = FsmSet.MapFsm;
        let tly = new eui.TileLayout();
        tly.orientation = "row";
        tly.requestedRowCount = fsm.mapRow;
        tly.requestedColumnCount = fsm.mapCol;
        tly.horizontalGap = tly.verticalGap = 0;
        this.mapList.layout = tly;
    }

    /**初始化坐标信息 */
    private initPosInfo(): void {
        this.touchPos.textFlow = YS.parse(`所选坐标:0,0`);
        this.startPos.textFlow = YS.parse(`起始坐标:0,0`);
        this.endPos.textFlow = YS.parse(`起始坐标:0,0`);
    }

    /**更新坐标信息 */
    private updatePosInfo(): void {
        let fsm = FsmSet.MapFsm;
        this.initPosInfo();
        if (fsm.curMapItem)
            this.touchPos.textFlow = YS.parse(`所选坐标:${fsm.curMapItem.row},${fsm.curMapItem.col}`);
        if (fsm.endMapItem)
            this.endPos.textFlow = YS.parse(`起始坐标:${fsm.endMapItem.row},${fsm.endMapItem.col}`);
        if (fsm.startMapItem)
            this.startPos.textFlow = YS.parse(`起始坐标:${fsm.startMapItem.row},${fsm.startMapItem.col}`);
    }

    private removeEvent() {
    }

    /**选中地图块 */
    private touchListHander(evt: eui.ItemTapEvent): void {
        let item = evt.item;
        let fsm = FsmSet.MapFsm;
        if (fsm.lastMapItem) {
            fsm.lastMapItem.selected = false;
            this.mapData.itemUpdated(fsm.lastMapItem);
        }
        fsm.lastMapItem = fsm.curMapItem = item;
        fsm.curMapItem.selected = true;
        this.mapData.itemUpdated(fsm.curMapItem);
        this.updatePosInfo();
        if (this.stoneFlag) //绘制障碍物
            fsm.curMapItem = fsm.MIS(fsm.curMapItem, MI_STATUS.STONE);
        else
            fsm.curMapItem = fsm.MIS(fsm.curMapItem, MI_STATUS.DEFAULT);
    }

    private timer: egret.Timer = new egret.Timer(100);
    private stoneFlag: boolean = false;
    private touchHander(evt: egret.Event): void {
        let target = evt.target;
        let sceneManager = SceneManager.Instance;
        let fsm = FsmSet.MapFsm;
        switch (target) {
            case this.gotoBtn:
                let firstScene = new FirstScene();
                sceneManager.changeScene(firstScene);
                break;
            case this.setSBtn:
                if (fsm.startMapItem)
                    fsm.MIS(fsm.startMapItem, MI_STATUS.DEFAULT);
                fsm.startMapItem = fsm.MIS(fsm.curMapItem, MI_STATUS.START);
                break;
            case this.setEBtn:
                if (!fsm.startMapItem) return;
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
                this.reset();
                break;
            case this.viewBtn:
                fsm.showInfo = !fsm.showInfo;
                this.mapData.source = fsm.mapData.source;
                break;
            case this.breBtn:
                if (fsm.startMapItem && fsm.endMapItem) {
                    let res = fsm.bresenHamLine();
                    for (let MI of res) {
                        fsm.MIS(MI, MI_STATUS.LINED);
                    }
                    fsm.startMapItem = fsm.endMapItem = null;
                }
                break;
            case this.primBtn:
                this.stoneFlag = !this.stoneFlag;
                this.reset();
                fsm.primMap();
                break;
        }
        this.updatePosInfo();
    }

    private reset(): void {
        let fsm = FsmSet.MapFsm;
        fsm.clearData();
        this.initPosInfo();
        this.createMap();
    }

    //直接演示
    private findFun(): void {
        let fsm = FsmSet.MapFsm;
        let resMI = fsm.aStar();
        let path: StdMapItem[] = [];
        while (resMI != null) {
            path.push(resMI);
            fsm.MIS(resMI, MI_STATUS.LINED);
            resMI = resMI.parent;
        }
        fsm.startMapItem = fsm.endMapItem = null;
    }

    //连续演示
    private find2Fun(): void {
        let fsm = FsmSet.MapFsm;
        let resMI = fsm.aStarSub();
        if (resMI && resMI == fsm.endMapItem) {
            this.timer.stop();
            let path: StdMapItem[] = [];
            while (resMI != null) {
                path.push(resMI);
                fsm.MIS(resMI, MI_STATUS.LINED);
                resMI = resMI.parent;
            }
            fsm.startMapItem = fsm.endMapItem = null;
        }
    }

    //逐步演示
    private find3Fun(): void {
        let fsm = FsmSet.MapFsm;
        let resMI = fsm.aStarSub();
        if (resMI && resMI == fsm.endMapItem) {
            let path: StdMapItem[] = [];
            while (resMI != null) {
                path.push(resMI);
                fsm.MIS(resMI, MI_STATUS.LINED);
                resMI = resMI.parent;
            }
            fsm.startMapItem = fsm.endMapItem = null;
        }
    }

    /**创建地图 */
    private createMap(): void {
        let fsm = FsmSet.MapFsm;
        if (fsm.mapRow && fsm.mapCol) {
            this.loadMapItem(fsm.mapRow, fsm.mapCol);
            fsm.mapData = this.mapData;
        }
    }

    /**载入地图块 */
    private loadMapItem(row, col): void {
        let mapArr = [];
        let len = row * col;
        for (let i = 0; i < len; ++i) {
            let rValue = Math.ceil((i + 1) / row);
            let cValue = i - (rValue - 1) * col + 1;
            let obj = {
                id: (i + 1),
                row: rValue, col: cValue,
                selected: false,
                status: MI_STATUS.DEFAULT
            }; //TODO...
            mapArr.push(obj);
        }
        this.mapData.source = mapArr;
    }
}