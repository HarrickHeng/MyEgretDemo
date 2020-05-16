/**商人类 */
class Trader extends CommerBody {
    private _aId: number;
    private _name: string;
    private _money: number;
    private _goodlist: Good[];
    private _curGoodIdx: number;

    constructor(aId: number, name: string = "", money: number = 0, goodlist: Good[] = []) {
        super();
        this._aId = aId;
        this._name = name;
        this._money = money;
        this._goodlist = goodlist;
    }

    public get aId(): number {
        return this._aId;
    }

    public get name(): string {
        return this._name;
    }

    public get money(): number {
        return this._money;
    }

    public get goodlist(): Good[] {
        return this._goodlist;
    }

    public getGoodIdx(good: Good): number {
        for (let i = 0; i < this._goodlist.length; i++) {
            if (this._goodlist[i].id == good.id)
                return i;
        }
        return -1;
    }

    public getGoodPrice(good: Good, isChange: boolean = false): number {
        let recgood: Good;
        recgood = isChange ? good : new Good(good.id, good.name, good.price, good.count, good.demandTend);
        return recgood.price;
    }

    public checkBuy(good: Good): boolean {
        this._curGoodIdx = this.getGoodIdx(good);
        this.getGoodPrice(good);
        let total = good.price * good.count;
        if (this._money < total) {
            egret.log(this._name + '不够支付' + good.name + ' X' + good.count + ' ' + total + '元');
            return false;
        }
        return true;
    }

    public buy(good: Good): void {
        let total = good.price * good.count;
        this._money = this._money - total;
        if (this._curGoodIdx >= 0)
            this._goodlist[this._curGoodIdx].count = this._goodlist[this._curGoodIdx].count + good.count;
        else
            this._goodlist.push(good);
    }

    public checkSell(good: Good): boolean {
        this._curGoodIdx = this.getGoodIdx(good);
        this.getGoodPrice(good);
        if (this._curGoodIdx >= 0) {
            if (this._goodlist[this._curGoodIdx].count >= good.count) { //库存足够
                return true;
            } else {
                egret.log(this._name + '的' + good.name + '库存不足' + good.count);
                return false;
            }
        } else {
            egret.log(this._name + '没有' + good.name);
            return false;
        }
    }

    public sell(good: Good): void {
        let total = good.price * good.count;
        this._money = this._money + total;
        this._goodlist[this._curGoodIdx].count = this._goodlist[this._curGoodIdx].count - good.count;
    }

    public showMoney(): void {
        egret.log(this._name + 'money:' + this.money);
    }

    public showGoodlist(): void {
        for (let good of this._goodlist) {
            if (good.count > 0)
                egret.log(good.name + '  ￥' + good.price + '  x' + good.count);
        }
    }

    /**比价列表 */
    private priceList: AItrader[] = [];
    /**traderAI */
    public traderAI(): void {
        let fsm = FsmSet.BusinessFsm;
        let selectCity: City = fsm.cityArr[0];
        this.priceList = [];
        /**卖出货物 */
        for (let good of this.goodlist) {
            this.getPriceList(this, good);
            if (this.priceList.length) {
                let max = this.priceList.reduce((maxAI, AI) => {
                    if (maxAI.income > AI.income) return maxAI;
                    if (maxAI.income <= AI.income) return AI;
                });
                selectCity = max.city;
                if (!selectCity.checkBuy(good)) {
                    let fixCount = selectCity.getMAXGoodCount(good, this.money);
                    good.count = fixCount; //城市财政不够时最大化售出数量
                    console.log(selectCity.name + "最大化购买" + good.name + " X" + good.count)
                }
                fsm.exchange(selectCity, this, good);
            }
            this.priceList = [];
        }
        /**购买货物 */
        for (let good of selectCity.goodlist) {
            this.getPriceList(selectCity, good);
            if (this.priceList.length) {
                let max = this.priceList.reduce((maxAI, AI) => {
                    if (maxAI.income > AI.income) return maxAI;
                    if (maxAI.income <= AI.income) return AI;
                });
                if (max.city !== selectCity) { //确保该货物在其他城市收益
                    if (!this.checkBuy(good)) {
                        let fixCount = selectCity.getMAXGoodCount(good, this.money);
                        good.count = fixCount; //商人钱不够时最大化购买数量
                        console.log(this._name + "最大化购买" + good.name + " X" + good.count)
                    }
                    fsm.exchange(this, selectCity, good);
                }
            }
            this.priceList = [];
        }
    }

    private getPriceList(seller: City | Trader, good: Good): void {
        let fsm = FsmSet.BusinessFsm;
        for (let city of fsm.cityArr) {
            let income: number = fsm.analysIncome(city, seller, good);
            if (income != null) {
                let AIt = new AItrader();
                AIt.city = city;
                AIt.good = good;
                AIt.income = income;
                this.priceList.push(AIt);
            }
        }
    }
}

class AItrader {
    public city: City;
    public good: Good;
    public income: number;
}

class StdTrader {
    public aId: number;
    public name: string;
    public money: number;
    public goodlist: Good[];
    public curGoodIdx: number;
}