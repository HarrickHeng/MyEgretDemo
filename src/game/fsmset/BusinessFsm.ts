class BusinessFsm {
	/**总账本 */
	public acBook: acRecord[] = [];
	/**城市组 */
	public cityArr: City[] = [];
	/**商人组 */
	public traderArr: Trader[] = [];

	/**商业体交易行为 */
	public exchange(buyer: City | Trader, seller: City | Trader, good: Good): void {
		if (buyer !== seller && buyer.checkBuy(good) && seller.checkSell(good)) {
			this.loadAcBook(buyer, seller, good, FsmSet.timeFsm.utcTime);
			buyer.buy(good);
			seller.sell(good);
		}
	}

	/**比价分析 */
	public analysIncome(buyer: City | Trader, seller: City | Trader, good: Good): number {
		let buyer_price = buyer.getGoodPrice(good, false);
		let seller_price = seller.getGoodPrice(good, false);
		if (!buyer_price) {
			good.price = seller_price * 1.5; //当地无货则暴利50%
			return good.price;
		}
		return buyer_price - seller_price;
	}

	/**创建商业体 */
	public createCommer(std: StdCity | StdTrader | StdGood): City | Trader {
		if (std instanceof StdCity) {
			for (let item of this.cityArr) {
				if (item.aId == std.aId) {
					egret.log('城市已存在！')
					return;
				}
			}
			let city = new City(std.aId, std.name, std.people, std.money, std.goodlist);
			this.cityArr.push(city);
			return city;
		} else if (std instanceof StdTrader) {
			for (let item of this.traderArr) {
				if (item.aId == std.aId) {
					egret.log('商人已存在！')
					return;
				}
			}
			let trader = new Trader(std.aId, std.name, std.money, std.goodlist);
			this.traderArr.push(trader);
			return trader;
		}
	}

	/**查询城市 */
	public findCityById(aId: number): City {
		for (let item of this.cityArr)
			if (item.aId == aId) return item;
		egret.log('未查到ID为' + aId + '的城市');
	}

	/**查询商人 */
	public findTraderById(aId: number): Trader {
		for (let item of this.traderArr) {
			if (item.aId == aId) return item;
		}
		egret.log('未查到ID为' + aId + '的商人');
	}

	/**记入账本 */
	private loadAcBook(buyer: City | Trader, seller: City | Trader, good: Good, time: number): void {
		let record = new acRecord();
		let recGood = new Good(good.id, good.name, good.price, good.count, good.demandTend); //记录交易时的货物状态
		record.time = DateTimeMgr.getTimeString(time, 5);
		record.buyer = buyer;
		record.seller = seller;
		record.good = recGood;
		record.orderId = buyer.aId.toString() + seller.aId.toString() + good.id.toString() + time + Math.floor(Math.random()).toString();
		this.acBook.push(record);
	}

	/**查看账本 */
	public readAcBook(orderId?: number): void {
		for (let record of this.acBook) {
			if (orderId != undefined && orderId == Number(record.orderId)) {
				let total = record.good.price * record.good.count;
				console.log(
					record.time
					+ Sign.SPACE + 'buyer:' + record.buyer.name
					+ Sign.SPACE + 'seller:' + record.seller.name
					+ Sign.SPACE + 'good:' + record.good.name
					+ Sign.SPACE + record.good.count
					+ Sign.SPACE + 'cost:' + total);
				return;
			}
			let total = record.good.price * record.good.count;
			console.log(
				record.time
				+ Sign.SPACE + 'buyer:' + record.buyer.name
				+ Sign.SPACE + 'seller:' + record.seller.name
				+ Sign.SPACE + 'good:' + record.good.name
				+ Sign.SPACE + record.good.count
				+ Sign.SPACE + 'cost:' + total);
		}
	}
}

/**交易记录 */
class acRecord {
	public orderId: string;
	public time: string;
	public buyer: City | Trader;
	public seller: City | Trader;
	public good: Good;
}