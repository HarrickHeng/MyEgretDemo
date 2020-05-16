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
var BasketBall = (function (_super) {
    __extends(BasketBall, _super);
    function BasketBall() {
        var _this = _super.call(this) || this;
        _this._isIdle = true;
        _this._type = BallType.basket;
        _this._dis = null;
        _this._message = "";
        return _this;
    }
    BasketBall.prototype.reset = function () {
        this._isIdle = false;
        this._dis.distribution(this);
        this._message = "this is a basketball,play it!";
    };
    BasketBall.prototype.dispose = function () {
        this._isIdle = true;
        this._dis.distribution(this);
        //other code
    };
    BasketBall.prototype.del = function () {
        this.dispose();
        this._dis = null;
    };
    BasketBall.prototype.setProtocol = function (val) {
        this._dis = val;
    };
    Object.defineProperty(BasketBall.prototype, "type", {
        get: function () {
            return this._type;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BasketBall.prototype, "hashc", {
        get: function () {
            return this.hashCode;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BasketBall.prototype, "isIdle", {
        get: function () {
            return this._isIdle;
        },
        enumerable: true,
        configurable: true
    });
    BasketBall.prototype.action = function () {
        console.log(this._message);
    };
    return BasketBall;
}(egret.HashObject));
__reflect(BasketBall.prototype, "BasketBall", ["IBall"]);
//# sourceMappingURL=BasketBall.js.map