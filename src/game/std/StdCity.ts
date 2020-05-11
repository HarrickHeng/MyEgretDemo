/**城市类 */
class City extends CommerBody {
    private _aId: number;
    private _name: string;
    private _people: number;
    private _money: number;
    private _goodlist: Good[];
    private _curGoodIdx: number;

    constructor(aId: number, name: string = "", people: number = 0, money: number = 0, goodlist: Good[] = []) {
        super();
        this._aId = aId;
        this._name = name;
        this._people = people;
        this._money = money;
        this._goodlist = goodlist;
    }

    public get aId(): number {
        return this._aId;
    }

    public get name(): string {
        return this._name;
    }

    public get people(): number {
        return this._people;
    }

    public set people(value: number) {
        this._people = value;
    }

    public get money(): number {
        return this._money;
    }

    public get goodlist(): Good[] {
        return this._goodlist;
    }

    public getGoodIdx(good: Good): number {
        for (let i = 0; i < this._goodlist.length; i++)
            if (this._goodlist[i].id == good.id) return i;
        return -1;
    }

    public getGoodPrice(good: Good, changePrice: boolean): number {
        let recgood: Good;
        recgood = changePrice ? good : new Good(good.id, good.name, good.price, good.count, good.demandTend);
        if (!this._curGoodIdx) this._curGoodIdx = this.getGoodIdx(recgood);
        if (this._curGoodIdx != -1) {
            let sum = 0;
            let count = this._goodlist[this._curGoodIdx].count;
            for (let i = recgood.count; i > 0; i--) {
                sum += (this._people * recgood.demandTend) / count;
                count--;
            }
            return recgood.price = Math.floor(sum / recgood.count);
        } else
            return null;
    }

    public checkBuy(good: Good): boolean {
        this._curGoodIdx = this.getGoodIdx(good);
        this.getGoodPrice(good, true);
        let total = good.price * good.count;
        if (this._money < total) {
            egret.log(this._name + '的财政不够支付' + total + '元');
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
        this.getGoodPrice(good, true);
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
        egret.log(this._name + ' money:' + this.money);
    }

    public showGoodlist(): void {
        for (let good of this._goodlist) {
            if (good.count > 0) {
                this.getGoodPrice(good, false);
                egret.log(good.name + '  ￥' + good.price + '  x' + good.count);
            }
        }
    }
}

class StdCity {
    public aId: number;
    public name: string;
    public people: number;
    public money: number;
    public goodlist: Good[];
    public curGoodIdx: number;
}