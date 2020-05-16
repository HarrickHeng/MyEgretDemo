var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var MapFsm = (function () {
    function MapFsm() {
        /**详细参数 */
        this.showInfo = false;
    }
    Object.defineProperty(MapFsm.prototype, "mapData", {
        get: function () {
            return this._mapData;
        },
        set: function (v) {
            this._mapData = v;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MapFsm.prototype, "mapRow", {
        get: function () {
            return this._mapRow;
        },
        set: function (v) {
            this._mapRow = v;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MapFsm.prototype, "mapCol", {
        get: function () {
            return this._mapCol;
        },
        set: function (v) {
            this._mapCol = v;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MapFsm.prototype, "curMapItem", {
        get: function () {
            return this._curMapItem;
        },
        set: function (v) {
            this._curMapItem = v;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MapFsm.prototype, "lastMapItem", {
        get: function () {
            return this._lastMapItem;
        },
        set: function (v) {
            this._lastMapItem = v;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MapFsm.prototype, "startMapItem", {
        get: function () {
            return this._startMapItem;
        },
        set: function (v) {
            this._startMapItem = v;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MapFsm.prototype, "endMapItem", {
        get: function () {
            return this._endMapItem;
        },
        set: function (v) {
            this._endMapItem = v;
        },
        enumerable: true,
        configurable: true
    });
    /**数据清除 */
    MapFsm.prototype.clearData = function () {
        this.openList = null;
        this.closeList = null;
        this._curMapItem = null;
        this._startMapItem = null;
        this._endMapItem = null;
        this._lastMapItem = null;
        this._mapData = null;
    };
    /**设置点的状态 */
    MapFsm.prototype.MIS = function (item, status) {
        if (item && status != undefined)
            item.status = status;
        if (this._mapData)
            this._mapData.itemUpdated(item);
        return item;
    };
    /////////////////////////////////////////A星寻路算法部分///////////////////////////////////
    /**开始A星寻路 */
    MapFsm.prototype.aStar = function () {
        this.openList = [];
        this.closeList = [];
        this.openList.push(this._startMapItem);
        while (this.openList.length > 0) {
            var resMI = this.searchWhile();
            if (resMI)
                return resMI;
        }
        egret.log('终点不可到达!');
        return null;
    };
    /**开始A星寻路(逐步) */
    MapFsm.prototype.aStarSub = function () {
        if (!this.openList && !this.closeList) {
            this.openList = [];
            this.closeList = [];
            this.openList.push(this._startMapItem);
        }
        return this.openList.length > 0 ? this.searchWhile() : null;
    };
    /**A星寻路循环 */
    MapFsm.prototype.searchWhile = function () {
        var _this = this;
        //是否有更优路径
        if (this.betterMI) {
            this._curMapItem = this.betterMI;
            this.betterMI = null;
        }
        //开启名单查找F值最小的节点(或待二叉堆优化)
        this._curMapItem = this.openList.reduce(function (minMI, MI) {
            if (minMI.F == MI.F)
                return minMI.H < MI.H ? minMI : MI;
            if (minMI.F < MI.F)
                return minMI;
            if (minMI.F > MI.F)
                return MI;
        });
        if (!this._curMapItem)
            return;
        var idx = this.openList.indexOf(this._curMapItem);
        this.openList.splice(idx, 1);
        this.closeList.push(this._curMapItem);
        this.MIS(this._curMapItem, MI_STATUS.CLOSED);
        var neighbors = this.findNeighbors();
        //邻居检查
        neighbors.forEach(function (MI) {
            if (_this.openList.indexOf(MI) == -1) {
                if (MI.status == MI_STATUS.END && _this.checkDecline(_this._curMapItem, MI))
                    return;
                MI.parent = _this._curMapItem;
                _this.Fcost(MI);
                _this.openList.push(MI);
                _this.MIS(MI, MI_STATUS.OPENED);
            }
        }, this);
        //终点检查
        if (this.openList.indexOf(this._endMapItem) != -1)
            return this._endMapItem;
    };
    /**搜寻周围地图块 */
    MapFsm.prototype.findNeighbors = function () {
        var MIarr = [];
        var offX = [0, 0, 1, -1, -1, 1, -1, 1], offY = [1, -1, 0, 0, 1, 1, -1, -1];
        var len = offX.length;
        for (var i = 0; i < len; ++i) {
            var id = this.getIdByOS(this._curMapItem, offX[i], offY[i]);
            var MI = this._mapData.source[id - 1] ? this._mapData.source[id - 1] : null;
            if (MI && this.checkMI(MI))
                MIarr.push(MI);
        }
        return MIarr;
    };
    /**地图块检测 */
    MapFsm.prototype.checkMI = function (MI) {
        var openIdx = this.openList.indexOf(MI);
        var closeIdx = this.closeList.indexOf(MI);
        //障碍物检测
        if (MI.status == MI_STATUS.STONE)
            return false;
        //开放列表检测
        if (openIdx != -1) {
            if (this.openList[openIdx].F < (MI.F + MI.parent.F))
                this.betterMI = this.openList[openIdx];
            return false;
        }
        //关闭列表检测
        if (closeIdx != -1)
            return false;
        return true;
    };
    /**获得周围的地图块ID */
    MapFsm.prototype.getIdByOS = function (curMI, offsetX, offsetY) {
        var id;
        //是否过界
        if (curMI.row + offsetY < 1 || curMI.row + offsetY > this._mapRow)
            return null;
        if (curMI.col + offsetX < 1 || curMI.col + offsetX > this._mapCol)
            return null;
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
    };
    /**赋予F值 */
    MapFsm.prototype.Fcost = function (nextMI) {
        var F, G, H;
        G = this.Gcost(nextMI.parent, nextMI, nextMI.cost);
        H = this.Hcost(nextMI);
        F = G + H;
        nextMI.G = G;
        nextMI.H = H;
        nextMI.F = F;
    };
    /**G值 */
    MapFsm.prototype.Gcost = function (curMI, nextMI, Cost) {
        if (!Cost)
            Cost = 1;
        var G = Math.floor(YS.disMI(curMI, nextMI) * 10);
        if (this.checkDecline(curMI, nextMI))
            Cost = 9999; //说明斜行路径被堵
        return G * Cost;
    };
    /**斜行障碍判断 */
    MapFsm.prototype.checkDecline = function (curMI, nextMI) {
        if (Math.floor(YS.disMI(curMI, nextMI) * 10) != 14)
            return false;
        var curTopMI; //当前块的顶部块
        var nextDownMI; //目标块的底部块
        if (curMI.row > nextMI.row) {
            //目标块当前块的在上方
            curTopMI = this._mapData.source[this.getIdByOS(curMI, 0, -1) - 1];
            nextDownMI = this._mapData.source[this.getIdByOS(nextMI, 0, 1) - 1];
            if (curTopMI.status == MI_STATUS.STONE && nextDownMI.status == MI_STATUS.STONE)
                return true;
        }
        else {
            //目标块当前块的在下方
            curTopMI = this._mapData.source[this.getIdByOS(curMI, 0, 1) - 1];
            nextDownMI = this._mapData.source[this.getIdByOS(nextMI, 0, -1) - 1];
            if (curTopMI.status == MI_STATUS.STONE && nextDownMI.status == MI_STATUS.STONE)
                return true;
        }
        return false;
    };
    /**H值 */
    MapFsm.prototype.Hcost = function (curMI) {
        var disX, disY;
        if (!this._endMapItem)
            return;
        disX = Math.abs(curMI.row - this._endMapItem.row);
        disY = Math.abs(curMI.col - this._endMapItem.col);
        return (disX + disY) * 10;
    };
    /////////////////////////////////////////布兰森汉姆算法部分///////////////////////////////////
    MapFsm.prototype.bresenHamLine = function () {
        var path = [];
        this._curMapItem = this._startMapItem;
        var y = this._curMapItem.col;
        var x = this._curMapItem.row;
        var dy = Math.abs(this._endMapItem.col - this._startMapItem.col);
        var dx = Math.abs(this._endMapItem.row - this._startMapItem.row);
        var sy = this._endMapItem.col > this._startMapItem.col ? 1 : -1;
        var sx = this._endMapItem.row > this._startMapItem.row ? 1 : -1;
        var interchange = 0;
        if (dy < dx) {
            interchange = 1;
            dy = dy + dx;
            dx = dy - dx;
            dy = dy - dx;
        }
        var middle = dy;
        var deltaY = (dx << 1);
        while (this._curMapItem != this._endMapItem) {
            if (interchange)
                x += sx;
            else
                y += sy;
            if (deltaY >= middle) {
                if (interchange)
                    y += sy;
                else
                    x += sx;
                middle += (dy << 1);
            }
            deltaY += (dx << 1);
            var id = y + (x - 1) * this._mapRow;
            this._curMapItem = this._mapData.source[id - 1];
            path.push(this._curMapItem);
        }
        return path;
    };
    /////////////////////////////////////////随机生成迷宫算法///////////////////////////////////
    MapFsm.prototype.primMap = function () {
        //全部设墙
        for (var _i = 0, _a = this._mapData.source; _i < _a.length; _i++) {
            var item = _a[_i];
            this.MIS(item, MI_STATUS.DEFAULT);
        }
        //acc存放已访问队列，noacc存放没有访问队列
        var acc = [], noacc = [];
        //中间格子打通
        for (var i = 1; i <= this._mapRow; ++i) {
            for (var j = 1; j <= this._mapCol; ++j) {
                var id = i + (j - 1) * this._mapRow;
                if (!(i % 2) && !(j % 2)) {
                    this.MIS(this._mapData.source[id - 1], MI_STATUS.STONE);
                    noacc.push(id);
                }
            }
        }
        var randIdx = MathUtil.randomRange(0, noacc.length - 1);
        var pos = noacc[randIdx];
        acc.push(pos);
        while (acc.length < noacc.length) {
            var roundArr = [];
            var curMI = this._mapData.source[pos - 1];
            var offX = [0, 0, 1, -1], offY = [1, -1, 0, 0];
            var len = offX.length;
            for (var i = 0; i < len; ++i) {
                var id = this.getIdByOS(curMI, offX[i], offY[i]);
                if (id == null)
                    continue;
                id = this.getIdByOS(this._mapData.source[id - 1], offX[i], offY[i]);
                if (id != null && acc.indexOf(id) == -1)
                    roundArr.push(id);
            }
            var roundPos = roundArr[MathUtil.randomRange(0, roundArr.length - 1)];
            if (roundPos) {
                this.MIS(this._mapData.source[roundPos + (roundPos - pos) / 2 - 1], MI_STATUS.STONE);
                pos = roundPos;
                acc.push(roundPos);
            }
            else {
                pos = acc[MathUtil.randomRange(0, acc.length - 1)];
            }
        }
    };
    return MapFsm;
}());
__reflect(MapFsm.prototype, "MapFsm");
//# sourceMappingURL=MapFsm.js.map