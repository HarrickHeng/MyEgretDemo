/**商业抽象类 */
abstract class CommerBody {
    public abstract checkBuy(good: Good): boolean;
    public abstract checkSell(good: Good): boolean;
    public abstract buy(good: Good): void;
    public abstract sell(good: Good): void;
    public abstract showMoney(): void;
    public abstract showGoodlist(): void;
}

/**货品类 */
class Good {
    private _id: number;
    private _name: string;
    private _price: number;
    private _count: number;
    private _demandTend: number;

    constructor(id: number, name: string, price: number, count: number, demandTend: number) {
        this._id = id;
        this._name = name;
        this._price = price;
        this._count = count;
        this._demandTend = demandTend;
    }

    public get id(): number {
        return this._id;
    }

    public get name(): string {
        return this._name;
    }

    public get price(): number {
        return this._price;
    }

    public set price(value: number) {
        this._price = value;
    }

    public get count(): number {
        return this._count;
    }

    public set count(value: number) {
        this._count = value;
    }

    public get demandTend(): number {
        return this._demandTend;
    }

    public set demandTend(value: number) {
        this._demandTend = value;
    }
}

class StdGood {
    public id: number;
    public name: string;
    public price: number;
    public count: number;
    public demandTend: number;
    public gains: number;
}
