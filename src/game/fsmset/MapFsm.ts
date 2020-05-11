class MapFsm {
	/**地图数据 */
	private _mapData;
	/**地图行数 */
	private _mapRow: number;
	/**地图列数 */
	private _mapCol: number;
	/**当前点 */
	private _curMapItem: StdMapItem;
	/**上一点 */
	private _lastMapItem: StdMapItem;
	/**起点 */
	private _startMapItem: StdMapItem;
	/**终点 */
	private _endMapItem: StdMapItem;
	/**关闭名单 */
	public closeList: StdMapItem[];
	/**开放名单 */
	public openList: StdMapItem[];
	/**详细参数 */
	public showInfo: boolean = false;

	public get mapData() {
		return this._mapData;
	}

	public set mapData(v) {
		this._mapData = v;
	}

	public get mapRow(): number {
		return this._mapRow;
	}

	public set mapRow(v: number) {
		this._mapRow = v;
	}

	public get mapCol(): number {
		return this._mapCol;
	}

	public set mapCol(v: number) {
		this._mapCol = v;
	}

	public get curMapItem(): StdMapItem {
		return this._curMapItem;
	}

	public set curMapItem(v: StdMapItem) {
		this._curMapItem = v;
	}

	public get lastMapItem(): StdMapItem {
		return this._lastMapItem;
	}

	public set lastMapItem(v: StdMapItem) {
		this._lastMapItem = v;
	}

	public get startMapItem(): StdMapItem {
		return this._startMapItem;
	}

	public set startMapItem(v: StdMapItem) {
		this._startMapItem = v;
	}

	public get endMapItem(): StdMapItem {
		return this._endMapItem;
	}

	public set endMapItem(v: StdMapItem) {
		this._endMapItem = v;
	}

	/**数据清除 */
	public clearData(): void {
		this.openList = null;
		this.closeList = null;
		this._curMapItem = null;
		this._startMapItem = null;
		this._endMapItem = null;
		this._lastMapItem = null;
		this._mapData = null;
	}

	/**设置点的状态 */
	public MIS(item: StdMapItem, status: number): StdMapItem {
		if (item && status != undefined)
			item.status = status;
		if (this._mapData) this._mapData.itemUpdated(item);
		return item;
	}

	/////////////////////////////////////////A星寻路算法部分///////////////////////////////////

	/**开始A星寻路 */
	public aStar(): StdMapItem {
		this.openList = [];
		this.closeList = [];
		this.openList.push(this._startMapItem);
		while (this.openList.length > 0) {
			let resMI = this.searchWhile();
			if (resMI) return resMI;
		}
		egret.log('终点不可到达!');
		return null;
	}

	/**开始A星寻路(逐步) */
	public aStarSub(): StdMapItem {
		if (!this.openList && !this.closeList) {
			this.openList = [];
			this.closeList = [];
			this.openList.push(this._startMapItem);
		}
		return this.openList.length > 0 ? this.searchWhile() : null;
	}

	/**A星寻路循环 */
	public searchWhile(): StdMapItem {
		//是否有更优路径
		if (this.betterMI) {
			this._curMapItem = this.betterMI;
			this.betterMI = null;
		}
		//开启名单查找F值最小的节点(或待二叉堆优化)
		this._curMapItem = this.openList.reduce((minMI, MI) => {
			if (minMI.F == MI.F) return minMI.H < MI.H ? minMI : MI;
			if (minMI.F < MI.F) return minMI;
			if (minMI.F > MI.F) return MI;
		});
		if (!this._curMapItem) return;
		let idx = this.openList.indexOf(this._curMapItem);
		this.openList.splice(idx, 1);
		this.closeList.push(this._curMapItem);
		this.MIS(this._curMapItem, MI_STATUS.CLOSED);
		let neighbors: StdMapItem[] = this.findNeighbors();
		//邻居检查
		neighbors.forEach(MI => {
			if (this.openList.indexOf(MI) == -1) {
				if (MI.status == MI_STATUS.END && this.checkDecline(this._curMapItem, MI)) return;
				MI.parent = this._curMapItem;
				this.Fcost(MI);
				this.openList.push(MI);
				this.MIS(MI, MI_STATUS.OPENED);
			}
		}, this);
		//终点检查
		if (this.openList.indexOf(this._endMapItem) != -1)
			return this._endMapItem;
	}

	/**搜寻周围地图块 */
	private findNeighbors(): StdMapItem[] {
		let MIarr: StdMapItem[] = [];
		for (let i = -1; i < 2; i++) {
			for (let j = -1; j < 2; j++) {
				if (i == 0 && j == 0) continue;
				let row = this._curMapItem.row + i;
				let col = this._curMapItem.col + j;
				if (row < 1 || row > this.mapRow || col < 1 || col > this.mapCol)
					continue; //是否过界
				let id = this.getIdByOS(this._curMapItem, j, i);
				let MI = this._mapData.source[id - 1];
				if (MI && this.checkMI(MI))
					MIarr.push(MI);
			}
		}
		return MIarr;
	}

	private betterMI: StdMapItem;
	/**地图块检测 */
	private checkMI(MI: StdMapItem): boolean {
		let openIdx = this.openList.indexOf(MI);
		let closeIdx = this.closeList.indexOf(MI);
		//障碍物检测
		if (MI.status == MI_STATUS.STONE) return false;
		//开放列表检测
		if (openIdx != -1) {
			if (this.openList[openIdx].F < (MI.F + MI.parent.F))
				this.betterMI = this.openList[openIdx];
			return false;
		}
		//关闭列表检测
		if (closeIdx != -1) return false;
		return true;
	}

	/**获得周围的地图块ID */
	private getIdByOS(curMI: StdMapItem, offsetX: number, offsetY: number): number {
		let id: number;
		switch (offsetX) {
			case -1:
				if (offsetY == -1)
					id = curMI.id - this._mapCol - 1;
				else if (offsetY == 0)
					id = curMI.id - 1;
				else if (offsetY == 1)
					id = curMI.id + this._mapCol - 1;
				break;
			case 0:
				if (offsetY == -1)
					id = curMI.id - this._mapCol;
				else if (offsetY == 1)
					id = curMI.id + this._mapCol;
				break;
			case 1:
				if (offsetY == -1)
					id = curMI.id - this._mapCol + 1;
				else if (offsetY == 0)
					id = curMI.id + 1;
				else if (offsetY == 1)
					id = curMI.id + this._mapCol + 1;
				break;
		}
		return id;
	}

	/**赋予F值 */
	public Fcost(nextMI: StdMapItem): void {
		let F: number, G: number, H: number;
		G = this.Gcost(nextMI.parent, nextMI, nextMI.cost);
		H = this.Hcost(nextMI);
		F = G + H;
		nextMI.G = G;
		nextMI.H = H;
		nextMI.F = F;
	}

	/**G值 */
	private Gcost(curMI: StdMapItem, nextMI: StdMapItem, Cost?: number): number {
		if (!Cost) Cost = 1;
		let G = Math.floor(YS.disMI(curMI, nextMI) * 10);
		if (this.checkDecline(curMI, nextMI))
			Cost = 9999; //说明斜行路径被堵
		return G * Cost;
	}

	/**斜行障碍判断 */
	public checkDecline(curMI: StdMapItem, nextMI: StdMapItem): boolean {
		if (Math.floor(YS.disMI(curMI, nextMI) * 10) != 14) return false;
		let curTopMI: StdMapItem; //当前块的顶部块
		let nextDownMI: StdMapItem; //目标块的底部块
		if (curMI.row > nextMI.row) {
			//目标块当前块的在上方
			curTopMI = this._mapData.source[this.getIdByOS(curMI, 0, -1) - 1];
			nextDownMI = this._mapData.source[this.getIdByOS(nextMI, 0, 1) - 1];
			if (curTopMI.status == MI_STATUS.STONE && nextDownMI.status == MI_STATUS.STONE)
				return true;
		} else {
			//目标块当前块的在下方
			curTopMI = this._mapData.source[this.getIdByOS(curMI, 0, 1) - 1];
			nextDownMI = this._mapData.source[this.getIdByOS(nextMI, 0, -1) - 1];
			if (curTopMI.status == MI_STATUS.STONE && nextDownMI.status == MI_STATUS.STONE)
				return true;
		}
		return false;
	}

	/**H值 */
	public Hcost(curMI: StdMapItem): number {
		let disX: number, disY: number;
		if (!this._endMapItem) return;
		disX = Math.abs(curMI.row - this._endMapItem.row);
		disY = Math.abs(curMI.col - this._endMapItem.col);
		return (disX + disY) * 10;
	}

	/////////////////////////////////////////布兰森汉姆算法部分///////////////////////////////////

	public BH_List = [];
	public bresenHamLine(): void {
		let x1 = this._startMapItem.row;
		let y1 = this._startMapItem.col;
		let x2 = this._endMapItem.row;
		let y2 = this._endMapItem.col;
		let w = x2 - x1;
		let h = y2 - y1;
		let dx = w > 0 ? 1 : -1;
		let dy = h > 0 ? 1 : -1;
		w = Math.abs(w);
		h = Math.abs(h);
		let f, y, x, delta1, delta2;
		if (w > h) {
			f = 2 * h - w;
			delta1 = 2 * h;
			delta2 = (h - w) * 2;
			for (x = x1, y = y1; x != x2; x += dx) {
				let MI: StdMapItem = new StdMapItem();
				this.BH_List.push({ row: x, col: y });
				if (f < 0) {
					f += delta1;
				} else {
					y += dy;
					f += delta2;
				}
			}
		} else {
			f = 2 * w - h;
			delta1 = w * 2;
			delta2 = (w - h) * 2;
			for (x = x1, y = y1; y != y2; y += dy) {
				this.BH_List.push({ row: x, col: y });
				if (f < 0) {
					f += delta1;
				} else {
					x += dx;
					f += delta2;
				}
			}
		}
		this.BH_List.push({ row: x, col: y });
	}
}