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
/**城市类 */
var City = (function (_super) {
    __extends(City, _super);
    function City(aId, name, people, money, goodlist) {
        if (name === void 0) { name = ""; }
        if (people === void 0) { people = 0; }
        if (money === void 0) { money = 0; }
        if (goodlist === void 0) { goodlist = []; }
        var _this = _super.call(this) || this;
        _this._aId = aId;
        _this._name = name;
        _this._people = people;
        _this._money = money;
        _this._goodlist = goodlist;
        return _this;
    }
    Object.defineProperty(City.prototype, "aId", {
        get: function () {
            return this._aId;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(City.prototype, "name", {
        get: function () {
            return this._name;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(City.prototype, "people", {
        get: function () {
            return this._people;
        },
        set: function (value) {
            this._people = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(City.prototype, "money", {
        get: function () {
            return this._money;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(City.prototype, "goodlist", {
        get: function () {
            return this._goodlist;
        },
        enumerable: true,
        configurable: true
    });
    City.prototype.getGoodIdx = function (good) {
        for (var i = 0; i < this._goodlist.length; i++)
            if (this._goodlist[i].id == good.id)
                return i;
        return -1;
    };
    City.prototype.getGoodPrice = function (good, changePrice) {
        var recgood;
        recgood = changePrice ? good : new Good(good.id, good.name, good.price, good.count, good.demandTend);
        if (!this._curGoodIdx)
            this._curGoodIdx = this.getGoodIdx(recgood);
        if (this._curGoodIdx != -1) {
            var sum = 0;
            var count = this._goodlist[this._curGoodIdx].count;
            for (var i = recgood.count; i > 0; i--) {
                sum += (this._people * recgood.demandTend) / count;
                count--;
            }
            return recgood.price = Math.floor(sum / recgood.count);
        }
        else
            return null;
    };
    City.prototype.checkBuy = function (good) {
        this._curGoodIdx = this.getGoodIdx(good);
        this.getGoodPrice(good, true);
        var total = good.price * good.count;
        if (this._money < total) {
            egret.log(this._name + '的财政不够支付' + total + '元');
            return false;
        }
        return true;
    };
    City.prototype.buy = function (good) {
        var total = good.price * good.count;
        this._money = this._money - total;
        if (this._curGoodIdx >= 0)
            this._goodlist[this._curGoodIdx].count = this._goodlist[this._curGoodIdx].count + good.count;
        else
            this._goodlist.push(good);
    };
    City.prototype.checkSell = function (good) {
        this._curGoodIdx = this.getGoodIdx(good);
        this.getGoodPrice(good, true);
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
    City.prototype.sell = function (good) {
        var total = good.price * good.count;
        this._money = this._money + total;
        this._goodlist[this._curGoodIdx].count = this._goodlist[this._curGoodIdx].count - good.count;
    };
    City.prototype.showMoney = function () {
        egret.log(this._name + ' money:' + this.money);
    };
    City.prototype.showGoodlist = function () {
        for (var _i = 0, _a = this._goodlist; _i < _a.length; _i++) {
            var good = _a[_i];
            if (good.count > 0) {
                this.getGoodPrice(good, false);
                egret.log(good.name + '  ￥' + good.price + '  x' + good.count);
            }
        }
    };
    return City;
}(CommerBody));
__reflect(City.prototype, "City");
var StdCity = (function () {
    function StdCity() {
    }
    return StdCity;
}());
__reflect(StdCity.prototype, "StdCity");
//# sourceMappingURL=StdCity.js.map