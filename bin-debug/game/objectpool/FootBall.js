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
var FootBall = (function (_super) {
    __extends(FootBall, _super);
    function FootBall() {
        var _this = _super.call(this) || this;
        _this._isIdle = true;
        _this._type = BallType.foot;
        _this._dis = null;
        _this._message = "";
        return _this;
    }
    FootBall.prototype.reset = function () {
        this._isIdle = false;
        this._dis.distribution(this);
        this._message = "this is a football,kick it!";
    };
    FootBall.prototype.dispose = function () {
        this._isIdle = true;
        this._dis.distribution(this);
        //other code
    };
    FootBall.prototype.del = function () {
        this.dispose();
        this._dis = null;
    };
    FootBall.prototype.setProtocol = function (val) {
        this._dis = val;
    };
    Object.defineProperty(FootBall.prototype, "type", {
        get: function () {
            return this._type;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FootBall.prototype, "hashc", {
        get: function () {
            return this.hashCode;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FootBall.prototype, "isIdle", {
        get: function () {
            return this._isIdle;
        },
        enumerable: true,
        configurable: true
    });
    FootBall.prototype.action = function () {
        console.log(this._message);
    };
    return FootBall;
}(egret.HashObject));
__reflect(FootBall.prototype, "FootBall", ["IBall"]);
//# sourceMappingURL=FootBall.js.map