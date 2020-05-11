var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var BusinessFsm = (function () {
    function BusinessFsm() {
        /**总账本 */
        this.acBook = [];
        /**城市组 */
        this.cityArr = [];
        /**商人组 */
        this.traderArr = [];
    }
    /**商业体交易行为 */
    BusinessFsm.prototype.exchange = function (buyer, seller, good) {
        if (buyer !== seller && buyer.checkBuy(good) && seller.checkSell(good)) {
            this.loadAcBook(buyer, seller, good, FsmSet.timeFsm.utcTime);
            buyer.buy(good);
            seller.sell(good);
        }
    };
    /**比价分析 */
    BusinessFsm.prototype.analysIncome = function (buyer, seller, good) {
        var buyer_price = buyer.getGoodPrice(good, false);
        var seller_price = seller.getGoodPrice(good, false);
        if (!buyer_price) {
            good.price = seller_price * 1.5; //当地无货则暴利50%
            return good.price;
        }
        return buyer_price - seller_price;
    };
    /**创建商业体 */
    BusinessFsm.prototype.createCommer = function (std) {
        if (std instanceof StdCity) {
            for (var _i = 0, _a = this.cityArr; _i < _a.length; _i++) {
                var item = _a[_i];
                if (item.aId == std.aId) {
                    egret.log('城市已存在！');
                    return;
                }
            }
            var city = new City(std.aId, std.name, std.people, std.money, std.goodlist);
            this.cityArr.push(city);
            return city;
        }
        else if (std instanceof StdTrader) {
            for (var _b = 0, _c = this.traderArr; _b < _c.length; _b++) {
                var item = _c[_b];
                if (item.aId == std.aId) {
                    egret.log('商人已存在！');
                    return;
                }
            }
            var trader = new Trader(std.aId, std.name, std.money, std.goodlist);
            this.traderArr.push(trader);
            return trader;
        }
    };
    /**查询城市 */
    BusinessFsm.prototype.findCityById = function (aId) {
        for (var _i = 0, _a = this.cityArr; _i < _a.length; _i++) {
            var item = _a[_i];
            if (item.aId == aId)
                return item;
        }
        egret.log('未查到ID为' + aId + '的城市');
    };
    /**查询商人 */
    BusinessFsm.prototype.findTraderById = function (aId) {
        for (var _i = 0, _a = this.traderArr; _i < _a.length; _i++) {
            var item = _a[_i];
            if (item.aId == aId)
                return item;
        }
        egret.log('未查到ID为' + aId + '的商人');
    };
    /**记入账本 */
    BusinessFsm.prototype.loadAcBook = function (buyer, seller, good, time) {
        var record = new acRecord();
        var recGood = new Good(good.id, good.name, good.price, good.count, good.demandTend); //记录交易时的货物状态
        record.time = DateTimeMgr.getTimeString(time, 5);
        record.buyer = buyer;
        record.seller = seller;
        record.good = recGood;
        record.orderId = buyer.aId.toString() + seller.aId.toString() + good.id.toString() + time + Math.floor(Math.random()).toString();
        this.acBook.push(record);
    };
    /**查看账本 */
    BusinessFsm.prototype.readAcBook = function (orderId) {
        for (var _i = 0, _a = this.acBook; _i < _a.length; _i++) {
            var record = _a[_i];
            if (orderId != undefined && orderId == Number(record.orderId)) {
                var total_1 = record.good.price * record.good.count;
                console.log(record.time
                    + Sign.SPACE + 'buyer:' + record.buyer.name
                    + Sign.SPACE + 'seller:' + record.seller.name
                    + Sign.SPACE + 'good:' + record.good.name
                    + Sign.SPACE + record.good.count
                    + Sign.SPACE + 'cost:' + total_1);
                return;
            }
            var total = record.good.price * record.good.count;
            console.log(record.time
                + Sign.SPACE + 'buyer:' + record.buyer.name
                + Sign.SPACE + 'seller:' + record.seller.name
                + Sign.SPACE + 'good:' + record.good.name
                + Sign.SPACE + record.good.count
                + Sign.SPACE + 'cost:' + total);
        }
    };
    return BusinessFsm;
}());
__reflect(BusinessFsm.prototype, "BusinessFsm");
/**交易记录 */
var acRecord = (function () {
    function acRecord() {
    }
    return acRecord;
}());
__reflect(acRecord.prototype, "acRecord");
//# sourceMappingURL=BusinessFsm.js.map