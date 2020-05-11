class MapItem extends eui.ItemRenderer {
    public bgColor: eui.Rect;
    /**坐标显示 */
    public posLab: eui.Label;
    /**F值显示 */
    public FLab: eui.Label;
    /**G值显示 */
    public GLab: eui.Label;
    /**H值显示 */
    public HLab: eui.Label;
    /**选中 */
    public selected: boolean;

    private mdata: StdMapItem;

    public constructor() {
        super();
        this.skinName = MapItemSkin;
    }

    protected dataChanged() {
        this.clearData();
        if (this.data) {
            let fsm = FsmSet.MapFsm;
            this.mdata = this.data;
            this.currentState = this.mdata.selected ? "selected" : "unselect";
            this.posLab.textFlow = fsm.showInfo ? YS.parse(`${this.mdata.row},${this.mdata.col}`) : YS.parse(``);
            this.FLab.text = (this.mdata.F && fsm.showInfo) ? this.mdata.F.toString() : "";
            this.GLab.text = (this.mdata.G && fsm.showInfo) ? this.mdata.G.toString() : "";
            this.HLab.text = (this.mdata.H && fsm.showInfo) ? this.mdata.H.toString() : "";
            this.doItemByStatus(this.mdata.status);
        }
    }

    private doItemByStatus(status: number): void {
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
    }

    private clearData(): void {
        this.FLab.text = '';
        this.GLab.text = '';
        this.HLab.text = '';
        this.selected = false;
    }
}

enum MI_STATUS {
    DEFAULT,
    START,
    END,
    OPENED,
    CLOSED,
    STONE,
    LINED
}