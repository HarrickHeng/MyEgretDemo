class DataEventDispatcher {
    public static dispatcher: egret.EventDispatcher = new egret.EventDispatcher();
    /**
     * 派发全局事件
     */
    public static dispatchEventWith(type: string, data?: any, ...param: any[]): void {
        let dataEvt: DataEvent = new DataEvent(type, data);
        if (param) dataEvt.param = param;
        DataEventDispatcher.dispatcher.dispatchEvent(dataEvt);
    }
}

/**
 * 数据事件
 */
class DataEvent extends egret.Event {
    public param: any[];
    public constructor(type: string, data: Object, ...param: any[]) {
        super(type);
        this.data = data;
        this.param = param;
        if (!this.param) {
            this.param = [];
        }
    }
}