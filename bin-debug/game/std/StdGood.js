var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
/**商业抽象类 */
var CommerBody = (function () {
    function CommerBody() {
    }
    return CommerBody;
}());
__reflect(CommerBody.prototype, "CommerBody");
/**货品类 */
var Good = (function () {
    function Good(id, name, price, count, demandTend) {
        this._id = id;
        this._name = name;
        this._price = price;
        this._count = count;
        this._demandTend = demandTend;
    }
    Object.defineProperty(Good.prototype, "id", {
        get: function () {
            return this._id;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Good.prototype, "name", {
        get: function () {
            return this._name;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Good.prototype, "price", {
        get: function () {
            return this._price;
        },
        set: function (value) {
            this._price = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Good.prototype, "count", {
        get: function () {
            return this._count;
        },
        set: function (value) {
            this._count = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Good.prototype, "demandTend", {
        get: function () {
            return this._demandTend;
        },
        set: function (value) {
            this._demandTend = value;
        },
        enumerable: true,
        configurable: true
    });
    return Good;
}());
__reflect(Good.prototype, "Good");
var StdGood = (function () {
    function StdGood() {
    }
    return StdGood;
}());
__reflect(StdGood.prototype, "StdGood");
//# sourceMappingURL=StdGood.js.map