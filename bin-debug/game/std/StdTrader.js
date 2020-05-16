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
/**商人类 */
var Trader = (function (_super) {
    __extends(Trader, _super);
    function Trader(aId, name, money, goodlist) {
        if (name === void 0) { name = ""; }
        if (money === void 0) { money = 0; }
        if (goodlist === void 0) { goodlist = []; }
        var _this = _super.call(this) || this;
        /**比价列表 */
        _this.priceList = [];
        _this._aId = aId;
        _this._name = name;
        _this._money = money;
        _this._goodlist = goodlist;
        return _this;
    }
    Object.defineProperty(Trader.prototype, "aId", {
        get: function () {
            return this._aId;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Trader.prototype, "name", {
        get: function () {
            return this._name;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Trader.prototype, "money", {
        get: function () {
            return this._money;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Trader.prototype, "goodlist", {
        get: function () {
            return this._goodlist;
        },
        enumerable: true,
        configurable: true
    });
    Trader.prototype.getGoodIdx = function (good) {
        for (var i = 0; i < this._goodlist.length; i++) {
            if (this._goodlist[i].id == good.id)
                return i;
        }
        return -1;
    };
    Trader.prototype.getGoodPrice = function (good, isChange) {
        if (isChange === void 0) { isChange = false; }
        var recgood;
        recgood = isChange ? good : new Good(good.id, good.name, good.price, good.count, good.demandTend);
        return recgood.price;
    };
    Trader.prototype.checkBuy = function (good) {
        this._curGoodIdx = this.getGoodIdx(good);
        this.getGoodPrice(good);
        var total = good.price * good.count;
        if (this._money < total) {
            egret.log(this._name + '不够支付' + good.name + ' X' + good.count + ' ' + total + '元');
            return false;
        }
        return true;
    };
    Trader.prototype.buy = function (good) {
        var total = good.price * good.count;
        this._money = this._money - total;
        if (this._curGoodIdx >= 0)
            this._goodlist[this._curGoodIdx].count = this._goodlist[this._curGoodIdx].count + good.count;
        else
            this._goodlist.push(good);
    };
    Trader.prototype.checkSell = function (good) {
        this._curGoodIdx = this.getGoodIdx(good);
        this.getGoodPrice(good);
        if (this._curGoodIdx >= 0) {
            if (this._goodlist[this._curGoodIdx].count >= good.count) {
                return true;
            }
            else {
                egret.log(this._name + '的' + good.name + '库存不足' + good.count);
                return false;
            }
        }
        else {
            egret.log(this._name + '没有' + good.name);
            return false;
        }
    };
    Trader.prototype.sell = function (good) {
        var total = good.price * good.count;
        this._money = this._money + total;
        this._goodlist[this._curGoodIdx].count = this._goodlist[this._curGoodIdx].count - good.count;
    };
    Trader.prototype.showMoney = function () {
        egret.log(this._name + 'money:' + this.money);
    };
    Trader.prototype.showGoodlist = function () {
        for (var _i = 0, _a = this._goodlist; _i < _a.length; _i++) {
            var good = _a[_i];
            if (good.count > 0)
                egret.log(good.name + '  ￥' + good.price + '  x' + good.count);
        }
    };
    /**traderAI */
    Trader.prototype.traderAI = function () {
        var fsm = FsmSet.BusinessFsm;
        var selectCity = fsm.cityArr[0];
        this.priceList = [];
        /**卖出货物 */
        for (var _i = 0, _a = this.goodlist; _i < _a.length; _i++) {
            var good = _a[_i];
            this.getPriceList(this, good);
            if (this.priceList.length) {
                var max = this.priceList.reduce(function (maxAI, AI) {
                    if (maxAI.income > AI.income)
                        return maxAI;
                    if (maxAI.income <= AI.income)
                        return AI;
                });
                selectCity = max.city;
                if (!selectCity.checkBuy(good)) {
                    var fixCount = selectCity.getMAXGoodCount(good, this.money);
                    good.count = fixCount; //城市财政不够时最大化售出数量
                    console.log(selectCity.name + "最大化购买" + good.name + " X" + good.count);
                }
                fsm.exchange(selectCity, this, good);
            }
            this.priceList = [];
        }
        /**购买货物 */
        for (var _b = 0, _c = selectCity.goodlist; _b < _c.length; _b++) {
            var good = _c[_b];
            this.getPriceList(selectCity, good);
            if (this.priceList.length) {
                var max = this.priceList.reduce(function (maxAI, AI) {
                    if (maxAI.income > AI.income)
                        return maxAI;
                    if (maxAI.income <= AI.income)
                        return AI;
                });
                if (max.city !== selectCity) {
                    if (!this.checkBuy(good)) {
                        var fixCount = selectCity.getMAXGoodCount(good, this.money);
                        good.count = fixCount; //商人钱不够时最大化购买数量
                        console.log(this._name + "最大化购买" + good.name + " X" + good.count);
                    }
                    fsm.exchange(this, selectCity, good);
                }
            }
            this.priceList = [];
        }
    };
    Trader.prototype.getPriceList = function (seller, good) {
        var fsm = FsmSet.BusinessFsm;
        for (var _i = 0, _a = fsm.cityArr; _i < _a.length; _i++) {
            var city = _a[_i];
            var income = fsm.analysIncome(city, seller, good);
            if (income != null) {
                var AIt = new AItrader();
                AIt.city = city;
                AIt.good = good;
                AIt.income = income;
                this.priceList.push(AIt);
            }
        }
    };
    return Trader;
}(CommerBody));
__reflect(Trader.prototype, "Trader");
var AItrader = (function () {
    function AItrader() {
    }
    return AItrader;
}());
__reflect(AItrader.prototype, "AItrader");
var StdTrader = (function () {
    function StdTrader() {
    }
    return StdTrader;
}());
__reflect(StdTrader.prototype, "StdTrader");
//# sourceMappingURL=StdTrader.js.map