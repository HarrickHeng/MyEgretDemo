var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
/**
 * 时间
 */
var TimeFsm = (function () {
    function TimeFsm() {
        this._sysFocus = true;
        this._pauseGame = false;
        this._hasInit = false;
        this._receiveTick = 0;
        this._frameRate = 60;
        this._frameTick = 0;
        this._tick = (new Date()).getTime() - DateTimeMgr.MiniDateTimeBase;
        this._seed = egret.getTimer();
    }
    TimeFsm.prototype.initEnterGameTime = function () {
        if (!this._enterGameTime) {
            this._enterGameTime = egret.getTimer();
        }
    };
    TimeFsm.prototype.getRunGameTime = function () {
        return egret.getTimer() - this._enterGameTime;
    };
    Object.defineProperty(TimeFsm.prototype, "sysFocus", {
        get: function () {
            return this._sysFocus;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TimeFsm.prototype, "uiReceiveTick", {
        get: function () {
            return this._receiveTick;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TimeFsm.prototype, "frameRate", {
        get: function () {
            return this._frameRate;
        },
        enumerable: true,
        configurable: true
    });
    TimeFsm.prototype._frameHandle = function (evt) {
        this._tickHandle(egret.getTimer());
    };
    Object.defineProperty(TimeFsm.prototype, "shortTime", {
        /**
         * 获取游戏短时间
         */
        get: function () {
            return this._tick;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TimeFsm.prototype, "seed", {
        /*
        * 时间seed
        */
        get: function () {
            return this._seed;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TimeFsm.prototype, "utcTime", {
        /*
        * 获取当前服务器时间
        */
        get: function () {
            return this._tick + DateTimeMgr.MiniDateTimeBase;
        },
        enumerable: true,
        configurable: true
    });
    return TimeFsm;
}());
__reflect(TimeFsm.prototype, "TimeFsm");
//# sourceMappingURL=TimeFsm.js.map