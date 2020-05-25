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
/**
 * 时间函数
 */
var TimeInstance = (function () {
    function TimeInstance() {
        if (TimeInstance._instance) {
            throw new Error("时间单例不可重复创建！");
        }
        this.timerls = new Object();
    }
    /**
     * 获取单例
     */
    TimeInstance.getInstance = function () {
        if (!TimeInstance._instance) {
            TimeInstance._instance = new TimeInstance();
        }
        return TimeInstance._instance;
    };
    /**
     * 单次触发
     */
    TimeInstance.onceTick = function (handle, time, thisObj) {
        var arg = [];
        for (var _i = 3; _i < arguments.length; _i++) {
            arg[_i - 3] = arguments[_i];
        }
        if (time <= 0 || !time) {
            handle.apply(thisObj, arg);
            return;
        }
        var handleId = setTimeout(function () {
            clearTimeout(handleId);
            delete TimeInstance._handles[handleId.toString()];
            handle.apply(thisObj, arg);
        }, time);
        TimeInstance._handles[handleId.toString()] = handle;
    };
    /**
     * 获取触发数量
     */
    TimeInstance.getTickNum = function () {
        var num = 0;
        for (var k in TimeInstance._handles) {
            num++;
        }
        return num;
    };
    TimeInstance.hasTick = function (handle) {
        var result = false;
        for (var k in TimeInstance._handles) {
            if (TimeInstance._handles[k] == handle) {
                result = true;
                return true;
            }
        }
        return result;
    };
    /**
     * 移除触发
     */
    TimeInstance.removeTick = function (handle) {
        for (var k in TimeInstance._handles) {
            if (TimeInstance._handles[k] == handle) {
                clearTimeout(Number(k));
                delete TimeInstance._handles[k];
                return;
            }
        }
    };
    TimeInstance.rcycle = function (handle) {
        var instance = TimeInstance.getInstance();
        var k, timer;
        for (k in instance.timerls) {
            timer = instance.timerls[k];
            if (timer.hasFunc(handle)) {
                timer.removeFunc(handle);
                return;
            }
        }
    };
    /**
     * 轮询指定函数，忽略第一次触发的精确度
     */
    TimeInstance.cycle = function (handle, loop, thisObj) {
        var arg = [];
        for (var _i = 3; _i < arguments.length; _i++) {
            arg[_i - 3] = arguments[_i];
        }
        var instance = TimeInstance.getInstance();
        var k, timer;
        for (k in instance.timerls) {
            timer = instance.timerls[k];
            if (timer.hasFunc(handle)) {
                if (timer.delay == loop) {
                    timer.addFunc(handle, thisObj, arg);
                    return;
                }
                else {
                    timer.removeFunc(handle);
                }
                break;
            }
        }
        timer = instance.timerls[loop.toString()];
        if (!timer) {
            timer = new SyncTimer(loop);
            instance.timerls[loop.toString()] = timer;
        }
        timer.addFunc(handle, thisObj, arg);
    };
    /**移除轮询函数 */
    TimeInstance.removeCycleTick = function (loop, fun) {
        var instance = TimeInstance.getInstance();
        var Timer = instance.timerls[loop + ""];
        if (!Timer)
            return;
        Timer.removeFunc(fun);
    };
    ////////////////////////////////////////////////
    //
    // 计时接口
    //
    ////////////////////////////////////////////////
    TimeInstance._handles = new Object();
    return TimeInstance;
}());
__reflect(TimeInstance.prototype, "TimeInstance");
/**
 * 同步触发时间对象
 */
var SyncTimer = (function (_super) {
    __extends(SyncTimer, _super);
    function SyncTimer(delay, repeatCount) {
        var _this = _super.call(this, delay, repeatCount) || this;
        var self = _this;
        self.handlels = new Array();
        self.thisObjls = new Array();
        self.paramls = new Array();
        return _this;
    }
    /**
     * 检测是否指定函数
     */
    SyncTimer.prototype.hasFunc = function (func) {
        return this.handlels.indexOf(func) != -1;
    };
    /**
     * 添加函数
     */
    SyncTimer.prototype.addFunc = function (func, thisObj, arg) {
        var self = this;
        var index = self.handlels.indexOf(func);
        if (index == -1) {
            self.handlels.push(func);
            self.thisObjls.push(thisObj);
            self.paramls.push(arg);
        }
        else {
            self.thisObjls[index] = thisObj;
            self.paramls[index] = arg;
        }
        if (self.handlels.length && !self.hasEventListener(egret.TimerEvent.TIMER)) {
            self.addEventListener(egret.TimerEvent.TIMER, self.onTimer, self);
            self.start();
        }
    };
    SyncTimer.prototype.onTimer = function (evt) {
        var i, func;
        var self = this;
        for (i = self.handlels.length - 1; i >= 0; i--) {
            func = self.handlels[i];
            if (func.apply(self.thisObjls[i], self.paramls[i])) {
                self.handlels.splice(i, 1);
                self.thisObjls.splice(i, 1);
                self.paramls.splice(i, 1);
            }
        }
    };
    /**
     * 移除轮询函数
     */
    SyncTimer.prototype.removeFunc = function (func) {
        var self = this;
        var index = self.handlels.indexOf(func);
        if (index != -1) {
            self.handlels.splice(index, 1);
            self.thisObjls.splice(index, 1);
            self.paramls.splice(index, 1);
        }
        if (self.handlels.length <= 0 && self.hasEventListener(egret.TimerEvent.TIMER)) {
            self.removeEventListener(egret.TimerEvent.TIMER, self.onTimer, self);
            self.stop();
        }
    };
    return SyncTimer;
}(egret.Timer));
__reflect(SyncTimer.prototype, "SyncTimer");
//# sourceMappingURL=TimeInstance.js.map