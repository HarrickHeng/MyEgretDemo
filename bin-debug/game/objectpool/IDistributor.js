var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
/**分配器 */
var Distributor = (function () {
    function Distributor() {
        this._UsedPool = null; //使用中的对象
        this._IdlePool = null; //未使用的对象
        this._IdlePool = {};
        this._UsedPool = {};
    }
    Distributor.prototype.distribution = function (val) {
        if (val.isIdle) {
            this._IdlePool[val.hashc] = val;
            delete this._UsedPool[val.hashc];
        }
        else {
            this._UsedPool[val.hashc] = val;
            delete this._IdlePool[val.hashc];
        }
    };
    Distributor.prototype.addVO = function (val) {
        val.setProtocol(this);
        if (val.isIdle) {
            this._IdlePool[val.hashc] = val;
        }
        else {
            this._UsedPool[val.hashc] = val;
        }
    };
    Distributor.prototype.getVO = function (type) {
        var obj = null;
        for (var key in this._IdlePool) {
            obj = this._IdlePool[key];
            if (obj.type == type) {
                obj.reset();
                return obj;
            }
        }
        return null;
    };
    Distributor.prototype.clear = function () {
        var obj = null;
        for (var key in this._IdlePool) {
            obj = this._IdlePool[key];
            obj.del();
        }
        this._IdlePool = null;
        this._IdlePool = {};
    };
    Distributor.prototype.look = function () {
        console.log("[LOOK]");
        console.log("-----------IdlePool 空闲对象------------");
        var num = 0;
        for (var key in this._IdlePool) {
            num++;
            console.log("KEY:" + key + " ,type: " + this._IdlePool[key].type);
        }
        console.log("共" + num + "个空闲对象");
        console.log("-----------UsedPool 使用对象------------");
        num = 0;
        for (var key in this._UsedPool) {
            num++;
            console.log("KEY:" + key + " ,type: " + this._UsedPool[key].type);
        }
        console.log("共" + num + "个使用对象");
        console.log("\n\n");
    };
    return Distributor;
}());
__reflect(Distributor.prototype, "Distributor", ["IDistributor"]);
//# sourceMappingURL=IDistributor.js.map