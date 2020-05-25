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
		let neighbors: StdMapItem[] = this.findNeighbors(this._curMapItem);
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
	private findNeighbors(curMapItem: StdMapItem): StdMapItem[] {
		let MIarr: StdMapItem[] = [];
		let offX = [0, 0, 1, -1, -1, 1, -1, 1], offY = [1, -1, 0, 0, 1, 1, -1, -1];
		let len = offX.length
		for (let i = 0; i < len; ++i) {
			let id = this.getIdByOS(curMapItem, offX[i], offY[i]);
			let MI = this._mapData.source[id - 1] ? this._mapData.source[id - 1] : null;
			if (MI && this.checkMI(MI))
				MIarr.push(MI);
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
		//是否过界
		if (curMI.row + offsetY < 1 || curMI.row + offsetY > this._mapRow) return null;
		if (curMI.col + offsetX < 1 || curMI.col + offsetX > this._mapCol) return null;
		return curMI.id + this._mapCol * offsetY + offsetX;
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

	public bresenHamLine(): StdMapItem[] {
		let path = [];
		this._curMapItem = this._startMapItem;
		let y = this._curMapItem.col;
		let x = this._curMapItem.row;
		let dy = Math.abs(this._endMapItem.col - this._startMapItem.col);
		let dx = Math.abs(this._endMapItem.row - this._startMapItem.row);
		let sy = this._endMapItem.col > this._startMapItem.col ? 1 : -1;
		let sx = this._endMapItem.row > this._startMapItem.row ? 1 : -1;
		let interchange = 0;
		if (dy < dx) { //斜率大于1交换
			interchange = 1;
			dy = dy + dx;
			dx = dy - dx;
			dy = dy - dx;
		}
		let middle = dy;
		let deltaY = (dx << 1);
		while (this._curMapItem != this._endMapItem) {
			if (interchange) x += sx
			else y += sy;
			if (deltaY >= middle) {
				if (interchange) y += sy
				else x += sx;
				middle += (dy << 1);
			}
			deltaY += (dx << 1);
			let id = y + (x - 1) * this._mapRow;
			this._curMapItem = this._mapData.source[id - 1];
			path.push(this._curMapItem);
		}
		return path;
	}

	/////////////////////////////////////////普里姆算法///////////////////////////////////

	public primMap(): void {
		//全部设墙
		for (let item of this._mapData.source)
			this.MIS(item, MI_STATUS.DEFAULT);
		//acc存放已访问队列，noacc存放没有访问队列
		let acc = [], noacc = [];
		//中间格子打通
		for (let i = 1; i <= this._mapRow; ++i) {
			for (let j = 1; j <= this._mapCol; ++j) {
				let id = i + (j - 1) * this._mapRow;
				if (!(i % 2) && !(j % 2)) {
					this.MIS(this._mapData.source[id - 1], MI_STATUS.STONE);
					noacc.push(id)
				}
			}
		}
		let randIdx = MathUtil.randomRange(0, noacc.length - 1);
		let pos = noacc[randIdx];
		this.startMapItem =
			this.MIS(this._mapData.source[pos - 1], MI_STATUS.START);
		acc.push(pos);
		while (acc.length < noacc.length) {
			let roundArr = [];
			let curMI = this._mapData.source[pos - 1];
			let offX = [0, 0, 2, -2], offY = [2, -2, 0, 0];
			for (let i = 0, len = offX.length; i < len; ++i) {
				let id = this.getIdByOS(curMI, offX[i], offY[i]);
				if (id != null && acc.indexOf(id) == -1)
					roundArr.push(id);
			}
			let roundPos = roundArr[MathUtil.randomRange(0, roundArr.length - 1)];
			if (roundPos) {
				this.MIS(this._mapData.source[roundPos + (roundPos - pos) / 2 - 1], MI_STATUS.STONE);
				if (acc.length == noacc.length - 1) {
					this.endMapItem =
						this.MIS(this._mapData.source[pos - 1], MI_STATUS.END);
				}
				pos = roundPos;
				acc.push(roundPos);
			} else {
				pos = acc[MathUtil.randomRange(0, acc.length - 1)];
			}
		}
	}
}
